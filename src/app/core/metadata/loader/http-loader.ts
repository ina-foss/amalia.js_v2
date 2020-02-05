import {HttpClient} from '@angular/common/http';
import {MetadataLoader} from './metadata-loader';
import {Metadata} from '@ina/amalia-model';
import {AmaliaException} from '../../exception/amalia-exception';
import {LoggerInterface} from '../../logger/logger-interface';
import {MetadataConverter} from '../converter/metadata-converter';
import {isArray} from 'util';
import {PlayerErrorCode} from '../../constant/error-type';

/**
 * In charge to load http resource
 */
export class HttpLoader implements MetadataLoader {
  private readonly httpClient: HttpClient;
  private readonly logger: LoggerInterface;
  private readonly converter: MetadataConverter;

  constructor(httpClient: HttpClient, converter: MetadataConverter, logger: LoggerInterface) {
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
  load(url: any): Promise<Array<Metadata>> {
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
    if (isArray(data)) {
      for (const m in data) {
        if (data.hasOwnProperty(m)) {
          listOfMetadata.push(this.converter.convert(m));
        }
      }
    } else {
      listOfMetadata.push(this.converter.convert(data));
    }
    return listOfMetadata;
  }

}
