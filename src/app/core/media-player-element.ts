import { LoggerInterface } from './logger/logger-interface';
import { ConfigurationManager } from './config/configuration-manager';
import { DefaultConfigConverter } from './config/converter/default-config-converter';
import { DefaultConfigLoader } from './config/loader/default-config-loader';
import { PlayerState } from './constant/player-state';
import { MetadataManager } from './metadata/metadata-manager';
import { Loader } from './loader/loader';
import { Metadata } from '@ina/amalia-model';
import { ConfigData } from './config/model/config-data';
import { PluginConfigData } from './config/model/plugin-config-data';
import { DefaultLogger } from './logger/default-logger';
import { MediaElement } from './media/media-element';
import { EventEmitter } from 'events';
import { PlayerEventType } from './constant/event-type';
import { PreferenceStorageManager } from './storage/preference-storage-manager';
import { LoggerLevel } from './logger/logger-level';
import AmaliaPlayer from '../player/photo/components/AmaliaPlayer';
import { AmaliaPlayerImageSource, AmaliaPlayerSettings } from '../player/photo/business/AmaliaPlayerSettings';
import AmaliaEventConstants from '../player/photo/business/AmaliaEventConstants';

/**
 * In charge to create player
 */
export class MediaPlayerElement {
    private static readonly THUMBNAIL_TC_STEP = 0.04;
    private static pictureHostCounter = 0;
    public configurationManager: ConfigurationManager;
    public _metadataManager: MetadataManager;
    public defaultLoader: Loader<Array<Metadata>>;
    private state: PlayerState = PlayerState.CREATED;
    private mediaPlayer: MediaElement;
    private picturePlayer: AmaliaPlayer;
    private _lastPictureZoomLevel: number = 100;
    private _picturePlayerResizeHandler: () => void = null;
    private _picturePlayerHostResizeObserver: ResizeObserver = null;
    private _picturePlayerHostResizeRaf: number = null;
    private _picturePlayerHost: HTMLElement = null;
    private _picturePlayerLayoutTimeout: any = null;
    private readonly _preferenceStorageManager: PreferenceStorageManager;
    private readonly logger: LoggerInterface;
    private readonly _eventEmitter: EventEmitter;
    public isMetadataLoaded = false;
    public width: number;

    constructor() {
        this.logger = new DefaultLogger('root-player');
        this._preferenceStorageManager = new PreferenceStorageManager();
        this._eventEmitter = new EventEmitter();
        this._eventEmitter.setMaxListeners(1001);
    }


    get preferenceStorageManager(): PreferenceStorageManager {
        return this._preferenceStorageManager;
    }

    /**
     * Selected aspectRatio
     */
    public _aspectRatio: '16:9' | '4:3' = '4:3';

    get aspectRatio() {
        this._aspectRatio = this.getConfiguration().player.ratio;
        if (this._aspectRatio !== '16:9' && this._aspectRatio !== '4:3') {
            this._aspectRatio = '16:9';
        }
        return this._aspectRatio;
    }

    set aspectRatio(value: '16:9' | '4:3') {
        this._aspectRatio = value;
        this.eventEmitter.emit(PlayerEventType.ASPECT_RATIO_CHANGE, value);
        this.logger.info(PlayerEventType.ASPECT_RATIO_CHANGE);
    }

    get eventEmitter(): EventEmitter {
        return this._eventEmitter;
    }

    /**
     * Return media player state
     */
    getState(): PlayerState {
        return this.state;
    }

    get metadataManager(): MetadataManager {
        return this._metadataManager;
    }

    set metadataManager(value: MetadataManager) {
        this._metadataManager = value;
    }

    /**
     * In  charge to init config
     * @param config param
     * @param defaultLoader default loader
     * @param configLoader configuration loader when empty we use default configuration loader
     */
    public async init(config: object, defaultLoader?: Loader<Array<Metadata>>, configLoader?: Loader<ConfigData>): Promise<PlayerState> {
        this.defaultLoader = defaultLoader;
        configLoader = configLoader ? configLoader : new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
        // Init configuration manager
        this.configurationManager = new ConfigurationManager(configLoader, this.logger);
        // Init metadata manager
        this.isMetadataLoaded = false;
        this._metadataManager = new MetadataManager(this.configurationManager, this.defaultLoader, this.logger);
        // Init player
        return await new Promise<PlayerState>((resolve, reject) => {
            // load configuration
            this.loadConfiguration(config).then(() => {
                this.state = PlayerState.INITIALIZED;
                // Set logger states
                const debug = this.preferenceStorageManager.getItem('debug');
                const loadMetadataOnDemand = this.getConfiguration().loadMetadataOnDemand;
                const loggerState = debug === null ? this.getConfiguration().debug : true;
                const loggerLevel = debug === null ? this.getConfiguration().logLevel : LoggerLevel.valToString(LoggerLevel.Debug);
                this.logger.state(loggerState);
                this.logger.logLevel(loggerLevel);
                this.logger.info(`Config data: ${config}`);
                // Forward logger state to the active player. Only one of mediaPlayer / picturePlayer
                // is set, depending on `playerConfig.player.media` (AUDIO|VIDEO ⇒ mediaPlayer,
                // PICTURE ⇒ picturePlayer). AmaliaPlayer does not expose a logger API, so for the
                // picture branch we just trace its activation here.
                if (this.mediaPlayer) {
                    this.mediaPlayer.initLoggerState(loggerState, loggerLevel);
                } else if (this.picturePlayer) {
                    this.logger.debug('picture player active, no logger forwarding required');
                    // For picture mode, there is no <video> element so the INIT event (normally
                    // emitted by handleLoadstart on the video element) never fires. Emit it here
                    // after the configuration is fully loaded so that plugins (e.g. CONTROL_BAR)
                    // can re-initialise with the correct pluginsConfiguration.
                    this._eventEmitter.emit(PlayerEventType.INIT);
                    // The control bar registers its PICTURE_ZOOM_CHANGE listener during the INIT
                    // handler above (synchronous). Re-emit the last known zoom so the display is
                    // correct even when the first zoom event fired before INIT.
                    this._eventEmitter.emit(PlayerEventType.PICTURE_ZOOM_CHANGE, this._lastPictureZoomLevel);
                }
                // Set media source specified by config
                this.setMediaSource();
                if (!loadMetadataOnDemand) {
                    this.loadDataSources().then(() => this.handleMetadataLoaded());
                }
                resolve(this.state);
            },
                error => {
                    this.state = PlayerState.ERROR_LOAD_CONFIG;
                    this.logger.error('Error to load config', error);
                    this.logger.info(`Config data: ${config}`);
                    reject(this.state);
                });
        });
    }

    /**
     * Return configuration
     */
    public getConfiguration(): ConfigData {
        return this.configurationManager?.getCoreConfig();
    }

    /**
     * Return configuration
     */
    public getPluginConfiguration(pluginName: string): PluginConfigData<any> {
        return this.configurationManager?.getPluginConfiguration(pluginName);
    }

    /**
     * Set media element
     */
    public setMediaPlayer(mediaPlayer: HTMLVideoElement): void {
        this.mediaPlayer && this.mediaPlayer.unsubscribeListeners();
        this.mediaPlayer = new MediaElement(mediaPlayer, this._eventEmitter);
        this.logger.debug('set media player', mediaPlayer);
    }

    /**
     * Return media source
     */
    public getMediaPlayer(): MediaElement {
        return this.mediaPlayer;
    }

    /**
     * Set picture element. Mirrors {@link setMediaPlayer} for `media === 'PICTURE'`
     * configurations: instead of wrapping a `<video>` into a {@link MediaElement},
     * we instantiate an {@link AmaliaPlayer} on the provided host element.
     *
     * @param host DOM element that will host the picture player (typically `#photoHost`).
     * @param settings AmaliaPlayer settings (gallery, toolbar, zoom, etc.).
     */
    public setPicturePlayer(host: HTMLElement, settings: AmaliaPlayerSettings): void {
        if (!host) {
            this.logger.warn('setPicturePlayer called without a host element');
            return;
        }
        this._picturePlayerHost = host;
        // AmaliaPlayer expects a CSS selector — guarantee the host is uniquely addressable.
        if (!host.id) {
            host.id = this.generatePictureHostId();
        }
        // Clean up listeners from any previous picture player instance
        if (this._picturePlayerResizeHandler) {
            window.removeEventListener('resize', this._picturePlayerResizeHandler);
            this._picturePlayerResizeHandler = null;
        }
        if (this._picturePlayerHostResizeObserver) {
            this._picturePlayerHostResizeObserver.disconnect();
            this._picturePlayerHostResizeObserver = null;
        }
        if (this._picturePlayerHostResizeRaf !== null) {
            cancelAnimationFrame(this._picturePlayerHostResizeRaf);
            this._picturePlayerHostResizeRaf = null;
        }
        if (this._picturePlayerLayoutTimeout) {
            clearTimeout(this._picturePlayerLayoutTimeout);
            this._picturePlayerLayoutTimeout = null;
        }
        this.picturePlayer = new AmaliaPlayer(`#${host.id}`, settings);
        // Forward window resize → PLAYER_RESIZED so plugins (control bar, etc.) respond to container size changes
        this._picturePlayerResizeHandler = () => this._eventEmitter.emit(PlayerEventType.PLAYER_RESIZED);
        window.addEventListener('resize', this._picturePlayerResizeHandler);
        // Forward picture player zoom events → PICTURE_ZOOM_CHANGE so the control bar can update its zoom display
        this.picturePlayer.addEventListener(AmaliaEventConstants.zoom, (e: CustomEvent) => {
            this._lastPictureZoomLevel = e.detail?.imageData?.zoomLevel ?? 100;
            this._eventEmitter.emit(PlayerEventType.PICTURE_ZOOM_CHANGE, this._lastPictureZoomLevel);
        });
        this.picturePlayer.addEventListener(AmaliaEventConstants.switchDisplayState, () => {
            this.schedulePicturePlayerLayoutRefresh(true);
        });
        // Set initial displayState using measured host dimensions when available.
        if (!this.applyPicturePlayerLayoutFromHost(false)) {
            this.picturePlayer.setDisplayState(this.getDisplayState());
        }
        // AmaliaPlayer's constructor uses `document.querySelector(target)` which cannot traverse
        // shadow roots. When the caller component uses ViewEncapsulation.ShadowDom, the lookup
        // fails and AmaliaPlayer falls back to a detached <div>. Re-attach it to the host here
        // so that this method works regardless of the caller's encapsulation mode.
        const playerDom = this.picturePlayer.getDom();
        if (playerDom && playerDom !== host && !host.contains(playerDom)) {
            host.appendChild(playerDom);
        }
        this.schedulePicturePlayerLayoutRefresh(false);
        if (typeof ResizeObserver !== 'undefined') {
            this._picturePlayerHostResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
                const entry = entries[0];
                if (!entry) {
                    return;
                }
                const width = Math.floor(entry.contentRect.width);
                const height = Math.floor(entry.contentRect.height);
                if (width <= 0 || height <= 0 || !this.picturePlayer) {
                    return;
                }
                if (this._picturePlayerHostResizeRaf !== null) {
                    cancelAnimationFrame(this._picturePlayerHostResizeRaf);
                }
                this._picturePlayerHostResizeRaf = requestAnimationFrame(() => {
                    this._picturePlayerHostResizeRaf = null;
                    this.width = width;
                    this.picturePlayer.setDisplayState(this.getDisplayState(), width, height);
                    this._eventEmitter.emit(PlayerEventType.PLAYER_RESIZED);
                });
            });
            this._picturePlayerHostResizeObserver.observe(host);
        }
        this.logger.debug('set picture player', host);
    }

    /**
     * Return picture player instance (only set when `media === 'PICTURE'`).
     */
    public getPicturePlayer(): AmaliaPlayer {
        return this.picturePlayer;
    }

    public selectPictureImage(imageSrc: string, imageName: string = 'image'): void {
        this.picturePlayer?.selectImageBySource(imageSrc, imageName);
    }

    private getPictureHostSize(host: HTMLElement): { width: number, height: number } | null {
        if (!host) {
            return null;
        }
        const rect: DOMRect = host.getBoundingClientRect();
        const width = Math.floor(rect.width || host.clientWidth || host.offsetWidth || 0);
        const height = Math.floor(rect.height || host.clientHeight || host.offsetHeight || 0);
        if (width <= 0 || height <= 0) {
            return null;
        }
        return { width, height };
    }

    private applyPicturePlayerLayoutFromHost(emitResize: boolean = true): boolean {
        if (!this.picturePlayer || !this._picturePlayerHost) {
            return false;
        }
        const size = this.getPictureHostSize(this._picturePlayerHost);
        if (!size) {
            return false;
        }
        this.width = size.width;
        this.picturePlayer.setDisplayState(this.getDisplayState(), size.width, size.height);
        if (emitResize) {
            this._eventEmitter.emit(PlayerEventType.PLAYER_RESIZED);
        }
        return true;
    }

    private schedulePicturePlayerLayoutRefresh(emitResize: boolean): void {
        if (!this.picturePlayer || !this._picturePlayerHost) {
            return;
        }
        requestAnimationFrame(() => {
            this.applyPicturePlayerLayoutFromHost(emitResize);
        });
        if (this._picturePlayerLayoutTimeout) {
            clearTimeout(this._picturePlayerLayoutTimeout);
        }
        this._picturePlayerLayoutTimeout = setTimeout(() => {
            this._picturePlayerLayoutTimeout = null;
            this.applyPicturePlayerLayoutFromHost(emitResize);
        }, 200);
    }

    private generatePictureHostId(): string {
        MediaPlayerElement.pictureHostCounter += 1;
        return `amalia-picture-host-${Date.now().toString(36)}-${MediaPlayerElement.pictureHostCounter.toString(36)}`;
    }

    /**
     * In charge to toggle fullscreen mode
     * @param element to put in fullscreen
     */
    public toggleFullscreen(element: HTMLElement) {
        const isFullscreen = document.fullscreenElement !== null;
        if (isFullscreen === false) {
            if (element.requestFullscreen) {
                element.requestFullscreen().then(() => this.logger.info(`fullscreen change`));
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => this.logger.debug('exitFullscreen mode'));
            }
        }
    }

    /**
     * In charge to load configuration
     * @param config configuration parameter
     */
    public loadConfiguration(config: string | object): Promise<void> {
        return new Promise((resolve, reject) => {
            this.configurationManager.load(config).then(() => resolve(), () => reject());
        });
    }

    /**
     * In charge to load data sources
     */
    private loadDataSources(): Promise<void> {
        return this._metadataManager.init();
    }

    public handleMetadataLoaded() {
        this.eventEmitter.emit(PlayerEventType.METADATA_LOADED);
        this.logger.info(PlayerEventType.METADATA_LOADED);
        this.isMetadataLoaded = true;
    }

    /**
     * In charge to load data sources
     */
    private setMediaSource(): void {
        if (this.mediaPlayer && this.configurationManager.getCoreConfig().player && this.configurationManager.getCoreConfig().player.src) {
            this.mediaPlayer.setSrc(this.configurationManager.getCoreConfig().player);
            this.logger.info('Set media source SRC : ', this.configurationManager.getCoreConfig().player.src);
        } else {
            this.logger.error('Error to set media source');
        }
    }

    /**
     * Return thumbnail base url
     * @param tc time code
     */
    public getThumbnailUrl(tc: number, onHover?: boolean) {
        if (this.getConfiguration().thumbnail.enableThumbnail && this.getConfiguration().thumbnail?.baseUrl) {
            const baseUrl = this.getConfiguration().thumbnail.baseUrl;
            const tcParam = this.getConfiguration().thumbnail.tcParam ? this.getConfiguration().thumbnail.tcParam : 'start';
            const widthParam = this.getConfiguration().thumbnail.width;
            const roundedTc = this.roundThumbnailTimeCode(tc);
            if (widthParam > 0 && onHover) {
                return baseUrl.search('\\?') === -1 ? `${baseUrl}?width=${widthParam}&${tcParam}=${roundedTc}` : `${baseUrl}&width=${widthParam}&${tcParam}=${roundedTc}`;
            } else {
                return baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=${roundedTc}` : `${baseUrl}&${tcParam}=${roundedTc}`;
            }
        }
    }

    private roundThumbnailTimeCode(tc: number): number {
        if (!Number.isFinite(tc)) {
            return tc;
        }
        const rounded = Math.round((tc + Number.EPSILON) / MediaPlayerElement.THUMBNAIL_TC_STEP) * MediaPlayerElement.THUMBNAIL_TC_STEP;
        return Number(rounded.toFixed(2));
    }

    /**
     * Set mediaPlayer width for responsive grid
     */
    public setMediaPlayerWidth(width) {
        this.width = width;
        this.logger.info('Player width : ' + this.width);
        if (this.picturePlayer && width > 0) {
            const hostHeight = this.getPictureHostSize(this._picturePlayerHost)?.height ?? null;
            this.picturePlayer.setDisplayState(this.getDisplayState(), width, hostHeight);
        }
    }

    /**
     * Return displayState (s/m/l)
     */
    public getDisplayState() {
        let displayState = 'l';
        if (this.getConfiguration() && this.width > 0) {
            const lWidth = this.getConfiguration().displaySizes?.large ?? 900;
            const mWidth = this.getConfiguration().displaySizes?.medium ?? 700;
            const sWidth = this.getConfiguration().displaySizes?.small ?? 550;
            const xsWidth = this.getConfiguration().displaySizes?.xsmall ?? 340;
            if (this.width < xsWidth) {
                displayState = 'xs';
            } else if (this.width >= xsWidth && this.width < sWidth) {
                displayState = 's';
            } else if (this.width >= sWidth && this.width < mWidth) {
                displayState = 'sm';
            } else if (this.width >= mWidth && this.width < lWidth) {
                displayState = 'm';
            }
        }
        // In picture mode, keep an interactive state with Cropper enabled.
        // `xs` and `s` fallback render static/non-draggable views.
        const isPictureMode = this.getConfiguration()?.player?.media === 'PICTURE' || !!this.picturePlayer;
        if (isPictureMode && (displayState === 'xs' || displayState === 's')) {
            displayState = 'sm';
        }

        return displayState;
    }

    public unsubscribeListeners() {
        if (this._picturePlayerResizeHandler) {
            window.removeEventListener('resize', this._picturePlayerResizeHandler);
            this._picturePlayerResizeHandler = null;
        }
        if (this._picturePlayerHostResizeObserver) {
            this._picturePlayerHostResizeObserver.disconnect();
            this._picturePlayerHostResizeObserver = null;
        }
        if (this._picturePlayerHostResizeRaf !== null) {
            cancelAnimationFrame(this._picturePlayerHostResizeRaf);
            this._picturePlayerHostResizeRaf = null;
        }
        if (this._picturePlayerLayoutTimeout) {
            clearTimeout(this._picturePlayerLayoutTimeout);
            this._picturePlayerLayoutTimeout = null;
        }
        this._picturePlayerHost = null;
        this.mediaPlayer?.unsubscribeListeners();
    }
}
