import {LoggerInterface} from './logger/logger-interface';
import {ConfigurationManager} from './config/configuration-manager';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';
import {MetadataManager} from './metadata/metadata-manager';
import {Loader} from './loader/loader';
import {Metadata} from '@ina/amalia-model';
import {ConfigData} from './config/model/config-data';
import {PluginConfigData} from './config/model/plugin-config-data';
import {DefaultLogger} from './logger/default-logger';
import {MediaElement} from './media/media-element';
import {EventEmitter} from 'events';
import {PlayerEventType} from './constant/event-type';
import {PreferenceStorageManager} from './storage/preference-storage-manager';
import {LoggerLevel} from './logger/logger-level';

/**
 * In charge to create player
 */
export class MediaPlayerElement {
    public configurationManager: ConfigurationManager;
    public _metadataManager: MetadataManager;
    public defaultLoader: Loader<Array<Metadata>>;
    private state: PlayerState = PlayerState.CREATED;
    private mediaPlayer: MediaElement;
    private readonly _preferenceStorageManager: PreferenceStorageManager;
    private readonly logger: LoggerInterface;
    private readonly _eventEmitter: EventEmitter;
    public isMetadataLoaded = false;
    public width: number;

    constructor() {
        this.logger = new DefaultLogger('root-player');
        this._preferenceStorageManager = new PreferenceStorageManager();
        this._eventEmitter = new EventEmitter();
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
        this._metadataManager = new MetadataManager(this.configurationManager, this.defaultLoader, this.logger);
        // Init player
        return await new Promise<PlayerState>((resolve, reject) => {
            // load configuration
            this.loadConfiguration(config).then(() => {
                        this.state = PlayerState.INITIALIZED;
                        // Set logger states
                        const debug = this.preferenceStorageManager.getItem('debug');
                        const dynamicMetadataPreLoad = this.getConfiguration().dynamicMetadataPreLoad;
                        const loggerState = debug === null ? this.getConfiguration().debug : true;
                        const loggerLevel = debug === null ? this.getConfiguration().logLevel : LoggerLevel.valToString(LoggerLevel.Debug);
                        this.logger.state(loggerState);
                        this.logger.logLevel(loggerLevel);
                        this.logger.info(`Config data: ${config}`);
                        this.mediaPlayer.initLoggerState(loggerState, loggerLevel);
                        // Set media source specified by config
                        this.setMediaSource();
                        if (dynamicMetadataPreLoad) {
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
        return this.configurationManager.getCoreConfig();
    }

    /**
     * Return configuration
     */
    public getPluginConfiguration(pluginName: string): PluginConfigData<any> {
        return this.configurationManager.getPluginConfiguration(pluginName);
    }

    /**
     * Set media element
     */
    public setMediaPlayer(mediaPlayer: HTMLVideoElement): void {
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
            if (widthParam > 0 && onHover) {
                return baseUrl.search('\\?') === -1 ? `${baseUrl}?width=${widthParam}&${tcParam}=${tc}` : `${baseUrl}&width=${widthParam}&${tcParam}=${tc}`;
            } else {
                return baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=${tc}` : `${baseUrl}&${tcParam}=${tc}`;
            }
        }
    }

    /**
     * Set mediaPlayer width for responsive grid
     */
    public setMediaPlayerWidth(width) {
        this.width = width;
        this.logger.info('Player width : ' + this.width);
    }

    /**
     * Return displayState (s/m/l)
     */
    public getDisplayState() {
        let displayState = 'l';
        if (this.getConfiguration()) {
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

        return displayState;
    }

    public unsubscribeListerners() {
        this.mediaPlayer.unsubscribeListerners();
    }
}
