export interface TranscriptionLocalisation {
    label: string;
    thumb: string;
    text: string;
    tcIn: number;
    tcOut: number;
    subLocalisations?: Array<TranscriptionLocalisation>;
    annotations?: Array<TranscriptionAnnotation>;
    /**
     * Vrai quand ce mot (ou ce segment sans sous-localisations) appartient à une entité nommée
     * du segment. Calculé une fois sur les données par le plugin transcription
     * (`markNamedEntities`) et lu par le template via `[class.named-entity]` : c'est ce qui
     * permet au rendu par-mot différé (`@defer`) de rester différé — la version historique
     * surlignait en `querySelectorAll` et devait donc hydrater tous les segments.
     */
    isNamedEntity?: boolean;
}

export interface TranscriptionAnnotation {
    label: string,
    matchedText: string | string[],
    id: string,
    type: string,
    conceptIdWikidata: string,
    conceptScheme: string
}
