import {Metadata} from '../model/metadata';
import {Converter} from '../../converter/converter';

/**
 * In charge to convert Metadata
 */
export class DefaultMetadataConverter implements Converter<Metadata> {
    convert(data: any): Metadata {
        return data as Metadata;
    }
}
