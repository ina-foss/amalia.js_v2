import {HttpClient} from '@angular/common/http';
import {Metadata} from '@ina/amalia-model';
import {AmaliaException} from '../../exception/amalia-exception';
import {LoggerInterface} from '../../logger/logger-interface';
import {isArray} from 'util';
import {PlayerErrorCode} from '../../constant/error-type';
import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';
import {isArrayLike} from 'rxjs/internal-compatibility';

/**
 * In charge to load http resource
 */
export class DefaultMetadataLoader implements Loader<Array<Metadata>> {
    private readonly httpClient: HttpClient;
    private readonly logger: LoggerInterface;
    private readonly converter: Converter<Metadata>;

    constructor(httpClient: HttpClient, converter: Converter<Metadata>, logger: LoggerInterface) {
        this.httpClient = httpClient;
        this.converter = converter;
        this.logger = logger;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
    }

    /**
     * In charge to load metadata
     * @param url for load metadata
     */
    load(url: string): Promise<Array<Metadata>> {
        return new Promise<Array<Metadata>>((resolve, reject) => {
            this.httpClient.get(url)
                .toPromise()
                .then(
                    res => {
                        this.logger.info('Metadata loaded ...');
                        if (res) {
                            resolve(this.mapResponse(res));
                        } else {
                            reject(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
                        }
                    },
                    error => {
                        this.logger.error('Error to load metadata ...', error);
                        reject(PlayerErrorCode.METADATA_HTTP_LOAD_ERROR);
                    });
        });
    }

    /**
     * In charge to convert metadata
     * @param data convert metadata
     */
    private mapResponse(data: any): Array<Metadata> {
        const listOfMetadata = new Array<Metadata>();
        if (isArrayLike<Metadata>(data)) {
            for (const m in data) {
                if (data.hasOwnProperty(m)) {
                    listOfMetadata.push(this.converter.convert(data[m]));
                }
            }
        } else {
            listOfMetadata.push(this.converter.convert(data));
        }
        return listOfMetadata;
    }

}
