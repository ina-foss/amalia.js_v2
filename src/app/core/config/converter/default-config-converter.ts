import {ConfigData} from '../model/config-data';
import {Converter} from '../../converter/converter';

/**
 * Default amalia config converter
 */
export class DefaultConfigConverter implements Converter<ConfigData> {

    /**
     * in charge to convert config
     * @param data configuration data
     */
    convert(data: any): ConfigData {
        return data as ConfigData;
    }
}
