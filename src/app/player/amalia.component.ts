import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DefaultConfigLoader } from '../core/config/loader/default-config-loader';
import { DefaultConfigConverter } from '../core/config/converter/default-config-converter';
import { DefaultMetadataConverter } from '../core/metadata/converter/default-metadata-converter';
import { DefaultMetadataLoader } from '../core/metadata/loader/default-metadata-loader';
import { MediaPlayerElement } from '../core/media-player-element';
import { HttpClient } from '@angular/common/http';
import { DefaultLogger } from '../core/logger/default-logger';
import { Loader } from '../core/loader/loader';
import { ConfigData } from '../core/config/model/config-data';
import { Converter } from '../core/converter/converter';
import { Metadata } from '@ina/amalia-model';
import { environment } from '../../environments/environment';
import { PlayerState } from '../core/constant/player-state';
import { PlayerEventType } from '../core/constant/event-type';
import { HttpConfigLoader } from '../core/config/loader/http-config-loader';
import { BaseUtils } from '../core/utils/base-utils';
import { MediaPlayerService } from '../service/media-player-service';
import { ThumbnailService } from '../service/thumbnail-service';
import { DomSanitizer } from '@angular/platform-browser';

import * as _ from 'lodash';
import { ControlBarPluginComponent } from '../plugins/control-bar/control-bar-plugin.component';
import { LoggerLevel } from '../core/logger/logger-level';
import { Utils } from "../core/utils/utils";
import { ShortcutEvent } from '../core/config/model/shortcuts-event';

@Component({
    selector: 'amalia-player',
    templateUrl: './amalia.component.html',
    styleUrls: ['./amalia.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class AmaliaComponent implements OnInit, OnDestroy {
    public static DEFAULT_THROTTLE_INVOCATION_TIME = 150;
    /**
     * version of player
     */
    public version = environment.VERSION;
    public chrono;
    /**
     * player state
     */
    public state: PlayerState;
    /**
     * Interval Images
     */
    public intervalImages;
    /**
     * Selected aspectRatio
     */
    public aspectRatio;

    /**
     * True for shown context menu
     */
    public contextMenuState: boolean;

    /**
     * player state 4by3
     */
    public PlayerState = PlayerState;

    /**
     * Player configuration
     */
    public playerConfig: ConfigData;

    /**
     * In charge to show preview thumbnail
     */
    public enablePreviewThumbnail = false;
    /**
     * preview thumbnail url
     */
    public previewThumbnailUrl = '';

    /**
     * Generate player base id
     */
    @Input()
    public playerId = BaseUtils.getUniqueId();
    /**
     * Preview thumbnail container
     */
    @ViewChild('previewThumbnail', { static: true })
    public previewThumbnailElement: ElementRef<HTMLVideoElement>;

    /**
     * Set player autoplay state
     */
    public autoplay: boolean;

    /**
     * Enable thumbnail
     */
    private enableThumbnail: boolean;
    /**
     * true when the mouse in over the player
     */
    public playerHover = false;

    private _config: any;
    // mainSource as src video
    public mainSource = true;
    handleKeyUpEvent: any;

    //mute shortcuts
    public muteShortcuts = false;

    get config(): any {
        return this._config;
    }

    @Input()
    set config(value: any) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                this.logger.debug(`Config not json ${value}`);
            }
        }
        this._config = value;
    }

    /**
     * Config loader in charge to load config data
     */
    @Input()
    public configLoader: Loader<ConfigData>;
    /**
     * Thumbnail service
     */
    private readonly thumbnailService: ThumbnailService;
    // dom sanitizer
    private sanitizer: DomSanitizer;
    /**
     * Metadata converter, converter metadata parameter
     */
    @Input()
    public metadataConverter: Converter<Metadata>;

    /**
     * Metadata loader
     */
    @Input()
    public metadataLoader: Loader<Array<Metadata>>;

    /**
     * Amalia events
     */
    @Output()
    public callback: EventEmitter<any> = new EventEmitter<any>();

    /**
     * get video html element
     */
    @ViewChild('video', { static: true })
    public mediaPlayer: ElementRef<HTMLVideoElement>;

    /**
     * Get context menu html element
     */
    @ViewChild('contextMenu', { static: true })
    public contextMenu: ElementRef<HTMLElement>;
    /**
     * tc
     */
    public tc = 0;
    /**
     * true when player load content
     */
    public inLoading = false;

    /**
     * true when error
     */
    public inError = false;

    /**
     * Default loader
     */
    public logger = new DefaultLogger();
    /**
     * default aspect ratio
     */
    public ratio = '16-9';
    /**
     * In charge to get instance of player
     */
    public playerService: MediaPlayerService;
    /**
     * Pinned Slider state
     */
    public pinned = false;
    /**
     * Pinned ControlBar state
     */
    public pinnedControlbar = false;
    /**
     * In charge to load resource
     */
    private readonly httpClient: HttpClient;
    /**
     * mediaContainer element
     */
    @ViewChild('mediaContainer', { static: true })
    public mediaContainer: ElementRef<HTMLElement>;
    /**
     * Sert à conserver les dimensions du mediaContainer avant qu' il ne passe en mode plein écran.<br/>
     * Pour ensuite les utiliser lors de la sortie du plein écran
     */
    private containerSizeBeforeFullScreen: { width: number, height: number } | undefined;
    /**
     * Amalia player main manager
     */
    @Input()
    public mediaPlayerElement: MediaPlayerElement;

    /**
     * List of pressed keys
     */
    public listKeys = [];
    /**
     * thumbnail blob preview on seeking
     */
    public thumbnailBlobVideo;

    public throttleFunc;
    /**
     * Message d'erreur
     */
    public errorMessage;

    /**
     * attribut qui definit une image a afficher lorsque la video est en cours de chargement,<br/>
     * ou jusqu'a ce que l'utilisateur ne joue la video.
     */
    public videoPoster = '';
    public posterBackgound = {
        'amalia-player-bg-color1': false,
        'amalia-primary-color': false,
        ' amalia-secondary-color': false
    };

    constructor(playerService: MediaPlayerService, httpClient: HttpClient, thumbnailService: ThumbnailService, sanitizer: DomSanitizer) {
        this.httpClient = httpClient;
        this.sanitizer = sanitizer;
        this.playerService = playerService;
        this.thumbnailService = thumbnailService;
        this.throttleFunc = _.throttle(this.setPreviewThumbnail, ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME, { trailing: false });
    }

    /**
     * Invoked immediately after the  first time the component has initialised
     */
    public ngOnInit() {
        // Init media player
        this.mediaPlayerElement = this.playerService.get(this.playerId);
        this.playerService.increment(this.playerId);
        this.state = PlayerState.CREATED;
        this.inLoading = true;
        // init default manager (converter, metadata loader)
        this.initDefaultHandlers();
        this.playerConfig = this.config;
        if (this.configLoader && this.metadataConverter && this.metadataLoader) {
            // set media player in charge to player video or audio files
            this.mediaPlayerElement.setMediaPlayer(this.mediaPlayer.nativeElement);
            this.mediaPlayerElement.init(this.playerConfig, this.metadataLoader, this.configLoader)
                .then((state) => this.onInitConfig(state))
                .catch((state) => this.onErrorInitConfig(state));
            // bind events
            this.bindEvents();
            // set mediaPlayer width for responsive grid
            this.mediaPlayerElement.setMediaPlayerWidth(this.mediaContainer.nativeElement.offsetWidth);
            if (this.enableThumbnail) {
                this.setPreviewThumbnail(0);
            }
        } else {
            this.logger.error('Error to initialize media player element.');
        }
        this.callback.emit(this.mediaPlayerElement);
    }

    /**
     * update mediaPlayerWidth on window resize
     */

    public handleWindowResize() {
        if (this.mediaContainer) {
            const mediaContainer = this.mediaContainer.nativeElement;
            if (mediaContainer && mediaContainer.offsetWidth > 0) {
                this.mediaPlayerElement.setMediaPlayerWidth(mediaContainer.offsetWidth);
                this.logger.info(`Player resized !`);
            }
        }
    }

    /**
     * Invoked on click context menu
     * @param event mouse event
     * @return return false for disable browser context menu
     */

    public onContextMenu(event: MouseEvent) {
        this.contextMenuState = true;
        const defaultMouseMargin = 15;
        this.contextMenu.nativeElement.style.left = `${event.offsetX - defaultMouseMargin}px`;
        this.contextMenu.nativeElement.style.top = `${event.offsetY - defaultMouseMargin}px`;
        return false;
    }

    /**
     * In charge to update player size with aspect ratio
     */
    @HostListener('window:resize', ['$event'])
    private updatePlayerSizeWithAspectRatio() {
        const htmlElement = this.mediaPlayer.nativeElement;
        if (this.aspectRatio && this.aspectRatio !== '') {
            this.ratio = this.aspectRatio.replace(':', '-');
            const isFullscreen = document.fullscreenElement != null;

            const maxWidth = this.getMaxWidth(isFullscreen, htmlElement);
            const maxHeight = this.getMaxHeight(isFullscreen, htmlElement);

            // Après le calcul de maxWidth et maxHeight, on vide la donnée sur la taille du conteneur avant plein écran
            this.resetContainerSizeBeforeFullScreen();

            const aspectRatio = this.aspectRatio ? parseFloat(this.aspectRatio.split(':')[0]) / parseFloat(this.aspectRatio.split(':')[1]) : 16 / 9;
            let w = Math.max(maxHeight * aspectRatio, maxWidth);
            let h = w / aspectRatio;
            if (w > maxWidth) {
                h = Math.floor(maxWidth * h / w);
                w = maxWidth;
            }
            if (h > maxHeight) {
                w = Math.floor(maxHeight * w / h);
                h = maxHeight;
            }
            htmlElement.style.width = `${w}px`;
            htmlElement.style.height = `${h}px`;
            htmlElement.style.left = `${Math.max(0, (maxWidth - w) / 2)}px`;
            htmlElement.style.top = `${Math.max(0, (maxHeight - h) / 2)}px`;
            htmlElement.style['object-fit'] = 'fill';
        } else {
            htmlElement.style.width = `100%`;
            htmlElement.style.height = `100%`;
            htmlElement.style.left = `0`;
            htmlElement.style.top = `0`;
            htmlElement.style['object-fit'] = 'none';
        }

        if (this.previewThumbnailElement) {
            const previewThumbnailElement = this.previewThumbnailElement.nativeElement;
            previewThumbnailElement.style.width = htmlElement.style.width;
            previewThumbnailElement.style.height = htmlElement.style.height;
            previewThumbnailElement.style.left = htmlElement.style.left;
            previewThumbnailElement.style.top = htmlElement.style.top;
        }
    }

    /**
     * Retourne la hauteur maximale du parent de la video en tenant compte de la taille du conteneur parent de la video avant le passage au plein écran.
     * @param isFullscreen plein écran
     * @param htmlElement conteneur parent de la video
     */
    private getMaxHeight = (isFullscreen: boolean, htmlElement: HTMLVideoElement) => {
        const maxParentHeight = !isFullscreen && this.containerSizeBeforeFullScreen ? this.containerSizeBeforeFullScreen.height : htmlElement.parentElement.offsetHeight;
        const maxHeightWhenNotPinned = this.pinnedControlbar ? maxParentHeight - 50 : maxParentHeight;
        return this.pinned ? maxParentHeight - 100 : maxHeightWhenNotPinned;
    }
    /**
     * Retourne la largeur maximale du parent de la video en tenant compte de la taille du conteneur parent de la video avant le passage au plein écran.
     * @param isFullscreen plein écran
     * @param htmlElement conteneur parent de la video
     */
    private getMaxWidth = (isFullscreen: boolean, htmlElement: HTMLVideoElement) => {
        // Quand nous sortons du mode plein écran, maxWidth est la largeur du parent(mediaContainer) de la balise video(mediaPlayer) avant sa mise en plein écran
        // sinon, maxWidth est la largeur du parent de la balise video
        return !isFullscreen && this.containerSizeBeforeFullScreen ? this.containerSizeBeforeFullScreen.width : htmlElement.parentElement.offsetWidth;
    }

    /**
     * In charge to bin events
     */
    private bindEvents() {
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKED, this.handleSeeked);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKING, this.handleSeeking);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYING, this.handlePlay);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.KEYDOWN_HISTOGRAM, this.handleKeyDownEvent);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.KEYUP_HISTOGRAM, this.emitKeyUpEvent);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ERROR, this.handleError);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ERASE_ERROR, this.handleEraseError);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYBACK_CLEAR_INTERVAL, this.clearInterval);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.FULLSCREEN_STATE_CHANGE, this.handleFullScreenChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.handlePinnedControlbarChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PINNED_SLIDER_CHANGE, this.handlePinnedSliderChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, this.scrollPlaybackRateImages);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_LOADING_BEGIN, this.handleLoading);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_LOADING_END, this.handleLoadingEnd);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ELEMENT_CONTEXT_MENU, this.onContextMenu);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_ASK_FOR_CURRENT_TIME, this.sendCurrentTime);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_SET_CURRENT_TIME, this.setCurrentTime);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_ASK_FOR_DURATION, this.sendDuration);
        this.addListener(document, PlayerEventType.ELEMENT_CLICK, this.hideControlsMenuOnClickDocument);
        this.addListener(document, PlayerEventType.ELEMENT_KEYDOWN, this.handleShortCutsKeyDownEvent);
        this.addListener(document, PlayerEventType.ELEMENT_FOCUSIN, this.handleMuteShortcuts);
        this.addListener(document, PlayerEventType.ELEMENT_FOCUSOUT, this.handleUnmuteShortcuts);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_MUTE, this.handleMuteShortcuts);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_UNMUTE, this.handleUnmuteShortcuts);
    }

    handleMuteShortcuts($event) {
        let needsToMuteShortcuts = false;
        $event && (needsToMuteShortcuts = Utils.eventTargetNeedsToMuteShortcuts($event));
        if (($event == undefined) || needsToMuteShortcuts) {
            this.muteShortcuts = true;
        }
    }

    handleUnmuteShortcuts($event) {
        let needsToMuteShortcuts = false;
        $event && (needsToMuteShortcuts = Utils.eventTargetNeedsToMuteShortcuts($event));
        if (($event == undefined) || needsToMuteShortcuts) {
            this.muteShortcuts = false;
        }
    }

    handleShortCutsKeyDownEvent($event) {
        let key = $event.key;
        if (key === ' ') {
            key = 'espace';
        }
        const shortcut: ShortcutEvent = {
            shortcut: {
                key: key.toLowerCase(),
                ctrl: $event.ctrlKey,
                shift: $event.shiftKey,
                alt: $event.altKey,
                meta: $event.metaKey,
            },
            targets: ['CONTROL_BAR', 'ANNOTATIONS'],
        };

        if (this.muteShortcuts === false) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SHORTCUT_KEYDOWN, shortcut);
            if ($event.key !== 'enter' && $event.key !== 'Enter') {
                $event.preventDefault();
            }
        }
    }

    sendCurrentTime() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_CURRENT_TIME, { currentTime: this.mediaPlayerElement.getMediaPlayer().getCurrentTime() });
    }
    setCurrentTime(event) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(event.currentTime);
    }
    sendDuration() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_DURATION, { duration: this.mediaPlayerElement.getMediaPlayer().getDuration() });
    }

    public handleLoading() {
        this.inLoading = true;
    }


    public handleLoadingEnd() {
        this.inLoading = false;
    }


    public handlePinnedControlbarChange(event) {
        this.pinnedControlbar = event;
        this.pinned = false;
        this.updatePlayerSizeWithAspectRatio();
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.CONTROL_BAR_TOGGLED, {
            pinnedControlBar: this.pinnedControlbar,
            pinned: this.pinned
        });
    }


    public handlePinnedSliderChange(event) {
        this.pinned = event;
        this.pinnedControlbar = false;
        this.updatePlayerSizeWithAspectRatio();
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.CONTROL_BAR_TOGGLED, {
            pinnedControlbar: this.pinnedControlbar,
            pinned: this.pinned
        });
    }


    private handleSeeking(tc: number) {
        this.logger.debug('handleSeeking');
        if (this.enableThumbnail && (this.mediaPlayerElement.getMediaPlayer().getPlaybackRate() === 1)) {
            this.enablePreviewThumbnail = true;
            const timecode = parseFloat(tc.toFixed(2));
            this.throttleFunc(timecode);
        }
    }


    private handleSeeked() {
        if (this.mediaPlayerElement.getMediaPlayer().getPlaybackRate() === 1 && this.enableThumbnail) {
            const tc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            const timecode = parseFloat(tc.toFixed(2));
            this.setPreviewThumbnail(timecode);
        }

    }


    private handlePlay() {
        if (this.enableThumbnail) {
            this.enablePreviewThumbnail = false;
            this.previewThumbnailUrl = '';
        }
    }

    /**
     * Invoked when error event
     * @param event error type
     */
    private handleError(event: any) {
        this.inError = true;
        this.errorMessage = event;
        this.logger.error('Error', event);
    }

    /**
     * Invoked when erasing an error event
     * @param event erase error message
     */
    private handleEraseError(event: any) {
        this.inError = false;
        this.errorMessage = event;
        this.logger.info('Erase Error', event);
    }

    /**
     * Invoked on aspect ratio change
     * @param event aspect ratio
     */

    private handleAspectRatioChange(event) {
        this.logger.debug('handleAspectRatioChange', event);
        this.aspectRatio = event;
        this.updatePlayerSizeWithAspectRatio();
    }

    /**
     * In charge to init default handlers when input not specified
     */
    private initDefaultHandlers() {
        if (!this.configLoader) {
            if (this.config && typeof this.config === 'string' && this.config.search('^http') !== -1) {
                this.configLoader = new HttpConfigLoader(new DefaultConfigConverter(), this.httpClient, this.logger);
            } else {
                // Default Config load this loader use input config parameter
                this.configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
            }

        }
        if (!this.metadataConverter) {
            // Default use parameter load metadata
            this.metadataConverter = new DefaultMetadataConverter();
        }
        if (!this.metadataLoader) {
            // Default use load source form http request
            this.metadataLoader = new DefaultMetadataLoader(this.httpClient, this.metadataConverter, this.logger);
        }
    }

    /**
     * In charge to update thumbnail
     */
    private setPreviewThumbnail(tc: number) {
        if (!isNaN(tc) && this.enableThumbnail) {
            this.previewThumbnailUrl = this.mediaPlayerElement.getThumbnailUrl(tc);
            if (this.previewThumbnailUrl) {
                this.thumbnailService.getThumbnail(this.previewThumbnailUrl, tc).then((blob) => {
                    if (typeof (blob) !== 'undefined') {
                        this.thumbnailBlobVideo = this.sanitizer.bypassSecurityTrustUrl(blob);
                    }
                });
            }
        }
    }

    /**
     * Invoked on  init config
     * @param state player init state
     */
    private onInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;
        this.autoplay = this.mediaPlayerElement.getConfiguration().player.autoplay || false;
        this.enableThumbnail = this.mediaPlayerElement.getConfiguration().thumbnail?.enableThumbnail || false;
        this.aspectRatio = this.mediaPlayerElement.getConfiguration().player.ratio || '16:8';
        this.ratio = this.aspectRatio.replace(':', '-');
        this.videoPoster = this.mediaPlayerElement.getConfiguration().player.poster || '';

        if (this.videoPoster !== '') {
            if (this.mediaPlayerElement.getConfiguration().player.posterBackground) {
                this.posterBackgound['' + this.mediaPlayerElement.getConfiguration().player.posterBackground] = true;
            }
        }
        const debug = this.mediaPlayerElement.preferenceStorageManager.getItem('debug');
        this.logger.state(debug === null ? this.mediaPlayerElement.getConfiguration().debug : true);
        this.logger.logLevel(debug === null ? this.mediaPlayerElement.getConfiguration().logLevel : LoggerLevel.valToString(LoggerLevel.Debug));
        this.updatePlayerSizeWithAspectRatio();
    }

    /**
     * Invoked on error to init config
     * @param state player init state
     */
    private onErrorInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;
        this.inError = true;
        this.logger.error(`Error to initialize player.`);
    }

    /***
     * focus mediaPlayer container
     */
    public focus() {
        // keypress works only after a click
        // this.mediaPlayer.nativeElement.click();
        this.mediaContainer.nativeElement.focus();
    }

    /**
     * Invoked on mouseenter and mouseleave events
     */
    public displayControlBar(_displayControlBar: boolean) {
        if (_displayControlBar === true) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_ENTER);
        } else if (_displayControlBar === false) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_LEAVE);
        }
    }

    /**
     * Invoked on fullscreen change
     */

    public handleFullScreenChange() {
        const isFullscreen = document.fullscreenElement !== null;
        if (!isFullscreen) {
            this.containerSizeBeforeFullScreen = {
                width: this.mediaContainer.nativeElement.offsetWidth,
                height: this.mediaContainer.nativeElement.offsetHeight
            };
        }

        const element = this.mediaPlayer.nativeElement.offsetParent as HTMLElement;
        if (element) {
            let parent = element.offsetParent as HTMLElement;
            let condition = parent && parent.classList.contains('module') && parent.classList.contains('player');
            while (parent && !condition) {
                parent = parent.offsetParent as HTMLElement;
                condition = parent && parent.classList.contains('module') && parent.classList.contains('player');
            }
            if (parent) {
                this.mediaPlayerElement.toggleFullscreen(parent);
            } else {
                this.mediaPlayerElement.toggleFullscreen(element);
            }
        }
        // Ne pas appeler ici this.updatePlayerSizeWithAspectRatio(),
        // car l'appli n'aurait pas eu le temps de passer en mode plein écran.
        // Dès que l'appli passe en mode plein écran, this.updatePlayerSizeWithAspectRatio() est
        // systématiquement appelée car l'évènement window:resize est déclenché.
    }

    /**
     * Toggle back this.containerSizeBeforeFullScreen to undefined.
     * To be used once, this.containerSizeBeforeFullScreen has already been used to compute the size of the video.
     */
    private resetContainerSizeBeforeFullScreen() {
        this.containerSizeBeforeFullScreen = undefined;
    }


    public handleKeyDownEvent(event) {
        this.playerHover = true;
        this.emitKeyDownEvent(event);
    }

    /**
     * invoked on keydown
     */

    public emitKeyDownEvent($event) {
        this.focus();
        let i;
        let keys;
        let key = $event.key;
        if (key === ' ') {
            key = 'espace';
        }
        if (this.playerHover === true) {
            if (this.listKeys.length === 0) {
                this.listKeys.push(key);
                keys = key;
            }
            for (i = 0; i < this.listKeys.length; i++) {
                if (this.listKeys[i] !== key) {
                    this.listKeys.push(key);
                    keys += ' + ' + key;
                }
            }
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.KEYDOWN, keys);
            if (key === 'espace') {
                $event.preventDefault();
            }
        }
    }


    public emitKeyUpEvent() {
        this.listKeys = [];
        this.focus();
    }


    public hideControlsMenuOnClickDocument($event) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.DOCUMENT_CLICK, $event);
    }

    // hide controlBar after 3 seconds of mouse inactive
    public startTimer() {
        this.chrono = setTimeout(this.hideControls.bind(this), 1800);
    }

    // reset 3 seconds mouse inactive and start timer again
    public resetTimer() {
        // reset
        clearTimeout(this.chrono);
        this.startTimer();
    }

    // hide controls if mouse in inactive since 3 seconds

    public hideControls() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_LEAVE);
    }


    public scrollPlaybackRateImages($event) {
        let rewinding = false;
        let playbackrate = $event;
        this.mainSource = !this.mediaPlayerElement.getMediaPlayer().reverseMode;
        if (playbackrate < 0) {
            rewinding = true;
            playbackrate = Math.abs(playbackrate);
        }
        const framesPerSecond = this.mediaPlayerElement.getMediaPlayer().framerate * playbackrate;
        const ms = 1000;
        this.mediaPlayerElement.getMediaPlayer().pause(true);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_SIMULATE_SLIDER);
        const self = this;
        this.tc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.intervalImages = setInterval(() => {
            self.displayImages(framesPerSecond, ms, rewinding);
        }, ms);
    }


    public clearInterval() {
        if (this.intervalImages) {
            clearInterval(this.intervalImages);
            this.intervalImages = '';
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_SIMULATE_PLAY, false);
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_STOP_SIMULATE_PLAY);
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.tc);
            this.mediaPlayerElement.getMediaPlayer().play();
        }
    }


    public displayImages(framesPerSecond, ms, rewinding) {
        const frames = framesPerSecond / (1000 / ms);
        if (rewinding === false) {
            this.tc = this.tc + (frames / this.mediaPlayerElement.getMediaPlayer().framerate);
        } else {
            this.tc = this.tc - (frames / this.mediaPlayerElement.getMediaPlayer().framerate);
        }
        this.tc = parseFloat(this.tc.toFixed(2));
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(this.tc);
        // Set thumbnail video
        this.enablePreviewThumbnail = true;
        if (this.enableThumbnail) {
            this.loopImages(this.tc);
            // this.setPreviewThumbnail(this.tc);
            // set current Time
        }
        if (this.tc > this.mediaPlayerElement.getMediaPlayer().getDuration() || this.tc < 0) {
            clearInterval(this.intervalImages);
        }
    }

    public loopImages(tc) {
        this.showImage(tc).then(time => {
            const dif = 250 - Number(time);
            const r = Math.max(250, dif);
            setTimeout(() => this.loopImages(tc), r);
        });
    }


    public showImage(tc) {
        let prevImg;
        return new Promise(resolve => {
            const url = this.mediaPlayerElement.getThumbnailUrl(tc);
            if (prevImg === url) {
                resolve(0);
            }
            const t = new Date().getTime();
            this.previewThumbnailElement.nativeElement.onload = () => {
                prevImg = url;
                const tm = new Date().getTime();
                const diff = Number(tm - t);
                resolve(diff);
            };
            this.previewThumbnailElement.nativeElement.onerror = () => resolve(0);
            this.thumbnailBlobVideo = url;
        });
    }

    public controlClicked($event) {
        this.mediaPlayerElement.getMediaPlayer().playPause();
    }

    addListener(element: any, playerEventType: PlayerEventType, func: any) {
        Utils.addListener(this, element, playerEventType, func);
    }

    ngOnDestroy(): void {
        Utils.unsubscribeTargetedElementEventListeners(this);
        this.playerService.decrement(this.playerId);
        this.thumbnailService.listThumbnails = [];
    }

    /** @internal */
    public _setEnableThumbnailForTesting(value: boolean): void {
        this.enableThumbnail = value;
    }

    /** @internal */
    public _setPreviewThumbnailForTesting(value): void {
        this.setPreviewThumbnail(value);
    }

    /** @internal */
    public _handleErrorForTesting(event: any) {
        this.handleError(event)
    }

    /** @internal */
    public _handleEraseErrorForTesting(event: any) {
        this.handleEraseError(event)
    }

    /** @internal */
    public _handlePlayForTesting() {
        this.handlePlay();
    }

}
