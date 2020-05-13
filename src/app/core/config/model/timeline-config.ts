export interface TimelineConfig {
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
