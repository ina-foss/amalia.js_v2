import BaseHtmlElement from "../components/BaseHtmlElement";
import {AmaliaPlayerImageData} from "../business/AmaliaPlayerSettings";

export default class MagnifierHtmlElement extends BaseHtmlElement {

    private readonly _callPos: any;
    private readonly _target: HTMLElement;
    private _zoom: number;
    private readonly _originalZoom: number;
    private readonly _maxZoom: number;
    private _imgData: AmaliaPlayerImageData;

    private readonly _queueMoveMagnifierRef: any;
    private readonly _mouseWheelRef: any;
    private readonly _updateRectRef: any;

    private _glassHalfW: number = 0;
    private _glassHalfH: number = 0;
    private _targetW: number = 0;
    private _targetH: number = 0;
    private _targetRect: DOMRect | null = null;
    private _glassParentRect: DOMRect | null = null;
    private _pendingFrame: number | null = null;
    private _lastPointerEvent: any = null;
    private _lastRenderedX: number | null = null;
    private _lastRenderedY: number | null = null;
    private _targetZoom: number;
    private _zoomAnimFrame: number | null = null;

    constructor(target: HTMLElement | string, imgData: AmaliaPlayerImageData, callPos: any, zoom: number = 400, zoomMax: number = 800) {
        super();
        const ratioZoom: number = zoom / 100;
        const ratioZoomMax: number = zoomMax / 100;
        this._originalZoom = imgData.zoomLevel / 100;
        this._zoom = (imgData.zoomLevel * ratioZoom) / 100;
        this._maxZoom = (imgData.zoomLevel * ratioZoomMax) / 100;
        this._targetZoom = this._zoom;
        this._imgData = imgData;
        this._callPos = callPos;
        this._target = (target instanceof HTMLElement ? target : document.querySelector<HTMLElement>(target)) as HTMLElement;
        this.dom = document.createElement('div');
        this.addClass('ajs-photo-magnifier-glass');
        this.dom.style.backgroundImage = "url('" + this._imgData.src + "')";
        this.dom.style.backgroundRepeat = "no-repeat";
        this.dom.style.willChange = 'left, top, background-position, background-size';
        this.resizeBackground();
        const transformStyle: string | null = this.getTransformStyle();
        if (transformStyle) {
            this.dom.style.transform = transformStyle;
        }
        this.updateRect();
        this._queueMoveMagnifierRef = this.queueMoveMagnifier.bind(this);
        this._mouseWheelRef = this.mouseWheel.bind(this);
        this._updateRectRef = this.updateRect.bind(this);
        window.addEventListener("mousemove", this._queueMoveMagnifierRef, true);
        this._target.addEventListener('mousewheel', this._mouseWheelRef, { passive: false });
        this._target.addEventListener('wheel', this._mouseWheelRef, { passive: false });
        window.addEventListener('wheel', this._mouseWheelRef, { passive: false, capture: true });
        window.addEventListener('resize', this._updateRectRef);
        window.addEventListener('scroll', this._updateRectRef, true);
    }

    private updateRect() {
        this._targetW = this._target.offsetWidth;
        this._targetH = this._target.offsetHeight;
        this._targetRect = this._target.getBoundingClientRect();
        this._glassParentRect = null;
        this._glassHalfW = 0;
        this._glassHalfH = 0;
    }

    private getGlassHalfW(): number {
        if (!this._glassHalfW) { this._glassHalfW = this.dom.offsetWidth / 2; }
        return this._glassHalfW;
    }

    private getGlassHalfH(): number {
        if (!this._glassHalfH) { this._glassHalfH = this.dom.offsetHeight / 2; }
        return this._glassHalfH;
    }

    private getGlassParentRect(): DOMRect {
        if (!this._glassParentRect) {
            this._glassParentRect = this.dom.parentElement
                ? this.dom.parentElement.getBoundingClientRect()
                : this._targetRect ?? this._target.getBoundingClientRect();
        }
        return this._glassParentRect;
    }

    private resizeBackground() {
        this.dom.style.backgroundSize = (this._imgData.src_width * this._zoom) + "px " + (this._imgData.src_height * this._zoom) + "px";
    }

    private mouseWheel(event: WheelEvent) {
        // Proportional step: 6% of current target zoom per scroll tick for smooth scaling
        const delta = event.deltaY > 0 ? -1 : 1;
        const step = this._targetZoom * 0.06;
        const nZoom = this._targetZoom + delta * step;
        this._targetZoom = Math.max(this._originalZoom, Math.min(nZoom, this._maxZoom));
        this.scheduleZoomAnimation();
        this.queueMoveMagnifier(event);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    }

    private scheduleZoomAnimation(): void {
        if (this._zoomAnimFrame !== null) { return; }
        this._zoomAnimFrame = requestAnimationFrame(() => this.animateZoom());
    }

    private animateZoom(): void {
        this._zoomAnimFrame = null;
        const diff = this._targetZoom - this._zoom;
        if (Math.abs(diff) < 0.001) {
            this._zoom = this._targetZoom;
            this.resizeBackground();
            if (this._lastPointerEvent) { this.moveMagnifier(this._lastPointerEvent); }
            return;
        }
        // Ease-out: move 25% of remaining distance per frame (~16 ms at 60 fps)
        this._zoom += diff * 0.25;
        this.resizeBackground();
        if (this._lastPointerEvent) { this.moveMagnifier(this._lastPointerEvent); }
        this._zoomAnimFrame = requestAnimationFrame(() => this.animateZoom());
    }

    private queueMoveMagnifier(event: any) {
        this._lastPointerEvent = event;
        if (this._pendingFrame !== null) {
            return;
        }
        this._pendingFrame = requestAnimationFrame(() => {
            this._pendingFrame = null;
            if (this._lastPointerEvent) {
                this.moveMagnifier(this._lastPointerEvent);
            }
        });
    }

    private getContainerPos(event: any): { x: number, y: number } {
        if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
            if (!this._targetRect) {
                this._targetRect = this._target.getBoundingClientRect();
            }
            return {
                x: event.clientX - this._targetRect.left,
                y: event.clientY - this._targetRect.top
            };
        }
        return this._callPos(event);
    }

    private moveMagnifier(event: any) {
        // pos is relative to .cropper-container — correct for background calculation
        const pos: { x: number, y: number } = this.getContainerPos(event);
        const glassW: number = this.getGlassHalfW();
        const glassH: number = this.getGlassHalfH();

        const targetWidth: number = this._targetW || this._target.offsetWidth;
        const targetHeight: number = this._targetH || this._target.offsetHeight;

        // bgX/bgY: clamped container-relative coords for background calculation
        const bgX: number = Math.max(0, Math.min(pos.x, targetWidth));
        const bgY: number = Math.max(0, Math.min(pos.y, targetHeight));

        // Do not skip background recalculation: zoom animation changes background
        // even when mouse coordinates are stable.
        if (this._lastRenderedX !== bgX || this._lastRenderedY !== bgY) {
            this._lastRenderedX = bgX;
            this._lastRenderedY = bgY;

            // glassX/glassY: convert to glass-parent-relative coords for positioning
            const targetRect: DOMRect = this._targetRect ?? this._target.getBoundingClientRect();
            const parentRect: DOMRect = this.getGlassParentRect();
            const offsetX: number = targetRect.left - parentRect.left;
            const offsetY: number = targetRect.top - parentRect.top;

            this.dom.style.left = (bgX + offsetX - glassW).toString() + "px";
            this.dom.style.top = (bgY + offsetY - glassH).toString() + "px";
        }
        this.moveImgMagnifier(bgX, bgY);
    }

    private moveImgMagnifier(mouseX: number, mouseY: number) {
        const zoom: number = this._imgData.zoomLevel / 100;
        const imgPos: number[] = this.getImgPos(
            (mouseX - this._imgData.left) / zoom,
            (mouseY - this._imgData.top) / zoom);
        this.dom.style.backgroundPosition = imgPos[0].toString() + "px " + imgPos[1].toString() + "px";
    }

    private getImgPos(pLeft: number, pTop: number): number[] {
        const glassW: number = this.getGlassHalfW();
        const glassH: number = this.getGlassHalfH();

        const r90: boolean = this._imgData.rotate === 90;
        const r270: boolean = this._imgData.rotate === 270;
        const srcWidth: number = !r90 && !r270 ? this._imgData.src_width : this._imgData.src_height;
        const srcHeight: number = !r90 && !r270 ? this._imgData.src_height : this._imgData.src_width;

        const [iLeft, iTop] = this.transformCoordinates(pLeft, pTop, srcWidth, srcHeight);

        return [-(iLeft * this._zoom) + glassW + 1, -(iTop * this._zoom) + glassH + 1];
    }

    private transformCoordinates(pLeft: number, pTop: number, srcWidth: number, srcHeight: number): [number, number] {
        const rotate = this._imgData.rotate ?? 0;
        const flip = this._imgData.flip === 1;
        const flop = this._imgData.flop === 1;
        const key = `${flip ? 1 : 0}${flop ? 1 : 0}-${rotate}`;

        const transforms: { [key: string]: () => [number, number] } = {
            '11-90':  () => [srcHeight - pTop, pLeft],
            '11-270': () => [pTop, srcWidth - pLeft],
            '10-90':  () => [pTop, pLeft],
            '10-180': () => [srcWidth - pLeft, pTop],
            '10-270': () => [srcHeight - pTop, srcWidth - pLeft],
            '01-90':  () => [srcHeight - pTop, srcWidth - pLeft],
            '01-180': () => [pLeft, srcHeight - pTop],
            '01-270': () => [pTop, pLeft],
            '11-0':   () => [srcWidth - pLeft, srcHeight - pTop],
            '10-0':   () => [pLeft, srcHeight - pTop],
            '01-0':   () => [srcWidth - pLeft, pTop],
            '00-90':  () => [pTop, srcWidth - pLeft],
            '00-180': () => [srcWidth - pLeft, srcHeight - pTop],
            '00-270': () => [srcHeight - pTop, pLeft]
        };

        const transform = transforms[key];
        return transform ? transform() : [pLeft, pTop];
    }

    private getTransformStyle(): string | null {
        const scaleTransforms = this.getScaleTransforms();
        if (scaleTransforms === null) {
            return null;
        }
        const rotate = this._imgData.rotate ?? 0;
        const tStyle: string[] = [...scaleTransforms];
        if (rotate > 0) { tStyle.push('rotate(' + rotate.toString() + 'deg)'); }
        return tStyle.length > 0 ? tStyle.join(' ') : null;
    }

    private getScaleTransforms(): string[] | null {
        const rotate = this._imgData.rotate ?? 0;
        const flip = this._imgData.flip === 1;
        const flop = this._imgData.flop === 1;
        const key = `${flip ? 1 : 0}${flop ? 1 : 0}-${rotate}`;

        if (key === '11-180') { return null; }

        const scaleMap: { [k: string]: string[] } = {
            '11-90': ['scaleX(-1)', 'scaleY(-1)'], '11-270': ['scaleX(-1)', 'scaleY(-1)'], '11-0': ['scaleX(-1)', 'scaleY(-1)'],
            '10-90': ['scaleX(-1)'], '10-270': ['scaleX(-1)'],
            '10-180': ['scaleY(-1)'], '10-0': ['scaleY(-1)'],
            '01-90': ['scaleY(-1)'], '01-270': ['scaleY(-1)'],
            '01-180': ['scaleX(-1)'], '01-0': ['scaleX(-1)']
        };
        return scaleMap[key] ?? [];
    }

    public updateImageData(data: AmaliaPlayerImageData): void {
        this._imgData = data;
        this._lastRenderedX = null;
        this._lastRenderedY = null;
        if (this._lastPointerEvent) {
            this.moveMagnifier(this._lastPointerEvent);
        }
    }

    public override removeFromDom() {
        if (this._pendingFrame !== null) {
            cancelAnimationFrame(this._pendingFrame);
            this._pendingFrame = null;
        }
        if (this._zoomAnimFrame !== null) {
            cancelAnimationFrame(this._zoomAnimFrame);
            this._zoomAnimFrame = null;
        }
        window.removeEventListener("mousemove", this._queueMoveMagnifierRef, true);
        this._target.removeEventListener("mousewheel", this._mouseWheelRef);
        this._target.removeEventListener("wheel", this._mouseWheelRef);
        window.removeEventListener("wheel", this._mouseWheelRef, true);
        window.removeEventListener('resize', this._updateRectRef);
        window.removeEventListener('scroll', this._updateRectRef, true);
        super.removeFromDom();
    }
}
