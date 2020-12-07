export interface TranscriptionConfig {
    title?: string;
    description?: string;
    /**
     * Time display format
     */
    timeFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' | 'seconds';
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
    key?: string;
}
