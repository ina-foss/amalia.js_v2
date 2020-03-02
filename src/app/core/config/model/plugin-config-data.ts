export interface PluginConfigData<T> {
    name: string;
    debug?: boolean;
    data: T;
    metadataIds?: Array<string>;
}
