import {Metadata} from '@ina/amalia-model';

export interface MetadataLoader {
  /**
   * load metadata
   * @param params for load metadata
   */
  load(params: any): Promise<Array<Metadata>>;
}
