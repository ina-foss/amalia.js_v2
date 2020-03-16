import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {TranscriptionConfig} from '../../core/config/model/transcription-config';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {TranscriptionLocalisation} from '../../core/config/model/transcription-localisation';
import {DEFAULT} from '../../core/constant/default';

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
    public static SELECTOR_SELECTED = 'selected';
    public static SELECTOR_PROGRESS_BAR = '.progress-bar';
    public tcDisplayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = false;
    public ignoreNextScroll = false;
    @ViewChild('transcriptionElement', {static: false})
    public transcriptionElement: ElementRef<HTMLElement>;
    public displayProgressBar = false;
    /**
     * Return  current time
     */
    public currentTime: number;
    public transcriptions: Array<TranscriptionLocalisation> = null;

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = TranscriptionPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            if (this.pluginConfiguration.data.timeFormat) {
                this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat;
            }
            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration?.data.autoScroll) {
                this.autoScroll = true;
                this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
            }
            this.displayProgressBar = this.pluginConfiguration.data.progressBar || false;
        }
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
    }

    /**
     * handle call
     * @param tc time code
     */
    public callSeek(tc) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
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
                progressBar: false
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
     * Invoked for change auto scroll state
     */
    public toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
    }

    /**
     * Invoked time change event for :
     * - update current time
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (this.pluginConfiguration.data.autoScroll && this.transcriptionElement) {
            const karaokeTcDelta = this.pluginConfiguration.data?.karaokeTcDelta || TranscriptionPluginComponent.KARAOKE_TC_DELTA;
            this.disableRemoveAllSelectedNodes();
            if (this.pluginConfiguration.data && this.pluginConfiguration.data.withSubLocalisations) {
                this.selectWords(karaokeTcDelta);
            }
            this.selectSegment(karaokeTcDelta);
        }
    }

    /**
     *  In charge to remove selected elements and disable progress bar
     */
    private disableRemoveAllSelectedNodes() {
        Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_SELECTED}`)).forEach(node => {
            node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
            if (this.pluginConfiguration.data && this.pluginConfiguration.data.progressBar) {
                const progressBarNode = (node.querySelector(TranscriptionPluginComponent.SELECTOR_PROGRESS_BAR) as HTMLElement);
                if (progressBarNode) {
                    progressBarNode.style.width = '0%';
                }
            }
        });
    }

    /**
     * In charge to select word in time range
     * @param karaokeTcDelta time code delta
     */
    private selectWords(karaokeTcDelta: number) {
        const elementNodes = Array.from(this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>('.w'));
        if (elementNodes) {
            const filteredNodes = elementNodes
                .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta
                    && this.currentTime < parseFloat(node.getAttribute('data-tcout')));
            if (filteredNodes && filteredNodes.length > 0) {
                filteredNodes.forEach(n => {
                    n.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
            }
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
                segmentFilteredNodes.forEach(n => {
                    const tcIn = Math.round(parseFloat(n.getAttribute('data-tcin')));
                    const tcOut = Math.round(parseFloat(n.getAttribute('data-tcout')));
                    const percentWidth = ((Math.round(this.currentTime) - tcIn) * 100) / (tcOut - tcIn);
                    n.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                    (n.querySelector(TranscriptionPluginComponent.SELECTOR_PROGRESS_BAR) as HTMLElement).style.width = percentWidth + '%';
                });
                this.scroll();
            }
        }
    }

    /**
     * In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height
     */
    private scroll() {
        const scrollNode = this.transcriptionElement.nativeElement.querySelector(`.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`) as HTMLElement;
        if (scrollNode) {
            const scrollPos = scrollNode.offsetTop
                - this.transcriptionElement.nativeElement.offsetTop;
            const scrollWin = this.transcriptionElement.nativeElement.scrollTop;
            // in charge of modifying the status of the scroll when reading segment is display area
            if (this.ignoreNextScroll && scrollWin < scrollPos) {
                this.ignoreNextScroll = false;
            }
            if (this.autoScroll && !this.ignoreNextScroll) {
                // Sliding window
                if ((scrollPos - this.transcriptionElement.nativeElement.scrollTop) > scrollNode.parentElement.clientHeight / 1.4) {
                    this.transcriptionElement.nativeElement.scrollTop = scrollPos;
                }
            }
        }
    }


    /**
     * handle user scrool
     */
    private handleScroll(ignoreNextScroll?: boolean) {
        this.ignoreNextScroll = ignoreNextScroll && ignoreNextScroll === true ? ignoreNextScroll : false;
        //this.autoScroll = (this.pluginConfiguration?.data.autoScroll) ? !this.ignoreNextScroll : false;

        console.log('handleScroll', this.autoScroll, this.ignoreNextScroll);
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded transcription ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && isArrayLike<string>(handleMetadataIds)) {
            this.transcriptions = new Array<TranscriptionLocalisation>();
            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`get metadata for ${metadataId}`);
                const transcriptionLocalisations = metadataManager
                    .getTranscriptionLocalisations(metadataId, this.pluginConfiguration.data.parseLevel, this.pluginConfiguration.data.withSubLocalisations);
                if (transcriptionLocalisations && transcriptionLocalisations.length > 0) {
                    this.transcriptions = this.transcriptions.concat(transcriptionLocalisations);
                }
            });
        }
    }

}
