import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {ControlBarConfig} from '../../core/config/model/control-bar-config';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {MediaPlayerService} from '../../service/media-player-service';
import {ThumbnailService} from '../../service/thumbnail-service';
import interact from 'interactjs';

@Component({
    selector: 'amalia-control-bar',
    templateUrl: './control-bar-plugin.component.html',
    styleUrls: ['./control-bar-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlBarPluginComponent extends PluginBase<Array<ControlBarConfig>> {
    public static PLUGIN_NAME = 'CONTROL_BAR';
    public static DEFAULT_THROTTLE_INVOCATION_TIME = 150;
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
    public sliderListOfPlaybackRateStep: Array<number> = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10];

    /**
     * List of playback rate
     */
    @Input()
    public sliderListOfPlaybackRateCustomSteps: Array<number> = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10];
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
    public listBufferSize: Array<number> = [120, 180, 240];
    // public defaultBufferSize = 12;
    @Input()
    public forwardPlaybackRateStep: Array<number> = [2, 6, 10];
    @Input()
    public forwardSlowPlaybackRateStep: Array<number> = [0.25, 0.5];
    public sliderListOfPlaybackRateStepWidth: Array<number> = [];
    public posPlaybackrates: Array<number> = [];
    public negPlaybackrates: Array<number> = [];
    public maxCursor: number;
    public minCursor: number;
    // handle slider drag
    @ViewChild('dragThumb')
    public dragElement: ElementRef;
    public sliderPosition = 0;
    public moving = false;
    /**
     * Player playback rate
     */
    public currentPlaybackRate = 1;
    /**
     * Player playbackrate slider 1
     */
    public currentPlaybackRateSlider = 1;
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
     * Enable Menu
     */
    public enableMenu = false;
    /**
     * In charge to notify download event
     */
    @Output()
    public callback = new EventEmitter<any>();

    /**
     * Volume left side
     */
    public volumeLeft = 50;
    /**
     * Old Volume left side
     */
    public oldVolumeLeft = 50;

    /**
     * Volume right side
     */
    public volumeRight = 50;
    /**
     * Old Volume right side
     */
    public oldVolumeRight = 50;

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
    /**
     * currentime
     */
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
     * keypressed
     */
    public keypressed = '';
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
    public subtitlePosition = 'none';
    /**
     * default label subtitle
     */
    public selectedLabel = 'Aucun (original)';
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
    public listOfSubtitles = [{label: 'Bas', key: 'down'}, {
        label: 'Haut',
        key: 'up'
    }, {label: this.selectedLabel, key: this.subtitlePosition}];
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
    @ViewChild('thumbnail')
    public thumbnailElement: ElementRef<HTMLElement>;
    @ViewChild('thumbnailContainer')
    public thumbnailContainer: ElementRef<HTMLElement>;
    @ViewChild('controlBarContainer')
    public controlBarContainer: ElementRef<HTMLElement>;
    @ViewChild('volumeButton')
    public volumeButton: ElementRef<HTMLElement>;
    /**
     * list of shortcuts
     */
    public listOfShortcuts;
    // Menu of controls
    @ViewChild('controlsMenu')
    public controlsMenu: ElementRef<HTMLElement>;
    public throttleFunc;
    // slider volume
    @ViewChild('leftVolumeSlider')
    public leftVolumeSlider: ElementRef;
    @ViewChild('rightVolumeSlider')
    public rightVolumeSlider: ElementRef;
    public playbackrateByImages = false;

    constructor(playerService: MediaPlayerService, thumbnailService: ThumbnailService) {
        super(playerService, ControlBarPluginComponent.PLUGIN_NAME);
        this.thumbnailService = thumbnailService;
        this.throttleFunc = _.throttle(this.updateThumbnail, ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME, {trailing: false});
    }

    @AutoBind
    init() {
        super.init();
        this.elements = this.pluginConfiguration.data;
        // init playbackrates
        this.initPlaybackrates();
        // init volume
        this.mediaPlayerElement.getMediaPlayer().setVolume(50);
        // init shortcuts
        this.listOfShortcuts = this.initShortcuts(this.pluginConfiguration.data);
        // Enable thumbnail
        const thumbnailConfig = this.mediaPlayerElement.getConfiguration().thumbnail;
        this.enableThumbnail = (thumbnailConfig && thumbnailConfig.baseUrl !== '' && thumbnailConfig.enableThumbnail) || false;
        // Show thumbnail when tc = 0
        if (this.enableThumbnail) {
            const url = this.mediaPlayerElement.getThumbnailUrl(0, true);
            this.setThumbnail(url, 0);
        }
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
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_SIMULATE_SLIDER, this.handlePlaybackRateChangeByImages);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_STOP_SIMULATE_PLAY, this.handlePlaybackRateChangeByImagesStop);
        // Set default aspect ratio
        this.getDefaultAspectRatio();
        this.handleDisplayState();
    }

    /**
     * Events
     */
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
     * Invoked time change event for :
     * - update progress bar
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (!this.inSliding && !isNaN(this.currentTime)) {
            this.progressBarValue = parseFloat(((this.currentTime / this.duration) * 100).toFixed(2));
        }
        if (this.inverse === false) {
            this.time = this.currentTime;
        } else {
            this.time = this.duration - this.currentTime;
        }
    }
    /**
     * SIMULATE SEEKING
     */
    @AutoBind
    public handlePlaybackRateChangeByImages() {
        this.playbackrateByImages = true;
    }

    /**
     * stop simulate seeking
     */
    public handlePlaybackRateChangeByImagesStop() {
        this.playbackrateByImages = false;
    }
    /**
     * Invoked on playback change
     * @param playbackRate playback rate
     */
    @AutoBind
    private handlePlaybackRateChange(playbackRate: number) {
        this.logger.info('Handle playback rate change', playbackRate);
        if (this.mediaPlayerElement.getMediaPlayer().isPaused() && playbackRate !== 1) {
            this.mediaPlayerElement.getMediaPlayer().play();
        }
        this.currentPlaybackRate = playbackRate;
        if (playbackRate === 1) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
        // setTimeout(() => this.selectActivePlaybackrate(), 10);
        if (this.currentPlaybackRate >= 1 || this.currentPlaybackRate <= -1) {
            this.currentPlaybackRateSlider = Math.round(this.currentPlaybackRate);
        } else {
            this.currentPlaybackRateSlider = (this.currentPlaybackRate);
        }
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
     * Update displayState on windowResize
     */
    @AutoBind
    public handleWindowResize() {
        this.handleDisplayState();
        // handle full screen on esc press
        this.fullScreenMode = document.fullscreenElement !== null;
    }
    /**
     * Apply shortcut if exists on keydown
     */
    @AutoBind
    public handleShortcuts(event) {
        this.applyShortcut(event);
    }
    /**
     * Progress bar on mouse move
     * @param value mouse event
     */
    public handleProgressBarMouseMove(event) {
        if (this.inSliding) {
            const value = this.getMouseValue(event);
            this.progressBarValue = value;
            this.currentTime = value * this.duration / 100;
            if (this.inverse === false) {
                this.time = this.currentTime;
            } else {
                this.time = this.duration - this.currentTime;
            }
            console.log(value);
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, value);
        }
    }

    /**
     * Handle callback
     */
    public handleCallback(control: ControlBarConfig) {
        this.callback.emit(control);
    }
    @AutoBind
    public hideControlsMenuOnClickDocument() {
        // click outside the player
        if (this.enableMenu) {
            this.enableMenu = !this.enableMenu;
        }
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
     * If key is declared in config apply control
     */
    public applyShortcut(key) {
        for (const shortcut of this.listOfShortcuts) {
            if (key === shortcut.key) {
                this.keypressed = shortcut.key;
                this.controlClicked(shortcut.control);
            }
        }
    }
    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    @AutoBind
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
            case 'volume':
                this.toggleVolume();
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
                mediaPlayer.pause();
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
                mediaPlayer.pause();
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
            case 'download':
                this.downloadUrl(control);
                break;
            default:
                this.logger.warn('Control not implemented', control);
                break;
        }
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
     * Return list controls by zone id
     * @param zone zone id
     */
    public getControlsByZone(zone: number): Array<ControlBarConfig> {
        if (this.elements) {
            return _.filter(this.elements, {zone});
        }
        return null;
    }
    public getControlsByPriority(priority: number, zone: number): Array<ControlBarConfig> {
        if (this.elements) {
            this.elements = _.orderBy(this.elements, ['order']);
            return _.filter(this.elements, {priority, zone});
        }
        return null;
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
    public changeVolumeCanal(value: string | number, volumeSide: string, mute?: boolean) {
        if (mute) {
            if (volumeSide === 'r' && Number(value) === 0) {
                this.oldVolumeRight = 0;
            } else if (volumeSide === 'l' && Number(value) === 0) {
                this.oldVolumeLeft = 0;
            }
        }
        if (Number(value) > 0) {
            if (volumeSide === 'r') {
                this.oldVolumeRight = Number(value);
            } else {
                this.oldVolumeLeft = Number(value);
            }
            value = 0;
        } else if (Number(value) === 0 && !mute) {
            if (volumeSide === 'r') {
                value = this.oldVolumeRight;
            } else {
                value = this.oldVolumeLeft;
            }
        }
        this.changeVolume(value, volumeSide);
    }
    /**
     * Invoked on mouse move
     * @param value change value
     */
    @AutoBind
    public moveSliderCursor(value: any) {
        this.logger.info('moveSliderCursor ', value);
        this.progressBarValue = value;
        this.currentTime = value * this.duration / 100;
        const oldPlaybackrate = this.currentPlaybackRate;
        if  (this.currentPlaybackRate === 1) {
            this.playbackrateByImages = false;
        }
        if (this.mediaPlayerElement.getMediaPlayer().reverseMode === true) {
            this.currentTime = this.duration - this.currentTime;
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.currentTime);
        } else {
            // this.mediaPlayerElement.getMediaPlayer().playbackRate = 1;
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.currentTime);
            if (this.playbackrateByImages) {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, oldPlaybackrate);
            } else {
                // this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.currentTime);
                this.mediaPlayerElement.getMediaPlayer().playbackRate = oldPlaybackrate;
            }
        }
    }

    /**
     * Tooltip tag is append after footer (ng2-directive-tooltip)
     * in fullscreen only the player is target , this function move the tooltip target from body to containerControlbar
     */
    @AutoBind
    public changeTooltipEmplacement() {
        if (this.fullScreenMode === true) {
            setTimeout(() => {
                const tooltip = document.body.getElementsByTagName('tooltip')[0];
                if (tooltip) {
                    console.log(tooltip);
                    document.body.removeChild(tooltip);
                    this.controlBarContainer.nativeElement.appendChild(tooltip);
                }
            }, 150);
        }
    }

    /**
     * switch container class based on width
     */
    @AutoBind
    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
        // Controls priority 3
        let controlsP3 = [];
        let controlsP2 = [];
        for (let zone = 1; zone < 4; zone++) {
            // Controls priority 3
            controlsP3 = controlsP3.concat(this.getControlsByPriority(3, zone));
            // Controls priority 2
            controlsP2 = controlsP2.concat(this.getControlsByPriority(2, zone));
        }
        if (controlsP3 === null) {
            controlsP3 = [];
        }
        if (controlsP2 === null) {
            controlsP2 = [];
        }
        if (this.displayState === 'm') {
            this.controls = controlsP3;
        } else if (this.displayState === 'sm') {
            this.controls = controlsP2.concat(controlsP3);
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
        if (this.currentPlaybackRate < 1 && this.currentPlaybackRate > -1) {
            this.currentPlaybackRateSlider = (this.currentPlaybackRate);
        } else {
            this.currentPlaybackRateSlider = Math.round(this.currentPlaybackRate);
        }
        if (this.mediaPlayerElement.getMediaPlayer().isPaused() && value !== 1) {
            this.mediaPlayerElement.getMediaPlayer().play();
        }
        this.mediaPlayerElement.getMediaPlayer().playbackRate = this.currentPlaybackRate;
    }
    /**
     * Change volume state
     */
    public changeSameVolumeState() {
        this.mediaPlayerElement.getMediaPlayer().withMergeVolume = !this.mediaPlayerElement.getMediaPlayer().withMergeVolume;
        if (this.mediaPlayerElement.getMediaPlayer().withMergeVolume) {
            // const v = Math.min(this.volumeRight, this.volumeLeft);
            const v = Math.max(this.volumeRight, this.volumeLeft);
            this.changeVolume(v);
            this.volumeLeft = v;
            this.volumeRight = v;
        }
    }

    /**
     * return list controls by priority
     * @param priority : number
     */
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
        if (this.enableThumbnail && !this.inSliding && this.thumbnailHidden === false) {
            const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
            const thumbnailSize = this.thumbnailElement.nativeElement.offsetWidth;
            const value = this.getMouseValue(event);
            const tc = parseFloat((value * this.duration / 100).toFixed(2));
            if (isFinite(tc)) {
                this.tcThumbnail = tc;
                this.thumbnailPosition = Math.min(Math.max(0, event.offsetX - thumbnailSize / 2), containerWidth - thumbnailSize);
            }
            this.throttleFunc(event);
        }
    }
    /**
     * Progress bar on mouse down
     * @param value mouse event
     */
    public handleProgressBarMouseDown() {
        this.inSliding = true;
        this.thumbnailHidden = true;
    }
    /**
     * get value
     * @param event mousevent
     */
    public getMouseValue(event) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        const value = (event.offsetX / containerWidth) * 100;
        return value;
    }

    /**
     * Progress bar on mouse up
     * @param value mouse event
     */
    public handleProgressBarMouseUp(event) {
        this.inSliding = false;
        const value = this.getMouseValue(event);
        this.moveSliderCursor(value);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKED, value);
    }
    /**
     * Handle thumbnail pos
     * @param event mouse event
     */
    public updateThumbnail(event: MouseEvent) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        const tc = parseFloat((event.offsetX * this.duration / containerWidth).toFixed(2));
        const currentTime = parseFloat(tc.toFixed(2));
        const url = this.mediaPlayerElement.getThumbnailUrl(currentTime, true);
        if (isFinite(tc)) {
            this.setThumbnail(url, currentTime);
        }
    }
    @AutoBind
    public setThumbnail(url, currentTime) {
        this.thumbnailService.getThumbnail(url, currentTime).then((blob) => {
            if (typeof (blob) !== 'undefined') {
                this.thumbnailElement.nativeElement.setAttribute('src', blob);
            }
        });
    }
    /**
     * Invoked for change playback rate
     */
    private prevPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate);
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer().mse.setMaxBufferLengthConfig(bufferSize);
        this.mediaPlayerElement.getMediaPlayer().mse.setMaxBufferLengthConfig(bufferSize);
    }

    /**
     * Invoked for change playback rate
     */
    private nextPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate);
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer().mse.setMaxBufferLengthConfig(bufferSize);
    }
    private changeBufferSize(index) {
        return this.listBufferSize[index];
    }
    /**
     * Invoked for change playback rate
     * When playbackrate >= 6 display images
     */
    @AutoBind
    public nextPlaybackRateImages(speed) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        if (this.getPlaybackStepValue(this.forwardPlaybackRateStep, true) < speed) {
            this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
        } else {
            this.currentPlaybackRate = this.getPlaybackStepValue(this.forwardPlaybackRateStep, true);
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, this.currentPlaybackRate);
        }
        setTimeout(() => this.selectActivePlaybackrate(), 10);
    }

    /**
     * Invoked for change playback rate
     * When playbackrate >= speed configuration display images
     */
    @AutoBind
    public previousPlaybackRateImages(speed) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        if (this.getPlaybackStepValue(this.backwardPlaybackRateStep, true) > speed) {
            this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        } else {
            this.currentPlaybackRate = this.getPlaybackStepValue(this.backwardPlaybackRateStep, true);
            const mainSource = !this.mediaPlayerElement.getMediaPlayer().reverseMode;
            if (this.currentPlaybackRate < 0 && mainSource === false) {
                const tc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
                this.mediaPlayerElement.getMediaPlayer().mse.switchToMainSrc().then(() => {
                    this.mediaPlayerElement.getMediaPlayer().setReverseMode(false);
                    this.mediaPlayerElement.getMediaPlayer().setCurrentTime((Math.max(0, tc)));
                    this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, this.currentPlaybackRate);
                });
            } else {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, this.currentPlaybackRate);
            }
        }
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
    private getPlaybackStepValue(playbackRateStep: Array<number>, ignoreSetPlaybackrate?: boolean): number {
        let playbackRate;
        let indexOfCurrentPlaybackRate = playbackRateStep.indexOf(this.currentPlaybackRate);
        indexOfCurrentPlaybackRate = indexOfCurrentPlaybackRate + 1;
        if (indexOfCurrentPlaybackRate > playbackRateStep.length - 1) {
            indexOfCurrentPlaybackRate = 0;
        }
        playbackRate = playbackRateStep[indexOfCurrentPlaybackRate];
        if (!ignoreSetPlaybackrate) {
            this.mediaPlayerElement.getMediaPlayer().playbackRate = playbackRate;
        }
        return playbackRate;
    }

    /**
     * Invoked for change playback rate
     */
    private changePlaybackRate(value: number) {
        this.currentPlaybackRate = value;
        this.mediaPlayerElement.getMediaPlayer().playbackRate = this.currentPlaybackRate;
        setTimeout(() => this.selectActivePlaybackrate(), 10);
        // this.currentPlaybackRateSlider = Math.round(this.currentPlaybackRate);
    }
    /**
     * Invoked on volume button hover
     */
    public setupAudioNodes(data: any) {
        if (this.clickedVolume === false) {
            this.mediaPlayerElement.getMediaPlayer().setupAudioNodes(data);
        }

    }



    @AutoBind
    public handlePlayerMouseHover() {
        this.activated = true;
    }



    /**
     * update position subtitle onclick
     * @param subtitlePosition subtitle position
     */
    @AutoBind
    public updateSubtitlePosition(subtitlePosition?: string) {
        let j;
        let selectedLabel;
        if (typeof (subtitlePosition) === 'undefined') {
            for (let i = 0; i < this.listOfSubtitles.length; i++) {
                if (this.subtitlePosition === this.listOfSubtitles[i].key) {
                    if (i === this.listOfSubtitles.length - 1) {
                        j = 0;
                    } else {
                        j = i + 1;
                    }
                    subtitlePosition = this.listOfSubtitles[j].key;
                    selectedLabel = this.listOfSubtitles[j].label;
                }
            }
        } else {
            for (const subtitle of this.listOfSubtitles) {
                if (subtitlePosition === subtitle.key) {
                    selectedLabel = subtitle.label;
                }
            }
        }
        this.subtitlePosition = subtitlePosition;
        this.selectedLabel = selectedLabel;
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.POSITION_SUBTITLE_CHANGE, subtitlePosition);
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
        setTimeout(() => this.initDragThumb(), 10);
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
        const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime().toFixed(2);
        if (baseUrl !== '') {
            element.setAttribute('href', baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=${currentTime}` : `${baseUrl}&${tcParam}=${this.currentTime}`);
        }
    }

    /**
     * Download URL on shortcut
     */
    public downloadUrl(control) {
        console.log('downloadUrl');
        const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime().toFixed(2);
        const data = this.elements;
        console.log(data);
        for (const i in data) {
            if (typeof data[i] === 'object') {
                const c = data[i];
                if (typeof c.key !== 'undefined') {
                    if (c.control === control && c.key === this.keypressed) {
                        let baseUrl = c.data.href;
                        const tcParam = c.data?.tcParam || 'tc';
                        baseUrl = baseUrl.search('\\?') === -1 ? baseUrl + '?' + tcParam + '=' + currentTime : baseUrl + '&' + tcParam + '=' + currentTime;
                        // window.open(baseUrl, 'Download');
                        window.location.href = baseUrl;
                    }
                }
            }
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
        setTimeout(() => this.initDragThumb(), 10);
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
    public hideAll(control?) {
        if (this.enableMenu && control !== 'menu') {
            this.enableMenu = !this.enableMenu;
        }
        if (this.enableVolumeSlider) {
            this.enableVolumeSlider = !this.enableVolumeSlider;
        }
        if (this.enableListPositionsSubtitle) {
            this.enableListPositionsSubtitle = !this.enableListPositionsSubtitle;
        }
        if (this.enableListRatio && control !== 'ratio') {
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
        this.negPlaybackrates = [...negPlaybackrates].reverse();
        negPlaybackrates.reverse();
        this.posPlaybackrates = posPlaybackrates;
        this.minCursor = this.negPlaybackrates.length * -1;
        this.maxCursor = this.posPlaybackrates.length;
    }

    @AutoBind
    public initDragThumb() {
        // init drag slider
        const selected: HTMLElement = this.controlBarContainer.nativeElement
            .querySelector<HTMLElement>('.selected > .playback-rate-values > .playbackrate-value.active');
        const step = Math.ceil(selected.offsetWidth);
        const values = this.controlBarContainer.nativeElement
            .querySelectorAll<HTMLElement>('.selected > .playback-rate-values > .playbackrate-value');
        let left = (step / 2);
        values.forEach(value => {
            value.setAttribute('data-x', left.toString());
            left += step;
        });
        let position = {x: Number(selected.getAttribute('data-x'))};
        const container = this.dragElement.nativeElement;
        const self = this;
        const valuesContainer = this.controlBarContainer.nativeElement
            .querySelector<HTMLElement>('.selected > .playback-rate-values');
        const maxWidth = valuesContainer.offsetWidth;
        container.style.paddingLeft = position.x + 'px';
        container.setAttribute('data-x', position.x);
        interact(container).styleCursor(false);
        interact(container).draggable({
            origin: 'self',
            inertia: true,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: 'self'
                })
            ],
            listeners: {

                move(event) {
                    if (self.selectedSlider === 'slider2') {
                        setTimeout(() => self.handleMoveDragThumb(event, position, step, maxWidth), 50);
                        event.stopImmediatePropagation();
                    } else {
                        event.preventDefault();
                        position = {x: Number(container.getAttribute('data-x'))};
                        position.x += event.dx;
                        if (position.x < step / 2) {
                            event.target.style.paddingLeft = '0px';
                            event.target.setAttribute('data-x', 0);
                        } else if (position.x > (Number(maxWidth - (step / 2))) || position.x > maxWidth) {
                            event.target.style.paddingLeft = Number(maxWidth - 10) + 'px';
                            event.target.setAttribute('data-x', Number(maxWidth - 10).toString());
                        } else if (position.x > 0) {
                            values.forEach(value => {
                                const v = Number(value.getAttribute('data-x'));
                                const p = Number(value.getAttribute('data'));
                                if (value.nextElementSibling) {
                                    const nextP = Number(value.nextElementSibling.getAttribute('data-x'));
                                    const nextValue = Number(value.nextElementSibling.getAttribute('data'));
                                    const difference = nextValue - p;
                                    if (position.x >= v && position.x < nextP) {
                                        const percentage = Math.round(((position.x - v) * 100) / step);
                                        const pr = (p + ((percentage * difference) / 100));
                                        const playbackrate = pr.toFixed(1);
                                        event.target.style.paddingLeft = position.x + 'px';
                                        event.target.setAttribute('data-x', position.x);
                                        if (Number(playbackrate) !== 0) {
                                            event.stopImmediatePropagation();
                                            // self.mediaPlayerElement.getMediaPlayer().playbackRate = Number(playbackrate);
                                            self.changePlaybackrate(playbackrate);
                                        }
                                    }
                                }
                            });
                        }
                    }
                },
                end(event) {
                    if (self.selectedSlider === 'slider2') {
                        setTimeout(() => self.handleStopMoveDragThumb(values, position.x), 10);
                        event.stopImmediatePropagation();
                    }
                }
            }
        });
    }

    /**
     * Handle stop move drag thumb
     */
    public handleStopMoveDragThumb(values, position) {
        values.forEach(value => {
            const v = Number(value.getAttribute('data-x'));
            if (position === v) {
                const pr = value.getAttribute('data');
                if (Number(pr) !== 0) {
                    this.changePlaybackrate(pr);
                }
            }
        });
    }

    /**
     * handle move drag thumb
     */
    public handleMoveDragThumb(event, position, step, maxWidth) {
        event.speed = 20;
        const oldPosition = position.x;
        const pos = (position.x + event.dx);
        if (pos > oldPosition) {
            position.x += step;
        } else {
            position.x -= step;
        }
        if (position.x === step / 2) {
            event.target.style.paddingLeft = '0px';
            event.target.setAttribute('data-x', 0);
        } else if (position.x === (Number(maxWidth - (step / 2))) || position.x > maxWidth) {
            event.target.style.paddingLeft = Number(maxWidth - 10) + 'px';
            event.target.setAttribute('data-x', Number(maxWidth - 10).toString());
        } else if (position.x > 0) {
            event.target.style.paddingLeft = position.x + 'px';
            event.target.setAttribute('data-x', position.x);
            event.stopImmediatePropagation();
        }
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
        } else {
            this.mediaPlayerElement.getMediaPlayer().pause();
        }
    }

    @AutoBind
    public changePlaybackrate(pr, click?) {
        if (pr !== 0) {
            if (Math.sign(pr) === 1) {
                this.indexPlaybackRate = this.posPlaybackrates.indexOf(pr);
            } else if (Math.sign(pr) === -1) {
                this.indexPlaybackRate = -1 * (this.negPlaybackrates.indexOf(pr) + 1);
            }
            this.onChangePlaybackRate(pr);
        } else {
            this.mediaPlayerElement.getMediaPlayer().pause();
        }
        if (click) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
    }

    /**
     * AutoBind Select Playbackrate
     */
    @AutoBind
    public selectActivePlaybackrate() {
        const container = this.dragElement.nativeElement;
        const selected: HTMLElement = this.controlBarContainer.nativeElement
            .querySelector<HTMLElement>('.selected > .playback-rate-values > .playbackrate-value.active');
        if (selected) {
            const position = Number(selected.getAttribute('data-x'));
            container.style.paddingLeft = position + 'px';
            container.setAttribute('data-x', position);
        }
    }

    /***
     * toggle Volume
     */
    @AutoBind
    private toggleVolume() {
        this.volumeButton.nativeElement.click();
        if (this.volumeLeft > 0 || this.volumeRight > 0) {
            this.mute();

        }
        if (this.volumeLeft === 0 && this.volumeRight === 0) {
            this.unmute();
        }
        this.changeVolumeCanal(this.leftVolumeSlider.nativeElement.value, 'l');
        this.changeVolumeCanal(this.rightVolumeSlider.nativeElement.value, 'r');
    }
}
