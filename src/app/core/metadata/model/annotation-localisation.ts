export interface AnnotationLocalisation {
    id?: string;
    label?: string;
    thumb?: string;
    tcIn: number;
    tcOut: number;
    tc: number;
    tcOffset?: number;
    data: {
        media?: string;
        linkThumbnail?: string;
        id_media?: string;
        link?: string;
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
        tcThumbnail?: number,
        codeChannel?: string,
        idmChannel?: string,
        idWsmedia?: string,
        idmSet?: string,
        labelChannel?: string,
        itemBusinessIdentifier?: string;
        tcMax?: number;
        category?: string;
        hierarchy_technical_id?: string;
        idDocument?: string;
        typeDocument?: string;
        instanceTitle?: string;
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
    type: "validate" | "edit" | "cancel" | "clone" | "remove" | "updatethumbnail" | "playMedia" | "muteShortCuts" | "unmuteShortCuts" | "openNotilusMaterial";
    payload: AnnotationLocalisation;
}
