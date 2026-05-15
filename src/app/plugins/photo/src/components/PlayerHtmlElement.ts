import BaseHtmlElement from "./BaseHtmlElement";
import {
    AmaliaPlayerImageData,
    AmaliaPlayerImageSource, AmaliaPlayerSettings, AmaliaPlayerToolbarSettings
} from "../business/AmaliaPlayerSettings";
import CropperWrapper from "../business/CropperWrapper";
import AmaliaEventConstants from "../business/AmaliaEventConstants";
import DownloadButton from "./buttons/DownloadButton";
import FitScreenButton from "./buttons/FitScreenButton";
import IncrementInfo from "./widgets/IncrementInfo";
import FullscreenButton from "./buttons/FullscreenButton";
import FlipHButton from "./buttons/FlipHButton";
import FlipVButton from "./buttons/FlipVButton";
import RotateButton from "./buttons/RotateButton";
import AmaliaPlayer from "./AmaliaPlayer";
import MagnifyButton from "./buttons/MagnifyButton";
import Utils from "../business/Utils";
import CloseButton from "./buttons/CloseButton";
import SwitchModeButton from "./buttons/SwitchModeButton";
import MagnifierHtmlElement from "./MagnifierHtmlElement";
import FullsizeButton from "./buttons/FullsizeButton";

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

    private _hideControlTimeout: any;
    private _hideEventsAdded: boolean = false;
    private _blockControlTimeout: boolean = false;
    private _topBar: HTMLDivElement;
    private _toolBar: HTMLDivElement;
    private _titleBox: HTMLDivElement;
    private _zoomInfo: IncrementInfo;
    private _cropperWrapper: CropperWrapper;
    private _isFullscreen: boolean = false;
    private _imagePath: string;

    private _availableModes: string[] = ['reduced', 'simple', 'advanced'];
    private _mode: string;
    private _width: number;
    private _height: number;

    private _btnFullScreen: FullscreenButton;
    private _btnFlipH: FlipHButton;
    private _btnFlipV: FlipVButton;
    private _btnRotate: RotateButton;
    private _btnMagnify: MagnifyButton;
    private _btnSwitchMode: SwitchModeButton;
    private _btnClose: CloseButton;
    private _btnDownload: DownloadButton;
    private _btnFitScreen: FitScreenButton;
    private _btnFullSize: FullsizeButton;

    private _magnify: boolean = false;
    private _magnifier: MagnifierHtmlElement;

    private readonly _toolbarSettings: AmaliaPlayerToolbarSettings;

    constructor(setting: AmaliaPlayerSettings, playerInstance: AmaliaPlayer) {
        super();
        this._zoomMax = setting.zoomMax;
        this._zoomMin = setting.zoomMin;
        this._zoomStep = setting.zoomStep;
        this._zoomSteps = setting.zoomSteps;
        this._magnifyValue = setting.magnifyValue;
        this._magnifyMaxValue = setting.magnifyMaxValue;
        this._toolbarSettings = Utils.mergeDeep({}, this._toolbarSettings, setting.toolbar);
        this._playerInstance = playerInstance;
        this.dom = document.createElement('div');
        this.dom.className = 'ajs-photo-cropper-content';

        const imgSetting: AmaliaPlayerImageSource = setting.imagesSrc[0];
        this._imagePath = imgSetting.path;
        const topBar = this.createTopbar();
        this.setTitle(imgSetting.name);

        const toolbar = this.createToolbar();

        this._image = document.createElement('img');
        this._image.src = this._imagePath;

        this.dom.appendChild(this._image);
        this.dom.appendChild(topBar);
        this.dom.appendChild(toolbar);

        this._escapeMagnifyRef = this.escapeMagnify.bind(this);
        this.addHideEvents();
    }

    public setTitle(title: string) {
        this._titleBox.textContent = Utils.truncate(title);
    }

    private createTopbar(): HTMLElement {
        this._topBar = document.createElement('div');
        this._topBar.className = 'ajs-photo-top-box';

        const topLeft = document.createElement('div');
        topLeft.className = 'ajs-photo-top-left';
        this._btnSwitchMode = new SwitchModeButton(this._toolbarSettings.switch_mode)
            .addEventListener('click', () => {
                this.triggerEvent(AmaliaEventConstants.switchMode);
            });
        topLeft.appendChild(this._btnSwitchMode.getDom());
        this._topBar.appendChild(topLeft);

        const topRight = document.createElement('div');
        topRight.className = 'ajs-photo-top-right';
        this._btnClose = new CloseButton(this._toolbarSettings.close)
            .addEventListener('click', this.eventClose.bind(this));
        topRight.appendChild(this._btnClose.getDom());
        this._topBar.appendChild(topRight);

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

        this._btnDownload = new DownloadButton(this._toolbarSettings.download, this.eventDownload.bind(this));
        left.appendChild(this._btnDownload.getDom());
        this._btnFitScreen = new FitScreenButton(this._toolbarSettings.fitToScreen, this.eventFitToScreen.bind(this));
        left.appendChild(this._btnFitScreen.getDom());
        this._btnFullSize = new FullsizeButton(this._toolbarSettings.fullsize, this.eventFullSize.bind(this));
        left.appendChild(this._btnFullSize.getDom());
        this._btnMagnify = new MagnifyButton(this._toolbarSettings.magnify, this.eventMagnify.bind(this));
        left.appendChild(this._btnMagnify.getDom());
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

        this._btnFullScreen = new FullscreenButton(this._toolbarSettings.fullscreen, this.eventFullscreen.bind(this));
        right.appendChild(this._btnFullScreen.getDom());
        this.dom.addEventListener('fullscreenchange', () => {
            this._btnFullScreen.toggleIcon();
            setTimeout(() => {
                if (!this._cropperWrapper) {
                    return;
                }
                const imageData: AmaliaPlayerImageData = this._cropperWrapper.getImageData();
                if (imageData) {
                    // this._cropperWrapper.zoom(imageData.zoomLevel);
                    this._cropperWrapper.fitToCanvas();
                }
            }, 150);
        });
        this._btnFlipV = new FlipVButton(this._toolbarSettings.flipv, this.eventFlipV.bind(this));
        right.appendChild(this._btnFlipV.getDom());
        this._btnFlipH = new FlipHButton(this._toolbarSettings.fliph, this.eventFlipH.bind(this));
        right.appendChild(this._btnFlipH.getDom());
        this._btnRotate = new RotateButton(this._toolbarSettings.rotate, this.eventRotate.bind(this));
        right.appendChild(this._btnRotate.getDom());

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
        this._topBar.addEventListener('mouseenter', this._blockControlsRef);
        this._topBar.addEventListener('mouseleave', this._releaseControlsRef);
        this._toolBar.addEventListener('mouseenter', this._blockControlsRef);
        this._toolBar.addEventListener('mouseleave', this._releaseControlsRef);

        this.resetHideControlTimeout();
        this._hideEventsAdded = true;
    }

    private removeHideEvents() {
        this._hideEventsAdded = false;
        this._blockControlTimeout = false;
        this.dom.removeEventListener('mousemove', this._showControlsRef);
        this._topBar.removeEventListener('mouseenter', this._blockControlsRef);
        this._topBar.removeEventListener('mouseleave', this._releaseControlsRef);
        this._toolBar.removeEventListener('mouseenter', this._blockControlsRef);
        this._toolBar.removeEventListener('mouseleave', this._releaseControlsRef);
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
        if (this._mode !== 'reduced') {
            this._toolBar.style.display = 'block';
        }
        this._topBar.style.display = 'block';
        this.resetHideControlTimeout();
    }

    private hideControls() {
        if (!this._blockControlTimeout) {
            this._toolBar.style.display = 'none';
            this._topBar.style.display = 'none';
        }
    }

    private resetHideControlTimeout() {
        if (this._hideControlTimeout) {
            clearTimeout(this._hideControlTimeout);
        }
        this._hideControlTimeout = setTimeout(this.hideControls.bind(this), 3000);
    }

    private eventFitToScreen() {
        this._cropperWrapper.fitToCanvas();
        this.triggerEvent(AmaliaEventConstants.fitToScreen, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFullSize() {
        this._cropperWrapper.fitToOrignalSize();
        this.triggerEvent(AmaliaEventConstants.fitToScreen, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventDownload() {
        this.triggerEvent(AmaliaEventConstants.download, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFullscreen() {
        let fullscreenPromise: Promise<void>;
        if (
            document.fullscreenElement ||
            // @ts-expect-error legacy cropper typing
            document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
        ) {
            this._isFullscreen = false;
            if (document.exitFullscreen) {
                fullscreenPromise = document.exitFullscreen();
                // @ts-expect-error legacy cropper typing
            } else if (document.mozCancelFullScreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = document.mozCancelFullScreen();
                // @ts-expect-error legacy cropper typing
            } else if (document.webkitExitFullscreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = document.webkitExitFullscreen();
                // @ts-expect-error legacy cropper typing
            } else if (document.msExitFullscreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = document.msExitFullscreen();
            }
        } else {
            this._isFullscreen = true;
            if (this.dom.requestFullscreen) {
                fullscreenPromise = this.dom.requestFullscreen();
                // @ts-expect-error legacy cropper typing
            } else if (this.dom.mozRequestFullScreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = this.dom.mozRequestFullScreen();
                // @ts-expect-error legacy cropper typing
            } else if (this.dom.webkitRequestFullscreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = this.dom.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                // @ts-expect-error legacy cropper typing
            } else if (this.dom.msRequestFullscreen) {
                // @ts-expect-error legacy cropper typing
                fullscreenPromise = this.dom.msRequestFullscreen();
            }
        }
        fullscreenPromise.then(() => {
            this.triggerEvent(AmaliaEventConstants.fullscreen);
            this.showControls();
        });
    }

    private eventMagnify() {
        this._magnify = !this._magnify;
        this._btnMagnify.toggleIcon();
        if (this._magnify) {
            this.enableMagnify();
        } else {
            this.disableMagnify();
        }
        this.triggerEvent(AmaliaEventConstants.magnify, {
            magnify: this._magnify
        });
    }

    private enableMagnify() {
        this.removeHideEvents();
        this._btnDownload.disable();
        this._btnFitScreen.disable();
        this._btnFullSize.disable();
        this._btnFlipV.disable();
        this._btnFlipH.disable();
        this._btnRotate.disable();
        this._btnFullScreen.disable();
        this._zoomInfo.disable();
        this._btnMagnify.getDom().style.zIndex = '9';
        const imgData: AmaliaPlayerImageData = this._cropperWrapper.getImageData();
        this._magnifier = new MagnifierHtmlElement(
            '.cropper-container',
            imgData,
            this.getCropperImgPos.bind(this),
            this._magnifyValue,
            this._magnifyMaxValue);
        this.dom.prepend(this._magnifier.getDom());
        this.addClass('ajs-photo-magnify');
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
        this._magnifier.removeFromDom();
        this.addHideEvents();
        this._btnDownload.enable();
        this._btnFitScreen.enable();
        this._btnFullSize.enable();
        this._btnFlipV.enable();
        this._btnFlipH.enable();
        this._btnRotate.enable();
        this._btnFullScreen.enable();
        this._zoomInfo.enable();
        this._btnMagnify.getDom().style.zIndex = 'unset';
        this.showControls();
        document.removeEventListener('keyup', this._escapeMagnifyRef);
    }

    private getCropperImgPos(e: any) {
        const clientRect = this.dom.getBoundingClientRect();
        return {
            x: e.pageX - clientRect.left - window.pageXOffset,
            y: e.pageY - clientRect.top - window.pageYOffset
        };
    }

    private eventZoom(e: CustomEvent) {
        this._cropperWrapper.zoom(e.detail.value);
        if (e.detail.hasOwnProperty('center') && e.detail.center) {
            this._cropperWrapper.center();
        }
        this.showControls();
    }

    private eventRotate() {
        this._cropperWrapper.rotate(90);
        this.triggerEvent(AmaliaEventConstants.rotate, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFlipH() {
        this._cropperWrapper.flipHorizontally();
        this.triggerEvent(AmaliaEventConstants.flipHorizontally, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventFlipV() {
        this._cropperWrapper.flipVertically();
        this.triggerEvent(AmaliaEventConstants.flipVertically, {
            imageData: this._cropperWrapper.getImageData()
        });
        this.showControls();
    }

    private eventClose() {
        this.triggerEvent(AmaliaEventConstants.close);
        this.showControls();
    }

    private triggerEvent(eventName: string, data: any = {}) {
        this._playerInstance.triggerEvent(new CustomEvent(eventName, {
            detail: Utils.mergeDeep({}, {
                isFullscreen: this._isFullscreen,
                mode: this._mode
            }, data)
        }));
    }

    private displayReducedGallery(fourImg: string[]) {
        const dual: boolean = fourImg.length === 2;
        const className: string = dual ? 'ajs-photo-vx2' : 'ajs-photo-vx4';
        const height: number = dual ? this._height : this._height / 2;
        const width: number = this._width / 2;
        fourImg.reverse().forEach((src: string) => {
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

    public setMode(requestedMode: string, width: number = null, height: number = null, fourImg: string[] = null) {
        if (!Utils.inArray(requestedMode, this._availableModes)) {
            return;
        }
        if (width !== null) {
            this._width = width;
            this.dom.style.width = width.toString() + 'px';
        }
        if (height !== null) {
            this._height = height;
            this.dom.style.height = height.toString() + 'px';
        }
        if (this._cropperWrapper) {
            this._cropperWrapper.destroy();
        }
        this.destroyReducedGallery();
        this._image.src = this._imagePath;
        switch (requestedMode) {
            case 'reduced':
                this._btnClose.hide();
                this._titleBox.style.visibility = 'hidden';
                this._toolBar.style.display = 'none';
                if (fourImg) {
                    this._image.style.display = 'none';
                    this.displayReducedGallery(fourImg);
                } else {
                    this._image.style.display = 'block';
                }
                break;
            case 'simple':
                this._btnClose.show();
                this._btnDownload.hide();
                this._btnFitScreen.hide();
                this._btnFullSize.hide();
                this._zoomInfo.hide();
                this._btnMagnify.hide();
                this._btnRotate.hide();
                this._btnFlipH.hide();
                this._btnFlipV.hide();
                this._titleBox.style.visibility = 'hidden';
                this._toolBar.style.display = 'block';
                this._image.style.display = 'block';
                this.triggerEvent(AmaliaEventConstants.ready);
                break;
            case 'advanced':
                this._btnClose.show();
                this._btnDownload.show();
                this._btnFitScreen.show();
                this._btnFullSize.show();
                this._zoomInfo.show();
                this._btnMagnify.show();
                this._btnRotate.show();
                this._btnFlipH.show();
                this._btnFlipV.show();
                this._titleBox.style.visibility = 'visible';
                this.createCropperInstance();
                break;
            default:
                return;
        }
        this._mode = requestedMode;
    }

    private createCropperInstance(): void {
        const addEvent: boolean = !this._cropperWrapper;
        if (this._image.naturalHeight === 0 || this._image.naturalWidth === 0) {
            setTimeout(() => {
                this.createCropperInstance();
            }, 300);
            return;
        }
        this._cropperWrapper = new CropperWrapper({
            target: this._image,
            zoomMax: this._zoomMax,
            zoomMin: this._zoomMin
        });
        if (addEvent) {
            this._cropperWrapper.addEventListener(CropperWrapper.events.ready, () => {
                const img: HTMLImageElement = this.dom.querySelector('img.cropper-hidden');
                img.style.display = 'none';
                this.triggerEvent(AmaliaEventConstants.ready);
                this.showControls();
            }).addEventListener(CropperWrapper.events.zoom, (e: CustomEvent) => {
                this._zoomInfo.setResultValue(e.detail.zoomLevel);
                this.triggerEvent(AmaliaEventConstants.zoom, {
                    imageData: this._cropperWrapper.getImageData()
                });
                this.showControls();
            });
        }
    }

    public getMode(): string {
        return this._mode;
    }

    private _timeoutLoadSrc: any = null;
    public replaceSrc(imageSrc: string, imageName: string) {
        clearTimeout(this._timeoutLoadSrc);
        this._timeoutLoadSrc = setTimeout(() => {
            if (this._magnify) {
                this.eventMagnify();
            }
            this._imagePath = imageSrc;
            this._image.src = this._imagePath;
            if (this._cropperWrapper && this._mode === 'advanced') {
                this._cropperWrapper.destroy();
                    this.createCropperInstance();

            }
            this.setTitle(imageName);
        }, 300);
    }

    public fullscreen() {
        this.eventFullscreen();
    }

    public zoom() {
        this._zoomInfo.increment();
    }

    public unZoom() {
        this._zoomInfo.decrement();
    }

    public showRealSize() {
        this._zoomInfo.showRealSize();
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

    public destroy() {
        if (this._cropperWrapper) {
            this._cropperWrapper.destroy();
        }
    }

    public removeFromDom() {
        this._zoomInfo.removeFromDom();

        this._btnFullScreen.removeFromDom();
        this._btnFlipH.removeFromDom();
        this._btnFlipV.removeFromDom();
        this._btnRotate.removeFromDom();
        this._btnMagnify.removeFromDom();
        this._btnSwitchMode.removeFromDom();
        this._btnClose.removeFromDom();
        this._btnDownload.removeFromDom();
        this._btnFitScreen.removeFromDom();
        this._btnFullSize.removeFromDom();
        super.removeFromDom();
    }
}



