import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import * as _ from 'lodash';

@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ControlBarPluginComponent extends PluginBase implements OnInit {
    /**
     * Volume left side
     */
    public volumeLeft = 100;
    /**
     * Volume right side
     */
    public volumeRight = 100;
    /**
     * State for store volume
     */
    public sameVolume = true;
    /**
     * Selected aspectRatio
     */
    public aspectRatio: '16by9' | '4by3' = '4by3';

    /**
     * return  current time
     */
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * list of controls
     */
    private readonly listOfControls = new Array<{ 'label': string, icon?: string, 'control': string, 'zone'?: number, order?: number }>();

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = 'control-bar';
    }

    ngOnInit(): void {
        super.ngOnInit();
        // Simple player
        // this.listOfControls.push({label: 'Barre de progression', control: 'progressBar'});
        // this.listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 1});
        // this.listOfControls.push({label: 'Volume', control: 'volume', zone: 2});
        // this.listOfControls.push({label: 'Fullscreen', control: 'pause', icon: 'fullscreen', zone: 3});

        // advanced player
        // this.listOfControls.push({label: 'Barre de progression', control: 'progressBar'});
        // this.listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2});
        // this.listOfControls.push({label: 'Volume', control: 'volume', zone: 3});
        // this.listOfControls.push({label: 'Fullscreen', control: 'pause', icon: 'fullscreen', zone: 3});
        // this.listOfControls.push({label: 'Aspect ratio (a)', control: 'viewRatio', icon: 'fullscreen', zone: 3});

        // Expert
        this.listOfControls.push({label: 'Barre de progression', control: 'progressBar'});
        this.listOfControls.push({label: 'Capture Image', control: 'screenshot', icon: 'screenshot', zone: 1});

        this.listOfControls.push({label: 'backward-start', icon: 'backward-start', control: 'backward-start', zone: 2});
        this.listOfControls.push({label: 'backward-frame', icon: 'backward-frame', control: 'backward-frame', zone: 2});
        this.listOfControls.push({label: 'backward-5seconds', icon: 'backward-5seconds', control: 'backward-5seconds', zone: 2});
        this.listOfControls.push({label: 'backward', icon: 'backward', control: 'backward', zone: 2});
        this.listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2});
        this.listOfControls.push({label: 'forward', icon: 'forward', control: 'forward', zone: 2});
        this.listOfControls.push({label: 'forward-5seconds', icon: 'forward-5seconds', control: 'forward-5seconds', zone: 2});
        this.listOfControls.push({label: 'forward-frame', icon: 'forward-frame', control: 'forward-frame', zone: 2});
        this.listOfControls.push({label: 'forward-end', icon: 'forward-end', control: 'forward-frame', zone: 2});

        this.listOfControls.push({label: 'Volume', control: 'volume', zone: 3});
        this.listOfControls.push({label: 'Fullscreen', control: 'pause', icon: 'fullscreen', zone: 3});
        this.listOfControls.push({label: 'Aspect ratio (a)', control: 'aspectRatio', zone: 3});
    }

    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    public controlClicked(control: string, a?: any) {
        this.logger.debug('Click to control', control);
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        switch (control) {
            case 'playPause':
                mediaPlayer.playPause();
                break;
            case 'viewRatio':
                mediaPlayer.playPause();
                break;
            case 'screenshot':
                mediaPlayer.captureImage();
                break;
            default:
                this.logger.warn('Control not implemented', control);
                break;
        }
    }

    public changeVolume(value: string | number, volumeSide?: string) {
        this.logger.debug(`Volume change ${volumeSide} ${value} with same volume ${this.sameVolume}`);
        const volume = Number(value);
        if (this.sameVolume) {
            this.volumeLeft = volume;
            this.volumeRight = volume;
        } else {
            if (volumeSide === 'r') {
                this.volumeRight = volume;
            } else if (volumeSide === 'l') {
                this.volumeLeft = volume;
            }
        }
        this.mediaPlayerElement.getMediaPlayer().setVolume(volume);
    }

    /**
     * Return true if the component is in ths configuration without zone
     * @param componentName compoent name
     */
    public hasComponentWithoutZone(componentName: string) {
        const control = _.find(this.listOfControls, {control: componentName});
        return !(control && control.hasOwnProperty('zone') && control.zone);
    }

    private changeSameVolumeState() {
        this.sameVolume = !this.sameVolume;
        if (this.sameVolume) {
            this.changeVolume(Math.min(this.volumeRight, this.volumeLeft));
        }
    }

    /**
     * return list controls by zone id
     * @param zone zone id
     */
    private getControlsByZone(zone: number): Array<{ 'label': string, icon?: string, 'control': string, 'zone'?: number, order?: number }> {
        // Sort by order attribute
        _.sortBy(this.listOfControls, [(o) => {
            return (o.order) ? o.order : 0;
        }]);
        return _.filter(this.listOfControls, {zone});
    }
}
