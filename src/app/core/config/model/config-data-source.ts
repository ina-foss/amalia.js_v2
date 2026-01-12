import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';
import {Metadata} from '@ina/amalia-model';

export interface ConfigDataSource {
    url: string;
    headers?: Array<string>;
    loader?: Loader<Array<Metadata>>;
    converter?: Converter<Metadata>;
    plugin?:string;
}
