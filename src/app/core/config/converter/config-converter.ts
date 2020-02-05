import {ConfigData} from '../model/config-data';

/**
 * In charge to convert amalia config
 */
export interface ConfigConverter {
  /**
   * in charge to convert config
   *
   * @param data configuration data
   */
  convert(data: any): ConfigData;
}
