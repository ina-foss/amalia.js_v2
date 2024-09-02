import {Metadata} from '@ina/amalia-model';
import {AmaliaException} from '../exception/amalia-exception';
import {ConfigurationManager} from '../config/configuration-manager';
import {LoggerInterface} from '../logger/logger-interface';
import {ConfigDataSource} from '../config/model/config-data-source';
import {Loader} from '../loader/loader';
import {Utils} from '../utils/utils';
import {MetadataUtils} from '../utils/metadata-utils';
import {TranscriptionLocalisation} from './model/transcription-localisation';
import {Histogram} from './model/histogram';
import {TimelineLocalisation} from './model/timeline-localisation';
import * as _ from 'lodash';
import {AnnotationLocalisation} from "./model/annotation-localisation";

/**
 * In charge to handle metadata
 */
export class MetadataManager {
    private logger: LoggerInterface;
    private configurationManager: ConfigurationManager;
    private listOfMetadata: Map<string, Metadata> = new Map<string, Metadata>();
    private toLoadData = 0;
    private readonly defaultLoader: Loader<Array<Metadata>>;

    constructor(configurationManager: ConfigurationManager, defaultLoader: Loader<Array<Metadata>>, logger: LoggerInterface) {
        this.configurationManager = configurationManager;
        this.defaultLoader = defaultLoader;
        this.logger = logger;
    }

    /**
     * In charge to load data source
     */
    public init(): Promise<void> {
        return new Promise((resolve) => {
            const dataSources = this.configurationManager.getCoreConfig().dataSources;
            if (dataSources && Utils.isArrayLike<Array<ConfigDataSource>>(dataSources)) {
                this.toLoadData = dataSources.length;
                dataSources.forEach(dataSource => {
                    this.loadDataSource(dataSource, resolve)
                        .then(() => this.logger.debug(`Data source : ${dataSource} loaded`));
                });
                // resolve() called on complete
            } else {
                this.logger.info('Can\'t find data sources');
            }
        });
    }

    /**
     * Get Metadata block
     * @param metadataId metadata id
     * @throws AmaliaException
     */
    public getMetadata(metadataId: string) {
        if (metadataId && metadataId !== '' && this.listOfMetadata.has(metadataId)) {
            return this.listOfMetadata.get(metadataId);
        } else {
            throw new AmaliaException(`Error to get metadata`);
        }
    }

    /**
     * Return list of metadata By Id
     * @param metadataType  type of metadata
     * @returns listOfMetadataById
     */
    public getMetadataByType(metadataType: string): Array<Metadata> {
        return _.filter<Metadata>([...this.listOfMetadata.values()], {type: metadataType});
    }

    /**
     * Add Metadata block
     * @param metadata metadata
     * @throws AmaliaException
     */
    public addMetadata(metadata: Metadata) {
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
    public removeMetadata(metadata: Metadata) {
        if (metadata && metadata.id && this.listOfMetadata.has(metadata.id)) {
            this.listOfMetadata.delete(metadata.id);
        } else {
            throw new AmaliaException('Error to found metadata');
        }
    }


    /**
     * Return transcription metadata
     * @param metadataId metadata
     * @param parseLevel parse level default 1
     * @param withSubLocalisations sub localisation default false
     */
    public getTranscriptionLocalisations(metadataId: string, parseLevel: number = 1, withSubLocalisations = false): Array<TranscriptionLocalisation> | null {
        try {
            const metadata = this.getMetadata(metadataId);
            if (metadata) {
                return MetadataUtils.getTranscriptionLocalisations(metadata, parseLevel, withSubLocalisations);
            }
        } catch (e) {
            this.logger.warn(`Error to find metadata : ${metadataId}`);
        }
        return null;
    }
    /**
     * Return annotation metadata
     * @param metadataId metadata
     * @param parseLevel parse level default 1
     * @param withSubLocalisations sub localisation default false
     */
    public getAnnotationLocalisations(metadataId: string, parseLevel: number = 1, withSubLocalisations = false): Array<AnnotationLocalisation> | null {
        try {
            const metadata = this.getMetadata(metadataId);
            if (metadata) {
                return MetadataUtils.getAnnotationLocalisations(metadata, parseLevel, withSubLocalisations);
            }
        } catch (e) {
            this.logger.warn(`Error to find metadata : ${metadataId}`);
        }
        return null;
    }
    /**
     * Get timeline metadata block
     * @param metadataId metadata id
     * @throws AmaliaException
     */
    public getTimelineLocalisations(metadata: Metadata): Array<TimelineLocalisation> {
        return MetadataUtils.getTimelineLocalisations(metadata);
    }

    /**
     * Return all parsed histogram
     * @param metadataIds ids
     */
    public getHistograms(metadataIds: Array<string>) {
        const histograms = new Array<Histogram>();
        metadataIds.forEach((id) => {
            try {
                const metadata = this.getMetadata(id);
                if (metadata) {
                    const list = MetadataUtils.getHistograms(metadata);
                    if (list && list.length > 0) {
                        histograms.push(...list);
                    }
                }
            } catch (e) {
                this.logger.warn(`Error to parse histogram [id: ${id}]`);
            }
        });
        return histograms;
    }

    /**
     * In charge to load data
     * @param loadData ConfigDataSource
     */
    private async loadDataSource(loadData: ConfigDataSource, completed) {
        if (loadData && loadData.url) {
            const loader: Loader<Array<Metadata>> = loadData.loader ? loadData.loader : this.defaultLoader;
            loader
                .load(loadData.url, loadData.headers)
                .then(listOfMetadata => this.onMetadataLoaded(listOfMetadata, completed))
                .catch(() => this.errorToLoadMetadata(loadData.url, completed));
        } else {
            this.logger.warn('Error to load data source');
        }
    }

    /**
     * Called on metadata loaded
     * @param listOfMetadata list of metadata
     */
    private onMetadataLoaded(listOfMetadata: Array<Metadata>, completed) {
        if (listOfMetadata && Utils.isArrayLike<Metadata>(listOfMetadata)) {
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
        this.toLoadData--;
        if (this.toLoadData < 1) {
            completed();
        }
    }

    /**
     * Error to load data
     * @param url error to local url
     * @param completed promise resolve function
     */
    private errorToLoadMetadata(url, completed) {
        this.toLoadData--;
        if (this.toLoadData < 1) {
            completed();
        }
        this.logger.warn(`Error to load data source : ${url}`);
    }
}
