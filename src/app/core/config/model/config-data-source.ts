import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';
import {Metadata} from '@ina/amalia-model';

export interface ConfigDataSource {
  url: string;
  loader?: Loader<Array<Metadata>>;
  converter?: Converter<Metadata>;
}
