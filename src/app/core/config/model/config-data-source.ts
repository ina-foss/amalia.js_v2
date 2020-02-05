import {MetadataLoader} from '../../metadata/loader/metadata-loader';
import {MetadataConverter} from '../../metadata/converter/metadata-converter';

export interface ConfigDataSource {
  url: string;
  loader?: MetadataLoader;
  converter?: MetadataConverter;
}
