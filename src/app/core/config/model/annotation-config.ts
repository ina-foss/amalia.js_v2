export interface AnnotationConfig {
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
     * Custom data control
     */
    data?: any;
}
