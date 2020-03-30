export interface StoryboardConfig {
    baseUrl: string;
    enableLabel: boolean;
    tcParam?: string;
    tcDelta?: number;
    displayFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms';
}
