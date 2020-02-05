import {MetadataConverter} from './metadata-converter';
import {Metadata} from '@ina/amalia-model';
import {AmaliaException} from '../../exception/amalia-exception';

/**
 * In charge to convert data lake format
 */
export class DataLakeFormatConverter implements MetadataConverter {
  /**
   * Not implemented
   * @param data data to convert
   * @throws AmaliaException
   */
  convert(data: any): Metadata {
    throw new AmaliaException('Not implemented');
  }
}
