import {PluginBase} from '../../core/plugin/plugin-base';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {ControlBarConfig} from '../../core/config/model/control-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {MediaPlayerService} from '../../service/media-player-service';
import {ThumbnailService} from '../../service/thumbnail-service';

@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlBarPluginComponent extends PluginBase<Array<ControlBarConfig>> implements OnDestroy {
    public static PLUGIN_NAME = 'CONTROL_BAR';
    public static DEFAULT_THUMBNAIL_DEBOUNCE_TIME = 250;
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
    public sliderListOfPlaybackRateStep: Array<number> = [-10, -8, -6, -4, -2, -1,  0, 1, 2, 4, 6, 8, 10];

    /**
     * List of playback rate
     */
    @Input()
    public sliderListOfPlaybackRateCustomSteps: Array<number> = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10];
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
     * Old Volume left side
     */
    public oldVolumeLeft = 100;

    /**
     * Volume right side
     */
    public volumeRight = 100;
    /**
     * Old Volume right side
     */
    public oldVolumeRight = 100;

    /**
     * Selected aspectRatio
     */
    public aspectRatio: '16:9' | '4:3' = '4:3';
    /**
     * Default aspect ratio
     */
    public defaultRatio;
    /**
     * return  current time
     */
    public currentTime = 0;
    public time = 0;
    /**
     * inverse display currentime
     */
    public inverse = false;

    /**
     * Progress bar value
     */
    public progressBarValue = 0;
    /**
     * Media duration
     */
    public duration = 0;
    /**
     * List of Controls
     */
    public controls = [];
    public indexPlaybackRate = 3;
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
     * Pinned slider state
     */
    public enablePinnedSlider = false;
    /**
     *  Pinned slider and ControlBar
     */
    public pinned = false;
    /**
     * display state (s/m/l)
     */
    public displayState: string;
    /**
     * FullScreenMode state
     */
    public fullScreenMode = false;
    /**
     * slider displayed
     */
    public selectedSlider = 'slider1';
    /**
     * show menu slider
     */
    public enableMenuSlider = false;
    /**
     * clicked button volume
     */
    public clickedVolume = false;
    /**
     * list position subtitles
     */
    public listOfSubtitles = [{position: 'Bas', key: 'down'}, {
        position: 'Haut',
        key: 'up'
    }, {position: 'Aucun (original)', key: 'none'}];
    /**
     * progressBar element
     */
    @ViewChild('progressBar')
    public progressBarElement: ElementRef<HTMLElement>;
    /**
     * Handle thumbnail
     */
    private readonly thumbnailService: ThumbnailService;
    public tcThumbnail = 0;
    public enableThumbnail = false;
    public thumbnailHidden = true;
    public thumbnailPosition = 0;
    public sliderListOfPlaybackRateStepWidth: Array<number> = [];
    public thumbnailBlob: string;
    @ViewChild('thumbnail')
    public thumbnailElement: ElementRef<HTMLElement>;
    @ViewChild('thumbnailContainer')
    public thumbnailContainer: ElementRef<HTMLElement>;
    /**
     * list of shortcuts
     */
    public listOfShortcuts;
    // Menu of controls
    @ViewChild('controlsMenu')
    public controlsMenu: ElementRef<HTMLElement>;
    public debounceFunction;
    public posPlaybackrates: Array<number> = [];
    public negPlaybackrates: Array<number> = [];
    public maxCursor: number;
    public minCursor: number;

    constructor(playerService: MediaPlayerService, thumbnailService: ThumbnailService) {
        super(playerService, ControlBarPluginComponent.PLUGIN_NAME);
        this.thumbnailService = thumbnailService;
        this.debounceFunction = _.debounce(this.updateThumbnail, 150, {maxWaitKey: ControlBarPluginComponent.DEFAULT_THUMBNAIL_DEBOUNCE_TIME});
    }

    @AutoBind
    init() {
        super.init();
        this.elements = this.pluginConfiguration.data;
        this.buildSliderSteps();
        this.initPlaybackrates();
        // init volume
        this.mediaPlayerElement.getMediaPlayer().setVolume(100);
        // init shortcuts
        this.listOfShortcuts = this.initShortcuts(this.pluginConfiguration.data);
        // Enable thumbnail
        const thumbnailConfig = this.mediaPlayerElement.getConfiguration().thumbnail;
        this.enableThumbnail = (thumbnailConfig && thumbnailConfig.baseUrl !== '' && thumbnailConfig.enableThumbnail) || false;
        // Init Events
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYBACK_RATE_CHANGE, this.handlePlaybackRateChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_ENTER, this.handlePlayerMouseenter);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_MOUSE_LEAVE, this.handlePlayerMouseleave);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.KEYDOWN, this.handleShortcuts);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DOCUMENT_CLICK, this.hideControlsMenuOnClickDocument);
        // Set default aspect ratio
        this.getDefaultAspectRatio();
        this.handleDisplayState();
    }
    /**
     * Return plugin configuration
     */
    getDefaultConfig(): PluginConfigData<Array<ControlBarConfig>> {
        const listOfControls = new Array<ControlBarConfig>();
        listOfControls.push({label: 'Barre de progression', control: 'progressBar', priority: 1});
        listOfControls.push({label: 'Play / Pause', control: 'playPause', zone: 2, priority: 1});
        listOfControls.push({
            label: 'Fullscreen',
            control: 'toggleFullScreen',
            icon: 'fullscreen',
            zone: 3,
            priority: 1
        });
        return {
            name: ControlBarPluginComponent.PLUGIN_NAME,
            data: listOfControls
        };
    }
    /**
     * init array of shortcuts
     */
    public initShortcuts(data) {
        const listOfShortcuts = [];
        for (const i in data) {
            if (typeof data[i] === 'object') {
                const control = data[i];
                if (typeof control.key !== 'undefined' && typeof control.control !== 'undefined') {
                    listOfShortcuts.push({key: control.key, control: control.control});
                }
            }
        }
        return listOfShortcuts;
    }
    /**
     * Apply shortcut if exists on keydown
     */
    @AutoBind
    public handleShortcuts(event) {
        this.applyShortcut(event);
    }
    /**
     * If key is declared in config apply control
     */
    public applyShortcut(key) {
        for (const shortcut of this.listOfShortcuts) {
            if (key === shortcut.key) {
                this.controlClicked(shortcut.control);
            }
        }
    }
    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    public controlClicked(control: string) {
        this.logger.debug('Click to control', control);
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        let frames: number;
        if (this.enableMenu) {
            this.enableMenu = !this.enableMenu;
        }
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
            case 'aspectRatio':
                this.changeAspectRatio();
                break;
            case 'subtitles':
                this.updateSubtitlePosition();
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
     * change Volume canal
     * set old value after unmute
     */
    public changeVolumeCanal(value: string | number, volumeSide: string) {
        if (Number(value) > 0) {
            if (volumeSide === 'r') {
                this.oldVolumeRight = Number(value);
            } else {
                this.oldVolumeLeft = Number(value);
            }
            value = 0;
        } else if (Number(value) === 0) {
            if (volumeSide === 'r') {
                value = this.oldVolumeRight;
            } else {
                value = this.oldVolumeLeft;
            }
        }
        this.changeVolume(value, volumeSide);
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
        // Controls priority 3
        let controlsP3 = this.getControlsByPriority(3);
        // Controls priority 2
        let controlsP2 = this.getControlsByPriority(2);
        if (controlsP3 === null) {
            controlsP3 = [];
        }
        if (controlsP2 === null) {
            controlsP2 = [];
        }
        if (this.displayState === 'm') {
            this.controls = controlsP3;
        } else if (this.displayState === 'sm') {
            this.controls = controlsP3.concat(controlsP2);
        }
    }
    /**
     * Invoked for change aspect ratio
     */
    public changeAspectRatio() {
        this.mediaPlayerElement.aspectRatio = (this.aspectRatio === '4:3') ? '16:9' : '4:3';
    }
    /**
     * get default aspect ratio
     */
    @AutoBind
    public getDefaultAspectRatio() {
        this.defaultRatio = this.mediaPlayerElement.aspectRatio;
        this.aspectRatio = this.defaultRatio;
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
        this.fullScreenMode = document.fullscreenElement !== null;
    }

    /**
     * Handle mouse enter on progress bar
     * @param event mouse enter
     */
    public progressBarMouseEnter(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            this.thumbnailHidden = false;
        }
    }

    /**
     * Handle mouse leave on progress bar
     * @param event mouse leave
     */
    public progressBarMouseLeave(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            this.thumbnailHidden = true;
        }
    }
    /**
     * Handle mouse move on progress bar
     * @param event mouse move
     */
    public progressBarMouseMove(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding) {
            const thumbnailSize = this.thumbnailElement.nativeElement.offsetWidth;
            const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
            const tc = parseFloat((((event.offsetX - 4) * this.duration) / containerWidth).toFixed(2));
            if (isFinite(tc)) {
                this.tcThumbnail = tc;
                this.thumbnailPosition = Math.min(Math.max(0, event.offsetX - thumbnailSize / 2), containerWidth - thumbnailSize);
            }
            this.debounceFunction(event);
        }
    }
    /**
     * Progress bar on mouse down
     * @param value mouse event
     */
    public handleProgressBarMouseDown(value) {
        this.inSliding = true;
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKED, value * this.duration / 100);
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
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, value * this.duration / 100);
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
    public updateThumbnail(event: MouseEvent) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        const tc = parseFloat((event.offsetX * this.duration / containerWidth).toFixed(2));
        const url = this.mediaPlayerElement.getThumbnailUrl(tc);
        if (isFinite(tc)) {
            this.thumbnailService.getThumbnail(url, tc).then((blob) => {
                if (typeof (blob) !== 'undefined') {
                    this.thumbnailBlob = blob;
                }
            });
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
        let playbackRate;
        let indexOfCurrentPlaybackRate = playbackRateStep.indexOf(this.currentPlaybackRate);
        indexOfCurrentPlaybackRate = indexOfCurrentPlaybackRate + 1;
        if (indexOfCurrentPlaybackRate > playbackRateStep.length - 1) {
            indexOfCurrentPlaybackRate = 0;
        }
        playbackRate = playbackRateStep[indexOfCurrentPlaybackRate];
        this.mediaPlayerElement.getMediaPlayer().playbackRate = playbackRate;
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
        if (!this.inSliding && !isNaN(this.currentTime)) {
            this.progressBarValue = (this.currentTime / this.duration) * 100;
        }
        if (this.inverse === false) {
            this.time = this.currentTime;
        } else {
            this.time = this.duration - this.currentTime;
        }
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.time = this.currentTime;
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
        if (this.clickedVolume === false) {
            this.mediaPlayerElement.getMediaPlayer().setupAudioNodes(data);
        }

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
    public updateSubtitlePosition(position?: string) {
        let j;
        if (typeof(position) === 'undefined') {
            for (let i = 0; i < this.listOfSubtitles.length; i++) {
                if (this.position === this.listOfSubtitles[i].key) {
                    if (i === this.listOfSubtitles.length - 1) {
                        j = 0;
                    } else {
                        j = i + 1;
                    }
                    position = this.listOfSubtitles[j].key;
                }
            }
        }
        this.position = position;
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.POSITION_SUBTITLE_CHANGE, position);
    }

    /**
     * Toggle Display playbackslider
     */
    private displaySlider() {
        this.enablePlaybackSlider = !this.enablePlaybackSlider;
        if (this.enablePlaybackSlider && this.pinnedSlider) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_SLIDER_CHANGE, this.enablePinnedSlider);
        } else {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.enablePinnedSlider);
        }
        this.pinned = this.enablePlaybackSlider && this.pinnedSlider;
    }

    /**
     * Toggle Pinned class playback slider
     */
    private pinControls() {
        this.pinnedSlider = !this.pinnedSlider;
        this.enablePinnedSlider = !this.enablePinnedSlider;
        if (this.enablePlaybackSlider && this.pinnedSlider) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_SLIDER_CHANGE, this.enablePinnedSlider);
        } else {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.enablePinnedSlider);
        }
        this.pinned = this.enablePlaybackSlider && this.pinnedSlider;
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
     * change slider displayed
     */
    @AutoBind
    public changeSlider() {
        if (this.selectedSlider === 'slider1') {
            this.selectedSlider = 'slider2';
        } else {
            this.selectedSlider = 'slider1';
        }
    }
    /**
     * switch timeCode display onclick
     */
    @AutoBind
    public switchDisplayCurrentTime() {
        if (this.inverse === true) {
            this.inverse = false;
            this.time = this.currentTime;
        } else {
            this.inverse = true;
            this.time = this.duration - this.currentTime;
        }
    }
    @AutoBind
    public hideControlsMenuOnClickDocument($event) {
        // click outside the player
        if (this.enableMenu) {
            this.enableMenu = !this.enableMenu;
        }
    }
    @AutoBind
    public hideAll() {
        if (this.enableMenu) {
            this.enableMenu = !this.enableMenu;
        }
        if (this.enableVolumeSlider) {
            this.enableVolumeSlider = !this.enableVolumeSlider;
        }
        if (this.enableListPositionsSubtitle) {
            this.enableListPositionsSubtitle = !this.enableListPositionsSubtitle;
        }
        if (this.enableListRatio) {
            this.enableListRatio = !this.enableListRatio;
        }
    }
    /**
     * Mute sound
     */
    public mute() {
        return this.mediaPlayerElement.getMediaPlayer().mute();
    }

    /**
     * unmute sound
     */
    public unmute() {
        return this.mediaPlayerElement.getMediaPlayer().unmute();
    }
    public initPlaybackrates() {
        let speed;
        const negPlaybackrates: Array<number> = [];
        const posPlaybackrates: Array<number> = [];
        const playbackrates = this.sliderListOfPlaybackRateCustomSteps;
        for (speed of playbackrates) {
            if (Math.sign(speed) === 1) {
                posPlaybackrates.push(speed);
            } else if (Math.sign(speed) === -1) {
                negPlaybackrates.push(speed);
            }
        }
        this.negPlaybackrates = negPlaybackrates.reverse();
        this.posPlaybackrates = posPlaybackrates;
        this.minCursor = this.negPlaybackrates.length * -1;
        this.maxCursor = this.posPlaybackrates.length;
    }
    @AutoBind
    public togglePlaybackrate(value) {
        let pr;
        if (Math.sign(value) === 1) {
            pr = this.posPlaybackrates[value - 1];
        } else if (Math.sign(value) === -1) {
            pr = this.negPlaybackrates[Math.abs(value) - 1];
        }
        this.indexPlaybackRate = value;
        if (value !== 0) {
            this.onChangePlaybackRate(pr);
        }
    }
    @AutoBind
    public changePlaybackrate(pr) {
        if (pr !== 0) {
            if (Math.sign(pr) === 1) {
                for (let i = 0; i < this.posPlaybackrates.length; i++) {
                    if (this.posPlaybackrates[i] === pr) {
                        this.indexPlaybackRate = i;
                    }
                }
            } else if (Math.sign(pr) === -1) {

                for (let i = 0; i < this.negPlaybackrates.length; i++) {
                    if (this.negPlaybackrates[i] === pr) {
                        this.indexPlaybackRate = -1 * (i + 1);
                    }
                }
            }
            this.onChangePlaybackRate(pr);
        }
    }
    /**
     * Handle on component destroy
     */
    ngOnDestroy() {
    }
}
