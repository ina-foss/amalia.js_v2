import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, OnInit, PipeTransform, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {TranscriptionConfig} from '../../core/config/model/transcription-config';
import {Utils} from '../../core/utils/utils';
import {TranscriptionLocalisation} from '../../core/metadata/model/transcription-localisation';
import {DEFAULT} from '../../core/constant/default';
import {TextUtils} from '../../core/utils/text-utils';
import {MediaPlayerService} from '../../service/media-player-service';
import * as _ from 'lodash';
import {FormatUtils} from '../../core/utils/format-utils';

export class TcFormatPipe implements PipeTransform {
    transform(tc: number, format: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = null, defaultFps: number = 25) {
        return FormatUtils.formatTime(tc, format, defaultFps);
    }
}

@Component({
    selector: 'amalia-transcription',
    templateUrl: './transcription-plugin.component.html',
    styleUrls: ['./transcription-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TranscriptionPluginComponent extends PluginBase<TranscriptionConfig> implements OnInit {
    public static PLUGIN_NAME = 'TRANSCRIPTION';
    public static KARAOKE_TC_DELTA = 0.250;
    public static SELECTOR_SEGMENT = 'segment';
    public static SELECTOR_SUBSEGMENT = 'subsegment';
    public static SELECTOR_WORD = 'w';
    public static SEARCH_SELECTOR = 'selected-text';
    public static SEARCH_FOUNDED = 'founded-text';
    public static SELECTOR_SELECTED = 'selected';
    public static SELECTOR_ACTIVATED = 'activated';
    public static SELECTOR_PROGRESS_BAR = '.progress-bar';
    public static BACKSPACE_KEY = 'Backspace';
    public static SELECTOR_NAMED_ENTITY = 'named-entity';
    public tcDisplayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = false;
    public active = false;
    public ignoreNextScroll = false;
    @ViewChild('transcriptionElement', {static: false})
    public transcriptionElement: ElementRef<HTMLElement>;
    @ViewChild('header', {static: false})
    public headerElement: ElementRef<HTMLElement>;
    @ViewChild('searchText')
    public searchText: ElementRef;
    public searching = false;
    public typing = false;
    public index = 0;
    /**
     * Return  current time
     */
    public currentTime: number;
    public transcriptions: Array<TranscriptionLocalisation> = null;
    public listOfSearchedNodes: Array<HTMLElement>;
    private searchedWordIndex = 0;
    public displaySynchro = false;
    private lastSelectedNode = null;
    private prevSearchValue = '';
    public tcFormatPipe = new TcFormatPipe();

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = TranscriptionPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            if (this.pluginConfiguration.data) {
                this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
            }
            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration.data.autoScroll) {
                this.autoScroll = true;
                this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
            }
        }
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseTranscription();
        }
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKED, this.handleOnTimeChange);
    }

    /**
     * handle call
     * @param tc time code
     */
    public callSeek(tc) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    public copy(localisation: any) {
        const tcOffset = this.mediaPlayerElement.getConfiguration()?.tcOffset;
        const tcIn = this.tcFormatPipe.transform(localisation.tcIn + tcOffset, this.tcDisplayFormat);
        const tcOut = this.tcFormatPipe.transform(localisation.tcOut + tcOffset, this.tcDisplayFormat);
        const copiedText = '[' + tcIn + '][' + tcOut + ']\n\n' + localisation.text;
        window.navigator.clipboard.writeText(copiedText).then(
                () => {
                    this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_COPY_BOARD, localisation);
                }
        );
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<TranscriptionConfig> {
        return {
            name: TranscriptionPluginComponent.PLUGIN_NAME,
            data: {
                timeFormat: 's',
                fps: DEFAULT.FPS,
                autoScroll: true,
                parseLevel: 1,
                withSubLocalisations: false,
                karaokeTcDelta: TranscriptionPluginComponent.KARAOKE_TC_DELTA,
                progressBar: false,
                mode: 2,
                label: 'Rechercher dans la transcription',
                key: 'Enter',
                labelSynchro: 'Synchronisation de la transcription'
            }
        };
    }

    /**
     * handle to seek work with defined tc delta
     * @param e mouse event
     */
    public seekToWord(e: MouseEvent): void {
        const element = e.target as HTMLElement;
        const tcIn = Number.parseFloat(element.getAttribute('data-tcin'));
        if (tcIn) {
            const seekTc = this.pluginConfiguration.data.tcDelta ? tcIn - this.pluginConfiguration.data.tcDelta : tcIn;
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(seekTc);
            this.scroll();
        }
    }

    /**
     * Invoked time change event for :
     * - update current time
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (this.currentTime && this.pluginConfiguration.data.autoScroll && this.transcriptionElement) {
            const karaokeTcDelta = this.pluginConfiguration.data?.karaokeTcDelta || TranscriptionPluginComponent.KARAOKE_TC_DELTA;
            if (this.pluginConfiguration.data.mode === 1) {
                this.disableRemoveAllSelectedNodes();
            } else {
                this.disableSelectedWords();
                this.disableRemoveSelectedSegment();
            }
            this.selectSegment(karaokeTcDelta);
        }
    }

    /**
     * Handle change text on searching input
     */
    @AutoBind
    public handleChangeInput(value) {
        if (value.length > 0) {
            this.typing = true;
        }
        if (this.searching === true) {
            this.searching = false;
            Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`)).forEach(node => {
                node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
            });
        }
    }

    /**
     *  disabled selected words on rewinding
     */
    private disableSelectedWords() {
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
    }

    /**
     *  In charge to remove selected parent
     */
    private disableRemoveSelectedSegment() {
        // remove selected segment
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
        // Remove activated world
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_ACTIVATED}`))
                .forEach(node => {
                    node.classList.remove(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                });
    }

    /**
     *  In charge to remove selected elements and disable progress bar
     */
    private disableRemoveAllSelectedNodes() {
        // remove selected word
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    if (!node.parentElement.parentElement.classList.contains(TranscriptionPluginComponent.SELECTOR_SELECTED)) {
                        node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                    }
                });
        // remove selected segment
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
    }

    /**
     * In charge to select word in time range
     * @param karaokeTcDelta time code delta
     */
    private selectWords(karaokeTcDelta: number) {
        const node = this.transcriptionElement.nativeElement.querySelector('.segment.selected');
        const elementNodes = node ? Array.from(node.querySelectorAll<HTMLElement>('.w')) : [];
        if (elementNodes) {
            const filteredNodes = this.handleModeTranscription(elementNodes, karaokeTcDelta);
            if (filteredNodes && filteredNodes.length > 0) {
                filteredNodes.forEach(n => {
                    n.classList.add(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                    // add active to parent segment
                    if (this.currentTime >= parseFloat(n.parentElement.parentElement.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime < parseFloat(n.parentElement.parentElement.getAttribute('data-tcout'))) {
                        n.parentElement.parentElement.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                    }
                    this.handleSelectedWordsStyle(filteredNodes, karaokeTcDelta);
                    if (this.currentTime >= parseFloat(n.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime < parseFloat(n.getAttribute('data-tcout'))) {
                        n.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                    }
                });
            }
        }
    }

    /**
     * handle mode 1 || mode 2
     */
    private handleModeTranscription(elementNodes, karaokeTcDelta) {
        let filteredNodes;
        if (this.pluginConfiguration.data.mode === 1) {
            filteredNodes = elementNodes
                    .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime <= parseFloat(node.getAttribute('data-tcout')));
        } else {
            filteredNodes = elementNodes
                    .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta);
        }
        return filteredNodes;
    }

    /**
     * add TranscriptionPluginComponent.SELECTOR_SELECTED to selected words
     */
    private handleSelectedWordsStyle(filteredNodes, karaokeTcDelta) {
        if (filteredNodes && filteredNodes.length > 0) {
            filteredNodes.forEach(n => {
                n.classList.add(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                // add active to parent segment
                if (this.currentTime >= parseFloat(n.parentElement.parentElement.getAttribute('data-tcin')) - karaokeTcDelta
                        && this.currentTime < parseFloat(n.parentElement.parentElement.getAttribute('data-tcout'))) {
                    n.parentElement.parentElement.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                }
                if (this.currentTime >= parseFloat(n.getAttribute('data-tcin')) - karaokeTcDelta
                        && this.currentTime < parseFloat(n.getAttribute('data-tcout'))) {
                    n.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                }
            });
        }
    }

    /**
     * In charge to select segment
     */

    private selectSegment(karaokeTcDelta: number) {
        const segmentElementNodes = Array.from(this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>('.segment'));
        if (segmentElementNodes) {
            const segmentFilteredNodes = segmentElementNodes
                    .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime < parseFloat(node.getAttribute('data-tcout')));
            if (segmentFilteredNodes && segmentFilteredNodes.length > 0) {
                segmentFilteredNodes.forEach(segmentNode => {
                    const tcIn = Math.round(parseFloat(segmentNode.getAttribute('data-tcin')));
                    const tcOut = Math.round(parseFloat(segmentNode.getAttribute('data-tcout')));
                    const percentWidth = ((Math.round(this.currentTime) - tcIn) * 100) / (tcOut - tcIn);
                    // const progressBar: HTMLElement = segmentNode.querySelector(TranscriptionPluginComponent.SELECTOR_PROGRESS_BAR);
                    // progressBar.style.width = percentWidth + '%';
                    segmentNode.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
                segmentElementNodes.forEach(n => {
                    if (n.classList.value !== 'segment selected') {
                        n.querySelector('.subsegment').classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                        const subSegmentElement = n.querySelector<HTMLElement>('.subsegment');
                        const textElement = subSegmentElement.querySelector<HTMLElement>('.text');
                        const wElementNodes = Array.from(textElement.querySelectorAll<HTMLElement>('.w'));
                        wElementNodes.forEach(word => {
                            word.classList.remove(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                        });
                    }
                });
                if (this.pluginConfiguration.data && this.pluginConfiguration.data.withSubLocalisations) {
                    this.selectWords(karaokeTcDelta);
                }
            }
            if (this.lastSelectedNode !== segmentFilteredNodes[0]) {
                this.lastSelectedNode = segmentFilteredNodes;
                this.scroll();
            }
        }
        this.getNamedEntities(karaokeTcDelta);
    }

    /**
     * In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height
     */
    private scroll() {
        const scrollNode: HTMLElement = this.transcriptionElement.nativeElement
                .querySelector(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`);
        if (scrollNode && this.displaySynchro === false) {
            this.scrollToNode(scrollNode);
            this.displaySynchro = false;
        } /*else {
            this.displaySynchro = false;
        }*/
    }

    /**
     * Invoked to scroll to node
     * @param scrollNode scroll node element
     */
    private scrollToNode(scrollNode: HTMLElement) {
        if (scrollNode) {
            const minScroll = Math.round(this.transcriptionElement.nativeElement.offsetHeight / 3);
            const maxScrollPos = Math.round((2 * this.transcriptionElement.nativeElement.offsetHeight) / 3);
            const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
            const visible = scrollPos < maxScrollPos;
            if (this.ignoreNextScroll && !visible) {
                this.ignoreNextScroll = false;
                this.displaySynchro = false;
            }
            if (this.currentTime === 0) {
                this.transcriptionElement.nativeElement.scrollTop = 0;
            }
            // scroll to node if he's not visible
            if (this.autoScroll) {
                if (!(visible) && this.displaySynchro === false) {
                    this.transcriptionElement.nativeElement.scrollTop = scrollPos - minScroll;
                }
            }
        }
    }

    /**
     * handle scroll event
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        this.ignoreNextScroll = true;
        setTimeout(() => this.updateSynchro(), 350);
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        this.parseTranscription();
    }

    /**
     * In charge to load metadata
     */
    private parseTranscription() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded transcription ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            this.transcriptions = new Array<TranscriptionLocalisation>();
            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`get metadata for ${metadataId}`);
                const transcriptionLocalisations = metadataManager
                        .getTranscriptionLocalisations(metadataId, this.pluginConfiguration.data.parseLevel, this.pluginConfiguration.data.withSubLocalisations);
                if (transcriptionLocalisations && transcriptionLocalisations.length > 0) {
                    this.transcriptions = this.transcriptions.concat(transcriptionLocalisations);
                }
            });
            // Add sort by tcin
            if (this.transcriptions) {
                this.transcriptions = _.sortBy(this.transcriptions, ['tcIn']);
            }
        }
    }

    /**
     * Search word ans scroll to first result
     */
    @AutoBind
    public searchWord(searchText: string) {
        this.listOfSearchedNodes = new Array<HTMLElement>();
        if (searchText !== '' && searchText !== this.pluginConfiguration.data.label) {
            this.searching = true;
            Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`)).forEach(node => {
                node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
                if (TextUtils.hasSearchText(node.textContent, searchText)) {
                    // node.classList.add(SEARCH_SELECTOR);
                    this.listOfSearchedNodes.push(node as HTMLElement);
                    // add active class to first element
                    this.index = this.searchedWordIndex + 1;
                    this.listOfSearchedNodes.forEach(n => {
                        n.classList.add(TranscriptionPluginComponent.SEARCH_FOUNDED);
                    });
                    this.listOfSearchedNodes[0].classList.add(TranscriptionPluginComponent.SEARCH_SELECTOR);
                    const scrollNode: HTMLElement = this.listOfSearchedNodes[0].parentElement.parentElement;
                    if (scrollNode) {
                        const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
                        this.transcriptionElement.nativeElement.scrollTop = scrollPos;
                        this.ignoreNextScroll = true;
                    }
                }
            });
        }
    }

    /**
     * Search named entities
     */
    @AutoBind
    public getNamedEntities(karaokeTcDelta: number) {
        const listOfNamedEntitesNodes = new Array<HTMLElement>();
        const segmentElementNode = this.transcriptionElement.nativeElement.querySelector<HTMLElement>('.segment .selected');
        if (segmentElementNode != null) {
            const transcriptionFilteredSegment = this.transcriptions
                    .find(node => Math.round(node.tcIn) === Math.round(parseFloat(segmentElementNode.getAttribute('data-tcin')))
                            && Math.round(node.tcOut) === Math.round(parseFloat(segmentElementNode.getAttribute('data-tcout'))));

            const segmentElementNodes = Array.from(this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>('.segment'));
            const segmentFilteredNodes = segmentElementNodes
                    .find(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime < parseFloat(node.getAttribute('data-tcout')));

            transcriptionFilteredSegment.annotations.forEach(a => {
                let index = 0;
                const t = segmentFilteredNodes.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`);
                t.forEach(node => {
                    index += 1;
                    if (a.label.includes(' ')) {
                        const tabLabel = a.label.split(' ');
                        tabLabel.forEach(i => {
                            if (TextUtils.hasSearchText(node.textContent, i)) {
                                if (TextUtils.hasSearchText(t.item(index).textContent, tabLabel[tabLabel.findIndex(elem => elem === i) + 1])) {
                                    listOfNamedEntitesNodes.push(node as HTMLElement);
                                    listOfNamedEntitesNodes.push(t[index] as HTMLElement);

                                    listOfNamedEntitesNodes.forEach(e => {
                                        e.classList.add(TranscriptionPluginComponent.SELECTOR_NAMED_ENTITY);
                                    });
                                }
                            }
                        });
                    } else {
                        if (TextUtils.hasSearchText(node.textContent, a.label)) {
                            listOfNamedEntitesNodes.push(node as HTMLElement);
                            listOfNamedEntitesNodes.forEach(e => {
                                e.classList.add(TranscriptionPluginComponent.SELECTOR_NAMED_ENTITY);
                            });
                        }
                    }
                });
            });
        }
    }

    /**
     * Scroll to next or previous searched word
     */
    @AutoBind
    public scrollToSearchedWord(direction: string) {
        if (this.listOfSearchedNodes && this.listOfSearchedNodes.length > 0) {
            if (this.listOfSearchedNodes[this.searchedWordIndex]) {
                this.listOfSearchedNodes[this.searchedWordIndex].classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
            }
            if (direction === 'up') {
                this.searchedWordIndex = this.searchedWordIndex - 1;
            } else {
                this.searchedWordIndex = this.searchedWordIndex + 1;
            }
            if (this.searchedWordIndex > this.listOfSearchedNodes.length - 1 && direction === 'down') {
                this.searchedWordIndex = 0;
            } else if (this.searchedWordIndex < 0 && direction === 'up') {
                this.searchedWordIndex = this.listOfSearchedNodes.length - 1;
            }
            this.index = this.searchedWordIndex + 1;
            this.ignoreNextScroll = true;
            this.autoScroll = false;
            this.listOfSearchedNodes[this.searchedWordIndex].classList.add(TranscriptionPluginComponent.SEARCH_SELECTOR);
            // this.scrollToNode(this.listOfSearchedNodes[this.searchedWordIndex].parentElement);
            const scrollNode: HTMLElement = this.listOfSearchedNodes[this.searchedWordIndex].parentElement.parentElement;
            if (scrollNode) {
                const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
                this.transcriptionElement.nativeElement.scrollTop = scrollPos;
            }
        }
    }

    /**
     * Invocked on click SYNCHRO button
     */
    @AutoBind
    public scrollToSelectedSegment() {
        const scrollNode: HTMLElement = this.transcriptionElement.nativeElement
                .querySelector(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`);
        if (scrollNode) {
            const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
            const minScroll = Math.round(this.transcriptionElement.nativeElement.offsetHeight / 3);
            this.transcriptionElement.nativeElement.scrollTop = scrollPos - minScroll;
        }
        this.displaySynchro = false;
    }

    /**
     * clear seach list onclick
     */
    @AutoBind
    public clearSearchList() {
        this.autoScroll = true;
        this.index = 0;
        this.searchedWordIndex = 0;
        this.listOfSearchedNodes = null;
        this.searching = false;
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`)).forEach(node => {
            node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
            node.classList.remove(TranscriptionPluginComponent.SEARCH_FOUNDED);
        });
    }

    private isHandleShortCutNeeded(event): boolean {
        return event.key === this.pluginConfiguration.data.key && this.searching === false && this.searchText.nativeElement.value !== ''
    }

    private isScrollToNextWordNeeded(): boolean {
        return this.listOfSearchedNodes && this.listOfSearchedNodes.length !== 0 && this.searchedWordIndex !== null;
    }

    /***
     * handleShortcut on search button
     * */
    public handleShortcut(event) {
        if (this.isHandleShortCutNeeded(event)) {
            if (this.prevSearchValue !== this.searchText.nativeElement.value) {
                this.prevSearchValue = this.searchText.nativeElement.value;
                this.clearSearchList();
                this.searchWord(this.searchText.nativeElement.value);
                this.searching = true;
            } else {
                if (this.isScrollToNextWordNeeded()) {
                    let direction = this.computeDirection();
                    this.searching = true;
                    this.scrollToSearchedWord(direction);
                } else {
                    this.searchWord(this.searchText.nativeElement.value);
                    this.searching = true;
                }
            }
        }
        if (event.key === TranscriptionPluginComponent.BACKSPACE_KEY && this.searchText.nativeElement.value !== '') {
            this.clearSearchList();
            this.typing = false;
        }
    }

    private computeDirection = () => {
        let direction = 'down';
        if (this.searchedWordIndex === 0) {
            direction = 'down';
        }
        if (this.searchedWordIndex === this.listOfSearchedNodes.length) {
            direction = 'up';
        }
        return direction;
    }

    /**
     * if scrolling and active segment is not visible add synchro button
     */
    @AutoBind
    public updateSynchro() {
        let visible;
        const selector = '.' + TranscriptionPluginComponent.SELECTOR_SEGMENT + ' > .' + TranscriptionPluginComponent.SELECTOR_SUBSEGMENT
                + ' > ' + '.text > .' + TranscriptionPluginComponent.SELECTOR_WORD + '.' + TranscriptionPluginComponent.SELECTOR_SELECTED;
        const activeNode: HTMLElement = this.transcriptionElement.nativeElement.querySelector(selector);
        if (activeNode) {
            const positionA = this.transcriptionElement.nativeElement.getBoundingClientRect();
            const positionB = activeNode.getBoundingClientRect();
            // check if active element is visible
            const top = (positionB.top) >= positionA.top;
            const bottom = (positionB.top - activeNode.clientHeight) < (this.transcriptionElement.nativeElement.clientHeight + positionA.top);
            if (!(top && bottom)) {
                visible = false;
            }
            // display  button synchro if active node is not visible
            if (visible === false) {
                this.displaySynchro = true;
            } else {
                this.displaySynchro = false;
            }
        } /*else {
            if (this.ignoreNextScroll) {
                this.displaySynchro = false;
            } else {
                this.displaySynchro = true;
            }
        }*/
    }
}
