export interface HistogramConfig {
    withFocus: boolean;
    enableMirror: boolean;
    labels: Array<string>;
    zoomMetadataIdx: Array<number>;
    focusMin: number;
    focusMax: number;
    focusMinOffset:number;
    focusMaxOffset:number;
}
