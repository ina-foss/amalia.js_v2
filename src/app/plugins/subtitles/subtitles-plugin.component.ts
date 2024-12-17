import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {Utils} from '../../core/utils/utils';
import {TranscriptionLocalisation} from '../../core/metadata/model/transcription-localisation';
import {SubtitleConfig} from '../../core/config/model/subtitle-config';
import * as _ from 'lodash';
import {MediaPlayerService} from '../../service/media-player-service';

@Component({
    selector: 'amalia-subtitles',
    templateUrl: './subtitles-plugin.component.html',
    styleUrls: ['./subtitles-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class SubtitlesPluginComponent extends PluginBase<SubtitleConfig> implements OnInit {
    public static PLUGIN_NAME = 'SUBTITLE';
    public static TC_DELTA = 0.5;
    /**
     * Return  current time
     */
    public currentTime: number;
    public subTitle: string;
    public transcriptions: Array<TranscriptionLocalisation> = null;
    public posSubtitle: ['none', 'up', 'down'];
    /**
     * Plugin display state
     */
    public displayState;
    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = SubtitlesPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init(): void {
        super.init();
        this.handleDisplayState();
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.POSITION_SUBTITLE_CHANGE, this.changeSubtitlePosition);
    }
    /**
     * switch container class based on width
     */
    @AutoBind
    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<SubtitleConfig> {
        return {
            name: SubtitlesPluginComponent.PLUGIN_NAME,
            data: {parseLevel: 2, tcDelta: SubtitlesPluginComponent.TC_DELTA}
        };
    }

    /**
     * Invoked time change event for :
     * - update current time
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.updateSubtitleContent();
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    protected handleMetadataLoaded() {
        this.refreshMetadata();
    }

    /**
     * Invoked for reload and parse metadata
     */
    private refreshMetadata() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(`Metadata loaded subtitle handle metadata ids: ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            this.transcriptions = new Array<TranscriptionLocalisation>();
            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`get metadata for ${metadataId}`);
                const transcriptionLocalisations = metadataManager
                    .getTranscriptionLocalisations(metadataId, this.pluginConfiguration.data.parseLevel, false);
                if (transcriptionLocalisations && transcriptionLocalisations.length > 0) {
                    this.transcriptions = this.transcriptions.concat(transcriptionLocalisations);
                }
            });
        }
    }

    /**
     * Invoked for change subtitle with current time
     */
    private updateSubtitleContent(): void {
        if (this.transcriptions) {
            const currentTime = this.currentTime;
            const tcDelta = this.pluginConfiguration.data?.tcDelta || SubtitlesPluginComponent.TC_DELTA;
            const listOfTranscription = _.filter(this.transcriptions, (l) => {
                return currentTime >= l.tcIn - tcDelta
                    && currentTime < l.tcOut + tcDelta;
            });
            if (listOfTranscription && listOfTranscription.length) {
                let texts: any = _.map(listOfTranscription, 'text');
                texts = _.trim(texts);
                this.subTitle = texts.toString();
            } else {
                this.subTitle = null;
            }
        } else {
            this.subTitle = null;
        }
    }
    /**
     * Invoked when user change subtitle position
     */
    @AutoBind
    private changeSubtitlePosition(event) {
        this.logger.debug('Change position subtitles', event);
        this.posSubtitle = event;
    }

}
