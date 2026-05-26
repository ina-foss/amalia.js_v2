import {AmaliaPlayerImageSource, AmaliaPlayerSettings} from "../business/AmaliaPlayerSettings";
import Gallery from "./widgets/Gallery";
import Utils from "../business/Utils";
import AmaliaEventConstants from "../business/AmaliaEventConstants";
import BaseHtmlElement from "./BaseHtmlElement";
import PlayerHtmlElement from "./PlayerHtmlElement";

export default class AmaliaPlayer extends BaseHtmlElement{
    private _id: string;
    private _settings: AmaliaPlayerSettings;
    private _cropperComponent: PlayerHtmlElement;
    private _gallery: Gallery;
    private _contentLeft: HTMLDivElement;
    private _contentRight: HTMLDivElement;

    constructor(target: string, settings: AmaliaPlayerSettings) {
        super();
        this._settings = settings;
        this.dom = document.querySelector(target) || document.createElement('div');
        this.dom.className = 'ajs-photo-amalia-photo';
        this._id = this.dom.id = Utils.guid();
        if (this._settings.imagesSrc && this._settings.imagesSrc.length > 0) {
            this.init();
        } else {
            console.error('Gallery empty');
        }
    }

    private getCropperWidth(): number {
        const width: number = this.getOffsetWidth();
        return this._settings.showGallery && this._gallery ? width - this._gallery.getOffsetWidth() : width;
    }

    private init() {
        this.dom.appendChild(this.createCropperComponent());
        if (this._settings.showGallery && this._settings.imagesSrc.length > 1) {
            this.dom.appendChild(this.createGallery());
        }
    }

    private createGallery(): HTMLElement {
        this._contentLeft = document.createElement('div');
        this._contentLeft.className = 'ajs-photo-content-left';
        this._gallery = new Gallery(this._settings.imagesSrc, this.getOffsetHeight());
        this._gallery.addEventListener(Gallery.events.select, this.selectImage.bind(this));
        this._contentLeft.appendChild(this._gallery.getDom());
        return this._contentLeft;
    }

    private selectImage(e: any) {
        this._cropperComponent.replaceSrc(e.detail.imageSrc, e.detail.imageName);
        this.triggerEvent(new CustomEvent(AmaliaEventConstants.select, {
            detail: Utils.mergeDeep({}, e.detail)
        }));
    }

    private createCropperComponent(): HTMLElement {
        this._contentRight = document.createElement('div');
        this._contentRight.className = 'ajs-photo-content-right';

        const selectedIdx: number = this._settings.imagesSrc.findIndex((img) => img.selectedImg === true);
        const settingsForPlayer = selectedIdx > 0
            ? { ...this._settings, imagesSrc: [this._settings.imagesSrc[selectedIdx], ...this._settings.imagesSrc.filter((_, i) => i !== selectedIdx)] }
            : this._settings;

        this._cropperComponent = new PlayerHtmlElement(settingsForPlayer, this);
        this._contentRight.appendChild(this._cropperComponent.getDom());

        return this._contentRight;
    }

    public triggerEvent(event: any) {
        event.detail.player = this;
        this.dom.dispatchEvent(event);
    }

    public addEventListener(event: any, callback: any) {
        this.dom.addEventListener(event, callback);
        return this;
    }

    public toggleFullscreen() {
        this._cropperComponent.fullscreen();
    }

    public zoom() {
        this._cropperComponent.zoom();
    }

    public unZoom() {
        this._cropperComponent.unZoom();
    }

    public showRealSize() {
        this._cropperComponent.showRealSize();
    }

    public flipV() {
        this._cropperComponent.flipV();
    }

    public flipH() {
        this._cropperComponent.flipH();
    }

    public rotate() {
        this._cropperComponent.rotate();
    }

    public magnify() {
        this._cropperComponent.magnify();
    }

    public fitToScreen() {
        this._cropperComponent.fitToScreen();
    }

    public setDisplayState(displayState: string, width: number = null, height: number = null) {
        this.removeClass('ajs-photo-' + this._cropperComponent.getDisplayState());
        const actualWidth = width ?? this.getOffsetWidth();
        const actualHeight = height ?? this.getOffsetHeight();
        
        if (actualWidth > 0) {
            this.dom.style.width = actualWidth.toString() + 'px';
        }
        if (actualHeight > 0) {
            this.dom.style.height = actualHeight.toString() + 'px';
        }
        if (this._contentLeft) {
            this._contentLeft.style.height = actualHeight.toString() + 'px';
            this._gallery.getDom().style.height = actualHeight.toString() + 'px';
        }

        let cwidth: number = this.getCropperWidth();
        let fourImg: string[] = null;
        if (displayState === 'xs') {
            cwidth = this.getOffsetWidth();
            fourImg = this._gallery ? this._gallery.getNextImages(4) : null;
        }

        this._cropperComponent.setDisplayState(displayState, cwidth, this.getOffsetHeight(), fourImg);
        this.addClass('ajs-photo-' + displayState);

        if (this._gallery) {
            this._gallery.setDisplayState(displayState);
            this._gallery.scrollToActive();
        }
    }

    public updateImages(images: AmaliaPlayerImageSource[]) {
        if (!images || images.length === 0) {
            return;
        }
        const existingPaths = new Set((this._settings?.imagesSrc || []).map((img) => img.path));
        const uniqueImages = images.filter((img) => !!img?.path && !existingPaths.has(img.path));
        if (uniqueImages.length === 0) {
            return;
        }
        if (this._settings) {
            this._settings.imagesSrc = (this._settings.imagesSrc || []).concat(uniqueImages);
        }
        if (this._gallery) {
            this._gallery.updateImages(uniqueImages);
        } else if (this._settings?.imagesSrc.length > 1 && this._contentRight) {
            this._settings.showGallery = true;
            this.dom.appendChild(this.createGallery());
            const currentState: string = this.getDisplayState() || 'l';
            this.setDisplayState(currentState);
        }
    }

    public selectImageBySource(imageSrc: string, imageName: string = 'image') {
        if (!imageSrc) {
            return;
        }
        if (this._gallery?.setActiveByImageSrc(imageSrc)) {
            return;
        }
        this._cropperComponent.replaceSrc(imageSrc, imageName);
        this.triggerEvent(new CustomEvent(AmaliaEventConstants.select, {
            detail: {
                imageSrc,
                imageName
            }
        }));
    }

    public getDisplayState(): string {
        return this._cropperComponent.getDisplayState();
    }

    public destroy() {
        this._cropperComponent.removeFromDom();
        this._cropperComponent.destroy();
        if (this._gallery) {
            this._gallery.removeFromDom();
        }
        this.dom.removeAttribute('id');
        this.removeClass('ajs-photo-' + this.getDisplayState());
        while (this.dom.hasChildNodes()) {
            this.dom.removeChild(this.dom.lastChild);
        }
        this._cropperComponent = null;
        this._id = null;
        this._gallery = null;
        this._settings = null;
        this.dom = null;
    }
}
