/**
 * Utils for format
 */
import {Metadata} from '@ina/amalia-model';
import {TranscriptionLocalisation} from '../config/model/transcription-localisation';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {FormatUtils} from './format-utils';

export class MetadataUtils {
    /**
     * Return list of transcription
     * @param metadata localisation
     * @param maxParselevel max parse level
     */
    public static getTranscriptionLocalisations(metadata: Metadata, parseLevel: number = 1, withSubLocalisations = false): Array<TranscriptionLocalisation> {
        const localisations: Array<TranscriptionLocalisation> = new Array<TranscriptionLocalisation>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((l) => {
                MetadataUtils.parseTranscriptionLocalisations(l, localisations, parseLevel, withSubLocalisations);
            });
        }
        return localisations;
    }

    /**
     * In charge to parse transcription
     * @param l localisation
     * @param localisations transcription
     */
    public static parseTranscriptionLocalisations(l: any, localisations: Array<TranscriptionLocalisation>, parseLevel: number, withSubLocalisations: boolean): void {
        if (l.tcin && l.tcout && l.data && l.data.text && l.tclevel === parseLevel) {
            const subLocalisations = new Array<TranscriptionLocalisation>();
            if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && withSubLocalisations) {
                l.sublocalisations.localisation.forEach((subl) => {
                    MetadataUtils.parseTranscriptionLocalisations(subl, subLocalisations, subl.tclevel, withSubLocalisations);
                });
            }
            localisations.push({
                label: (l.label) ? l.label : '',
                thumb: (l.thumb) ? l.thumb : '',
                tcIn: (l.tcin && typeof l.tcin === 'string') ? FormatUtils.convertTcToSeconds(l.tcin) : l.tcin,
                tcOut: (l.tcout && typeof l.tcout === 'string') ? FormatUtils.convertTcToSeconds(l.tcout) : l.tcout,
                text: (l.data && l.data.text && isArrayLike<string>(l.data.text)) ? l.data.text.toString() : '',
                subLocalisations
            });
        }
        if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && l.tclevel <= parseLevel) {
            l.sublocalisations.localisation.forEach((subl) => {
                MetadataUtils.parseTranscriptionLocalisations(subl, localisations, parseLevel, withSubLocalisations);
            });
        }
    }


}
