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
import {Inject, Injectable} from '@angular/core';
import {DefaultLogger} from './logger/default-logger';
import {MediaElement} from './media/media-element';
import {EventEmitter} from 'events';


/**
 * In charge to create player
 */
@Injectable()
export class MediaPlayerElement {
    private configurationManager: ConfigurationManager;
    private metadataManager: MetadataManager;
    private defaultLoader: Loader<Array<Metadata>>;
    private state: PlayerState = PlayerState.CREATED;
    private mediaPlayer: MediaElement;
    private readonly logger: LoggerInterface;
    private readonly _eventEmitter: EventEmitter;

    constructor(@Inject(DefaultLogger) logger: LoggerInterface) {
        this.logger = logger;
        this._eventEmitter = new EventEmitter();
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

    /**
     * In  charge to init config
     * @param config param
     * @param configLoader configuration loader when empty we use default configuration loader
     */
    public async init(config: object, defaultLoader?: Loader<Array<Metadata>>, configLoader?: Loader<ConfigData>): Promise<PlayerState> {
        this.defaultLoader = defaultLoader;
        const loader = configLoader ? configLoader : new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
        // Init configuration manager
        this.configurationManager = new ConfigurationManager(loader, this.logger);
        // Init metadata manager
        this.metadataManager = new MetadataManager(this.configurationManager, this.defaultLoader, this.logger);
        // Init player
        return await new Promise<PlayerState>((resolve, reject) => {
            // load configuration
            this.loadConfiguration(config).then(() => {
                    this.state = PlayerState.INITIALIZED;
                    // set media source specified by config
                    this.setMediaSource();
                    // TODO : load metadata
                    this.loadDataSources().then(ds => this.logger.info('', ds));
                    resolve(this.state);
                },
                error => {
                    this.state = PlayerState.ERROR_LOAD_CONFIG;
                    this.logger.error('Error to load config', error);
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
    public getPluginConfiguration(pluginName: string): PluginConfigData {
        return this.configurationManager.getPluginConfiguration(pluginName);
    }

    /**
     * Set media element
     */
    public setMediaPlayer(mediaPlayer: HTMLVideoElement): void {
        this.mediaPlayer = new MediaElement(mediaPlayer, this._eventEmitter, this.logger);
        this.logger.debug('set media player', mediaPlayer);
    }

    /**
     * Return media source
     */
    public getMediaPlayer(): MediaElement {
        return this.mediaPlayer;
    }

    /**
     * In charge to put element on full screen
     * @param element to put in fullscreen
     */
    openFullscreen(element: HTMLElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    }

    /**
     * In charge to exit fullscreen
     * @param document main document element
     */
    closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => this.logger.debug('exitFullscreen mode'));
        }
    }


    /**
     * In charge to load configuration
     * @param config configuration parameter
     */
    private loadConfiguration(config: string | object): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.configurationManager.load(config).then(() => resolve(true), () => reject(false));
        });
    }

    /**
     * In charge to load data sources
     */
    private loadDataSources(): Promise<boolean> {
        return new Promise(() => {
            // TODO
        });
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

}
