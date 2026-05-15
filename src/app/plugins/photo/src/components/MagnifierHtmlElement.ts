import BaseHtmlElement from "../components/BaseHtmlElement";
import {AmaliaPlayerImageData} from "../business/AmaliaPlayerSettings";

export default class MagnifierHtmlElement extends BaseHtmlElement {

    private readonly _callPos: any;

    private readonly _target: HTMLElement;
    private _zoom: number;
    private readonly _originalZoom: number;
    private readonly _maxZoom: number;
    private readonly _imgData: AmaliaPlayerImageData;

    private readonly _moveMagnifierRef: any;
    private readonly _mouseWheelRef: any;

    constructor(targetSelector: string, imgData: AmaliaPlayerImageData, callPos: any, zoom: number = 400, zoomMax: number = 800) {
        super();
        const ratioZoom: number = zoom / 100;
        const ratioZoomMax: number = zoomMax / 100;
        this._originalZoom = imgData.zoomLevel / 100;
        this._zoom = (imgData.zoomLevel * ratioZoom) / 100;
        this._maxZoom = (imgData.zoomLevel * ratioZoomMax) / 100;
        this._imgData = imgData;
        this._callPos = callPos;
        this._target = document.querySelector(targetSelector);
        this.dom = document.createElement('div');
        this.addClass('ajs-photo-magnifier-glass');
        this.dom.style.backgroundImage = "url('" + this._imgData.src + "')";
        this.dom.style.backgroundRepeat = "no-repeat";
        this.resizeBackground();
        const transformStyle: string = this.getTransformStyle();
        if (transformStyle) {
            this.dom.style.transform = transformStyle;
        }
        this._moveMagnifierRef = this.moveMagnifier.bind(this);
        this._mouseWheelRef = this.mouseWheel.bind(this);
        this.dom.addEventListener("mousemove", this._moveMagnifierRef);
        this._target.addEventListener("mousemove", this._moveMagnifierRef);
        this.dom.addEventListener('mousewheel', this._mouseWheelRef);
    }

    private resizeBackground() {
        this.dom.style.backgroundSize = (this._imgData.src_width * this._zoom) + "px " + (this._imgData.src_height * this._zoom) + "px";
    }

    private mouseWheel(event: WheelEvent) {
        const nZoom: number = event.deltaY > 0 ? this._zoom - .1 : this._zoom + .1;
        this._zoom = Math.max(this._originalZoom, nZoom);
        this._zoom = Math.min(this._zoom, this._maxZoom);
        this.resizeBackground();
        this.moveMagnifier(event);

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    }

    private moveMagnifier(event: any) {
        const pos: any = this._callPos(event);
        const glassW: number = this.dom.offsetWidth / 2;
        const glassH: number = this.dom.offsetHeight / 2;
        let mouseX: number = pos.x;
        let mouseY: number = pos.y;

        const targetWidth: number = this._target.offsetWidth;
        const targetHeight: number = this._target.offsetHeight;

        if (mouseX > targetWidth) {
            mouseX = targetWidth;
        }
        if (mouseX < 0) {
            mouseX = 0;
        }
        if (mouseY > targetHeight) {
            mouseY = targetHeight;
        }
        if (mouseY < 0) {
            mouseY = 0;
        }

        const left: number = mouseX - glassW;
        const top: number = mouseY - glassH;
        this.dom.style.left = left.toString() + "px";
        this.dom.style.top = top.toString() + "px";

        this.moveImgMagnifier(mouseX, mouseY);
    }

    private moveImgMagnifier(mouseX: number, mouseY: number) {
        const zoom: number = this._imgData.zoomLevel / 100;
        const imgPos: number[] = this.getImgPos(
            (mouseX - this._imgData.left) / zoom,
            (mouseY - this._imgData.top) / zoom);
        const imgLeft: number = imgPos[0];
        const imgTop: number = imgPos[1];
        this.dom.style.backgroundPosition = imgLeft.toString() + "px " + imgTop.toString() + "px";
    }

    private getImgPos(pLeft: number, pTop: number): number[] {
        const glassW: number = this.dom.offsetWidth / 2;
        const glassH: number = this.dom.offsetHeight / 2;

        const r90: boolean = this._imgData.rotate === 90;
        const r180: boolean = this._imgData.rotate === 180;
        const r270: boolean = this._imgData.rotate === 270;
        const flip: boolean = this._imgData.flip === 1;
        const flop: boolean = this._imgData.flop === 1;

        let srcWidth: number = !r90 && !r270 ? this._imgData.src_width : this._imgData.src_height;
        let srcHeight: number = !r90 && !r270 ? this._imgData.src_height : this._imgData.src_width;

        let imgLeft: number;
        let imgTop: number;
        let iLeft: number = pLeft;
        let iTop: number = pTop;

        if (flip && flop && r180) {
            // no Transformation
        } else if (flip && flop && r90) {
            iLeft = srcHeight - pTop;
            iTop = pLeft;
        } else if (flip && flop && r270) {
            iLeft = pTop;
            iTop = srcWidth - pLeft;
        } else if (flip && r90) {
            iLeft = pTop;
            iTop = pLeft;
        } else if (flip && r180) {
            iLeft = srcWidth - pLeft;
        } else if (flip && r270) {
            iLeft = srcHeight - pTop;
            iTop = srcWidth - pLeft;
        } else if (flop && r90) {
            iLeft = srcHeight - pTop;
            iTop = srcWidth - pLeft;
        } else if (flop && r180) {
            iTop = srcHeight - pTop;
        } else if (flop && r270) {
            iLeft = pTop;
            iTop = pLeft;
        } else if (flip && flop) {
            iLeft = srcWidth - pLeft;
            iTop = srcHeight - pTop;
        } else if (flip) {
            iTop = srcHeight - pTop;
        } else if (flop) {
            iLeft = srcWidth - pLeft;
        } else if (r90) {
            iLeft = pTop;
            iTop = srcWidth - pLeft;
        } else if (r180) {
            iLeft = srcWidth - pLeft;
            iTop = srcHeight - pTop;
        } else if (r270) {
            iLeft = srcHeight - pTop;
            iTop = pLeft;
        }

        imgLeft = -(iLeft * this._zoom) + glassW + 1;
        imgTop = -(iTop * this._zoom) + glassH + 1;

        return [imgLeft, imgTop];
    }

    private getTransformStyle(): string {
        const tStyle: string[] = [];

        const r90: boolean = this._imgData.rotate === 90;
        const r180: boolean = this._imgData.rotate === 180;
        const r270: boolean = this._imgData.rotate === 270;
        const flip: boolean = this._imgData.flip === 1;
        const flop: boolean = this._imgData.flop === 1;

        if (flip && flop && r180) {
            return null;
        } else if (flip && flop && r90) {
            tStyle.push('scaleX(-1)');
            tStyle.push('scaleY(-1)');
        } else if (flip && flop && r270) {
            tStyle.push('scaleX(-1)');
            tStyle.push('scaleY(-1)');
        } else if (flip && r90) {
            tStyle.push('scaleX(-1)');
        } else if (flip && r180) {
            tStyle.push('scaleY(-1)');
        } else if (flip && r270) {
            tStyle.push('scaleX(-1)');
        } else if (flop && r90) {
            tStyle.push('scaleY(-1)');
        } else if (flop && r180) {
            tStyle.push('scaleX(-1)');
        } else if (flop && r270) {
            tStyle.push('scaleY(-1)');
        } else if (flip && flop) {
            tStyle.push('scaleX(-1)');
            tStyle.push('scaleY(-1)');
        } else if (flip) {
            tStyle.push('scaleY(-1)');
        } else if (flop) {
            tStyle.push('scaleX(-1)');
        }

        if (this._imgData.rotate !== null && this._imgData.rotate > 0) {
            tStyle.push('rotate(' + this._imgData.rotate.toString() + 'deg)');
        }
        return tStyle.length > 0 ? tStyle.join(' ') : null;
    }

    public removeFromDom() {
        this.dom.removeEventListener("mousemove", this._moveMagnifierRef);
        this.dom.removeEventListener("mousewheel", this._mouseWheelRef);
        this._target.removeEventListener("mousemove", this._moveMagnifierRef);
        super.removeFromDom();
    }

}

