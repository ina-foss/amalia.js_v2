export interface AnnotationLocalisation {
    label?: string;
    thumb?: string;
    tcIn: string;
    tcOut: string;
    tc: string;
    categories?: Array<string>;
    description?: string;
    keywords?: Array<string>;
    selected: boolean;
    displayMode: "new" | "edit" | "readonly";
}

export interface AnnotationInfo {
    lastModificationUser?: string;
    creationUser: string;
    idMedia: string;
    id: string,
    label?: string,
    data: Array<AnnotationLocalisation>
}

export interface AnnotationAction {
    type: "validate" | "edit" | "cancel" | "clone" | "remove" | "updatethumbnail";
    payload: AnnotationLocalisation;
}
