import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import * as _ from 'lodash';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {ControlBarConfig} from '../../core/config/model/control-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';


@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlBarPluginComponent extends PluginBase<Array<ControlBarConfig>> {
    public static PLUGIN_NAME = 'CONTROL_BAR';
    /**
     * Min playback rate
     */
    @Input()
    public minPlaybackRateSlider = -10;

    /**
     * Max playback rate
     */
    @Input()
    public maxPlaybackRateSlider = 10;

    /**
     * Playback rate step
     */
    @Input()
    public stepPlaybackRateSlider = 0.05;

    /**
     * list playback rate step (2/6/8)
     */
    @Input()
    public sliderListOfPlaybackRateStep: Array<number> = [-10, -8, -6, -4, -2, -1, 0, 1, 2, 4, 6, 8, 10];
    /**
     * List of playback rate
     */
    @Input()
    public sliderListOfPlaybackRateCustomSteps: Array<number> = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 1.5, 2, 4, 6, 8, 10];

    public sliderListOfPlaybackRateStepWidth: Array<number> = [];

    /**
     * list of backward playback step
     */
    @Input()
    public backwardPlaybackRateStep: Array<number> = [-1, -2, -6, -10];
    /**
     * list of forward playback step
     */
    @Input()
    public forwardPlaybackRateStep: Array<number> = [2, 6, 10];
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
    public currentTime = 0;

    /**
     * Media duration
     */
    public duration = 0;

    /**
     * Player playback rate
     */
    public currentPlaybackRate = 1;

    /**
     * Volume slider state
     */
    public enableVolumeSlider = false;

    /**
     * List of control for Zone 1
     */
    public elements;

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = ControlBarPluginComponent.PLUGIN_NAME;
    }

    @AutoBind
    init() {
        super.init();
        this.elements = this.pluginConfiguration.data;
        this.buildSliderSteps();
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.VOLUME_CHANGE, this.handleOnVolumeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYBACK_RATE_CHANGE, this.handlePlaybackRateChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
    }


    /**
     * Return plugin configuration
     */
    getDefaultConfig(): PluginConfigData<Array<ControlBarConfig>> {
        const listOfControls = new Array<ControlBarConfig>();
        listOfControls.push({label: 'Barre de progression', control: 'progressBar'});
        listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2});
        listOfControls.push({label: 'Fullscreen', control: 'pause', icon: 'fullscreen', zone: 3});
        return {
            name: ControlBarPluginComponent.PLUGIN_NAME,
            data: listOfControls
        };
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
    public hasComponentWithoutZone(componentName: string): boolean {
        const control = _.find(this.pluginConfiguration.data, {control: componentName});
        return (control);
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
        if (this.elements) {
            return _.filter(this.elements, {zone});
        }
        return null;
    }

    /**
     * In charge to build step width size
     */
    private buildSliderSteps() {
        const maxStep = this.sliderListOfPlaybackRateStep.length;
        this.sliderListOfPlaybackRateStepWidth = new Array<number>();
        for (let i = 0; i < maxStep; i++) {
            const startStep = this.sliderListOfPlaybackRateStep[i];
            const endStep = this.sliderListOfPlaybackRateStep[(i === maxStep - 1) ? i - 1 : i + 1];
            // maxStepAbs = Math.max(Math.abs(this.sliderListOfPlaybackRateStep[i]), maxStepAbs);
            if (i === maxStep - 1) {
                this.sliderListOfPlaybackRateStepWidth[i] = 1;
            } else {
                this.sliderListOfPlaybackRateStepWidth[i] = Math.abs(startStep - endStep);
            }
        }
        const sumOfGap = _.sum(this.sliderListOfPlaybackRateStepWidth);
        for (let i = 0; i < maxStep; i++) {
            this.sliderListOfPlaybackRateStepWidth[i] = (this.sliderListOfPlaybackRateStepWidth[i] * 100 / sumOfGap);
        }
    }

    /**
     * Invoked for change playback rate
     */
    private prevPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
    }

    /**
     * Invoked for change playback rate
     */
    private nextPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
    }

    /**
     * Return playback step value
     * @param playbackRateStep list of steps
     * @return return playback step
     */
    private getPlaybackStepValue(playbackRateStep: Array<number>): number {
        let playbackRate = 1;
        let indexOfCurrentPlaybackRate = playbackRateStep.indexOf(this.currentPlaybackRate);
        if (indexOfCurrentPlaybackRate !== -1 || this.currentPlaybackRate === 1) {
            indexOfCurrentPlaybackRate = Math.min(indexOfCurrentPlaybackRate + 1, playbackRateStep.length - 1);
            playbackRate = playbackRateStep[indexOfCurrentPlaybackRate];
        }
        return playbackRate;
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
     * @param playbackRate playback rate
     */
    @AutoBind
    private handlePlaybackRateChange(playbackRate: number) {
        this.currentPlaybackRate = playbackRate;
        this.logger.info('Handle playback rate change', playbackRate);
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
