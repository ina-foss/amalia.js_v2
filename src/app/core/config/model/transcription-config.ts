export interface TranscriptionConfig {
    title?: string;
    description?: string;
    /**
     * Time display format
     */
    timeFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds';
    /**
     * Media Fps
     */
    fps: number;
    /**
     * Used for seek to word
     */
    tcDelta?: number;
    karaokeTcDelta?: number;
    autoScroll: boolean;
    parseLevel: number;
    withSubLocalisations: boolean;
    progressBar?: boolean;
    mode?: number;
    label: string;
    labelSynchro: string;
    key?: string;
    tcIn?: number;
    duration?: number;
    resourceType?: 'stock' | 'flux';
}
