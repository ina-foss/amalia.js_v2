export interface AmaliaPlayerSettings {
    mode: string
    imagesSrc: AmaliaPlayerImageSource[]
    toolbar: any
    showGallery: boolean
    zoomStep?: number
    zoomSteps?: number[]
    zoomMax?: number
    zoomMin?: number
    magnifyValue?: number
    magnifyMaxValue?: number
}

export interface AmaliaPlayerImageSource {
    name: string
    path: string
    thumbPath: string
}

export interface AmaliaPlayerButtonSettings {
    disable?: boolean
    className?: string
    tooltip: string
    tooltip_off?: string
    shortcut: string
}

export interface AmaliaPlayerImageData {
    src: string
    src_width: number
    src_height: number
    left: number
    top: number
    rotate: number
    crop_left: number
    crop_top: number
    crop_width: number
    crop_height: number
    flop: number
    flip: number
    zoomLevel: number
}

export interface AmaliaPlayerCropperWrapperSettings {
    target: HTMLImageElement
    zoomMax: number
    zoomMin: number
}

export interface AmaliaPlayerToolbarSettings {
    close?: AmaliaPlayerButtonSettings
    switch_mode?: AmaliaPlayerButtonSettings
    download?: AmaliaPlayerButtonSettings
    fitToScreen?: AmaliaPlayerButtonSettings
    fullsize?: AmaliaPlayerButtonSettings
    magnify?: AmaliaPlayerButtonSettings
    rotate?: AmaliaPlayerButtonSettings
    fliph?: AmaliaPlayerButtonSettings
    flipv?: AmaliaPlayerButtonSettings
    fullscreen?: AmaliaPlayerButtonSettings
    zoomInfo?: AmaliaPlayerZoomInfoSettings
}

export interface AmaliaPlayerZoomInfoSettings {
    minus?: AmaliaPlayerButtonSettings
    plus?: AmaliaPlayerButtonSettings
    result?: AmaliaPlayerButtonSettings
}

export interface AmaliaPlayerGalleryItem {
    div: HTMLDivElement
    img: HTMLImageElement
}
