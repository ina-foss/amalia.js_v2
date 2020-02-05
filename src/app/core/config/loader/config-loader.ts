import {ConfigData} from '../model/config-data';

/**
 * In charge to load configuration
 */
export interface ConfigLoader {
  /**
   * load configuration
   * @param params configuration load params
   */
  load(params: any): Promise<ConfigData>;
}
