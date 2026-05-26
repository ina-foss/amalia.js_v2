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
    private readonly _updateTargetGeometryRef: any;
    private _pendingFrame: number = null;
    private _lastPointerEvent: any = null;
    private _glassHalfWidth: number = 0;
    private _glassHalfHeight: number = 0;
    private _targetWidth: number = 0;
    private _targetHeight: number = 0;
    private _targetRect: DOMRect = null;
    private _targetResizeObserver: ResizeObserver = null;
    private _lastRenderTime: number = 0;
    private _lastRenderedX: number = null;
    private _lastRenderedY: number = null;

    constructor(target: HTMLElement | string, imgData: AmaliaPlayerImageData, callPos: any, zoom: number = 400, zoomMax: number = 800) {
        super();
        const ratioZoom: number = zoom / 100;
        const ratioZoomMax: number = zoomMax / 100;
        this._originalZoom = imgData.zoomLevel / 100;
        this._zoom = (imgData.zoomLevel * ratioZoom) / 100;
        this._maxZoom = (imgData.zoomLevel * ratioZoomMax) / 100;
        this._imgData = imgData;
        this._callPos = callPos;
        this._target = target instanceof HTMLElement ? target : document.querySelector(target);
        this.dom = document.createElement('div');
        this.addClass('ajs-photo-magnifier-glass');
        this.dom.style.backgroundImage = "url('" + this._imgData.src + "')";
        this.dom.style.backgroundRepeat = "no-repeat";
        this.dom.style.willChange = 'left, top, background-position, background-size';
        this.resizeBackground();
        const transformStyle: string = this.getTransformStyle();
        if (transformStyle) {
            this.dom.style.transform = transformStyle;
        }
        this.updateGlassSize();
        this.updateTargetGeometry();
        this._moveMagnifierRef = this.queueMoveMagnifier.bind(this);
        this._mouseWheelRef = this.mouseWheel.bind(this);
        this._target.addEventListener("mousemove", this._moveMagnifierRef);
        this._target.addEventListener('mousewheel', this._mouseWheelRef);
        this._target.addEventListener('wheel', this._mouseWheelRef, { passive: false });
        this._updateTargetGeometryRef = this.updateTargetGeometry.bind(this);
        window.addEventListener('resize', this._updateTargetGeometryRef);
        window.addEventListener('scroll', this._updateTargetGeometryRef, true);
        if (typeof ResizeObserver !== 'undefined') {
            this._targetResizeObserver = new ResizeObserver(() => {
                this.updateTargetGeometry();
            });
            this._targetResizeObserver.observe(this._target);
        }
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

    private queueMoveMagnifier(event: any) {
        this._lastPointerEvent = event;
        if (this._pendingFrame !== null) {
            return;
        }
        this._pendingFrame = requestAnimationFrame((ts: number) => {
            this._pendingFrame = null;
            // Cap rendering rate to reduce expensive background repaint work.
            if (ts - this._lastRenderTime < 24) {
                this.queueMoveMagnifier(this._lastPointerEvent);
                return;
            }
            this._lastRenderTime = ts;
            if (this._lastPointerEvent) {
                this.moveMagnifier(this._lastPointerEvent);
            }
        });
    }

    private updateGlassSize() {
        this._glassHalfWidth = this.dom.offsetWidth / 2;
        this._glassHalfHeight = this.dom.offsetHeight / 2;
    }

    private updateTargetGeometry() {
        this._targetWidth = this._target.offsetWidth;
        this._targetHeight = this._target.offsetHeight;
        this._targetRect = this._target.getBoundingClientRect();
    }

    private getPointerPos(event: any) {
        if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number' && this._targetRect) {
            return {
                x: event.clientX - this._targetRect.left,
                y: event.clientY - this._targetRect.top
            };
        }
        return this._callPos(event);
    }

    private moveMagnifier(event: any) {
        const pos: any = this.getPointerPos(event);
        if (this._glassHalfWidth === 0 || this._glassHalfHeight === 0) {
            this.updateGlassSize();
        }
        const glassW: number = this._glassHalfWidth;
        const glassH: number = this._glassHalfHeight;
        let mouseX: number = pos.x;
        let mouseY: number = pos.y;

        const targetWidth: number = this._targetWidth;
        const targetHeight: number = this._targetHeight;

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

        if (this._lastRenderedX === mouseX && this._lastRenderedY === mouseY) {
            return;
        }
        this._lastRenderedX = mouseX;
        this._lastRenderedY = mouseY;

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
        if (this._glassHalfWidth === 0 || this._glassHalfHeight === 0) {
            this.updateGlassSize();
        }
        const glassW: number = this._glassHalfWidth;
        const glassH: number = this._glassHalfHeight;

        const r90: boolean = this._imgData.rotate === 90;
        const r270: boolean = this._imgData.rotate === 270;

        let srcWidth: number = !r90 && !r270 ? this._imgData.src_width : this._imgData.src_height;
        let srcHeight: number = !r90 && !r270 ? this._imgData.src_height : this._imgData.src_width;

        const [iLeft, iTop] = this.transformCoordinates(pLeft, pTop, srcWidth, srcHeight);

        const imgLeft = -(iLeft * this._zoom) + glassW + 1;
        const imgTop = -(iTop * this._zoom) + glassH + 1;

        return [imgLeft, imgTop];
    }

    private getTransformStyle(): string {
        const scaleTransforms = this.getScaleTransforms();
        if (scaleTransforms === null) {
            return null;
        }

        const tStyle: string[] = [...scaleTransforms];
        if (this._imgData.rotate !== null && this._imgData.rotate > 0) {
            tStyle.push('rotate(' + this._imgData.rotate.toString() + 'deg)');
        }
        return tStyle.length > 0 ? tStyle.join(' ') : null;
    }

    private transformCoordinates(pLeft: number, pTop: number, srcWidth: number, srcHeight: number): [number, number] {
        const rotate = this._imgData.rotate ?? 0;
        const flip = this._imgData.flip === 1;
        const flop = this._imgData.flop === 1;
        const key = `${flip ? 1 : 0}${flop ? 1 : 0}-${rotate}`;

        const transforms: { [key: string]: () => [number, number] } = {
            '11-90': () => [srcHeight - pTop, pLeft],
            '11-270': () => [pTop, srcWidth - pLeft],
            '10-90': () => [pTop, pLeft],
            '10-180': () => [srcWidth - pLeft, pTop],
            '10-270': () => [srcHeight - pTop, srcWidth - pLeft],
            '01-90': () => [srcHeight - pTop, srcWidth - pLeft],
            '01-180': () => [pLeft, srcHeight - pTop],
            '01-270': () => [pTop, pLeft],
            '11-0': () => [srcWidth - pLeft, srcHeight - pTop],
            '10-0': () => [pLeft, srcHeight - pTop],
            '01-0': () => [srcWidth - pLeft, pTop],
            '00-90': () => [pTop, srcWidth - pLeft],
            '00-180': () => [srcWidth - pLeft, srcHeight - pTop],
            '00-270': () => [srcHeight - pTop, pLeft]
        };

        const transform = transforms[key];
        return transform ? transform() : [pLeft, pTop];
    }

    private getScaleTransforms(): string[] | null {
        const rotate = this._imgData.rotate ?? 0;
        const flip = this._imgData.flip === 1;
        const flop = this._imgData.flop === 1;
        const key = `${flip ? 1 : 0}${flop ? 1 : 0}-${rotate}`;

        if (key === '11-180') {
            return null;
        }
        if (key === '11-90' || key === '11-270' || key === '11-0') {
            return ['scaleX(-1)', 'scaleY(-1)'];
        }
        if (key === '10-90' || key === '10-270') {
            return ['scaleX(-1)'];
        }
        if (key === '10-180' || key === '10-0') {
            return ['scaleY(-1)'];
        }
        if (key === '01-90' || key === '01-270') {
            return ['scaleY(-1)'];
        }
        if (key === '01-180' || key === '01-0') {
            return ['scaleX(-1)'];
        }
        return [];
    }

    public removeFromDom() {
        if (this._pendingFrame !== null) {
            cancelAnimationFrame(this._pendingFrame);
            this._pendingFrame = null;
        }
        this._target.removeEventListener("mousemove", this._moveMagnifierRef);
        this._target.removeEventListener("mousewheel", this._mouseWheelRef);
        this._target.removeEventListener("wheel", this._mouseWheelRef);
        window.removeEventListener('resize', this._updateTargetGeometryRef);
        window.removeEventListener('scroll', this._updateTargetGeometryRef, true);
        this._targetResizeObserver?.disconnect();
        super.removeFromDom();
    }

}
