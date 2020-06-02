import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {ControlBarConfig} from '../../core/config/model/control-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {MediaPlayerService} from '../../service/media-player-service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';


@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlBarPluginComponent extends PluginBase<Array<ControlBarConfig>> implements OnDestroy {
    public static PLUGIN_NAME = 'CONTROL_BAR';
    public static DEFAULT_THUMBNAIL_DEBOUNCE_TIME = 50;
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
    /**
     * Enable Menu
     */
    public enableMenu = false;
    /**
     * list of backward playback step
     */
    @Input()
    public backwardSlowPlaybackRateStep: Array<number> = [-0.25, -0.5];
    @Input()
    public backwardPlaybackRateStep: Array<number> = [-2, -6, -10];
    /**
     * list of forward playback step
     */
    @Input()
    public forwardPlaybackRateStep: Array<number> = [2, 6, 10];
    @Input()
    public forwardSlowPlaybackRateStep: Array<number> = [0.25, 0.5];
    /**
     * In charge to notify download event
     */
    @Output()
    public callback = new EventEmitter<any>();

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
    public aspectRatio: '16:9' | '4:3' = '4:3';

    /**
     * return  current time
     */
    public currentTime = 0;

    /**
     * Progress bar value
     */
    public progressBarValue = 0;
    /**
     * Media duration
     */
    public duration = 0;

    /**
     * In sliding
     */
    public inSliding = false;

    /**
     * Player playback rate
     */
    public currentPlaybackRate = 1;

    /**
     * Volume slider state
     */
    public enableVolumeSlider = false;
    /**
     * Menu list ratio state
     */
    public enableListRatio = false;
    /**
     * position of subtitles
     */
    public position = 'none';
    /**
     * List positions subtitle state
     */
    public enableListPositionsSubtitle = false;
    /**
     * List of control for Zone 1
     */
    public elements;
    /**
     * State of controlBar
     */
    public activated = true;
    /**
     * Playbackrate slider state
     */
    public enablePlaybackSlider = false;
    /**
     * Pinned Controls state
     */
    public pinnedSlider = false;
    /**
     * display state (s/m/l)
     */
    public displayState: string;
    /**
     * FullScreenMode state
     */
    public fullScreenMode = false;
    /**
     * Handle thumbnail
     */
    public tcThumbnail;
    public enableThumbnail = false;
    public thumbnailHidden = true;
    public thumbnailUrl: string;
    public thumbnailPosition = 0;
    public sliderListOfPlaybackRateStepWidth: Array<number> = [];
    private thumbnailSeekingDebounceTime: Subject<number> = new Subject<number>();
    private thumbnailPreviewDebounceTime: Subject<MouseEvent> = new Subject<MouseEvent>();

    constructor(playerService: MediaPlayerService) {
        super(playerService, ControlBarPluginComponent.PLUGIN_NAME);
    }

    @AutoBind
    init() {
        super.init();
        this.handleDisplayState();
        this.elements = this.pluginConfiguration.data;
        this.buildSliderSteps();
        // Enable thumbnail
        const thumbnailConfig = this.mediaPlayerElement.getConfiguration().thumbnail;
        this.enableThumbnail = (thumbnailConfig && thumbnailConfig.baseUrl !== '' && thumbnailConfig.enableThumbnail) || false;
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYBACK_RATE_CHANGE, this.handlePlaybackRateChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_ENTER, this.handlePlayerMouseenter);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_LEAVE, this.handlePlayerMouseleave);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
        // Handle to seek events with debounceTime
        const _debounceTime = this.mediaPlayerElement.getConfiguration().thumbnail?.debounceTime || ControlBarPluginComponent.DEFAULT_THUMBNAIL_DEBOUNCE_TIME;
        this.thumbnailSeekingDebounceTime
            .pipe(debounceTime(_debounceTime))
            .subscribe((value) => this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, value));
        this.thumbnailPreviewDebounceTime
            .pipe(debounceTime(_debounceTime))
            .subscribe((e) => this.updateThumbnail(e));
    }

    /**
     * Return plugin configuration
     */
    getDefaultConfig(): PluginConfigData<Array<ControlBarConfig>> {
        const listOfControls = new Array<ControlBarConfig>();
        listOfControls.push({label: 'Barre de progression', control: 'progressBar', priority: 1});
        listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2, priority: 1});
        listOfControls.push({label: 'Fullscreen', control: 'toggleFullScreen', icon: 'fullscreen', zone: 3, priority: 1});
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
        let frames: number;
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
            case 'slow-backward':
                this.prevSlowPlaybackRate();
                break;
            case 'backward-5seconds':
                frames = 5 * mediaPlayer.framerate;
                mediaPlayer.movePrevFrame(frames);
                break;
            case 'backward-second':
                frames = mediaPlayer.framerate;
                mediaPlayer.movePrevFrame(frames);
                break;
            case 'backward-10seconds':
                frames = 10 * mediaPlayer.framerate;
                mediaPlayer.movePrevFrame(frames);
                break;
            case 'backward-frame':
                mediaPlayer.movePrevFrame(1);
                break;
            case 'backward-start':
                this.changePlaybackRate(1);
                mediaPlayer.seekToBegin();
                break;
            case 'forward':
                this.nextPlaybackRate();
                break;
            case 'slow-forward':
                this.nextSlowPlaybackRate();
                break;
            case 'forward-5seconds':
                frames = 5 * mediaPlayer.framerate;
                mediaPlayer.moveNextFrame(frames);
                break;
            case 'forward-10seconds':
                frames = 10 * mediaPlayer.framerate;
                mediaPlayer.moveNextFrame(frames);
                break;
            case 'forward-second':
                frames = mediaPlayer.framerate;
                mediaPlayer.moveNextFrame(frames);
                break;
            case 'forward-frame':
                mediaPlayer.moveNextFrame(1);
                break;
            case 'forward-end':
                this.changePlaybackRate(1);
                mediaPlayer.seekToEnd();
                break;
            case 'displaySlider':
                this.displaySlider();
                break;
            case 'pinControls':
                this.pinControls();
                break;
            case 'toggleFullScreen':
                this.toggleFullScreen();
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
        this.volumeLeft = this.mediaPlayerElement.getMediaPlayer().getVolume('l');
        this.volumeRight = this.mediaPlayerElement.getMediaPlayer().getVolume('r');
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
        this.progressBarValue = value;
        this.currentTime = value * this.duration / 100;
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.currentTime);
    }

    /**
     * switch container class based on width
     */
    @AutoBind
    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
    }

    /**
     * Invoked for change aspect ratio
     */
    public changeAspectRatio() {
        this.mediaPlayerElement.aspectRatio = (this.aspectRatio === '4:3') ? '16:9' : '4:3';
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
            const v = Math.min(this.volumeRight, this.volumeLeft);
            this.changeVolume(v);
            this.volumeLeft = v;
            this.volumeRight = v;
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
     * return list controls by priority
     * @param priority : number
     */
    public getControlsByPriority(priority: number): Array<ControlBarConfig> {
        if (this.elements) {
            return _.filter(this.elements, {priority});
        }
        return null;
    }

    /**
     * Update displayState on windowResize
     */
    @AutoBind
    public handleWindowResize() {
        this.handleDisplayState();
        // handle full screen on esc press
        if (document.fullscreenElement === null) {
            this.fullScreenMode = false;
        } else {
            this.fullScreenMode = true;
        }
    }

    /**
     * Handle mouse enter on progress bar
     * @param event mouse enter
     */
    public progressBarMouseEnter(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            this.thumbnailHidden = false;
            this.updateThumbnail(event);
        }
    }

    /**
     * Handle mouse leave on progress bar
     * @param event mouse leave
     */
    public progressBarMouseLeave(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            this.thumbnailHidden = true;
            this.updateThumbnail(event);
        }
    }

    /**
     * Handle mouse move on progress bar
     * @param event mouse move
     */
    public progressBarMouseMove(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            this.thumbnailPreviewDebounceTime.next(event);
        }
    }

    /**
     * Progress bar on mouse down
     * @param value mouse event
     */
    public handleProgressBarMouseDown(value) {
        this.inSliding = true;
        this.thumbnailSeekingDebounceTime.next(value * this.duration / 100);
    }

    /**
     * Progress bar on mouse up
     * @param value mouse event
     */
    public handleProgressBarMouseUp(value) {
        this.inSliding = false;
        this.moveSliderCursor(value);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKED, value * this.duration / 100);
    }

    /**
     * Progress bar on mouse move
     * @param value mouse event
     */
    public handleProgressBarMouseMove(value) {
        if (this.inSliding) {
            this.thumbnailSeekingDebounceTime.next(value * this.duration / 100);
        }
    }


    /**
     * Handle callback
     */
    public handleCallback(control: ControlBarConfig) {
        this.callback.emit(control);
    }

    /**
     * Handle thumbnail pos
     * @param event mouse event
     */
    private updateThumbnail(event: MouseEvent) {
        const thumbnailSize = 150;
        const containerWidth = (event.target as HTMLElement).offsetWidth;
        const tc = Math.round(event.clientX * this.duration / containerWidth);
        if (isFinite(tc)) {
            this.thumbnailPosition = Math.min(Math.max(0, event.clientX - thumbnailSize / 2), containerWidth - thumbnailSize);
            this.thumbnailUrl = this.mediaPlayerElement.getThumbnailUrl(tc);
            this.tcThumbnail = tc;
        }
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
     * Invoked for change slow playback rate
     */
    private prevSlowPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardSlowPlaybackRateStep));
    }

    /**
     * Invoked for change slow playback rate
     */
    private nextSlowPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardSlowPlaybackRateStep));
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
            // indexOfCurrentPlaybackRate = Math.min(indexOfCurrentPlaybackRate + 1, playbackRateStep.length - 1);
            indexOfCurrentPlaybackRate = indexOfCurrentPlaybackRate + 1;
            if (indexOfCurrentPlaybackRate > playbackRateStep.length - 1) {
                indexOfCurrentPlaybackRate = 0;
            }
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
        if (!this.inSliding) {
            this.progressBarValue = (this.currentTime / this.duration) * 100;
        }
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

    /**
     * Invoked on volume button hover
     */
    public setupAudioNodes(data: any) {
        this.mediaPlayerElement.getMediaPlayer().setupAudioNodes(data);
    }

    /**
     * Invoked player mouse enter event for :
     * - animate controlBar
     */
    @AutoBind
    private handlePlayerMouseenter() {
        this.activated = true;
    }

    /**
     * Invoked player mouse leave event for :
     * - animate controlBar
     */
    @AutoBind
    private handlePlayerMouseleave() {
        this.activated = false;
    }

    /**
     * update position subtitle onclick
     * @param position subtitle position
     */
    public updateSubtitlePosition(position: string) {
        this.position = position;
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.POSITION_SUBTITLE_CHANGE, position);
    }

    /**
     * Toggle Display playbackslider
     */
    private displaySlider() {
        this.enablePlaybackSlider = !this.enablePlaybackSlider;
    }

    /**
     * Toggle Pinned class playback slider
     */
    private pinControls() {
        this.pinnedSlider = !this.pinnedSlider;
    }

    /**
     * Set aspect Ratio
     */
    public setVideoAspectRatio(ratio) {
        this.mediaPlayerElement.aspectRatio = ratio;
    }

    /**
     * Toggle fullscreen player
     */
    private toggleFullScreen() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
    }

    /**
     * Handle to download url
     * @param element html element
     * @param control control bar config
     */
    public buildUrlWithTc(element: HTMLElement, control: ControlBarConfig) {
        const baseUrl = control.data.href;
        const tcParam = control.data?.tcParam || 'tc';
        const tc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (baseUrl !== '') {
            element.setAttribute('href', baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=${tc}` : `${baseUrl}&${tcParam}=${tc}`);
        }
    }

    /**
     * Handle on component destroy
     */
    ngOnDestroy() {
    }

}
