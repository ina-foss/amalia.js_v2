import {Metadata} from '@ina/amalia-model';
import {AmaliaException} from '../exception/amalia-exception';
import {ConfigurationManager} from '../config/configuration-manager';
import {LoggerInterface} from '../logger/logger-interface';
import {isArray} from 'util';
import {ConfigDataSource} from '../config/model/config-data-source';
import {Loader} from '../loader/loader';

/**
 * In charge to handle metadata
 */
export class MetadataManager {
    private logger: LoggerInterface;
    private configurationManager: ConfigurationManager;
    private readonly defaultLoader: Loader<Array<Metadata>>;
    private listOfMetadata: Map<string, Metadata> = new Map<string, Metadata>();

    constructor(configurationManager: ConfigurationManager, defaultLoader: Loader<Array<Metadata>>, logger: LoggerInterface) {
        this.configurationManager = configurationManager;
        this.defaultLoader = defaultLoader;
        this.logger = logger;
    }

    /**
     * In charge to load data source
     */
    public init() {
        const dataSources = this.configurationManager.getCoreConfig().dataSources;
        if (dataSources && isArray(dataSources)) {
            dataSources.forEach(dataSource => {
                this.loadDataSource(dataSource);
            });
        } else {
            this.logger.warn('Can\'t find data sources');
        }
    }

    /**
     * Get Metadata block
     * @param metadataId metadata id
     * @throws AmaliaException
     */
    getMetadata(metadataId: string) {
        if (metadataId && metadataId !== '' && this.listOfMetadata.has(metadataId)) {
            return this.listOfMetadata.get(metadataId);
        } else {
            throw new AmaliaException(`Error to get metadata`);
        }
    }

    /**
     * Add Metadata block
     * @param metadata metadata
     * @throws AmaliaException
     */
    addMetadata(metadata: Metadata) {
        if (metadata && metadata.id) {
            this.listOfMetadata.set(metadata.id, metadata);
        } else {
            throw new AmaliaException('Error to add Metadata');
        }
    }

    /**
     * Remove Metadata block by metadata id
     * @param metadata metadata
     * @throws AmaliaException
     */
    removeMetadata(metadata: Metadata) {
        if (metadata && metadata.id && this.listOfMetadata.has(metadata.id)) {
            this.listOfMetadata.delete(metadata.id);
        } else {
            throw new AmaliaException('Error to found metadata');
        }
    }

    /**
     * In charge to load data
     * @param loadData ConfigDataSource
     */
    private loadDataSource(loadData: ConfigDataSource) {
        if (loadData && loadData.url) {
            const loader: Loader<Array<Metadata>> = loadData.loader ? loadData.loader : this.defaultLoader;
            loader
                .load(loadData)
                .then(listOfMetadata => this.onMetadataLoaded(listOfMetadata))
                .catch(() => this.logger.warn('Error to load metadata'));
        } else {
            this.logger.warn('Error to load data source');
        }
    }

    /**
     * Called on metadata loaded
     * @param listOfMetadata list of metadata
     */
    private onMetadataLoaded(listOfMetadata: Array<Metadata>) {
        if (listOfMetadata && isArray(listOfMetadata)) {
            for (const metadata of listOfMetadata) {
                try {
                    this.addMetadata(metadata);
                } catch (e) {
                    this.logger.warn('Error to add metadata', metadata);
                }
            }
        } else {
            this.logger.warn('Error to load data');
        }
    }

}
