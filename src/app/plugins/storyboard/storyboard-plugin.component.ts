import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {StoryboardConfig} from '../../core/config/model/storyboard-config';
import * as _ from 'lodash';
import {MediaPlayerService} from '../../service/media-player-service';

@Component({
    selector: 'amalia-storyboard',
    templateUrl: './storyboard-plugin.component.html',
    styleUrls: ['./storyboard-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class StoryboardPluginComponent extends PluginBase<StoryboardConfig> implements OnInit {
    public static PLUGIN_NAME = 'STORYBOARD';
    public baseUrl: string;
    public listOfThumbnail: Array<number>;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * thumbnail size
     */
    public size: 'small' | 'medium' | 'large' = 'small';
    /**
     * Display format specifier h|m|s|f|ms|mms
     */
    public displayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' = 'f';
    /**
     * Media fps
     */
    public fps: number;
    /**
     * show time code label
     */
    public enableLabel: boolean;

    /**
     * Time code interval
     */
    public tcIntervals = [10, 30, 60];
    /**
     * frame intervals
     */
    public frameIntervals = [6, 60, 360];

    /**
     * Selected interval
     */
    public selectedInterval: [string, number];

    /**
     * state list of interval
     */
    public openIntervalList: boolean;

    constructor(playerService: MediaPlayerService) {
        super(playerService, StoryboardPluginComponent.PLUGIN_NAME);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.selectedInterval = ['tc', this.tcIntervals[0]];
    }

    @AutoBind
    init() {
        super.init();
        this.selectedInterval = ['tc', this.tcIntervals[0]];
        this.fps = this.mediaPlayerElement.getMediaPlayer().framerate;
        this.enableLabel = this.pluginConfiguration.data.enableLabel;
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl !== '') {
            if (this.mediaPlayerElement.isMetadataLoaded) {
                this.initStoryboard();
            } else {
                this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleDurationChange);
            }
        }
    }

    /**
     * Init storyboard
     * @param duration media duration
     */
    initStoryboard() {
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (!isNaN(duration)) {
            this.duration = duration;
            const baseUrl = this.pluginConfiguration.data.baseUrl;
            const tcParam = this.pluginConfiguration.data.tcParam;
            this.baseUrl = baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=` : `${baseUrl}&${tcParam}=`;
            this.updateThumbnailSize();
        } else {
            this.logger.error('Error to init storyboard, please check media duration');
        }
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<StoryboardConfig> {
        return {
            name: StoryboardPluginComponent.PLUGIN_NAME, data: {
                baseUrl: '',
                enableLabel: true,
                tcParam: 'tc',
                tcIntervals: this.tcIntervals,
                frameIntervals: this.frameIntervals,
                displayFormat: 'f'
            }
        };
    }

    /**
     * Handle to seek to time code
     * @param tc time code
     */
    public seekToTc(tc: number) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    /**
     * handle change thumbnail size
     * @param type type interval
     * @param tc time code
     */
    public selectedThumbnailSize(type: string, tc: number) {
        this.selectedInterval = [type, tc];
        this.updateThumbnailSize();
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleDurationChange() {
        this.initStoryboard();

    }

    /**
     * Handle interval
     */
    private updateThumbnailSize() {
        let interval: number = this.selectedInterval[1];
        if (this.selectedInterval[0] === 'frame') {
            interval = (1 / this.fps) * interval;
        }
        this.listOfThumbnail = _.range(0, this.duration, interval);
    }


}
