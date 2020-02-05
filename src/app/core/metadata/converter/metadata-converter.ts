import {Metadata} from '@ina/amalia-model';

export interface MetadataConverter {
  convert(data: any): Metadata;
}
