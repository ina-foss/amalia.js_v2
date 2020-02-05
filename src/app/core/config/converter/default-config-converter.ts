import {ConfigData} from '../model/config-data';

/**
 * Default amalia config converter
 */
export class DefaultConfigConverter {

  /**
   * in charge to convert config
   * @param data configuration data
   */
  convert(data: any): ConfigData {
    return data as ConfigData;
  }
}
