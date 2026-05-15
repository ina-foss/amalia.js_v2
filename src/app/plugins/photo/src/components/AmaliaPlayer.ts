import {AmaliaPlayerSettings} from "../business/AmaliaPlayerSettings";
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
        this.setMode(this._settings.mode);
        return this;
    }

    private getCropperWidth(): number {
        const width: number = this.getOffsetWidth();
        return this._settings.showGallery && this._gallery ? width - this._gallery.getOffsetWidth() : width;
    }

    private init() {
        this.dom.appendChild(this.createCropperComponent());
        if (this._settings.showGallery) {
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

        this._cropperComponent = new PlayerHtmlElement(this._settings, this);
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

    public setMode(mode: string = 'standard', width: number = null, height: number = null) {
        this.removeClass('ajs-photo-' + this._cropperComponent.getMode());
        if (width) {
            this.dom.style.width = width.toString() + 'px';
        }
        if (height) {
            this.dom.style.height = height.toString() + 'px';
            if (this._contentLeft) {
                this._contentLeft.style.height = height.toString() + 'px';
                this._gallery.getDom().style.height = height.toString() + 'px';
            }
        }

        let cwidth: number = this.getCropperWidth();
        let fourImg: string[] = null;
        if (mode === 'reduced') {
            cwidth = this.getOffsetWidth();
            fourImg = this._gallery ? this._gallery.getNextImages(4) : null;
        }

        this._cropperComponent.setMode(mode, cwidth, this.getOffsetHeight(), fourImg);
        this.addClass('ajs-photo-' + mode);

        if (this._gallery) {
            this._gallery.setMode(mode);
            this._gallery.scrollToActive();
        }
    }

    public getMode(): string {
        return this._cropperComponent.getMode();
    }

    public destroy() {
        this._cropperComponent.removeFromDom();
        this._cropperComponent.destroy();
        if (this._gallery) {
            this._gallery.removeFromDom();
        }
        this.dom.removeAttribute('id');
        this.removeClass('ajs-photo-' + this.getMode());
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

