/**
 * Utils for format
 */
import {Metadata} from '@ina/amalia-model';
import {TranscriptionLocalisation} from '../metadata/model/transcription-localisation';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {FormatUtils} from './format-utils';
import {Histogram} from '../metadata/model/histogram';
import {TimelineLocalisation} from '../metadata/model/timeline-localisation';

export class MetadataUtils {
    /**
     * Return list of transcription
     * @param metadata localisation
     * @param parseLevel parse level
     * @param withSubLocalisations true for parse sub localisation
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
     * @param parseLevel parse level
     * @param withSubLocalisations true for parse sub localisation
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

    /**
     * Return list of histogram
     * @param metadata metadata
     */
    public static getHistograms(metadata: Metadata): Array<Histogram> {
        const histograms: Array<Histogram> = new Array<Histogram>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((l) => {
                if (l.data.hasOwnProperty('histogram') && l.data.histogram && isArrayLike(l.data.histogram)) {
                    l.data.histogram.forEach((h) => {
                        h.id = metadata.id;
                        histograms.push(h as Histogram);
                    });
                }
            });
        }
        return histograms;
    }

    /**
     * Parse timeline localisation
     * @param metadata amalia model
     */
    public static getTimelineLocalisations(metadata: Metadata): Array<TimelineLocalisation> {
        const timelineLocalisations = new Array<TimelineLocalisation>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((localisation) => {
                MetadataUtils.parseTimelineLocalisation(localisation, timelineLocalisations);
            });
        }
        return timelineLocalisations;
    }

    /**
     * Convert metadata localisation to timeline localisation
     */
    private static parseTimelineLocalisation(localisation: any, timelineLocalisations: Array<TimelineLocalisation>) {
        if (localisation) {
            if (localisation.tclevel > 0) {
                const tl: TimelineLocalisation = {
                    label: localisation.label || null,
                    thumb: localisation.thumb || null,
                    type: localisation.type || null,
                    tc: (typeof localisation.tc === 'string') ? FormatUtils.convertTcToSeconds(localisation.tc) : localisation.tc || null,
                    tcIn: (typeof localisation.tcin === 'string') ? FormatUtils.convertTcToSeconds(localisation.tcin) : localisation.tcin || null,
                    tcOut: (typeof localisation.tcout === 'string') ? FormatUtils.convertTcToSeconds(localisation.tcout) : localisation.tcout || null,
                };
                // add to list if tc or tcin not empty
                if (tl.tc || tl.tcIn) {
                    timelineLocalisations.push(tl);
                }
            }
            // parse sub localisation
            if (localisation.sublocalisations && localisation.sublocalisations.localisation && localisation.sublocalisations.localisation.length) {
                localisation.sublocalisations.localisation.forEach((subLocalisation) => {
                    MetadataUtils.parseTimelineLocalisation(subLocalisation, timelineLocalisations);
                });
            }
        }
    }
}
