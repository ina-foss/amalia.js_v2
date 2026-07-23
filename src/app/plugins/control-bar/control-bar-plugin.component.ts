import { PluginBase } from '../../core/plugin/plugin-base';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import { PlayerEventType } from '../../core/constant/event-type';
import { ControlBarConfig } from '../../core/config/model/control-bar-config';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { MediaPlayerService } from '../../service/media-player-service';
import { ThumbnailService } from '../../service/thumbnail-service';
import interact from 'interactjs';
import { matchesShortcut, Shortcut, ShortcutControl, ShortcutEvent } from 'src/app/core/config/model/shortcuts-event';

@Component({
    selector: 'amalia-control-bar',
    standalone: false,
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
    public extractTcIn?: number = null;
    public extractTcOut?: number = null;
    public onProgressBar = false;
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
     * Volume right side
     */
    public volumeRight = 50;

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
    public controls: Array<ControlBarConfig> = [];
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
    public openPisteAudio = false;
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
    private _elements: Array<ControlBarConfig> = [];
    /**
     * Contrôles indexés par zone. getControlsByZone est appelé depuis un @for du template
     * (une fois par colonne et par cycle de change detection) : le cache évite de re-filtrer
     * la liste complète à chaque CD. Invalidé par le setter de `elements`.
     */
    private _controlsByZone: Map<number, Array<ControlBarConfig>> | null = null;

    get elements(): Array<ControlBarConfig> {
        return this._elements;
    }

    set elements(value: Array<ControlBarConfig>) {
        this._elements = value;
        if (!value) {
            this._controlsByZone = null;
            return;
        }
        this._controlsByZone = new Map();
        // Certaines configurations fournissent un objet au lieu d'un tableau ; l'ancien
        // _.filter itérait alors ses valeurs (sémantique lodash « collection »).
        const controls: ControlBarConfig[] = Array.isArray(value) ? value : Object.values(value);
        for (const control of controls) {
            const zoneControls = this._controlsByZone.get(control.zone);
            if (zoneControls) {
                zoneControls.push(control);
            } else {
                this._controlsByZone.set(control.zone, [control]);
            }
        }
    }
    /**
     * State of controlBar
     */
    public activated = false;
    /**
     * display state (s/m/l)
     */
    public displayState: string = 'l';
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
    public listOfSubtitles = [{ label: 'Bas', key: 'down' }, {
        label: 'Haut',
        key: 'up'
    }, { label: this.selectedLabel, key: this.subtitlePosition }];
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
    private thumbnailConfigInitialized = false;
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
    public listOfShortcuts: Array<ShortcutControl> = [];
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
    public listOfTracks: Array<{ label: string, track: string }> = [];
    public selectedTrack = null;
    public selectedTrackLabel = '';
    @ViewChild('displaySlider')
    displaySliderElement: ElementRef;
    @ViewChild('pinControls')
    pinControlsElement: ElementRef;
    aspectRatioMouseEnterTimeOut: any;
    volumeMouseEnterTimeOut: any;
    /**
     * Picture player magnify state
     */
    public magnifyEnabled = false;
    /**
     * Picture player crop mode state
     */
    public cropModeEnabled = false;
    /**
     * Picture player annotation mode state ('draw' | 'text' | 'erase' | null)
     */
    public annotationMode: 'draw' | 'text' | 'erase' | null = null;
    /**
     * Available annotation colors
     */
    public readonly annotationColors: string[] = ['#ff0000', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#ffffff', '#000000'];
    /**
     * Available annotation stroke sizes (label + line width + font size)
     */
    public readonly annotationSizes: { label: string; lineWidth: number; fontSize: number }[] = [
        { label: 'Fine', lineWidth: 2, fontSize: 16 },
        { label: 'Moyenne', lineWidth: 5, fontSize: 24 },
        { label: 'Large', lineWidth: 10, fontSize: 40 }
    ];
    /**
     * Currently selected annotation color
     */
    public annotationColor: string = '#ff0000';
    /**
     * Currently selected annotation stroke width
     */
    public annotationLineWidth: number = 5;
    /**
     * Picture player current zoom level (%)
     */
    public pictureZoomLevel = 100;
    private pendingFrameJump = 0;
    private readonly debouncedSeek: _.DebouncedFunc<() => void>;

    constructor(playerService: MediaPlayerService, thumbnailService: ThumbnailService, private readonly renderer: Renderer2, private readonly cdr: ChangeDetectorRef, private readonly ngZone: NgZone) {
        super(playerService);
        this.pluginName = ControlBarPluginComponent.PLUGIN_NAME;
        this.thumbnailService = thumbnailService;
        this.throttleFunc = _.throttle(this.updateThumbnail, ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME);
        this.debouncedSeek = _.debounce(() => this.executeFrameJump(), ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME);
    }

    listenToDisplaySliderDisplayChanges() {
        const sliderDisplayStyle = getComputedStyle(this.displaySliderElement.nativeElement).display;
        const displaySliderOff = !this.displaySliderElement || sliderDisplayStyle === 'none';
        const svgPinControls = this.pinControlsElement.nativeElement.querySelector('svg');
        if (displaySliderOff) {
            svgPinControls && this.renderer.removeClass(svgPinControls, 'amalia-svg-pin-size');
        } else {
            svgPinControls && this.renderer.addClass(svgPinControls, 'amalia-svg-pin-size');
        }
    }

    listenToPinControlsDisplayChanges() {
        const pinControlsDisplayStyle = getComputedStyle(this.pinControlsElement.nativeElement).display;
        const pinControlsOff = !this.pinControlsElement || pinControlsDisplayStyle === 'none';
        const svgDisplaySlider = this.displaySliderElement.nativeElement.querySelector('svg');
        if (pinControlsOff) {
            svgDisplaySlider && this.renderer.removeClass(svgDisplaySlider, 'amalia-svg-slider-size');
        } else {
            svgDisplaySlider && this.renderer.addClass(svgDisplaySlider, 'amalia-svg-slider-size');
        }
    }

    updatePinAndSpeedSliderPositions(): void {
        if (this.displaySliderElement && this.pinControlsElement) {
            this.listenToDisplaySliderDisplayChanges();
            this.listenToPinControlsDisplayChanges();
        } else if (!this.displaySliderElement && this.pinControlsElement) {
            const svgPinControls = this.pinControlsElement.nativeElement.querySelector('svg');
            svgPinControls && this.renderer.removeClass(svgPinControls, 'amalia-svg-pin-size');
        } else if (!this.pinControlsElement && this.displaySliderElement) {
            const svgDisplaySlider = this.displaySliderElement.nativeElement.querySelector('svg');
            svgDisplaySlider && this.renderer.removeClass(svgDisplaySlider, 'amalia-svg-slider-size');
        }
    }

    init() {
        super.init();
        this.elements = this.pluginConfiguration?.data || [];
        // init playbackrates
        this.initPlaybackrates();
        // init volume — use defaultVolume from config to preserve volume across DOM moves
        const defaultVolume = (this.mediaPlayerElement.getConfiguration?.() as any)?.player?.defaultVolume ?? 50;
        this.mediaPlayerElement.getMediaPlayer()?.setVolume(defaultVolume);
        // init shortcuts
        this.initShortcuts(this.pluginConfiguration?.data || []);
        // Enable thumbnail
        // init() can be re-run (INIT/METADATA_LOADED re-init, grid re-attach) with a
        // mediaPlayerElement whose configuration is momentarily incomplete. Once resolved once,
        // don't let a transient missing thumbnail config silently disable an already-working
        // hover preview — only re-evaluate when a thumbnail config is actually present.
        const thumbnailConfig = this.mediaPlayerElement.getConfiguration().thumbnail;
        if (thumbnailConfig || !this.thumbnailConfigInitialized) {
            this.enableThumbnail = (thumbnailConfig && thumbnailConfig.baseUrl !== '' && thumbnailConfig.enableThumbnail) || false;
            this.thumbnailConfigInitialized = true;
        }

        const configuration = this.mediaPlayerElement.getConfiguration();
        this.extractTcIn = configuration.extractTcIn !== undefined ? configuration.extractTcIn : null;
        this.extractTcOut = configuration.extractTcOut !== undefined ? configuration.extractTcOut : null;

        // Show thumbnail when tc = 0
        if (this.enableThumbnail) {
            const url = this.mediaPlayerElement.getThumbnailUrl(0, true);
            this.setThumbnail(url, 0);
        }
        // fixed controlBar
        const fixedControlBar = this.pluginConfiguration?.fixed;
        if (fixedControlBar) {
            this.fixControlBar();
        }
        // pinned controls
        const pinnedControlBarWithControls = this.pluginConfiguration?.pinnedControls;
        if (pinnedControlBarWithControls && !this.pinnedSlider) {
            this.applyPinnedControlsState(true);
        }

        // Resync slider position with the real media state (handles DOM reattachment on player deploy/detach)
        const player = this.mediaPlayerElement.getMediaPlayer();
        this.duration = player?.getDuration();
        this.currentTime = player?.getCurrentTime();
        if (!isNaN(this.currentTime) && !isNaN(this.duration) && this.duration > 0) {
            this.progressBarValue = parseFloat(((this.currentTime / this.duration) * 100).toFixed(6));
        }

        // Init Events
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYBACK_RATE_CHANGE, this.handlePlaybackRateChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_MOUSE_ENTER, this.handlePlayerMouseenter);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_MOUSE_LEAVE, this.handlePlayerMouseleave);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PICTURE_ZOOM_CHANGE, this.handlePictureZoomChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PICTURE_MAGNIFY, this.handlePictureMagnifyChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, this.handleShortcuts);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DOCUMENT_CLICK, this.hideControlsMenuOnClickDocument);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_SIMULATE_SLIDER, this.handlePlaybackRateChangeByImages);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_STOP_SIMULATE_PLAY, this.handlePlaybackRateChangeByImagesStop);
        // Set default aspect ratio
        this.getDefaultAspectRatio();
        this.handleDisplayState();
        this.initTracks();
    }

    /**
     * Events
     */
    /**
     * Invoked on duration change
     */

    private handleOnDurationChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime();
        this.time = this.currentTime;
        this.duration = this.mediaPlayerElement.getMediaPlayer()?.getDuration();
    }

    /**
     * Invoked time change event for :
     * - update progress bar
     */

    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime();
        if (!this.inSliding && !isNaN(this.currentTime)) {
            this.progressBarValue = parseFloat(((this.currentTime / this.duration) * 100).toFixed(6));
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

    private handlePlaybackRateChange(playbackRate: number) {
        this.logger.info('Handle playback rate change', playbackRate);
        if (this.mediaPlayerElement.getMediaPlayer()?.isPaused() && playbackRate !== 1) {
            this.mediaPlayerElement.getMediaPlayer()?.play();
        }
        this.currentPlaybackRate = playbackRate;
        if (playbackRate === 1) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
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

    private handleAspectRatioChange(event) {
        this.aspectRatio = event;
    }

    /**
     * Invoked player mouse enter event for :
     * - animate controlBar
     */

    private handlePlayerMouseenter() {
        this.activated = true;
    }

    /**
     * Invoked player mouse leave event for :
     * - animate controlBar
     */

    private handlePlayerMouseleave() {
        this.activated = false;
    }

    /**
     * Update displayState on windowResize
     */

    public handleWindowResize() {
        this.handleDisplayState();
        // handle full screen on esc press
        this.fullScreenMode = document.fullscreenElement !== null;
    }

    public handlePictureZoomChange(zoomLevel: number) {
        this.ngZone.run(() => {
            this.pictureZoomLevel = zoomLevel ?? 100;
            this.cdr.markForCheck();
        });
    }

    public handlePictureMagnifyChange(event: CustomEvent) {
        this.ngZone.run(() => {
            this.magnifyEnabled = event.detail?.magnify ?? false;
            this.cdr.markForCheck();
        });
    }

    /**
     * Apply shortcut if exists on keydown
     */

    public handleShortcuts(event: ShortcutEvent) {
        if (event.targets.find(target => target.toLowerCase() === this.pluginName.toLowerCase())) {
            this.applyShortcut(event);
        }
    }

    /**
     * Progress bar on mouse move
     * @param event mouse event
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
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, this.time);
            // Keep the thumbnail preview following the cursor while actively dragging, not just on hover.
            if (this.enableThumbnail && this.progressBarElement?.nativeElement && this.thumbnailElement?.nativeElement) {
                const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
                const thumbnailSize = this.thumbnailElement.nativeElement.offsetWidth;
                const tc = parseFloat(this.currentTime.toFixed(6));
                if (isFinite(tc)) {
                    this.tcThumbnail = tc;
                    this.thumbnailPosition = Math.min(Math.max(0, event.offsetX - thumbnailSize / 2), containerWidth - thumbnailSize);
                }
                this.throttleFunc(event);
            }
        }
    }

    /**
     * Handle callback
     */
    public handleCallback(control: ControlBarConfig) {
        this.callback.emit(control);
    }


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
        listOfControls.push({ label: 'Barre de progression', control: 'progressBar', priority: 1 });
        listOfControls.push({ label: 'Play / Pause', control: 'playPause', zone: 2, priority: 1 });
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
    public initShortcuts(data: Array<ControlBarConfig>) {
        this.listOfShortcuts = [];
        for (const i in data) {
            if (typeof data[i] === 'object') {
                const controlConfig = data[i];
                if (typeof controlConfig.key !== 'undefined' && typeof controlConfig.control !== 'undefined') {
                    let key = controlConfig.key
                        .replace('Control', '')
                        .replace('Shift', '')
                        .replace('Alt', '')
                        .replace('Meta', '')
                        .replaceAll('+', '')
                        .replaceAll(' ', '')
                        .toLowerCase();
                    const shortCut: Shortcut = {
                        key,
                        ctrl: controlConfig.key.includes('Control') || controlConfig.key.includes('Ctrl') || controlConfig.key.includes('control') || controlConfig.key.includes('ctrl'),
                        shift: controlConfig.key.includes('Shift') || controlConfig.key.includes('shift'),
                        alt: controlConfig.key.includes('Alt') || controlConfig.key.includes('alt'),
                        meta: controlConfig.key.includes('Meta') || controlConfig.key.includes('meta')
                    };

                    const shortcutControl: ShortcutControl = {
                        shortcut: shortCut,
                        control: controlConfig.control
                    };
                    this.listOfShortcuts.push(shortcutControl);
                }
            }
        }
    }

    /**
     * If key is declared in config apply control
     */
    public applyShortcut(shortcutToBeApplied: ShortcutEvent) {
        let shortcutFound = false;
        for (const shortcutControl of this.listOfShortcuts) {
            if (shortcutFound === false && matchesShortcut(shortcutControl, shortcutToBeApplied.shortcut)) {
                this.keypressed = shortcutControl.shortcut.key;
                if (shortcutControl.control === 'volume') {
                    this.handleMuteUnmuteVolume();
                } else {
                    this.controlClicked(shortcutControl.control);
                }
                shortcutFound = true;
            }
        }
        const volumeUpShortcut: ShortcutControl = {
            shortcut: { key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false },
            control: 'volume'
        };
        const volumeDownShortcut: ShortcutControl = {
            shortcut: { key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false },
            control: 'volume'
        };
        if (matchesShortcut(volumeUpShortcut, shortcutToBeApplied.shortcut)) {
            this.volumeButton.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            this.volumeRight = Math.min(this.volumeRight + 5, 100);
            this.volumeLeft = Math.min(this.volumeLeft + 5, 100);
            if (this.volumeMouseEnterTimeOut) {
                clearTimeout(this.volumeMouseEnterTimeOut);
            }
            this.volumeMouseEnterTimeOut = setTimeout(() => {
                this.hideAll();
            }, 1500);
        }
        if (matchesShortcut(volumeDownShortcut, shortcutToBeApplied.shortcut)) {
            this.volumeButton.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            this.volumeRight = Math.max(this.volumeRight - 5, 0);
            this.volumeLeft = Math.max(this.volumeLeft - 5, 0);
            if (this.volumeMouseEnterTimeOut) {
                clearTimeout(this.volumeMouseEnterTimeOut);
            }
            this.volumeMouseEnterTimeOut = setTimeout(() => {
                this.hideAll();
            }, 1500);
        }
    }

    /**
     * Invoked seek time
     * @param time number
     */
    public seekTo(time: number) {
        if (this.mediaPlayerElement.getMediaPlayer()) {
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(time);
        }
    }

    /**
     * Execute accumulated frame jump after debounce delay.
     * This prevents multiple rapid seeks when clicking 5-second buttons quickly.
     */
    private executeFrameJump(): void {
        if (this.pendingFrameJump === 0) return;

        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const paused = mediaPlayer?.isPaused();

        if (this.pendingFrameJump > 0) {
            mediaPlayer.pauseOnly();
            mediaPlayer.moveNextFrame(this.pendingFrameJump);
        } else {
            mediaPlayer.pauseOnly();
            mediaPlayer.movePrevFrame(Math.abs(this.pendingFrameJump));
        }

        !paused && mediaPlayer.play();
        this.pendingFrameJump = 0;
    }

    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    public controlClicked(control: string) {
        this.logger.debug('Click to control', control);
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();

        if (!mediaPlayer && !picturePlayer) {
            this.logger.warn('Control not implemented', control);
            return;
        }
        this.closeMenuIfOpen();

        if (this.handlePictureControl(control)) {
            return;
        }

        if (!mediaPlayer) {
            this.logger.warn('Control not implemented', control);
            return;
        }

        const paused = mediaPlayer.isPaused();

        if (this.handleTimelineControl(control, mediaPlayer, paused)) {
            return;
        }

        const actions: Record<string, () => void> = {
            playPause: () => mediaPlayer.playPause(),
            volume: () => this.toggleVolume(),
            viewRatio: () => mediaPlayer.playPause(),
            screenshot: () => mediaPlayer.captureImage(100),
            backward: () => this.prevPlaybackRate(),
            'slow-backward': () => this.prevSlowPlaybackRate(),
            'backward-start': () => {
                this.changePlaybackRate(1);
                mediaPlayer.seekToBegin();
            },
            forward: () => this.nextPlaybackRate(),
            'slow-forward': () => this.nextSlowPlaybackRate(),
            'forward-end': () => {
                this.changePlaybackRate(1);
                mediaPlayer.seekToEnd();
            },
            displaySlider: () => this.displaySlider(),
            pinControls: () => this.pinControls(),
            toggleFullScreen: () => this.toggleFullScreen(),
            aspectRatio: () => this.changeAspectRatio(),
            subtitles: () => this.updateSubtitlePosition(),
            download: () => this.downloadUrl(control)
        };

        const action = actions[control];
        if (action) {
            action();
            return;
        }
        this.logger.warn('Control not implemented', control);
    }

    private closeMenuIfOpen(): void {
        if (this.enableMenu) {
            this.enableMenu = false;
        }
    }

    private handlePictureControl(control: string): boolean {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (control === 'magnify') {
            picturePlayer?.magnify();
            return true;
        }

        const pictureActions: Record<string, () => void> = {
            rotate: () => picturePlayer?.rotate(),
            fliph: () => picturePlayer?.flipH(),
            flipv: () => picturePlayer?.flipV(),
            fullsize: () => picturePlayer?.showRealSize(),
            fullscreen: () => this.toggleFullScreen(),
            fitToScreen: () => picturePlayer?.fitToScreen(),
            zoomIn: () => picturePlayer?.zoom(),
            zoomOut: () => picturePlayer?.unZoom(),
            pinControls: () => this.pinControls(),
            center: () => picturePlayer?.center(),
            crop: () => this.toggleCropMode(picturePlayer),
            draw: () => this.toggleAnnotationMode(picturePlayer, 'draw'),
            text: () => this.toggleAnnotationMode(picturePlayer, 'text'),
            erase: () => this.toggleAnnotationMode(picturePlayer, 'erase'),
            reset: () => {
                picturePlayer?.clearAnnotations();
                if (this.annotationModeEnabled) {
                    picturePlayer?.disableAnnotationMode();
                    this.setAnnotationMode(null);
                }
            },
            snapshot: () => {
                const snapshot = picturePlayer?.takeSnapshot();
                if (snapshot) {
                    this.downloadSnapshot(snapshot);
                }
            },
        };

        const action = pictureActions[control];
        if (!action) {
            return false;
        }
        if (!this.magnifyEnabled) {
            action();
        }
        return true;
    }

    public get drawModeEnabled(): boolean {
        return this.annotationMode === 'draw';
    }

    public get textModeEnabled(): boolean {
        return this.annotationMode === 'text';
    }

    public get eraseModeEnabled(): boolean {
        return this.annotationMode === 'erase';
    }

    public get annotationModeEnabled(): boolean {
        return this.annotationMode !== null;
    }

    @HostListener('document:keydown.escape')
    public onEscapeKey(): void {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (this.cropModeEnabled) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        }
        if (this.annotationModeEnabled) {
            picturePlayer?.disableAnnotationMode();
            this.setAnnotationMode(null);
        }
    }

    private toggleCropMode(picturePlayer: any): void {
        if (this.cropModeEnabled) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        } else {
            // Crop and annotation are mutually exclusive.
            if (this.annotationModeEnabled) {
                picturePlayer?.disableAnnotationMode();
                this.setAnnotationMode(null);
            }
            picturePlayer?.enableCropMode();
            this.setCropModeEnabled(true);
        }
    }

    private setCropModeEnabled(enabled: boolean): void {
        this.cropModeEnabled = enabled;
        this.cdr.markForCheck();
    }

    private toggleAnnotationMode(picturePlayer: any, mode: 'draw' | 'text' | 'erase'): void {
        if (this.annotationMode === mode) {
            picturePlayer?.disableAnnotationMode();
            this.setAnnotationMode(null);
            return;
        }
        // Crop and annotation are mutually exclusive.
        if (this.cropModeEnabled) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        }
        picturePlayer?.enableAnnotationMode();
        if (mode === 'draw') {
            picturePlayer?.enableDrawMode();
        } else if (mode === 'text') {
            picturePlayer?.enableTextMode();
        } else {
            picturePlayer?.enableEraseMode();
        }
        this.applyAnnotationSettings(picturePlayer);
        this.setAnnotationMode(mode);
    }

    private setAnnotationMode(mode: 'draw' | 'text' | 'erase' | null): void {
        this.annotationMode = mode;
        this.cdr.markForCheck();
    }

    private applyAnnotationSettings(picturePlayer: any): void {
        picturePlayer?.setAnnotationColor(this.annotationColor);
        picturePlayer?.setAnnotationLineWidth(this.annotationLineWidth);
        const size = this.annotationSizes.find(s => s.lineWidth === this.annotationLineWidth);
        if (size) {
            picturePlayer?.setAnnotationFontSize(size.fontSize);
        }
    }

    public selectAnnotationColor(color: string): void {
        this.annotationColor = color;
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        picturePlayer?.setAnnotationColor(color);
        this.cdr.markForCheck();
    }

    public selectAnnotationSize(size: { label: string; lineWidth: number; fontSize: number }): void {
        this.annotationLineWidth = size.lineWidth;
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        picturePlayer?.setAnnotationLineWidth(size.lineWidth);
        picturePlayer?.setAnnotationFontSize(size.fontSize);
        this.cdr.markForCheck();
    }

    private downloadSnapshot(dataUrl: string): void {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `snapshot-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private handleTimelineControl(control: string, mediaPlayer: any, paused: boolean): boolean {
        if (control === 'backward-5seconds') {
            this.pendingFrameJump -= 5 * mediaPlayer.framerate;
            this.debouncedSeek();
            return true;
        }
        if (control === 'forward-5seconds') {
            this.pendingFrameJump += 5 * mediaPlayer.framerate;
            this.debouncedSeek();
            return true;
        }

        const frameMoves: Record<string, number> = {
            'backward-second': -mediaPlayer.framerate,
            'backward-10seconds': -10 * mediaPlayer.framerate,
            'forward-second': mediaPlayer.framerate,
            'forward-10seconds': 10 * mediaPlayer.framerate
        };
        if (frameMoves[control] !== undefined) {
            this.jumpFrames(mediaPlayer, frameMoves[control], paused);
            return true;
        }

        if (control === 'backward-frame') {
            mediaPlayer.pauseOnly();
            mediaPlayer.movePrevFrame(1);
            return true;
        }
        if (control === 'forward-frame') {
            mediaPlayer.pauseOnly();
            mediaPlayer.moveNextFrame(1);
            return true;
        }
        if (control === 'backward-1h') {
            this.shiftTimeByHour(mediaPlayer, -1);
            return true;
        }
        if (control === 'forward-1h') {
            this.shiftTimeByHour(mediaPlayer, 1);
            return true;
        }
        return false;
    }

    private jumpFrames(mediaPlayer: any, frames: number, paused: boolean): void {
        mediaPlayer.pauseOnly();
        if (frames < 0) {
            mediaPlayer.movePrevFrame(Math.abs(frames));
        } else {
            mediaPlayer.moveNextFrame(frames);
        }
        if (!paused) {
            mediaPlayer.play();
        }
    }

    private shiftTimeByHour(mediaPlayer: any, direction: 1 | -1): void {
        let currentTime = mediaPlayer.reverseMode
            ? mediaPlayer.getDuration() - mediaPlayer.getCurrentTime()
            : mediaPlayer.getCurrentTime();
        currentTime = mediaPlayer.reverseMode
            ? currentTime - (direction * 3600)
            : currentTime + (direction * 3600);
        mediaPlayer.setCurrentTime(currentTime);
    }

    /**
     * Return true if the component is in the configuration without a zone
     * @param componentName compoent name
     */
    public hasComponentWithoutZone(componentName: string): boolean {
        if (!this.pluginConfiguration || !this.pluginConfiguration.data) {
            return false;
        }
        const control = _.find<ControlBarConfig>(this.pluginConfiguration.data, { control: componentName });
        return (control !== undefined && control !== null);
    }

    /**
     * Return list controls by zone id
     * @param zone zone id
     */
    public getControlsByZone(zone: number): Array<ControlBarConfig> {
        if (this._controlsByZone) {
            return this._controlsByZone.get(zone) ?? [];
        }
        return null;
    }

    /**
     * Check if control should be shown based on priority and display state
     * @param priority control priority
     * @returns true if control should be shown
     */
    public shouldShowControl(priority: number): boolean {
        if (priority === 1) {
            return true;
        }
        if (this.displayState === 'l') {
            return priority >= 2 && priority <= 5;
        }
        if (this.displayState === 'm') {
            return priority >= 2 && priority <= 4;
        }
        if (this.displayState === 'sm') {
            return priority >= 2 && priority <= 3;
        }
        if (this.displayState === 's') {
            return priority === 2;
        }
        return false;
    }

    public getControlsByPriority(priority: number, zone: number): Array<ControlBarConfig> {
        if (this.elements) {
            this.elements = _.orderBy(this.elements, ['order']);
            return _.filter<ControlBarConfig>(this.elements, { priority, zone });
        }
        return [];
    }

    /**
     * Change volume
     * @param value volume percentage
     * @param volumeSide volume side (l or r)
     */
    public changeVolume(value: string | number, volumeSide?: string) {
        if (this.mediaPlayerElement?.getMediaPlayer()?.withMergeVolume) {
            if (volumeSide === 'l') {
                this.volumeRight = this.volumeLeft;
            } else {
                this.volumeLeft = this.volumeRight;
            }
            this.mediaPlayerElement.getMediaPlayer()?.setVolume(Number(value));
        } else {
            this.mediaPlayerElement.getMediaPlayer()?.setVolume(Number(value), volumeSide);
        }
    }

    /**
     * Invoked on mouse move
     * @param value change value
     */

    public moveSliderCursor(value: any) {
        this.logger.info('moveSliderCursor ', value);
        this.progressBarValue = value;
        this.currentTime = value * this.duration / 100;
        const oldPlaybackrate = this.currentPlaybackRate;
        if (this.currentPlaybackRate === 1) {
            this.playbackrateByImages = false;
        }
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) { return; }
        if (mediaPlayer.reverseMode === true) {
            this.currentTime = this.duration - this.currentTime;
            mediaPlayer.setCurrentTime(this.currentTime);
        } else {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
            mediaPlayer.setCurrentTime(this.currentTime);
            if (this.playbackrateByImages) {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, oldPlaybackrate);
            } else {
                mediaPlayer.playbackRate = oldPlaybackrate;
            }
        }
    }

    /**
     * PrimeNG's Tooltip appends its overlay (.p-tooltip) to document.body — outside the
     * fullscreened subtree when the player is in fullscreen (the Fullscreen API only renders
     * descendants of the fullscreened element), so it would stay invisible. Move it into the
     * control bar container (part of the fullscreened subtree) so it remains visible.
     */
    public changeTooltipEmplacement() {
        if (this.fullScreenMode === true) {
            setTimeout(() => {
                const tooltip = document.body.querySelector('.p-tooltip');
                if (tooltip) {
                    document.body.removeChild(tooltip);
                    this.controlBarContainer.nativeElement.appendChild(tooltip);
                }
            }, 150);
        }
    }

    /**
     * switch container class based on width
     */

    public handleDisplayState() {
        this.controls = [];
        this.displayState = this.mediaPlayerElement.getDisplayState();
        // Controls priority 5
        let controlsP5 = [];
        // Controls priority 4
        let controlsP4 = [];
        // Controls priority 3
        let controlsP3 = [];
        let controlsP2 = [];
        for (let zone = 1; zone < 4; zone++) {
            // Controls priority 5
            controlsP5 = controlsP5.concat(this.getControlsByPriority(5, zone));
            // Controls priority 4
            controlsP4 = controlsP4.concat(this.getControlsByPriority(4, zone));
            // Controls priority 3
            controlsP3 = controlsP3.concat(this.getControlsByPriority(3, zone));
            // Controls priority 2
            controlsP2 = controlsP2.concat(this.getControlsByPriority(2, zone));
        }
        controlsP5 ??= [];
        controlsP4 ??= [];
        controlsP3 ??= [];
        controlsP2 ??= [];

        if (this.displayState === 'l') {
            this.controls = controlsP5.concat(controlsP4).concat(controlsP3).concat(controlsP2);
        } else if (this.displayState === 'm') {
            this.controls = controlsP5;
        } else if (this.displayState === 'sm') {
            this.controls = controlsP5.concat(controlsP4);
        } else if (this.displayState === 's') {
            this.controls = controlsP5.concat(controlsP4).concat(controlsP3);
        } else if (this.displayState === 'xs') {
            this.controls = controlsP5.concat(controlsP4).concat(controlsP3).concat(controlsP2);
        }
        //remove controls not in menu
        this.controls = this.controls.filter((control) => !control.notInMenu);
        //readjust Pin and speed slider
        setTimeout(() => {
            this.updatePinAndSpeedSliderPositions();
        }, 100);
        // Update picture player displayState
        this.updatePicturePlayerDisplayState();
    }

    /**
     * Update picture player displayState
     */
    private updatePicturePlayerDisplayState() {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (picturePlayer) {
            picturePlayer.setDisplayState(this.displayState);
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

    public getDefaultAspectRatio() {
        this.defaultRatio = this.mediaPlayerElement.aspectRatio;
        this.aspectRatio = this.defaultRatio;
    }

    /**
     * Invoked on change playback rate
     */
    public onChangePlaybackRate(value: number) {
        this.currentPlaybackRate = value;
        if (this.currentPlaybackRate < 1 && this.currentPlaybackRate > -1) {
            this.currentPlaybackRateSlider = (this.currentPlaybackRate);
        } else {
            this.currentPlaybackRateSlider = Math.round(this.currentPlaybackRate);
        }
        if (this.mediaPlayerElement.getMediaPlayer()?.isPaused() && value !== 1) {
            this.mediaPlayerElement.getMediaPlayer()?.play();
        }
        const mp = this.mediaPlayerElement.getMediaPlayer();
        if (mp) { mp.playbackRate = this.currentPlaybackRate; }
    }

    /**
     * Change volume state
     */
    public changeSameVolumeState() {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) { return; }
        mediaPlayer.withMergeVolume = !mediaPlayer.withMergeVolume;
        if (mediaPlayer.withMergeVolume) {
            const v = Math.max(this.volumeRight, this.volumeLeft);
            this.volumeLeft = v;
            this.volumeRight = v;
            this.changeVolume(v);
        }
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
     */
    public progressBarMouseLeave() {
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
            const tc = parseFloat((value * this.duration / 100).toFixed(6));
            if (isFinite(tc)) {
                this.tcThumbnail = tc;
                this.thumbnailPosition = Math.min(Math.max(0, event.offsetX - thumbnailSize / 2), containerWidth - thumbnailSize);
            }
            this.throttleFunc(event);
        }
    }

    /**
     * Progress bar on mouse down
     */
    public handleProgressBarMouseDown() {
        this.inSliding = true;
        if (this.enableThumbnail) {
            this.thumbnailHidden = false;
        }
    }

    /**
     * get value
     * @param event click event
     */
    public getMouseValue(event) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        return (event.offsetX / containerWidth) * 100;
    }

    /**
     * Progress bar on mouse up
     * @param event  click event
     */
    public handleProgressBarMouseUp(event) {
        this.inSliding = false;
        const value = this.getMouseValue(event);
        this.moveSliderCursor(value);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKED, value);
        this.thumbnailHidden = false;
    }

    /**
     * Handle thumbnail pos
     * @param event mouse event
     */
    public updateThumbnail(event: MouseEvent) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        const tc = parseFloat((event.offsetX * this.duration / containerWidth).toFixed(6));
        const currentTime = parseFloat(tc.toFixed(6));
        const url = this.mediaPlayerElement.getThumbnailUrl(currentTime, true);
        if (isFinite(tc)) {
            this.setThumbnail(url, currentTime);
        }
    }


    private thumbnailRequestToken = 0;

    // Fast dragging fires many overlapping thumbnail fetches; without this guard, whichever
    // network response resolves last wins the <img> src, even if it's not the last one requested
    // (out-of-order resolution), leaving a stale or dropped preview image.
    public setThumbnail(url, currentTime) {
        const requestToken = ++this.thumbnailRequestToken;
        this.thumbnailService.getThumbnail(url, currentTime).then((blob) => {
            if (requestToken !== this.thumbnailRequestToken) {
                return;
            }
            if (typeof (blob) !== 'undefined') {
                this.thumbnailElement?.nativeElement?.setAttribute('src', blob);
            }
        });
    }

    /**
     * Invoked for change playback rate
     */
    private prevPlaybackRate() {
        this.inverse = true;
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate);
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
    }

    /**
     * Invoked for change playback rate
     */
    private nextPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate);
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
    }

    private changeBufferSize(index) {
        return this.listBufferSize[index];
    }

    /**
     * Invoked for change playback rate
     * When playbackrate >= 6 display images
     */

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

    public previousPlaybackRateImages(speed) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        if (this.getPlaybackStepValue(this.backwardPlaybackRateStep, true) > speed) {
            this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        } else {
            this.currentPlaybackRate = this.getPlaybackStepValue(this.backwardPlaybackRateStep, true);
            const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
            const mainSource = !mediaPlayer?.reverseMode;
            if (this.currentPlaybackRate < 0 && mainSource === false) {
                const tc = mediaPlayer?.getCurrentTime();
                mediaPlayer?.mse.switchToMainSrc().then(() => {
                    this.mediaPlayerElement.getMediaPlayer()?.setReverseMode(false);
                    this.mediaPlayerElement.getMediaPlayer()?.setCurrentTime((Math.max(0, tc)));
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
     * @param ignoreSetPlaybackrate
     * @return return playback step if true, does not set the playbackRate on mediaPlayerElement.getMediaPlayer()
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
            const mp = this.mediaPlayerElement.getMediaPlayer();
            if (mp) { mp.playbackRate = playbackRate; }
        }
        return playbackRate;
    }

    /**
     * Invoked for change playback rate
     */
    private changePlaybackRate(value: number) {
        this.currentPlaybackRate = value;
        const mp = this.mediaPlayerElement.getMediaPlayer();
        if (mp) { mp.playbackRate = this.currentPlaybackRate; }
        setTimeout(() => this.selectActivePlaybackrate(), 10);
    }


    public handlePlayerMouseHover() {
        this.activated = true;
    }

    /**
     * update position subtitle onclick
     * @param subtitlePosition subtitle position
     */

    public updateSubtitlePosition(subtitlePosition?: string) {
        if (typeof (subtitlePosition) === 'undefined') {
            this.updateSubtitleInfos();
        } else {
            for (const subtitle of this.listOfSubtitles) {
                if (subtitlePosition === subtitle.key) {
                    this.selectedLabel = subtitle.label;
                    this.subtitlePosition = subtitlePosition;
                }
            }
        }
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.POSITION_SUBTITLE_CHANGE, subtitlePosition);
    }

    // update Subtitle position & subtitle label {

    public updateSubtitleInfos() {
        let j: number;
        for (let i = 0; i < this.listOfSubtitles.length; i++) {
            if (this.subtitlePosition === this.listOfSubtitles[i].key) {
                if (i === this.listOfSubtitles.length - 1) {
                    j = 0;
                } else {
                    j = i + 1;
                }
                this.subtitlePosition = this.listOfSubtitles[j].key;
                this.selectedLabel = this.listOfSubtitles[j].label;
            }
        }
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

    private fixControlBar() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_CONTROLBAR_CHANGE, true);
    }

    /**
     * Toggle Pinned class playback slider
     */
    private pinControls() {
        this.applyPinnedControlsState(!this.pinnedSlider);
    }

    /**
     * Sets the pinned state directly (idempotent) rather than toggling it — used both by the
     * user-driven pinControls() toggle above and by the pluginConfiguration.pinnedControls
     * default-on init below. init() can run more than once for the same plugin instance (DOM
     * reattachment on fullscreen/detach, config reload, etc. — see the volume/audio-track reinit
     * fix for the same class of bug), and pinnedControls being applied via the pinControls()
     * toggle on every init() would flip pinnedSlider back to false on an even number of
     * re-inits, silently un-pinning a controlbar the config says should always stay pinned.
     */
    private applyPinnedControlsState(pinnedSlider: boolean) {
        this.pinnedSlider = pinnedSlider;
        this.enablePinnedSlider = pinnedSlider;
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
        const currentTime = (this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime() ?? 0).toFixed(2);
        if (baseUrl !== '') {
            element.setAttribute('href', baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=${currentTime}` : `${baseUrl}&${tcParam}=${this.currentTime}`);
        }
    }

    /**
     * Download URL on shortcut
     */
    public downloadUrl(control) {
        const currentTime = (this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime() ?? 0).toFixed(2);
        const data = this.elements;
        for (const i in data) {
            if (typeof data[i] === 'object') {
                const c = data[i];
                this.openDownloadUrl(c, control, currentTime);
            }
        }
    }

    private openDownloadUrl(c, control, currentTime) {
        if (typeof c.key !== 'undefined') {
            if (c.control === control && c.key === this.keypressed) {
                let baseUrl = c.data.href;
                const tcParam = c.data?.tcParam || 'tc';
                baseUrl = baseUrl.search('\\?') === -1 ? baseUrl + '?' + tcParam + '=' + currentTime : baseUrl + '&' + tcParam + '=' + currentTime;
                window.location.href = baseUrl;
            }
        }
    }

    /**
     * change slider displayed
     */

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

    public switchDisplayCurrentTime() {
        if (this.inverse === true) {
            this.inverse = false;
            this.time = this.currentTime;
        } else {
            this.inverse = true;
            this.time = this.duration - this.currentTime;
        }
    }


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
        if (this.enableListRatio) {
            this.enableListRatio = !this.enableListRatio;
        }
    }

    /**
     * .controls-menu used a fixed `right: 10px` (relative to its positioning parent,
     * .controls-container), which only lines the menu up with the "..." button when that
     * button happens to sit right at the container's own right edge. Once other controls
     * before it get hidden differently per display state/layout, the button can end up well
     * short of that edge, leaving the menu visibly offset from the button that opens it.
     * Align the menu's right edge with the actual trigger button's right edge instead, measured
     * fresh against their shared positioning parent every time the menu opens.
     */
    public alignMenuToTrigger(trigger: EventTarget | null): void {
        const menuEl = this.controlsMenu?.nativeElement;
        const container = menuEl?.parentElement;
        if (!menuEl || !container || !(trigger instanceof HTMLElement)) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const rightOffset = Math.max(0, containerRect.right - triggerRect.right);
        menuEl.style.right = `${rightOffset}px`;
    }

    aspectRatioMouseEnter() {
        this.hideAll('ratio');
        this.enableListRatio = true;
        if (this.aspectRatioMouseEnterTimeOut) {
            clearTimeout(this.aspectRatioMouseEnterTimeOut);
        }
        this.aspectRatioMouseEnterTimeOut = setTimeout(() => {
            this.enableListRatio = false;
        }, 4000);
    }

    volumeMouseEnter(data: any) {
        this.hideAll('volume');
        this.enableVolumeSlider = true;
        this.openVolume(data);
        if (this.volumeMouseEnterTimeOut) {
            clearTimeout(this.volumeMouseEnterTimeOut);
        }
        this.volumeMouseEnterTimeOut = setTimeout(() => {
            this.enableVolumeSlider = false;
            this.openPisteAudio = false;
        }, 4000);
    }


    /**
     * Mute sound
     */
    public mute() {
        this.volumeRight = 0;
        this.volumeLeft = 0;
        return this.mediaPlayerElement.getMediaPlayer()?.mute();
    }

    /**
     * unmute sound
     */
    public unmute() {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) { return; }
        this.volumeRight = mediaPlayer.getVolume('r');
        this.volumeLeft = mediaPlayer.getVolume('l');
        if (this.volumeLeft < 50 || this.volumeRight < 50) {
            mediaPlayer.setVolume(50, 'r');
            mediaPlayer.setVolume(50, 'l');
            this.volumeRight = mediaPlayer.getVolume('r');
            this.volumeLeft = mediaPlayer.getVolume('l');
        }
        return mediaPlayer.unmute();
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
        let position = { x: Number(selected.getAttribute('data-x')) };
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
                        position = { x: Number(container.getAttribute('data-x')) };
                        position.x += event.dx;
                        if (position.x < step / 2) {
                            event.target.style.paddingLeft = '0px';
                            event.target.setAttribute('data-x', 0);
                        } else if (position.x > (Number(maxWidth - (step / 2))) || position.x > maxWidth) {
                            event.target.style.paddingLeft = Number(maxWidth - 10) + 'px';
                            event.target.setAttribute('data-x', Number(maxWidth - 10).toString());
                        } else if (position.x > 0) {
                            self.handleThumbPosition(values, event, position, step);
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

    // Handle thumb position slider
    private handleThumbPosition(values, event, position, step) {
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
                        this.changePlaybackrate(playbackrate);
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
            this.mediaPlayerElement.getMediaPlayer()?.pause();
        }
    }


    public changePlaybackrate(pr, click?) {
        if (pr !== 0) {
            if (Math.sign(pr) === 1) {
                this.indexPlaybackRate = this.posPlaybackrates.indexOf(pr);
            } else if (Math.sign(pr) === -1) {
                this.indexPlaybackRate = -1 * (this.negPlaybackrates.indexOf(pr) + 1);
            }
            this.onChangePlaybackRate(pr);
        } else {
            this.mediaPlayerElement.getMediaPlayer()?.pause();
        }
        if (click) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
    }

    /**
     * AutoBind Select Playbackrate
     */

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

    private toggleVolume() {
        this.volumeButton.nativeElement.click();
        if (this.volumeLeft > 0 || this.volumeRight > 0) {
            this.mute();

        }
        if (this.volumeLeft === 0 && this.volumeRight === 0) {
            this.unmute();
        }
    }

    initTracks() {
        if (!this.pluginConfiguration || !this.pluginConfiguration.data) {
            return;
        }
        const control = _.find<ControlBarConfig>(this.pluginConfiguration.data, { control: 'volume' });
        if (control && control.data && control.data.tracks) {
            this.listOfTracks = control.data.tracks;
            this.selectedTrack = this.listOfTracks[0].track;
            this.selectedTrackLabel = this.listOfTracks.find(x => x.track === this.selectedTrack).label;
            this.logger.info(`[AUDIO_TRACK_DEBUG] initTracks listOfTracks=${JSON.stringify(this.listOfTracks)} selectedTrack=${this.selectedTrack}`);
        }
    }

    /**
     * In charge to open Volume
     * @param data volume paramèter
     */
    openVolume(data: any) {
        this.mediaPlayerElement.getMediaPlayer()?.initAudioChannelMerger(data);
    }

    /**
     * In charge to handle click volume
     */
    handleMuteUnmuteVolume(side = '') {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) { return; }
        const vol = mediaPlayer.getVolume();
        if (side === '') {
            if (vol === 0) {
                this.unmute();
            } else {
                this.mute();
            }
        } else {
            if (side === 'r') {
                const oldVolumeRight = mediaPlayer.getVolume('r');
                this.volumeRight = (oldVolumeRight === 0) ? 50 : 0;
                this.changeVolume(this.volumeRight, side);
            } else if (side === 'l') {
                const oldVolumeLeft = mediaPlayer.getVolume('l');
                this.volumeLeft = (oldVolumeLeft === 0) ? 50 : 0;
                this.changeVolume(this.volumeLeft, side);
            }
        }
    }

    /**
     * handle change track
     * @param trackId track id
     */
    changeAudioTrack(trackId: any) {
        this.logger.info(`[AUDIO_TRACK_DEBUG] changeAudioTrack -> trackId=${trackId}`);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.AUDIO_CHANNEL_CHANGE, trackId);
        this.selectedTrack = trackId;
        this.selectedTrackLabel = this.listOfTracks.find(x => x.track === this.selectedTrack).label;
    }
}
