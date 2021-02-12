import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {TimeBarConfig} from '../../core/config/model/time-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {DEFAULT} from '../../core/constant/default';
import {MediaPlayerService} from '../../service/media-player-service';

@Component({
    selector: 'amalia-time-bar',
    templateUrl: './time-bar-plugin.component.html',
    styleUrls: ['./time-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimeBarPluginComponent extends PluginBase<TimeBarConfig> implements OnInit {
    public static PLUGIN_NAME = 'TIME_BAR';
    /**
     * Return  current time
     */
    public startTc: number;

    /**
     * Return  current time
     */
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;

    /**
     * Display format specifier h|m|s|f|ms|mms
     */
    public displayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' = 'f';
    /**
     * Media fps
     */
    public fps = DEFAULT.FPS;

    /**
     * Plugin display state
     */
    public displayState;
    /**
     * Show timeBar
     */
    public active = true;

    /**
     * theme
     */
    public theme: 'inside' | 'outside';
    constructor(playerService: MediaPlayerService) {
        super(playerService, TimeBarPluginComponent.PLUGIN_NAME);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        this.handleDisplayState();
        this.theme = this.pluginConfiguration.data.theme;
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        if (this.theme === 'inside') {
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_LEAVE, this.hideTimeBar);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_ENTER, this.showTimeBar);
        }
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_RESIZED, this.handleDisplayState);
    }
    /**
     * switch container class based on width
     */
    @AutoBind
    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
    }
    @AutoBind
    public hideTimeBar() {
        this.active = false;
    }
    @AutoBind
    public showTimeBar() {
        if (this.displayState !== 's') {
            this.active = true;
        } else {
            this.active = false;
        }
    }


    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<TimeBarConfig> {
        return {name: TimeBarPluginComponent.PLUGIN_NAME, data: {timeFormat: 'f', theme: 'outside'}};
    }

    /**
     * Invoked time change event for :
     * - update current time
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        this.startTc = (this.mediaPlayerElement.getConfiguration().tcOffset) ? this.mediaPlayerElement.getConfiguration().tcOffset : 0;
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
    }
}
