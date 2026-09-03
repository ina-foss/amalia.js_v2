/**
 * Modèle de métadonnées Amalia, internalisé depuis @ina/amalia-model
 * (XSD http://research.ina.fr — seuls les types réellement utilisés par core sont repris).
 */
export enum ActionType {
    AddAll = "add-all",
    DeleteAll = "delete-all",
    ReplaceAll = "replace-all"
}

export interface ViewControl {
    action?: ActionType;
    color?: string;
    parseLevel?: number;
    shape?: string;
}

export type Localisation = {
    [key: string]: any;
}[] | {
    [key: string]: any;
};

export interface Metadata {
    algorithm?: string;
    enrich?: string;
    id: string;
    label?: string;
    processed?: string;
    processor?: string;
    rootDirectory?: string;
    type?: string;
    version?: number;
    data?: {
        [key: string]: any;
    };
    localisation?: Localisation;
    viewControl?: ViewControl;
}
