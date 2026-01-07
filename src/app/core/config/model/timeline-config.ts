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
    timeFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds';
    /**
     * Main metadata ids
     */
    mainMetadataIds: Array<string>;
    /**
     * Main block color
     */
    mainBlockColor: string;
    tcIn?: number;
    duration?: number;
    resourceType?: 'stock' | 'flux';
    /**
     * True for enable tv days
     * Tv Days are enabled when the user is allowed to export the tv Days.
     * This means that the metadata has some Tv program data
     */
    tvDaysEnabled?: boolean;
}
