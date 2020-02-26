import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import * as _ from 'lodash';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {ControlBarConfig} from '../../core/config/model/control-bar-config';


@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlBarPluginComponent extends PluginBase implements OnInit {
    @Input()
    public listOfPlaybackRate = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10];
    /**
     * Volume left side
     */
    public volumeLeft = 100;
    /**
     * Volume right side
     */
    public volumeRight = 100;
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
     * Player playback rate
     */
    public currentPlaybackRate = 1;
    public stateControl: 'small' | 'large' = 'large';
    /**
     * Volume slider state
     */
    public enableVolumeSlider = false;
    /**
     * list of controls
     */
    private readonly listOfControls = new Array<ControlBarConfig>();


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
        this.listOfControls.push({
            label: 'Capture Image',
            control: 'download',
            icon: 'screenshot',
            zone: 1,
            order: 2,
            data: {href: 'http://localhost:4200/assets/logo.svg'}
        });

        this.listOfControls.push({
            label: 'Download',
            control: 'download',
            icon: 'download',
            zone: 1,
            order: 1,
            data: {href: 'http://localhost:4200/assets/logo.svg'}
        });
        this.listOfControls.push({label: 'Playback Rate', control: 'playbackRate', zone: 1});

        this.listOfControls.push({label: 'backward-start', icon: 'backward-start', control: 'backward-start', zone: 2});
        this.listOfControls.push({label: 'backward-frame', icon: 'backward-frame', control: 'backward-frame', zone: 2});
        this.listOfControls.push({label: 'backward-5seconds', icon: 'backward-5seconds', control: 'backward-5seconds', zone: 2});
        this.listOfControls.push({label: 'backward', icon: 'backward', control: 'backward', zone: 2});
        this.listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2});
        this.listOfControls.push({label: 'forward', icon: 'forward', control: 'forward', zone: 2});
        this.listOfControls.push({label: 'forward-5seconds', icon: 'forward-5seconds', control: 'forward-5seconds', zone: 2});
        this.listOfControls.push({label: 'forward-frame', icon: 'forward-frame', control: 'forward-frame', zone: 2});
        this.listOfControls.push({label: 'forward-end', icon: 'forward-end', control: 'forward-end', zone: 2});

        this.listOfControls.push({label: 'Volume', control: 'volume', zone: 3});
        this.listOfControls.push({label: 'Fullscreen', control: 'pause', icon: 'fullscreen', zone: 3});
        this.listOfControls.push({label: 'Aspect ratio (a)', control: 'aspectRatio', zone: 3});


        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.VOLUME_CHANGE, this.handleOnVolumeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYBACK_RATE_CHANGE, this.handlePlaybackRateChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
    }

    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    public controlClicked(control: string) {
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
                mediaPlayer.captureImage(100);
                break;
            case 'backward':
                this.prevPlaybackRate();
                break;
            case 'backward-5seconds':
                mediaPlayer.movePrevFrame(5);
                break;
            case 'backward-frame':
                mediaPlayer.movePrevFrame(1);
                break;
            case 'backward-start':
                mediaPlayer.seekToBegin();
                break;
            case 'forward':
                this.nextPlaybackRate();
                break;
            case 'forward-5seconds':
                mediaPlayer.moveNextFrame(5);
                break;
            case 'forward-frame':
                mediaPlayer.moveNextFrame(1);
                break;
            case 'forward-end':
                mediaPlayer.seekToEnd();
                break;
            case 'download':
                mediaPlayer.seekToEnd();
                break;
            default:
                this.logger.warn('Control not implemented', control);
                break;
        }
    }

    /**
     * Change volume
     * @param value volume percentage
     * @param volumeSide volume side (l or r)
     */
    public changeVolume(value: string | number, volumeSide?: string) {
        this.mediaPlayerElement.getMediaPlayer().setVolume(Number(value), volumeSide);
    }

    /**
     * Return true if the component is in ths configuration without zone
     * @param componentName compoent name
     */
    public hasComponentWithoutZone(componentName: string) {
        const control = _.find(this.listOfControls, {control: componentName});
        return !(control && control.hasOwnProperty('zone') && control.zone);
    }

    /**
     * Invoked on mouse move
     * @param value change value
     */
    public moveSliderCursor(value: any) {
        this.logger.info('moveSliderCursor ', value);
        this.currentTime = value * this.duration / 100;
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.currentTime);
    }

    /**
     * Invoked for change aspect ratio
     */
    public changeAspectRatio() {
        this.mediaPlayerElement.aspectRatio = (this.aspectRatio === '4by3') ? '16by9' : '4by3';
    }

    /**
     * Invoked on change playback rate
     */
    public onChangePlaybackRate(value) {
        this.currentPlaybackRate = value;
        this.mediaPlayerElement.getMediaPlayer().playbackRate = this.currentPlaybackRate;
    }

    /**
     * Return interval min value
     */
    public getPlaybackRateIntervalMinValue() {
        return _.min(this.listOfPlaybackRate);
    }

    /**
     * Return interval max value
     */
    public getPlaybackRateIntervalMaxValue() {
        return _.max(this.listOfPlaybackRate);
    }

    /**
     * Change volume state
     */
    public changeSameVolumeState() {
        this.mediaPlayerElement.getMediaPlayer().withMergeVolume = !this.mediaPlayerElement.getMediaPlayer().withMergeVolume;
        if (this.mediaPlayerElement.getMediaPlayer().withMergeVolume) {
            this.changeVolume(Math.min(this.volumeRight, this.volumeLeft));
        }
    }

    /**
     * Return list controls by zone id
     * @param zone zone id
     */
    public getControlsByZone(zone: number): Array<ControlBarConfig> {
        return _.filter(this.listOfControls, {zone});
    }

    /**
     * Invoked for change playback rate
     */
    private prevPlaybackRate() {
        let indexOfCurrentPlaybackRate = this.listOfPlaybackRate.indexOf(this.currentPlaybackRate);
        if (indexOfCurrentPlaybackRate !== -1) {
            indexOfCurrentPlaybackRate = Math.max(0, indexOfCurrentPlaybackRate - 1);
            this.changePlaybackRate(this.listOfPlaybackRate[indexOfCurrentPlaybackRate]);
        } else {
            this.logger.warn('Error to found selected playback rate');
        }
    }

    /**
     * Invoked for change playback rate
     */
    private nextPlaybackRate() {
        let indexOfCurrentPlaybackRate = this.listOfPlaybackRate.indexOf(this.currentPlaybackRate);
        if (indexOfCurrentPlaybackRate !== -1) {
            indexOfCurrentPlaybackRate = Math.min(indexOfCurrentPlaybackRate + 1, this.listOfPlaybackRate.length - 1);
            this.changePlaybackRate(this.listOfPlaybackRate[indexOfCurrentPlaybackRate]);
        } else {
            this.logger.warn('Error to found selected playback rate');
        }
    }


    /**
     * Invoked for change playback rate
     */
    private changePlaybackRate(value: number) {
        this.currentPlaybackRate = value;
        this.mediaPlayerElement.getMediaPlayer().playbackRate = this.currentPlaybackRate;
    }


    /**
     * Invoked time change event for :
     * - update progress bar
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
    }

    /**
     * Invoked on volume change :
     * - change left volume
     */
    @AutoBind
    private handleOnVolumeChange() {
        this.volumeLeft = this.mediaPlayerElement.getMediaPlayer().getVolume('l');
        this.volumeRight = this.mediaPlayerElement.getMediaPlayer().getVolume('r');
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
    }

    /**
     * Invoked on playback change
     * @param event playback rate
     */
    @AutoBind
    private handlePlaybackRateChange(event) {
        this.logger.info('Playback rate change', event);
    }

    /**
     * Invoked on aspect ratio change
     * @param event aspect ratio
     */
    @AutoBind
    private handleAspectRatioChange(event) {
        this.aspectRatio = event;
    }

}
