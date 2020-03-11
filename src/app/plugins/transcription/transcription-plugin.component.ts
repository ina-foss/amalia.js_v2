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
    public static KARAOKE_TC_DELTA = 0.5;
    public static SELECTED_CLASS_NAME = 'selected';
    public tcDisplayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = false;
    @ViewChild('transcriptionElement', {static: false})
    public transcriptionElement: ElementRef<HTMLElement>;
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
            data: {timeFormat: 's', fps: DEFAULT.FPS, autoScroll: true, parseLevel: 1, withSubLocalisations: false}
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
            this.scroll(element);
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
            Array.from(this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTED_CLASS_NAME}`)).forEach(node => {
                node.classList.remove(TranscriptionPluginComponent.SELECTED_CLASS_NAME);
            });
            const karaokeTcDelta = this.pluginConfiguration.data?.karaokeTcDelta || TranscriptionPluginComponent.KARAOKE_TC_DELTA;
            const elementNodes = Array.from(this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>('.w'));
            if (elementNodes) {
                const filteredNodes = elementNodes
                    .filter(node => this.currentTime >= Math.round(parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta)
                        && this.currentTime < Math.round(parseFloat(node.getAttribute('data-tcout')) + karaokeTcDelta));
                if (filteredNodes && filteredNodes.length > 0) {
                    filteredNodes.forEach(n => {
                        n.classList.add(TranscriptionPluginComponent.SELECTED_CLASS_NAME);
                    });
                    this.scroll(filteredNodes[0]);
                }
            }
        }
    }

    /**
     * In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height
     */
    private scroll(scrollNode: HTMLElement) {
        if (this.autoScroll) {
            this.transcriptionElement.nativeElement.scrollTop = scrollNode.parentElement.parentElement.offsetTop
                - this.transcriptionElement.nativeElement.offsetTop - scrollNode.parentElement.parentElement.offsetHeight;
        }
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
