import {PluginConfigData} from './plugin-config-data';
import {PlayerConfigData} from './player-config-data';
import {ConfigDataSource} from './config-data-source';

/**
 * Invoked method type
 */
export declare type CallbackHandler = (event: any) => void;

export interface ConfigData {
    /**
     * Time code offset handle metadata time code
     */
    tcOffset?: number;
    player: PlayerConfigData;
    pluginsConfiguration?: Map<string, PluginConfigData<any>>;
    dataSources?: Array<ConfigDataSource>;
    data?: any;
    debug?: boolean;
}
