export interface TranscriptionLocalisation {
    label: string;
    thumb: string;
    text: string;
    tcIn: number;
    tcOut: number;
    subLocalisations?: Array<TranscriptionLocalisation>;
    annotations?: Array<TranscriptionAnnotation>;
}

export interface TranscriptionAnnotation {
    label: string,
    matchedText: string,
    id: string,
    type: string,
    conceptIdWikidata: string,
    conceptScheme: string
}
