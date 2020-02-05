import {MetadataConverter} from './metadata-converter';
import {Metadata} from '@ina/amalia-model';

/**
 * In charge to convert Metadata
 */
export class DefaultMetadataConverter implements MetadataConverter {
  convert(data: any): Metadata {
    return data as Metadata;
  }
}
