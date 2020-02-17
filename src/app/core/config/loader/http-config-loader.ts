import {ConfigData} from '../model/config-data';
import {HttpClient} from '@angular/common/http';
import {LoggerInterface} from '../../logger/logger-interface';
import {AmaliaException} from '../../exception/amalia-exception';
import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';

/**
 * In charge to load amalia config from specified url
 */
export class HttpConfigLoader implements Loader<ConfigData> {
    private converter: Converter<ConfigData>;
    private readonly httpClient: HttpClient;
    private readonly logger: LoggerInterface;

    constructor(converter: Converter<ConfigData>, httpClient: HttpClient, logger: LoggerInterface) {
        this.converter = converter;
        this.httpClient = httpClient;
        this.logger = logger;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
    }

    /**
     * In charge to load configuration by url
     * @param url configuration url
     */
    load(url: any): Promise<ConfigData> {
        return new Promise<ConfigData>((resolve, reject) => {
            this.httpClient.get(url)
                .toPromise()
                .then(
                    res => {
                        this.logger.info('Config loaded', res);
                        resolve(this.converter.convert(res));
                    },
                    error => {
                        this.logger.info('Config loaded', error);
                        reject('ERROR_LOAD_HTTP');
                    });
        });
    }
}
