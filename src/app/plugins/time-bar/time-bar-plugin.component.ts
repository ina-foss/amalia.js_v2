import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';

@Component({
    selector: 'amalia-time-bar',
    templateUrl: './time-bar-plugin.component.html',
    styleUrls: ['./time-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimeBarPluginComponent extends PluginBase implements OnInit {
    /**
     * return  current time
     */
    public startTc: number;

    /**
     * return  current time
     */
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;

    /**
     * display format specifier h/m/s/f/ms/mms
     */
    public displayFormat = 'f';
    /**
     * Media fps
     */
    public fps = 25;

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = 'time-bar';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.startTc = 3600;
        this.currentTime = 3900;
        this.duration = 3600;
    }

}
