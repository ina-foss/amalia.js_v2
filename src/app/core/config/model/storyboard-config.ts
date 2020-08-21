export interface StoryboardConfig {
    baseUrl: string;
    enableLabel: boolean;
    tcParam?: string;
    tcIntervals?: Array<number>;
    frameIntervals?: Array<number>;
    displayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms';
    theme: 'h'|'v';
}
