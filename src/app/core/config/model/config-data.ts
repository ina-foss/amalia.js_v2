import {PluginConfigData} from './plugin-config-data';
import {PlayerConfigData} from './player-config-data';
import {ConfigDataSource} from './config-data-source';

/**
 * Invoked method type
 */
export declare type CallbackHandler = (event: any) => void;

export interface ConfigData {
    loadMetadataOnDemand?: boolean;// si Oui, on charge les metadaonnees des datasources lors du chargement du media
    /**
     * Time code offset handle metadata time code
     */
    tcOffset?: number;
    extractTcIn?: number;
    extractTcOut?: number;
    player: PlayerConfigData;
    pluginsConfiguration?: Map<string, PluginConfigData<any>>;
    dataSources?: Array<ConfigDataSource>;
    data?: any;
    thumbnail?: {
        baseUrl?: string,
        tcParam?: string,
        enableThumbnail?: boolean,
        enableThumbnailPreview?: boolean
        debounceTime?: number,
        width?: number
    };
    debug?: boolean;
    logLevel?: string;
    displaySizes?: {
        large?: number,
        medium?: number,
        small?: number,
        xsmall?: number
    };
}
