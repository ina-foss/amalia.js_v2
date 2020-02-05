import {ConfigLoader} from './config-loader';
import {ConfigConverter} from '../converter/config-converter';
import {ConfigData} from '../model/config-data';
import {LoggerInterface} from '../../logger/logger-interface';

/**
 * Default config loader in charge use params to ConfigData
 */
export class DefaultConfigLoader implements ConfigLoader {
  private converter: ConfigConverter;
  private logger: LoggerInterface;

  constructor(converter: ConfigConverter, logger: LoggerInterface) {
    this.converter = converter;
    this.logger = logger;
  }

  /**
   * In charge to load config
   * @param params ConfigData
   */
  load(params: any): Promise<ConfigData> {
    return new Promise((resolve, reject) => {
      // Load config
      const config = this.converter.convert(params);
      if (config) {
        this.logger.debug('Config loaded', config);
        resolve(config);
      } else {
        this.logger.error('Error to load config', config);
        reject(config);
      }
    });
  }
}
