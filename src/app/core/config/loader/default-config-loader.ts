import {ConfigData} from '../model/config-data';
import {LoggerInterface} from '../../logger/logger-interface';
import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';

/**
 * Default config loader in charge use params to ConfigData
 */
export class DefaultConfigLoader implements Loader<ConfigData> {
    private converter: Converter<ConfigData>;
    private logger: LoggerInterface;

    constructor(converter: Converter<ConfigData>, logger: LoggerInterface) {
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
