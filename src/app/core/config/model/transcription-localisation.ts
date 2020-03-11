export interface TranscriptionLocalisation {
    label: string;
    thumb: string;
    text: string;
    tcIn: number;
    tcOut: number;
    subLocalisations?: Array<TranscriptionLocalisation>;
}
