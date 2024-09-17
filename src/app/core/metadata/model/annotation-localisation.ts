export interface AnnotationLocalisation {
    id?: string;
    label?: string;
    thumb?: string;
    tcIn: number;
    tcOut: number;
    tc: number;
    tcOffset?: number;
    data: {
        lastModificationUser?: string;
        creationUser?: string;
        selected?: boolean;
        displayMode?: "new" | "edit" | "readonly";
        startDate?: Date;
        endDate?: Date;
        startDateParent?: string;
        endDateParent?: string;
        tcInParent?: number;
        tcOutParent?: number;
        tcThumbnail?: string,
        codeChannel?: string,
        idmChannel?: string,
        idWsmedia?: string,
        idmSet?: string,
        labelChannel?: string,
        itemBusinessIdentifier?: string;
        tcMax?: number;
    };
    property?: {
        key: string;
        value: string;
    }[];
    description?: string;
    tclevel?: number;
    subLocalisations?: Array<AnnotationLocalisation>;
}

export interface AnnotationAction {
    type: "validate" | "edit" | "cancel" | "clone" | "remove" | "updatethumbnail";
    payload: AnnotationLocalisation;
}
