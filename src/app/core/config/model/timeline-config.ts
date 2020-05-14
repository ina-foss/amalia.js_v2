export interface TimelineConfig {
    /**
     * Plugin title
     */
    title: string;
    /**
     * True for enable resize plugin
     */
    resizeable: boolean;
    /**
     * True for expend line
     */
    expendable: boolean;
    /**
     * Time format
     */
    timeFormat: 'h' | 'm' | 's' | 'f' | 'ms' | 'mms' | 'seconds';
}
