/**
 * Utils for format
 */
import {Metadata} from '@ina/amalia-model';
import {TranscriptionAnnotation, TranscriptionLocalisation} from '../metadata/model/transcription-localisation';
import {Utils} from './utils';
import {FormatUtils} from './format-utils';
import {Histogram} from '../metadata/model/histogram';
import {TimelineLocalisation} from '../metadata/model/timeline-localisation';
import {AnnotationLocalisation} from "../metadata/model/annotation-localisation";

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
                MetadataUtils.parseTranscriptionLocalisations(l, localisations, parseLevel, withSubLocalisations,
                    new Array<TranscriptionAnnotation>() );
            });
        }
        return localisations;
    }
    /**
     * Return list of transcription
     * @param metadata localisation
     * @param parseLevel parse level
     * @param withSubLocalisations true for parse sub localisation
     */
    public static getAnnotationLocalisations(metadata: Metadata, parseLevel: number = 1, withSubLocalisations = false): Array<AnnotationLocalisation> {
        const localisations: Array<AnnotationLocalisation> = new Array<AnnotationLocalisation>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((l) => {
                MetadataUtils.parseAnnotationLocalisations(l, localisations, parseLevel, withSubLocalisations,
                        new Array<AnnotationLocalisation>() );
            });
        }
        return localisations;
    }

    /**
     * In charge to parse annotations
     * @param l localisation
     * @param localisations transcription
     * @param parseLevel parse level
     * @param withSubLocalisations true for parse sub localisation
     * @param annotationsLoc
     */
    public static parseAnnotationLocalisations(l: any, localisations: Array<AnnotationLocalisation>, parseLevel: number,
                                                  withSubLocalisations: boolean, annotationsLoc: Array<AnnotationLocalisation>): void {
        if (l.tcin && l.tcout && l.data && l.data.text && l.tclevel === parseLevel) {
            const subLocalisations = new Array<AnnotationLocalisation>();
            if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && withSubLocalisations) {
                l.sublocalisations.localisation.forEach((subl) => {
                    MetadataUtils.parseAnnotationLocalisations(subl, subLocalisations, subl.tclevel, withSubLocalisations,
                            new Array<AnnotationLocalisation>());
                });
            }
            MetadataUtils.pushAnnotationLocalisations(l, localisations, subLocalisations, annotationsLoc);
        }
        if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && l.tclevel <= parseLevel) {
            l.sublocalisations.localisation.forEach((subl) => {
                const annotations = new Array<AnnotationLocalisation>();
                if (subl.data.annotations && subl.data.annotations.length > 0) {
                    subl.data.annotations.forEach(a => {
                        annotations.push(a);
                    });
                }
                MetadataUtils.parseAnnotationLocalisations(subl, localisations, parseLevel, withSubLocalisations, annotations);
            });
        }
    }
    // push annotation localisations
    private static pushAnnotationLocalisations(l, localisations, subLocalisations, annotations) {
        localisations.push({
            label: (l.label) ? l.label : '',
            thumb: (l.thumb) ? l.thumb : '',
            tcIn: (l.tcin && typeof l.tcin === 'string') ? FormatUtils.convertTcToSeconds(l.tcin)  : l.tcin,
            tcOut: (l.tcout && typeof l.tcout === 'string') ? FormatUtils.convertTcToSeconds(l.tcout) : l.tcout,
            subLocalisations,
            annotations
        });
    }
    /**
     * In charge to parse transcription
     * @param l localisation
     * @param localisations transcription
     * @param parseLevel parse level
     * @param withSubLocalisations true for parse sub localisation
     * @param annotationsLoc
     */
    public static parseTranscriptionLocalisations(l: any, localisations: Array<TranscriptionLocalisation>, parseLevel: number,
                                                  withSubLocalisations: boolean, annotationsLoc: Array<TranscriptionAnnotation>): void {
        if (l.tcin && l.tcout && l.data && l.data.text && l.tclevel === parseLevel) {
            const subLocalisations = new Array<TranscriptionLocalisation>();
            if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && withSubLocalisations) {
                l.sublocalisations.localisation.forEach((subl) => {
                    MetadataUtils.parseTranscriptionLocalisations(subl, subLocalisations, subl.tclevel, withSubLocalisations,
                        new Array<TranscriptionAnnotation>());
                });
            }
            MetadataUtils.pushTranscriptionLocalisations(l, localisations, subLocalisations, annotationsLoc);
        }
        if (l.sublocalisations && l.sublocalisations.localisation && l.sublocalisations.localisation.length && l.tclevel <= parseLevel) {
            l.sublocalisations.localisation.forEach((subl) => {
                const annotations = new Array<TranscriptionAnnotation>();
                if (subl.data.annotations && subl.data.annotations.length > 0) {
                    subl.data.annotations.forEach(a => {
                        annotations.push(a);
                    });
                }
                MetadataUtils.parseTranscriptionLocalisations(subl, localisations, parseLevel, withSubLocalisations, annotations);
            });
        }
    }
    // push transcription localisations
    private static pushTranscriptionLocalisations(l, localisations, subLocalisations, annotations) {
        localisations.push({
            label: (l.label) ? l.label : '',
            thumb: (l.thumb) ? l.thumb : '',
            tcIn: (l.tcin && typeof l.tcin === 'string') ? FormatUtils.convertTcToSeconds(l.tcin)  : l.tcin,
            tcOut: (l.tcout && typeof l.tcout === 'string') ? FormatUtils.convertTcToSeconds(l.tcout) : l.tcout,
            text: (l.data && l.data.text && Utils.isArrayLike<string>(l.data.text)) ? l.data.text.toString() : '',
            subLocalisations,
            annotations
        });
    }

    /**
     * Return list of histogram
     * @param metadata metadata
     */
    public static getHistograms(metadata: Metadata): Array<Histogram> {
        const histograms: Array<Histogram> = new Array<Histogram>();
        if (metadata && metadata.localisation) {
            metadata.localisation.forEach((l) => {
                if (l.data.hasOwnProperty('histogram') && l.data.histogram && Utils.isArrayLike(l.data.histogram)) {
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
                MetadataUtils.pushTimelineLocalisation(localisation, timelineLocalisations);
            }
            // parse sub localisation
            if (localisation.sublocalisations && localisation.sublocalisations.localisation && localisation.sublocalisations.localisation.length) {
                localisation.sublocalisations.localisation.forEach((subLocalisation) => {
                    MetadataUtils.parseTimelineLocalisation(subLocalisation, timelineLocalisations);
                });
            }
        }
    }
    // push timelineLocalisation
    private static pushTimelineLocalisation(localisation, timelineLocalisations) {
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
}
