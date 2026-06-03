import { AmaliaPlayerSettings} from "../business/AmaliaPlayerSettings";
import Utils from "../business/Utils";
import { PlayerEventType } from "../../../core/constant/event-type";
import BaseHtmlElement from "./BaseHtmlElement";
import PlayerHtmlElement from "./PlayerHtmlElement";

export default class AmaliaPlayer extends BaseHtmlElement{
    private _id: string;
    private _settings: AmaliaPlayerSettings;
    private _cropperComponent: PlayerHtmlElement;
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
        return this.getOffsetWidth();
    }

    private init() {
        this.dom.appendChild(this.createCropperComponent());
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
        const parent = this.dom.parentElement as HTMLElement;
        const parentWidth = parent?.offsetWidth ?? 0;
        const parentHeight = parent?.offsetHeight ?? 0;
        const actualWidth = (width ?? parentWidth) || this.getOffsetWidth();
        const actualHeight = (height ?? parentHeight) || this.getOffsetHeight();
        
        if (actualWidth > 0) {
            this.dom.style.width = actualWidth.toString() + 'px';
        }
        if (actualHeight > 0) {
            this.dom.style.height = actualHeight.toString() + 'px';
        }

        const cwidth: number = displayState === 'xs' ? this.getOffsetWidth() : this.getCropperWidth();
        this._cropperComponent.setDisplayState(displayState, cwidth, this.getOffsetHeight(), null);
        this.addClass('ajs-photo-' + displayState);
    }

    public selectImageBySource(imageSrc: string, imageName: string = 'image') {
        if (!imageSrc) {
            return;
        }
        this._cropperComponent.replaceSrc(imageSrc, imageName);
        this.triggerEvent(new CustomEvent(PlayerEventType.PICTURE_SELECT, {
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
        this.dom.removeAttribute('id');
        this.removeClass('ajs-photo-' + this.getDisplayState());
        while (this.dom.hasChildNodes()) {
            this.dom.removeChild(this.dom.lastChild);
        }
        this._cropperComponent = null;
        this._id = null;
        this._settings = null;
        this.dom = null;
    }
}
