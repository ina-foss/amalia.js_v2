import {LoggerInterface} from './logger/logger-interface';
import {ConfigurationManager} from './config/configuration-manager';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {ConfigLoader} from './config/loader/config-loader';
import {PlayerState} from './constant/player-state';

/**
 * In charge to create player
 */
export class MediaPlayerElement {
  private configurationManager: ConfigurationManager;
  private readonly logger: LoggerInterface;
  private state: PlayerState;

  constructor(logger: LoggerInterface) {
    this.logger = logger;
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
  public init(config: object, configLoader?: ConfigLoader): Promise<PlayerState> {
    return new Promise<PlayerState>((resolve, reject) => {
      try {
        const loader = configLoader ? configLoader : new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
        this.configurationManager = new ConfigurationManager(loader, this.logger);
        this.loadConfiguration(config).then(() => {
            this.state = PlayerState.INITIALIZED;
            this.logger.debug('Config loaded ...');
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


}
