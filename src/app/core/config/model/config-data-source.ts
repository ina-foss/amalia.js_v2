import {Loader} from '../../loader/loader';
import {Converter} from '../../converter/converter';
import {Metadata} from '../../metadata/model/metadata';

export interface ConfigDataSource {
    url: string;
    headers?: Array<string>;
    loader?: Loader<Array<Metadata>>;
    converter?: Converter<Metadata>;
    plugin?: string;
    body?: any;
    method?: 'GET' | 'POST';
    photo?: any;
}
