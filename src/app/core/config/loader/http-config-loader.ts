import {ConfigData} from '../model/config-data';
import {HttpClient} from '@angular/common/http';
import {LoggerInterface} from '../../logger/logger-interface';
import {AmaliaException} from '../../exception/amalia-exception';
import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';
import {firstValueFrom} from 'rxjs';

/**
 * In charge to load amalia config from specified url
 */
export class HttpConfigLoader implements Loader<ConfigData> {
    private readonly converter: Converter<ConfigData>;
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
        return firstValueFrom(this.httpClient.get(url))
            .then(res => {
                this.logger.info('Config loaded', res);
                return this.converter.convert(res);
            })
            .catch(error => {
                this.logger.info('Config load error', error);
                throw new Error('ERROR_LOAD_HTTP');
            });
    }
}
