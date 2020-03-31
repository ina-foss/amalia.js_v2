import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {StoryboardConfig} from '../../core/config/model/storyboard-config';
import * as _ from 'lodash';

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

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = StoryboardPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        this.enableLabel = this.pluginConfiguration.data.enableLabel;
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl !== '') {
            this.fps = this.mediaPlayerElement.getMediaPlayer().framerate;
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleDurationChange);
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
                tcDelta: 1,
                displayFormat: 'f'
            }
        };
    }

    /**
     * Invoked on duration chage
     */
    @AutoBind
    private handleDurationChange() {
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (!isNaN(duration)) {
            this.listOfThumbnail = _.range(0, duration, this.pluginConfiguration.data.tcDelta);
        }
        const baseUrl = this.pluginConfiguration.data.baseUrl;
        const tcParam = this.pluginConfiguration.data.tcParam;
        this.baseUrl = baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=` : `${baseUrl}&${tcParam}=`;
        this.logger.debug(`${this.baseUrl} : duration : ${duration}`);
    }

}
