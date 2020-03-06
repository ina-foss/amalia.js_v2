/**
 * Utils for format
 */
import {Localisation, Metadata} from '@ina/amalia-model';
import {TranscriptionLocalisation} from '../config/model/transcription-localisation';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {FormatUtils} from './format-utils';

export class MetadataUtils {
    /**
     * Return list of transcription
     * Todo sub localisation
     * @param metadata localisation
     * @param maxParselevel max parse level
     */
    public static getTranscriptionLocalisations(metadata: Metadata, maxParseLevel: number = 1): Array<TranscriptionLocalisation> {
        const localisations: Array<TranscriptionLocalisation> = new Array<TranscriptionLocalisation>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((l) => {
                MetadataUtils.parseTranscriptionLocalisations(l, localisations, maxParseLevel);
            });
        }
        return localisations;
    }

    /**
     * In charge to parse transcription
     * @param l localisation
     * @param localisations transcription
     */
    public static parseTranscriptionLocalisations(l: any, localisations: Array<TranscriptionLocalisation>, maxParselevel: number): void {
        if (l.tcin && l.tcout && l.data && l.data.text) {
            localisations.push({
                label: (l.label) ? l.label : '',
                thumb: (l.thumb) ? l.thumb : '',
                tcIn: (l.tcin && typeof l.tcin === 'string') ? FormatUtils.convertTcToSeconds(l.tcin) : l.tcin,
                tcOut: (l.tcout && typeof l.tcout === 'string') ? FormatUtils.convertTcToSeconds(l.tcout) : l.tcout,
                text: (l.data && l.data.text && isArrayLike<string>(l.data.text)) ? l.data.text.toString() : ''
            });
        }
        if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && l.tclevel <= maxParselevel) {
            l.sublocalisations.localisation.forEach((subl) => {
                MetadataUtils.parseTranscriptionLocalisations(subl, localisations, maxParselevel);
            });
        }
    }


}
