export interface StoryboardConfig {
    baseUrl: string;
    enableLabel: boolean;
    tcParam?: string;
    tcIntervals?: Array<number>;
    frameIntervals?: Array<number>;
    displayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds';
    theme: 'h'|'v';
    labelSynchro?: string;
    itemPerLine: number;
}
