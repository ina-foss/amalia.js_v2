export interface StoryboardConfig {
    baseUrl: string;
    nbCols?: number;
    tcParam?: string;
    tcDelta?: number;
    displayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms';
}
