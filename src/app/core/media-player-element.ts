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


/**
 * In charge to create player
 */
export class MediaPlayerElement {
  private configurationManager: ConfigurationManager;
  private metadataManager: MetadataManager;
  private readonly defaultLoader: Loader<Array<Metadata>>;
  private readonly logger: LoggerInterface;
  private state: PlayerState;
  private mediaPlayer: HTMLMediaElement;

  constructor(defaultLoader: Loader<Array<Metadata>>, logger: LoggerInterface) {
    this.logger = logger;
    this.defaultLoader = defaultLoader;
    this.state = PlayerState.CREATED;
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
  public init(config: object, configLoader?: Loader<ConfigData>): Promise<PlayerState> {
    const loader = configLoader ? configLoader : new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
    // Init configuration manager
    this.configurationManager = new ConfigurationManager(loader, this.logger);
    // Init metadata manager
    this.metadataManager = new MetadataManager(this.configurationManager, this.defaultLoader, this.logger);

    // Init player
    return new Promise<PlayerState>((resolve, reject) => {
      try {
        // load configuration
        this.loadConfiguration(config).then(() => {
            this.state = PlayerState.INITIALIZED;
            // set media source specified by config
            this.setMediaSource();
            this.loadDataSources().then(ds => this.logger.info('', ds));
            resolve(this.state);
          },
          error => {
            this.state = PlayerState.ERROR_LOAD_CONFIG;
            this.logger.error('Error to load config', error);
            reject(this.state);
          });
      } catch (e) {
        this.logger.error('Error init media player element', e);
        this.state = PlayerState.ERROR_LOAD_CONFIG;
        reject(this.state);
      }
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
   * Return media source
   */
  public setMediaPlayer(mediaPlayer: HTMLMediaElement): void {
    this.mediaPlayer = mediaPlayer;
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
      if (typeof this.configurationManager.getCoreConfig().player.src === 'string') {
        this.mediaPlayer.src = this.configurationManager.getCoreConfig().player.src.toString();
      } else {
        // Todo HSL
        // this.mediaPlayer.srcObject = this.configurationManager.getCoreConfig().player.src.getSrc();
      }
      this.logger.info('Set media source SRC : ', this.mediaPlayer.src);
    } else {
      this.logger.error('Error to set media source');
    }
  }


}
