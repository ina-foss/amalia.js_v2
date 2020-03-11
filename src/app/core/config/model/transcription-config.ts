export interface TranscriptionConfig {
    title?: string;
    description?: string;
    timeFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' | 'seconds';
    fps: number;
    tcDelta?: number;
    karaokeTcDelta?: number;
    autoScroll: boolean;
    parseLevel: number;
    withSubLocalisations: boolean;
}
