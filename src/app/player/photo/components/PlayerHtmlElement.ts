import BaseHtmlElement from "./BaseHtmlElement";
import {
    AmaliaPlayerImageData,
    AmaliaPlayerImageSource, AmaliaPlayerSettings, AmaliaPlayerToolbarSettings
} from "../business/AmaliaPlayerSettings";
import CropperWrapper from "../business/CropperWrapper";
import { PlayerEventType } from "../../../core/constant/event-type";
import IncrementInfo from "./widgets/IncrementInfo";
import AmaliaPlayer from "./AmaliaPlayer";
import Utils from "../business/Utils";
import MagnifierHtmlElement from "./MagnifierHtmlElement";
import AnnotationCanvas from "../business/AnnotationCanvas";

export default class PlayerHtmlElement extends BaseHtmlElement {

    private readonly _image: HTMLImageElement;
    private readonly _zoomMax: number = 300;
    private readonly _zoomMin: number = 10;
    private readonly _zoomStep: number = 25;
    private readonly _zoomSteps: number[] = null;
    private readonly _magnifyValue: number = 400;
    private readonly _magnifyMaxValue: number = 800;
    private readonly _playerInstance: AmaliaPlayer;
    private readonly _escapeMagnifyRef: any;
    private readonly _fullscreenChangeRef: any;
    private readonly _preventContextMenuRef: any;

    private _hideControlTimeout: any;
    private _hideEventsAdded: boolean = false;
    private _createCropperTimeout: any = null;
    private _blockControlTimeout: boolean = false;
    private _isInFullscreen: boolean = false;
    private _cropperReadyRef: any = null;
    private _cropperZoomRef: any = null;
    private _cropperMoveRef: any = null;
    private _topBar: HTMLDivElement;
    private _toolBar: HTMLDivElement;
    private _titleBox: HTMLDivElement;
    private _zoomInfo: IncrementInfo;
    private _cropperWrapper: CropperWrapper;
    private _isFullscreen: boolean = false;
    private _imagePath: string;
    private _retryWithoutCorsForSrc: string = null;
    private readonly _imageLoadRef: any;
    private readonly _imageErrorRef: any;

    private readonly _availableDisplayStates: string[] = ['xs', 's', 'sm', 'm', 'l'];
    private _displayState: string;
    private _width: number;
    private _height: number;

    // Set to true when the user manually adjusts zoom; prevents fitToCanvas() from
    // overriding the user-set level when PLAYER_RESIZED fires via ResizeObserver.
    private _manualZoom: boolean = false;

    private _magnify: boolean = false;
    private _magnifier: MagnifierHtmlElement;

    private readonly _toolbarSettings: AmaliaPlayerToolbarSettings;
    private _annotationCanvas: AnnotationCanvas;
    private _isAnnotationMode: boolean = false;

    constructor(setting: AmaliaPlayerSettings, playerInstance: AmaliaPlayer) {
        super();
        this._zoomMax = setting.zoomMax ?? 300;
        this._zoomMin = setting.zoomMin ?? 10;
        this._zoomStep = setting.zoomStep ?? 25;
        this._zoomSteps = setting.zoomSteps ?? null;
        this._magnifyValue = setting.magnifyValue ?? 400;
        this._magnifyMaxValue = setting.magnifyMaxValue ?? 800;
        this._toolbarSettings = Utils.mergeDeep({}, this._toolbarSettings, setting.toolbar);
        this._playerInstance = playerInstance;
        this.dom = document.createElement('div');
        this.dom.className = 'ajs-photo-cropper-content';

        const imgSetting: AmaliaPlayerImageSource = setting.imagesSrc[0];
        this._imagePath = imgSetting.path;


        this._image = document.createElement('img');
        this._imageLoadRef = this.onImageLoad.bind(this);
        this._imageErrorRef = this.onImageError.bind(this);
        this._image.addEventListener('load', this._imageLoadRef);
        this._image.addEventListener('error', this._imageErrorRef);
        this.setImageSource(this._imagePath);

        this.dom.appendChild(this._image);
        if (!setting.noTopbar) {
            const topBar = this.createTopbar();
            this.setTitle(imgSetting.name);
            this.dom.appendChild(topBar);
        }
        if (!setting.noToolbar) {
            const toolbar = this.createToolbar();
            this.dom.appendChild(toolbar);
        }

        this._escapeMagnifyRef = this.escapeMagnify.bind(this);
        this._fullscreenChangeRef = this.handleFullscreenChange.bind(this);
        this._preventContextMenuRef = this.preventContextMenu.bind(this);
        this.dom.addEventListener('fullscreenchange', this._fullscreenChangeRef);
        this.addHideEvents();
        this.attachContextMenuBlockers();
    }

    private preventContextMenu(event: MouseEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }

    private attachContextMenuBlockers(): void {
        this.dom.addEventListener('contextmenu', this._preventContextMenuRef);
        const cropperContainer = this.dom.querySelector<HTMLElement>('.cropper-container');
        cropperContainer?.addEventListener('contextmenu', this._preventContextMenuRef);
    }

    private handleFullscreenChange(): void {
        if (!this._cropperWrapper?.getImageData()) {
            return;
        }
        setTimeout(() => {
            if (!this._cropperWrapper) {
                return;
            }
            this._cropperWrapper.fitToCanvas();
            if (this._magnify) {
                this.refreshMagnifier();
            }
        }, 150);
    }

    private shouldUseAnonymousCrossOrigin(imageSrc: string): boolean {
        if (!imageSrc) {
            return false;
        }
        if (/^(data:|blob:|file:)/i.test(imageSrc)) {
            return false;
        }
        try {
            const resolved = new URL(imageSrc, window.location.href);
            return resolved.origin !== window.location.origin;
        } catch {
            return false;
        }
    }

    private setImageSource(imageSrc: string): void {
        this._imagePath = imageSrc;
        this._retryWithoutCorsForSrc = null;
        if (this.shouldUseAnonymousCrossOrigin(imageSrc)) {
            this._image.crossOrigin = 'anonymous';
        } else {
            this._image.removeAttribute('crossorigin');
        }
        this._image.src = imageSrc;
    }

    private onImageError(): void {
        const currentSrc = this._imagePath;
        if (!currentSrc) {
            return;
        }
        if (!this._image.getAttribute('crossorigin')) {
            return;
        }
        if (this._retryWithoutCorsForSrc === currentSrc) {
            return;
        }
        this._retryWithoutCorsForSrc = currentSrc;
        this._image.removeAttribute('crossorigin');
        this._image.src = '';
        this._image.src = currentSrc;
    }

    private onImageLoad(): void {
        if (!['sm', 'm', 'l'].includes(this._displayState)) {
            return;
        }
        if (!this._cropperWrapper) {
            this.createCropperInstance();
        }
    }

    public setTitle(title: string) {
        if (this._titleBox) {
            this._titleBox.textContent = Utils.truncate(title);
        }
    }

    private createTopbar(): HTMLElement {
        this._topBar = document.createElement('div');
        this._topBar.className = 'ajs-photo-top-box';

        this._titleBox = document.createElement('div');
        this._titleBox.className = 'ajs-photo-top-middle';
        this._topBar.appendChild(this._titleBox);

        return this._topBar;
    }

    private createToolbar(): HTMLElement {
        this._toolBar = document.createElement('div');
        this._toolBar.className = 'ajs-photo-toolbar';
        const left = this.createLeftAreaToolBar();
        this._toolBar.appendChild(left);
        const middle = this.createMiddleAreaToolBar();
        this._toolBar.appendChild(middle);
        const right = this.createRightAreaToolbar();
        this._toolBar.appendChild(right);
        return this._toolBar;
    }

    private createLeftAreaToolBar(): HTMLElement {
        const left = document.createElement('div');
        left.className = 'ajs-photo-toolbar-left';
        return left;
    }

    private createMiddleAreaToolBar(): HTMLElement {
        const middle = document.createElement('div');
        middle.className = 'ajs-photo-toolbar-middle';

        this._zoomInfo = new IncrementInfo(this._zoomStep, this._zoomSteps, this._zoomMin, this._zoomMax, this._toolbarSettings.zoomInfo)
            .addEventListener(IncrementInfo.events.change, this.eventZoom.bind(this));

        middle.appendChild(this._zoomInfo.getDom());
        return middle;
    }

    private createRightAreaToolbar(): HTMLElement {
        const right = document.createElement('div');
        right.className = 'ajs-photo-toolbar-right';
        return right;
    }

    private _showControlsRef: any;
    private _blockControlsRef: any;
    private _releaseControlsRef: any;

    private addHideEvents() {
        if (this._hideEventsAdded) {
            return;
        }
        if (!this._showControlsRef) {
            this._showControlsRef = this.showControls.bind(this);
        }
        if (!this._blockControlsRef) {
            this._blockControlsRef = this.blockControls.bind(this);
        }
        if (!this._releaseControlsRef) {
            this._releaseControlsRef = this.releaseControls.bind(this);
        }
        this.dom.addEventListener('mousemove', this._showControlsRef);
        this._topBar?.addEventListener('mouseenter', this._blockControlsRef);
        this._topBar?.addEventListener('mouseleave', this._releaseControlsRef);
        this._toolBar?.addEventListener('mouseenter', this._blockControlsRef);
        this._toolBar?.addEventListener('mouseleave', this._releaseControlsRef);

        this.resetHideControlTimeout();
        this._hideEventsAdded = true;
    }

    private removeHideEvents() {
        this._hideEventsAdded = false;
        this._blockControlTimeout = false;
        this.dom.removeEventListener('mousemove', this._showControlsRef);
        this._topBar?.removeEventListener('mouseenter', this._blockControlsRef);
        this._topBar?.removeEventListener('mouseleave', this._releaseControlsRef);
        this._toolBar?.removeEventListener('mouseenter', this._blockControlsRef);
        this._toolBar?.removeEventListener('mouseleave', this._releaseControlsRef);
        clearTimeout(this._hideControlTimeout);
    }

    private blockControls() {
        this.showControls();
        clearTimeout(this._hideControlTimeout);
        this._blockControlTimeout = true;
    }

    private releaseControls() {
        this._blockControlTimeout = false;
        this.showControls();
    }

    private showControls() {
        if (this._displayState !== 'xs' && this._toolBar) {
            this._toolBar.style.display = 'block';
        }
        if (this._topBar) {
            this._topBar.style.display = 'block';
        }
        this.resetHideControlTimeout();
    }

    private hideControls() {
        if (!this._blockControlTimeout) {
            if (this._toolBar) {
                this._toolBar.style.display = 'none';
            }
            if (this._topBar) {
                this._topBar.style.display = 'none';
            }
        }
    }

    private resetHideControlTimeout() {
        if (this._hideControlTimeout) {
            clearTimeout(this._hideControlTimeout);
        }
        this._hideControlTimeout = setTimeout(this.hideControls.bind(this), 3000);
    }

    private eventFitToScreen() {
        if (!this._cropperWrapper) {
            return;
        }
        this._manualZoom = false;
        this._cropperWrapper.fitToCanvas();
        this.triggerEvent(PlayerEventType.PICTURE_FIT_TO_SCREEN, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFullSize() {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.fitToOrignalSize();
        this.triggerEvent(PlayerEventType.PICTURE_FULL_SIZE, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventDownload() {
        this.triggerEvent(PlayerEventType.PICTURE_DOWNLOAD, {
            imageData: this._cropperWrapper?.getImageData()
        });
        this.showControls();
    }

    private recreateCropper(): void {
        if (this._cropperWrapper) {
            this._cropperWrapper.destroy();
            this._cropperWrapper = null;
        }
        this._image.style.display = '';
        this.createCropperInstance();
        this._zoomInfo?.show();
        this.showControls();
    }

    private eventFullscreen() {
        if (document.fullscreenElement) {
            this._isFullscreen = false;
            document.exitFullscreen().then(() => {
                this._isInFullscreen = false;
                if (this._width > 0) { this.dom.style.width = this._width + 'px'; }
                if (this._height > 0) { this.dom.style.height = this._height + 'px'; }
                this.recreateCropper();
                this.triggerEvent(PlayerEventType.PICTURE_FULLSCREEN);
            }).catch(() => {
                this._isInFullscreen = false;
            });
        } else {
            this._isFullscreen = true;
            this._isInFullscreen = true;
            this.dom.style.width = '';
            this.dom.style.height = '';
            this.dom.requestFullscreen().then(() => {
                setTimeout(() => {
                    this.recreateCropper();
                }, 300);
                this.triggerEvent(PlayerEventType.PICTURE_FULLSCREEN);
                this.showControls();
            }).catch(() => {
                this._isInFullscreen = false;
                if (this._width > 0) { this.dom.style.width = this._width + 'px'; }
                if (this._height > 0) { this.dom.style.height = this._height + 'px'; }
            });
        }
    }

    private eventMagnify() {
        this._magnify = !this._magnify;
        if (this._magnify) {
            this.enableMagnify();
        } else {
            this.disableMagnify();
        }
        this.triggerEvent(PlayerEventType.PICTURE_MAGNIFY, {
            magnify: this._magnify
        });
    }

    private enableMagnify() {
        this.removeHideEvents();
        this._zoomInfo?.disable();
        if (!this._cropperWrapper) {
            return;
        }
        const imgData: AmaliaPlayerImageData = this._cropperWrapper.getImageData();
        if (!imgData) {
            return;
        }
        const cropperContainer = this.dom.querySelector<HTMLElement>('.cropper-container');
        if (!cropperContainer) {
            return;
        }
        this._magnifier?.removeFromDom();
        this._magnifier = new MagnifierHtmlElement(
            cropperContainer,
            imgData,
            this.getCropperImgPos.bind(this),
            this._magnifyValue,
            this._magnifyMaxValue);
        this.dom.prepend(this._magnifier.getDom());
        this.addClass('ajs-photo-magnify');
        document.removeEventListener('keyup', this._escapeMagnifyRef);
        document.addEventListener('keyup', this._escapeMagnifyRef);
    }

    private escapeMagnify(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.eventMagnify();
            this.disableMagnify();
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
    }

    private disableMagnify() {
        this.removeClass('ajs-photo-magnify');
        this._magnifier?.removeFromDom();
        this.addHideEvents();
        this._zoomInfo?.enable();
        this.showControls();
        document.removeEventListener('keyup', this._escapeMagnifyRef);
    }

    private getCropperImgPos(e: any) {
        const clientRect = this.dom.getBoundingClientRect();
        return {
            x: e.clientX - clientRect.left,
            y: e.clientY - clientRect.top
        };
    }

    private eventZoom(e: CustomEvent) {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.zoom(e.detail.value);
        if (e.detail.hasOwnProperty('center') && e.detail.center) {
            this._cropperWrapper.center();
        }
        this.showControls();
    }

    private eventRotate() {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.rotate(90);
        this.triggerEvent(PlayerEventType.PICTURE_ROTATE, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFlipH() {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.flipHorizontally();
        this.triggerEvent(PlayerEventType.PICTURE_FLIP_HORIZONTALLY, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFlipV() {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.flipVertically();
        this.triggerEvent(PlayerEventType.PICTURE_FLIP_VERTICALLY, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventClose() {
        this.triggerEvent(PlayerEventType.PICTURE_CLOSE);
        this.showControls();
    }

    private triggerEvent(eventName: string, data: any = {}) {
        this._playerInstance.triggerEvent(new CustomEvent(eventName, {
            detail: Utils.mergeDeep({}, {
                isFullscreen: this._isFullscreen,
                displayState: this._displayState
            }, data)
        }));
    }

    private displayReducedGallery(fourImg: string[]) {
        const dual: boolean = fourImg.length === 2;
        const className: string = dual ? 'ajs-photo-vx2' : 'ajs-photo-vx4';
        const height: number = dual ? this._height : this._height / 2;
        const width: number = this._width / 2;
        const reversedImages = [...fourImg].reverse();
        reversedImages.forEach((src: string) => {
            const div: HTMLDivElement = document.createElement('div');
            div.style.width = width.toString() + 'px';
            div.style.height = height.toString() + 'px';
            div.className = 'ajs-photo-reduced-view ' + className;
            const img: HTMLImageElement = document.createElement('img');
            img.src = src;
            img.style.maxWidth = width.toString() + 'px';
            img.style.maxHeight = height.toString() + 'px';
            div.appendChild(img);
            this.dom.prepend(div);
        });
    }

    private destroyReducedGallery() {
        this.dom.querySelectorAll('div.ajs-photo-reduced-view').forEach((el: Element) => {
            el.remove();
        });
    }

    public setDisplayState(displayState: string, width: number = null, height: number = null, fourImg: string[] = null) {
        if (this._isInFullscreen) {
            return;
        }
        if (!Utils.inArray(displayState, this._availableDisplayStates)) {
            return;
        }
        const sameDisplayState = this._displayState === displayState;
        if (sameDisplayState && ['sm', 'm', 'l'].includes(displayState) && this._cropperWrapper) {
            this.updateContainerDimensions(width, height);
            if (this._manualZoom) {
                // Container may have resized; preserve user zoom, only reposition.
                this._cropperWrapper.center();
            } else {
                this._cropperWrapper.fitToCanvas();
            }
            if (this._magnify) {
                this.refreshMagnifier();
            }
            this.showControls();
            return;
        }
        this.updateContainerDimensions(width, height);
        this.resetDisplayContent();

        switch (displayState) {
            case 'xs':
                this.applyExtraSmallDisplayState(fourImg);
                break;
            case 's':
                this.applySmallDisplayState();
                break;
            case 'sm':
            case 'm':
            case 'l':
                this.applyMediumToLargeDisplayState();
                break;
            default:
                return;
        }
        this._displayState = displayState;
    }

    private refreshMagnifier() {
        this._magnifier?.removeFromDom();
        const imgData: AmaliaPlayerImageData = this._cropperWrapper?.getImageData();
        const cropperContainer = this.dom.querySelector<HTMLElement>('.cropper-container');
        if (!imgData || !cropperContainer) {
            return;
        }
        this._magnifier = new MagnifierHtmlElement(
            cropperContainer,
            imgData,
            this.getCropperImgPos.bind(this),
            this._magnifyValue,
            this._magnifyMaxValue
        );
        this.dom.prepend(this._magnifier.getDom());
    }

    private updateContainerDimensions(width: number | null, height: number | null): void {
        if (width !== null) {
            this._width = width;
            if (!this._isInFullscreen) {
                this.dom.style.width = width.toString() + 'px';
            }
        }
        if (height !== null) {
            this._height = height;
            if (!this._isInFullscreen) {
                this.dom.style.height = height.toString() + 'px';
            }
        }
    }

    private resetDisplayContent(): void {
        this._manualZoom = false;
        if (this._createCropperTimeout) {
            clearTimeout(this._createCropperTimeout);
            this._createCropperTimeout = null;
        }
        if (this._cropperWrapper) {
            this._cropperWrapper.destroy();
            this._cropperWrapper = null;
        }
        this.destroyReducedGallery();
        this._image.style.display = '';
        this.setImageSource(this._imagePath);
    }

    private applyExtraSmallDisplayState(fourImg: string[] | null): void {
        this.setTitleVisibility('hidden');
        this.setToolbarDisplay('none');
        if (fourImg) {
            this._image.style.display = 'none';
            this.displayReducedGallery(fourImg);
            return;
        }
        this._image.style.display = 'block';
    }

    private applySmallDisplayState(): void {
        this._zoomInfo?.hide();
        this.setTitleVisibility('hidden');
        this.setToolbarDisplay('block');
        this._image.style.display = 'block';
        this.triggerEvent(PlayerEventType.PICTURE_READY);
    }

    private applyMediumToLargeDisplayState(): void {
        this._zoomInfo?.show();
        this.setTitleVisibility('visible');
        this.createCropperInstance();
    }

    private setTitleVisibility(visibility: 'hidden' | 'visible'): void {
        if (this._titleBox) {
            this._titleBox.style.visibility = visibility;
        }
    }

    private setToolbarDisplay(display: 'none' | 'block'): void {
        if (this._toolBar) {
            this._toolBar.style.display = display;
        }
    }

    private createCropperInstance(): void {
        if (this._cropperWrapper) {
            return;
        }
        if (this._image.naturalHeight === 0 || this._image.naturalWidth === 0) {
            if (!this._createCropperTimeout) {
                this._createCropperTimeout = setTimeout(() => {
                    this._createCropperTimeout = null;
                    this.createCropperInstance();
                }, 300);
            }
            return;
        }
        if (this._cropperReadyRef) {
            this._image.removeEventListener(CropperWrapper.events.ready, this._cropperReadyRef);
        }
        if (this._cropperZoomRef) {
            this._image.removeEventListener(CropperWrapper.events.zoom, this._cropperZoomRef);
        }

        this._cropperWrapper = new CropperWrapper({
            target: this._image,
            zoomMax: this._zoomMax,
            zoomMin: this._zoomMin
        });

        this._cropperReadyRef = () => {
            this._image.style.display = 'none';
            if (this._magnify) {
                this.enableMagnify();
            }
            this.triggerEvent(PlayerEventType.PICTURE_READY);
            this.showControls();
            
            // Initialize annotation canvas if needed
            if (this._isAnnotationMode && !this._annotationCanvas) {
                this.initAnnotationCanvas();
            }
        };
        this._cropperZoomRef = (e: CustomEvent) => {
            this._zoomInfo?.setResultValue(e.detail.zoomLevel);
            const imageData = this._cropperWrapper?.getImageData();
            this._magnifier?.updateImageData(imageData);
            this.triggerEvent(PlayerEventType.PICTURE_ZOOM, { imageData });
            this.showControls();
        };
        this._cropperMoveRef = () => {
            this._magnifier?.updateImageData(this._cropperWrapper?.getImageData());
        };

        this._cropperWrapper.addEventListener(CropperWrapper.events.ready, this._cropperReadyRef);
        this._cropperWrapper.addEventListener(CropperWrapper.events.zoom, this._cropperZoomRef);
        this._image.addEventListener('cropmove', this._cropperMoveRef);
        this.attachContextMenuBlockers();
    }

    public getDisplayState(): string {
        return this._displayState;
    }

    private _timeoutLoadSrc: any = null;
    public replaceSrc(imageSrc: string, imageName: string) {
        clearTimeout(this._timeoutLoadSrc);
        this._timeoutLoadSrc = setTimeout(() => {
            this._manualZoom = false;
            if (this._magnify) {
                this.eventMagnify();
            }
            if (this._createCropperTimeout) {
                clearTimeout(this._createCropperTimeout);
                this._createCropperTimeout = null;
            }
            if (this._cropperWrapper) {
                this._cropperWrapper.destroy();
                this._cropperWrapper = null;
            }
            this._image.style.display = '';
            this.setImageSource(imageSrc);
            if (['sm', 'm', 'l'].includes(this._displayState)) {
                this.createCropperInstance();
            }
            this.setTitle(imageName);
        }, 300);
    }

    public fullscreen() {
        this.eventFullscreen();
    }

    public zoom() {
        if (!this._cropperWrapper) {
            return;
        }
        if (this._zoomInfo) {
            this._zoomInfo.increment();
            return;
        }
        this._manualZoom = true;
        this._cropperWrapper.zoom(this._nextZoomStep(this._cropperWrapper.getZoomLevel()));
    }

    public unZoom() {
        if (!this._cropperWrapper) {
            return;
        }
        if (this._zoomInfo) {
            this._zoomInfo.decrement();
            return;
        }
        this._manualZoom = true;
        this._cropperWrapper.zoom(this._prevZoomStep(this._cropperWrapper.getZoomLevel()));
    }

    private _nextZoomStep(current: number): number {
        if (this._zoomSteps?.length) {
            return this._zoomSteps.find(s => s > current) ?? Math.min(current + this._zoomStep, this._zoomMax);
        }
        return Math.min(current + this._zoomStep, this._zoomMax);
    }

    private _prevZoomStep(current: number): number {
        if (this._zoomSteps?.length) {
            return [...this._zoomSteps].reverse().find(s => s < current) ?? Math.max(current - this._zoomStep, this._zoomMin);
        }
        return Math.max(current - this._zoomStep, this._zoomMin);
    }

    public showRealSize() {
        if (this._cropperWrapper && typeof (this._cropperWrapper as any).fitToOrignalSize === 'function') {
            this._cropperWrapper.fitToOrignalSize();
            return;
        }
        this._zoomInfo?.showRealSize();
    }

    public flipV() {
        this.eventFlipV();
    }

    public flipH() {
        this.eventFlipH();
    }

    public rotate() {
        this.eventRotate();
    }

    public magnify() {
        this.eventMagnify();
    }

    public center() {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.center();
        this.showControls();
    }

    public fitToScreen() {
        this.eventFitToScreen();
    }

    public destroy() {
        if (this._cropperWrapper) {
            this._cropperWrapper.destroy();
        }
        if (this._annotationCanvas) {
            this._annotationCanvas.destroy();
            this._annotationCanvas = null;
        }
    }

    private initAnnotationCanvas(): void {
        const cropperContainer = this.dom.querySelector<HTMLElement>('.cropper-container');
        if (!cropperContainer) {
            return;
        }
        this._annotationCanvas = new AnnotationCanvas(cropperContainer);
    }

    public enableAnnotationMode(): void {
        this._isAnnotationMode = true;
        // Make sure the cropper is not in crop-drag mode so it doesn't fight the overlay.
        this._cropperWrapper?.disableCropMode();
        this.dom.classList.remove('crop-mode-active');
        if (this._cropperWrapper && !this._annotationCanvas) {
            this.initAnnotationCanvas();
        }
        if (this._annotationCanvas) {
            this._annotationCanvas.enableDrawMode();
        }
        this.triggerEvent(PlayerEventType.PICTURE_ANNOTATION_MODE, { enabled: true });
    }

    public disableAnnotationMode(): void {
        this._isAnnotationMode = false;
        if (this._annotationCanvas) {
            this._annotationCanvas.disableMode();
        }
        this.triggerEvent(PlayerEventType.PICTURE_ANNOTATION_MODE, { enabled: false });
    }

    public setAnnotationColor(color: string): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.setColor(color);
        }
    }

    public setAnnotationLineWidth(width: number): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.setLineWidth(width);
        }
    }

    public setAnnotationFontSize(size: number): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.setFontSize(size);
        }
    }

    public enableDrawMode(): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.enableDrawMode();
        }
    }

    public enableTextMode(): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.enableTextMode();
        }
    }

    public enableEraseMode(): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.enableEraseMode();
        }
    }

    public clearAnnotations(): void {
        if (this._annotationCanvas) {
            this._annotationCanvas.clear();
        }
    }

    public getAnnotationSnapshot(): string {
        if (this._annotationCanvas) {
            return this._annotationCanvas.getSnapshot();
        }
        return null;
    }

    public enableCropMode(): void {
        if (!this._cropperWrapper) {
            return;
        }
        // Disable annotation mode but keep the canvas so annotations persist.
        if (this._annotationCanvas) {
            this._isAnnotationMode = false;
            this._annotationCanvas.disableMode();
        }
        this._cropperWrapper.enableCropMode();
        this.dom.classList.add('crop-mode-active');
        this.triggerEvent(PlayerEventType.PICTURE_CROP_MODE, { enabled: true });
    }

    public disableCropMode(): void {
        if (!this._cropperWrapper) {
            return;
        }
        this._cropperWrapper.disableCropMode();
        this.dom.classList.remove('crop-mode-active');
        this.triggerEvent(PlayerEventType.PICTURE_CROP_MODE, { enabled: false });
    }

    public takeSnapshot(): string {
        if (!this._cropperWrapper) {
            return null;
        }

        // Get the cropped canvas from CropperJS
        const croppedCanvas = this._cropperWrapper.getCroppedCanvas();
        if (!croppedCanvas) {
            return null;
        }

        // Create a combined canvas with annotations
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = croppedCanvas.width;
        combinedCanvas.height = croppedCanvas.height;
        const ctx = combinedCanvas.getContext('2d');

        // Draw the cropped image
        ctx.drawImage(croppedCanvas, 0, 0);

        // Draw annotations if present (canvas is a synchronous image source)
        if (this._annotationCanvas) {
            const annotationCanvas = this._annotationCanvas.getCanvas();
            if (annotationCanvas) {
                ctx.drawImage(annotationCanvas, 0, 0, combinedCanvas.width, combinedCanvas.height);
            }
        }

        const snapshotData = combinedCanvas.toDataURL('image/png');
        this.triggerEvent(PlayerEventType.PICTURE_SNAPSHOT, { snapshotData });
        return snapshotData;
    }

    public removeFromDom() {
        this.dom.removeEventListener('fullscreenchange', this._fullscreenChangeRef);
        this._image.removeEventListener('load', this._imageLoadRef);
        this._image.removeEventListener('error', this._imageErrorRef);
        if (this._cropperReadyRef) {
            this._image.removeEventListener(CropperWrapper.events.ready, this._cropperReadyRef);
        }
        if (this._cropperZoomRef) {
            this._image.removeEventListener(CropperWrapper.events.zoom, this._cropperZoomRef);
        }
        if (this._cropperMoveRef) {
            this._image.removeEventListener('cropmove', this._cropperMoveRef);
        }
        this.dom.removeEventListener('contextmenu', this._preventContextMenuRef);
        this.dom.querySelector<HTMLElement>('.cropper-container')?.removeEventListener('contextmenu', this._preventContextMenuRef);
        this._zoomInfo?.removeFromDom();
        super.removeFromDom();
    }
}
