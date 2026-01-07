import { PluginBase } from '../../core/plugin/plugin-base';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PlayerEventType } from '../../core/constant/event-type';
import { TimeBarConfig } from '../../core/config/model/time-bar-config';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { DEFAULT } from '../../core/constant/default';
import { LABEL } from '../../core/constant/labels';
import { MediaPlayerService } from '../../service/media-player-service';
import { Utils } from 'src/app/core/utils/utils';
import { FormatUtils } from 'src/app/core/utils/format-utils';

@Component({
    selector: 'amalia-time-bar',
    templateUrl: './time-bar-plugin.component.html',
    styleUrls: ['./time-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimeBarPluginComponent extends PluginBase<TimeBarConfig> implements OnInit {
    @ViewChild("tooltip")
    tooltip: ElementRef<HTMLDivElement>;

    @ViewChild("tooltip2")
    tooltip2: ElementRef<HTMLDivElement>;

    public static PLUGIN_NAME = 'TIME_BAR';
    /**
     * Return  current time
     */
    public startTc: number;

    /**
     * Return  current time
     */
    public timeTimeBar: number;
    /**
     * Media duration
     */
    public durationTimeBar: number;

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
        super(playerService);
        this.pluginName = TimeBarPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }


    init() {
        super.init();
        this.handleDisplayState();
        this.theme = this.pluginConfiguration.data.theme;
        this.timeFormat = this.pluginConfiguration.data.timeFormat;
        this.displayFormat = (this.timeFormat) ? this.timeFormat : this.getDefaultConfig().data.timeFormat;
        if (this.pluginConfiguration.data.timeFormat === 'hours') {
            this.labelTcIn = LABEL.START_HOUR;
            this.labelTcOut = LABEL.END_HOUR;
        } else {
            this.labelTcIn = LABEL.START_TC;
            this.labelTcOut = LABEL.END_TC;
        }
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        if (this.theme === 'inside') {
            this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_MOUSE_LEAVE, this.hideTimeBar);
            this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_MOUSE_ENTER, this.showTimeBar);
        }
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_RESIZED, this.handleDisplayState);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKING, this.handleOnSeeking);
    }

    /**
     * switch container class based on width
     */

    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
    }

    public hideTimeBar() {
        this.active = false;
    }

    public showTimeBar() {
        if (this.displayState !== 's' && this.displayState !== 'xs') {
            this.active = true;
        } else {
            this.active = false;
        }
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<TimeBarConfig> {
        return { name: TimeBarPluginComponent.PLUGIN_NAME, data: { timeFormat: 'f', theme: 'outside' } };
    }

    /**
     * Invoked time change event for :
     * - update current time
     */

    public handleOnTimeChange() {
        const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
        this.timeTimeBar = (tcOffset) ? tcOffset + this.mediaPlayerElement.getMediaPlayer().getCurrentTime() : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.timeTimeBar = this.pluginConfiguration?.data?.first_tc ? this.timeTimeBar + this.pluginConfiguration?.data?.first_tc : this.timeTimeBar;
    }

    /**
     * Invoked on duration change
     */

    public handleOnDurationChange() {
        const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
        this.startTc = (tcOffset) ? tcOffset : 0;
        this.startTc = this.pluginConfiguration?.data?.first_tc ? this.startTc + this.pluginConfiguration?.data?.first_tc : this.startTc;
        this.timeTimeBar = (tcOffset) ? tcOffset + this.mediaPlayerElement.getMediaPlayer().getCurrentTime() : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.timeTimeBar = this.pluginConfiguration?.data?.first_tc ? this.timeTimeBar + this.pluginConfiguration?.data?.first_tc : this.timeTimeBar;
        this.durationTimeBar = (tcOffset) ? this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset : this.mediaPlayerElement.getMediaPlayer().getDuration();
        this.durationTimeBar = this.pluginConfiguration?.data?.first_tc ? this.durationTimeBar + this.pluginConfiguration?.data?.first_tc : this.durationTimeBar;
    }

    public handleOnSeeking(time: number) {
        const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
        this.timeTimeBar = (tcOffset) ? tcOffset + time : time;
        this.timeTimeBar = this.pluginConfiguration?.data?.first_tc ? this.timeTimeBar + this.pluginConfiguration?.data?.first_tc : this.timeTimeBar;

    }

    copyToClipBoard(tc: number, event: MouseEvent) {
        const text = FormatUtils.formatTime(tc, 's', this.fps);
        Utils.copyToClipBoard(text, this.tooltip?.nativeElement, event.clientX, event.clientY);
    }
    copyAllToClipBoard(tc: number, event: MouseEvent) {
        const text = FormatUtils.formatTime(tc, 'f', this.fps);
        Utils.copyToClipBoard(text, this.tooltip2?.nativeElement, event.clientX, event.clientY);
    }
}
