import Cropper from 'cropperjs';
import {AmaliaPlayerCropperWrapperSettings, AmaliaPlayerImageData} from "./AmaliaPlayerSettings";

export default class CropperWrapper {

    private _zoomLevel: number;
    private readonly _cropper: Cropper;
    private readonly _image: HTMLImageElement;
    private _settings: AmaliaPlayerCropperWrapperSettings;
    private readonly _zoomHandlerRef: any;

    public static events: any = {
        ready: 'ina.amalia.photo.event.cropper.ready',
        zoom: 'ina.amalia.photo.event.cropper.zoom'
    };

    constructor(settings: AmaliaPlayerCropperWrapperSettings) {
        this._settings = settings;
        const self: CropperWrapper = this;
        this._image = this._settings.target;

        this._zoomHandlerRef = this.zoomHandler.bind(this);
        this._image.addEventListener('zoom', this._zoomHandlerRef);

        const onePercentWidth: number = this._image.naturalWidth / 100;

        this._cropper = new Cropper(this._image, {
            autoCrop: false,
            background: false,
            zoomOnWheel: true,
            wheelZoomRatio: onePercentWidth * .001,
            dragMode: 'move',
            toggleDragModeOnDblclick: false,
            ready() {
                self.fitToCanvas();
                self.triggerEvent(new CustomEvent(CropperWrapper.events.ready));
            }
        });
    }

    private zoomHandler(event: any) {
        const currentZoom: number = Math.round(event.detail.oldRatio / .01);
        const requestedZoom: number = Math.round(event.detail.ratio / .01);
        if (requestedZoom <= this._settings.zoomMax && requestedZoom >= this._settings.zoomMin) {
            this._zoomLevel = requestedZoom;
            this.triggerEvent(new CustomEvent(CropperWrapper.events.zoom, {
                detail: {
                    zoomLevel: this._zoomLevel
                }
            }));
            return;
        } else if (requestedZoom > this._settings.zoomMax && currentZoom < this._settings.zoomMax) {
            this.zoom(this._settings.zoomMax);
        } else if (requestedZoom < this._settings.zoomMin && currentZoom > this._settings.zoomMin) {
            this.zoom(this._settings.zoomMin);
        }
        event.preventDefault();
    }

    public addEventListener(eventName: string, callback: any): CropperWrapper {
        this._image.addEventListener(eventName, callback);
        return this;
    }

    private triggerEvent(event: any) {
        this._image.dispatchEvent(event);
    }

    public destroy(): void {
        this._image.removeEventListener('zoom', this._zoomHandlerRef);
        if (this._cropper) {
            this._cropper.destroy();
        }
    }

    public rotate(degree: number): void {
        if (this._cropper) {
            this._cropper.rotate(degree);
        }
    }

    public flipHorizontally(): void {
        if (this._cropper) {
            const data: Cropper.ImageData = this._cropper.getImageData();
            let currentValue: number;
            if (data.rotate === 90 || data.rotate === 270) {
                currentValue = data.scaleX || 1;
                this._cropper.scaleX(-currentValue);
            } else {
                currentValue = data.scaleY || 1;
                this._cropper.scaleY(-currentValue);
            }
        }
    }

    public flipVertically(): void {
        if (this._cropper) {
            const data: Cropper.ImageData = this._cropper.getImageData();
            let currentValue: number;
            if (data.rotate === 90 || data.rotate === 270) {
                currentValue = data.scaleY || 1;
                this._cropper.scaleY(-currentValue);
            } else {
                currentValue = data.scaleX || 1;
                this._cropper.scaleX(-currentValue);
            }
        }
    }

    public zoom(zoomLevel: number = null): void {
        if (!this._cropper || !zoomLevel) {
            return;
        }
        this._zoomLevel = zoomLevel;
        this._cropper.zoomTo(this._zoomLevel * .01);
    }

    public center() {
        if (!this._cropper) {
            return;
        }
        const imgData: Cropper.ImageData = this._cropper.getImageData();
        const containerData: Cropper.ContainerData = this._cropper.getContainerData();
        this._cropper.moveTo((containerData.width / 2) - (imgData.width / 2), (containerData.height / 2) - (imgData.height / 2));
    }

    public fitToOrignalSize(): number {
        if (!this._cropper) {
            return null;
        }
        this._cropper.zoomTo(1);
        this.center();
        this._zoomLevel = 100;
        return this._zoomLevel;
    }

    public fitToCanvas(): number {
        if (!this._cropper) {
            return null;
        }
        const imgData: Cropper.ImageData = this._cropper.getImageData();
        const stage: Cropper.ContainerData = this._cropper.getContainerData();
        const ratioH: number = stage.width * 100 / imgData.naturalWidth;
        const zoomH: number = Math.floor(ratioH);
        const ratioV: number = stage.height * 100 / imgData.naturalHeight;
        const zoomV: number = Math.floor(ratioV);
        this._zoomLevel = Math.min(zoomH, zoomV);
        if (this._settings.zoomMax && this._zoomLevel > this._settings.zoomMax) {
            this._zoomLevel = this._settings.zoomMax;
        }
        if (this._settings.zoomMin && this._zoomLevel < this._settings.zoomMin) {
            this._zoomLevel = this._settings.zoomMin;
        }
        this._cropper.zoomTo(this._zoomLevel * .01);
        this.center();
        return this._zoomLevel;
    }

    public getImageData(): AmaliaPlayerImageData {
        if (!this._cropper) {
            return null;
        }
        const cropData: Cropper.CropBoxData = this._cropper.getCropBoxData();
        const canvasData: Cropper.CanvasData = this._cropper.getCanvasData();
        const imageData: Cropper.ImageData = this._cropper.getImageData();
        const showRatio: number = canvasData.naturalWidth / canvasData.width;

        const cropped: boolean = cropData.hasOwnProperty('left');

        // @ts-expect-error - `crossOriginUrl` is a private/undocumented Cropper property
        const src: string = this._cropper.crossOriginUrl;
        const src_width: number = imageData.naturalWidth;
        const src_height: number = imageData.naturalHeight;
        const left: number = canvasData.left;
        const top: number = canvasData.top;
        const rotate: number = imageData.rotate || null;
        const crop_left: number = cropped ? (cropData.left - canvasData.left) * showRatio : null;
        const crop_top: number = cropped ? (cropData.top - canvasData.top) * showRatio : null;
        const crop_width: number = cropped ? cropData.width * showRatio : null;
        const crop_height: number = cropped ? cropData.height * showRatio : null;
        const flop: number = imageData.hasOwnProperty('scaleX') && imageData.scaleX === -1 ? 1 : null;
        const flip: number = imageData.hasOwnProperty('scaleY') && imageData.scaleY === -1 ? 1 : null;
        const zoomLevel: number = this._zoomLevel;

        return {
            src,
            src_width,
            src_height,
            left,
            top,
            rotate,
            crop_left,
            crop_top,
            crop_width,
            crop_height,
            flop,
            flip,
            zoomLevel
        };
    }
}
