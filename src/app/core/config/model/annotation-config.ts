export interface AnnotationConfig {
    thumbNailLink?: string;
    link?: string;
    assetId?: string;
    availableCategories?: string[];
    availableKeywords?: string[];
    noSpinner?: boolean;
    /**
     * Plugin title
     */
    title: string;
    /**
     * Time display format
     */
    timeFormat?: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds';
    /**
     * Media Fps
     */
    fps?: number;
    autoScroll?: boolean;
    mode?: number;
    karaokeTcDelta?: number;
    parseLevel: number;
    withSubLocalisations: boolean;
    progressBar?: boolean;
    label: string;
    labelSynchro: string;
    key?: string;
    /**
     * delai d'attente de la reponse des services back end
     * qui gèrent le CRUD des annotations
     */
    timeout?: number;
}
