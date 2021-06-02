import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {TimeBarConfig} from '../../core/config/model/time-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {DEFAULT} from '../../core/constant/default';
import {LABEL} from '../../core/constant/labels';
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
    public displayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 'f';
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
     * label tcin
     */
    public labelTcIn;
    /**
     * label tcout
     */
    public labelTcOut;

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
        this.timeFormat = this.pluginConfiguration.data.timeFormat;
        if (this.pluginConfiguration.data.timeFormat === 'hours') {
            this.labelTcIn = LABEL.START_HOUR;
            this.labelTcOut = LABEL.END_HOUR;
        } else {
            this.labelTcIn = LABEL.START_TC;
            this.labelTcOut = LABEL.END_TC;
        }
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
    public handleOnTimeChange() {
        const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
        this.currentTime = (tcOffset) ? tcOffset + this.mediaPlayerElement.getMediaPlayer().getCurrentTime() : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    public handleOnDurationChange() {
        const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
        this.startTc = (tcOffset) ? tcOffset : 0;
        this.currentTime = (tcOffset) ? tcOffset + this.mediaPlayerElement.getMediaPlayer().getCurrentTime() : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.duration = (tcOffset) ? this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset :  this.mediaPlayerElement.getMediaPlayer().getDuration();
    }
}
