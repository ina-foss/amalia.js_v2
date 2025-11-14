import { PluginBase } from '../../core/plugin/plugin-base';
import { AfterViewInit, Component, ElementRef, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { PlayerEventType } from '../../core/constant/event-type';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { TranscriptionConfig } from '../../core/config/model/transcription-config';
import { Utils } from '../../core/utils/utils';
import { TranscriptionLocalisation } from '../../core/metadata/model/transcription-localisation';
import { DEFAULT } from '../../core/constant/default';
import { TextUtils } from '../../core/utils/text-utils';
import { MediaPlayerService } from '../../service/media-player-service';
import * as _ from 'lodash';
import { FormatUtils } from '../../core/utils/format-utils';
import { DefaultLogger } from "../../core/logger/default-logger";
import { ToastComponent } from 'src/app/core/toast/toast.component';

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
export class TranscriptionPluginComponent extends PluginBase<TranscriptionConfig> implements AfterViewInit {

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
    @ViewChild('transcriptionElement', { static: false })
    public transcriptionElement: ElementRef<HTMLElement>;
    @ViewChild('header', { static: false })
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
    logger: DefaultLogger;

    @ViewChild('messages') messagesComponent!: ToastComponent;

    public resourceType: 'stock' | 'flux';
    automaticallyScrolled: boolean = false;

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = TranscriptionPluginComponent.PLUGIN_NAME;
    }

    ngOnInit() {
        try {
            super.ngOnInit();
            this.resourceType = this.pluginConfiguration?.data?.resourceType;
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        if (this.mediaPlayerElement && this.mediaPlayerElement.getConfiguration() && this.mediaPlayerElement.getConfiguration().loadMetadataOnDemand) {
            this.init();
            this.handleMetadataLoaded();
        }
    }


    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration.data.autoScroll) {
                this.autoScroll = true;
                this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
            }
        }
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseTranscription();
        }
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKED, this.handleOnTimeChange);
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
    copyAll() {
        const tcOffset = this.mediaPlayerElement.getConfiguration()?.tcOffset;
        const copiedText = this.transcriptions.map((localisation) => {
            const tcIn = this.tcFormatPipe.transform(localisation.tcIn + tcOffset, this.tcDisplayFormat);
            const tcOut = this.tcFormatPipe.transform(localisation.tcOut + tcOffset, this.tcDisplayFormat);
            return '[' + tcIn + '][' + tcOut + ']\n' + localisation.text;
        }).join('\n\n');
        window.navigator.clipboard.writeText(copiedText).then(
            () => {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_COPY_BOARD, copiedText);
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
            let seekTc;
            if (this.pluginConfiguration.data.resourceType === 'stock' && this.pluginConfiguration?.data?.tcIn > 0) {
                seekTc = this.pluginConfiguration.data.tcDelta ? tcIn - this.pluginConfiguration.data.tcDelta - this.pluginConfiguration.data.tcIn : tcIn - this.pluginConfiguration.data.tcIn;
            } else {
                seekTc = this.pluginConfiguration.data.tcDelta ? tcIn - this.pluginConfiguration.data.tcDelta : tcIn;
            }
            const reverseMode = this.mediaPlayerElement.getMediaPlayer().reverseMode;
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(reverseMode ? this.mediaPlayerElement.getMediaPlayer().getDuration() - seekTc : seekTc);
            this.scroll();
        }
    }

    /**
     * Invoked time change event for :
     * - update current time
     */

    private handleOnTimeChange() {
        const tcIn = this.pluginConfiguration?.data?.tcIn;
        this.currentTime = tcIn > 0 ? this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + tcIn : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
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

    /** @internal */
    public _handleOnTimeChangeForTesting() {
        this.handleOnTimeChange();
    }

    /**
     * Handle change text on searching input
     */

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
        }
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
                    this.automaticallyScrolled = true;
                    setTimeout(() => {
                        this.automaticallyScrolled = false;
                    }, 100);
                }
            }
        }
    }

    /**
     * handle scroll event
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        this.ignoreNextScroll = ignoreNextScroll;
        this.updateSynchro();
    }

    /**
     * Invoked on metadata loaded
     */

    protected handleMetadataLoaded() {
        if (this.metaDataLoaded()) {
            this.parseTranscription();
        }
    }

    /** @internal */
    _handleMetadataLoadedForTesting() {
        this.handleMetadataLoaded();
    }

    /**
     * In charge to load metadata
     */
    private parseTranscription() {
        if ((!this.transcriptions) || (this.transcriptions && this.transcriptions.length === 0)) {
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
                    const tcIn = this.pluginConfiguration?.data?.tcIn;
                    const duration = this.pluginConfiguration?.data?.duration;
                    if (tcIn > 0 || duration > 0) {
                        let transcriptionsToBeRemoved = [];
                        this.transcriptions.forEach((transcription, index) => {
                            if (transcription.tcOut < tcIn) {
                                transcriptionsToBeRemoved.push(transcription);
                            }
                            if (duration > 0 && transcription.tcIn > tcIn + duration) {
                                transcriptionsToBeRemoved.push(transcription);
                            }
                        });
                        this.transcriptions = this.transcriptions.filter(transcription => !transcriptionsToBeRemoved.includes(transcription));
                    }

                }
            }
        }
    }

    /**
     * Search word and scroll to first result
     */

    public searchWord(searchText: string) {
        this.listOfSearchedNodes = new Array<HTMLElement>();
        if (searchText !== '' && searchText !== this.pluginConfiguration.data.label) {
            this.searching = true;
            Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`)).forEach(node => {
                node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
                if (TextUtils.hasSearchText(node.textContent, searchText)) {
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
     * Scroll to next or previous searched word
     */

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

    public scrollToSelectedSegment() {
        const scrollNode: HTMLElement = this.transcriptionElement.nativeElement
            .querySelector(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`);
        if (scrollNode) {
            const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
            const minScroll = Math.round(this.transcriptionElement.nativeElement.offsetHeight / 3);
            this.transcriptionElement.nativeElement.scrollTop = scrollPos - minScroll;
            this.automaticallyScrolled = true;
            setTimeout(() => {
                this.automaticallyScrolled = false;
            }, 100);
        }
        this.displaySynchro = false;
    }

    /**
     * clear seach list onclick
     */

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
        if (this.searchedWordIndex === this.listOfSearchedNodes.length) {
            direction = 'up';
        }
        return direction;
    }

    /**
     * if scrolling and active segment is not visible add synchro button
     */

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
            if (!this.automaticallyScrolled) {
                this.displaySynchro = true;
            }
        }
    }

    private predicateIsNodeTcInTcOutMatching(transcription) {
        return segment => Math.round(transcription.tcIn) === Math.round(parseFloat(segment.getAttribute('data-tcin')))
            && Math.round(transcription.tcOut) === Math.round(parseFloat(segment.getAttribute('data-tcout')));
    }

    /**
     * Ajoute la classe css named-entity aux textes correspondants aux annotations (named entities).
     * @private
     */
    private handleMatchedTextStyle() {
        const listOfNamedEntitiesNodes = new Set<HTMLElement>();
        if (this.transcriptionElement && this.transcriptionElement.nativeElement) {
            const segmentElementNodes = Array.from(this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>('.segment'));

            this.transcriptions.forEach(tr => {
                const segmentElementNodesForCurrentTranscription = segmentElementNodes.filter(this.predicateIsNodeTcInTcOutMatching(tr));
                tr.annotations.forEach(a => {
                    if (a.matchedText.includes(' ')) {
                        //Matched texte est composé exemple: Emmanuel Macron
                        const matchedTextArray = a.matchedText.split(' ');
                        segmentElementNodesForCurrentTranscription.forEach(segmentElementNode => {
                            const wordElementNodes = segmentElementNode.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`);
                            wordElementNodes.forEach((node, nodeIndex) => {
                                TranscriptionPluginComponent.matchComposedSearchKey(node, matchedTextArray, wordElementNodes, nodeIndex, listOfNamedEntitiesNodes);
                            });
                        });
                    } else {
                        segmentElementNodesForCurrentTranscription.forEach((segmentElementNode) => {
                            const wordElementNodes = segmentElementNode.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`);
                            wordElementNodes.forEach((node) => {
                                if (node.textContent && TextUtils.hasSearchText(node.textContent, a.matchedText)) {
                                    listOfNamedEntitiesNodes.add(node as HTMLElement);

                                }
                            });
                        });
                    }
                });
            });
            listOfNamedEntitiesNodes.forEach(e => {
                e.classList.add(TranscriptionPluginComponent.SELECTOR_NAMED_ENTITY);
            });
        }
    }

    private static matchComposedSearchKey = (node: Element, matchedTextArray: string[], wordElementNodes: NodeListOf<Element>, nodeIndex: number, listOfNamedEntitiesNodes: Set<HTMLElement>) => {
        if (node.textContent && TextUtils.hasSearchText(node.textContent, matchedTextArray[0])) {
            let allMatched = true;
            let arrayOfMatchingWords = [];
            arrayOfMatchingWords.push(node);
            matchedTextArray.forEach((value, pos) => {
                const __ret = TranscriptionPluginComponent.matchRemainingWords(pos, wordElementNodes, nodeIndex, allMatched, value, arrayOfMatchingWords);
                allMatched = __ret.allMatched;
                arrayOfMatchingWords = __ret.arrayOfMatchingWords;
            });
            if (allMatched) {
                arrayOfMatchingWords.forEach(wordNode => {
                    listOfNamedEntitiesNodes.add(wordNode);
                })
            }

        }
    }
    private static matchRemainingWords = (pos: number, wordElementNodes: NodeListOf<Element>, nodeIndex: number, allMatched: boolean, value: string, arrayOfMatchingWords: any[]) => {
        if (pos > 0) {
            const nextNode = wordElementNodes[nodeIndex + pos];
            if (allMatched && nextNode && nextNode.textContent && TextUtils.hasSearchText(nextNode.textContent, value)) {
                arrayOfMatchingWords.push(nextNode);
            } else {
                allMatched = false;
                arrayOfMatchingWords = [];
            }
        }
        return { allMatched, arrayOfMatchingWords };
    }

    ngAfterViewInit(): void {
        this.subscriptionToEventsEmitters.push(Utils.waitFor(() => (this.transcriptionElement && this.transcriptionElement.nativeElement && this.transcriptions && this.transcriptions.length > 0),
            undefined,
            this.handleMatchedTextStyle.bind(this),
            this.intervalStep,
            this.timeout,
            this.setDataLoading.bind(this)));
        Utils.displaySnackBar(this.messagesComponent, "Les transcriptions sont issues d’un traitement par IA et peuvent contenir des erreurs.", 'info');
    }

}
