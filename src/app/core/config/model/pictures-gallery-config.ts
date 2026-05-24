export interface PicturesGalleryConfig {
    height: number;
    thumbSize: number;
    enableKeyboardNavigation: boolean;
    lazyLoadOffset: number;
}

export interface PicturesGalleryImageSource {
    name: string;
    path: string;
    thumbPath: string;
    resourceRef?: string;
}
