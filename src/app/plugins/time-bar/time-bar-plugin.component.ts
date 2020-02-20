import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';

@Component({
    selector: 'amalia-time-bar',
    templateUrl: './time-bar-plugin.component.html',
    styleUrls: ['./time-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimeBarPluginComponent extends PluginBase implements OnInit {
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
    public fps = 25;

    /**
     * Plugin display state
     */
    public displayState: 'small' | 'large' = 'large';

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = 'time-bar';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
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
