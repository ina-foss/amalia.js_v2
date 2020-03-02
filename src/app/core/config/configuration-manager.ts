/**
 * In charge handler amalia configuration
 */
import {ConfigData} from './model/config-data';
import {AmaliaException} from '../exception/amalia-exception';
import {PluginConfigData} from './model/plugin-config-data';
import {LoggerInterface} from '../logger/logger-interface';
import {Loader} from '../loader/loader';


/**
 * In charge to handle amalia configuration
 */
export class ConfigurationManager {
    private configData: ConfigData;
    private loader: Loader<ConfigData>;
    private logger: LoggerInterface;

    constructor(loader: Loader<ConfigData>, logger: LoggerInterface) {
        this.loader = loader;
        this.logger = logger;
    }

    /**
     * In charge to load configuration
     * @param params load configuration params
     */
    load(params: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.loader
                .load(params)
                .then(config => {
                    this.configData = config;
                    if (!config.pluginsConfiguration) {
                        this.configData.pluginsConfiguration = new Map<string, PluginConfigData<any>>();
                    }
                    this.logger.info('Config loaded', config);
                    resolve(true);
                })
                .catch(error => {
                    reject(error);
                    this.logger.error('Error to load config ', this.configData);
                });
        });
    }

    /**
     * @return return configuration parameter
     */
    getCoreConfig(): ConfigData {
        return this.configData;
    }

    /**
     * In charge to add plugin configuration
     * @param name plugin name
     * @param config plugin configuration
     */
    addPluginConfiguration(name: string, config: PluginConfigData<any>) {
        this.configData.pluginsConfiguration.set(name, config);
    }

    /**
     * In charge to return plugin configuration
     * @param name plugin name
     * @throws AmaliaException if plugin don't contain config
     */
    getPluginConfiguration(name: string): PluginConfigData<any> {
        if (this.configData.pluginsConfiguration.has(name)) {
            return this.configData.pluginsConfiguration.get(name);
        } else {
            throw new AmaliaException(`Error to get configuration for plugin ${name}.`);
        }
    }
}
