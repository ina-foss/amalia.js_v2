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
    id: string,
    label?: string,
    data: Set<AnnotationLocalisation>
}

export interface AnnotationAction {
    type: "validate" | "edit" | "cancel" | "clone" | "remove";
    payload: AnnotationLocalisation;
}
