import CropperWrapper from './CropperWrapper';

describe('CropperWrapper', () => {
    function createWrapper(cropperStub: any = null, overrideSettings: any = {}) {
        const image = document.createElement('img');
        const wrapper = Object.create(CropperWrapper.prototype) as any;
        wrapper._image = image;
        wrapper._settings = {
            target: image,
            zoomMin: 10,
            zoomMax: 300,
            ...overrideSettings
        };
        wrapper._cropper = cropperStub;
        wrapper._zoomLevel = 100;
        return { wrapper, image };
    }

    it('zoomHandler should emit zoom event when requested zoom is in bounds', () => {
        const { wrapper, image } = createWrapper();
        let zoomLevel = 0;
        image.addEventListener(CropperWrapper.events.zoom, (e: any) => {
            zoomLevel = e.detail.zoomLevel;
        });

        (wrapper as any).zoomHandler({
            detail: { oldRatio: 1, ratio: 1.5 },
            preventDefault: jasmine.createSpy('preventDefault')
        });

        expect(zoomLevel).toBe(150);
    });

    it('zoomHandler should clamp above max and prevent default', () => {
        const { wrapper } = createWrapper();
        const zoomSpy = spyOn(wrapper as any, 'zoom');
        const preventDefault = jasmine.createSpy('preventDefault');

        (wrapper as any).zoomHandler({
            detail: { oldRatio: 1, ratio: 4 },
            preventDefault
        });

        expect(zoomSpy).toHaveBeenCalledWith(300);
        expect(preventDefault).toHaveBeenCalled();
    });

    it('zoomHandler should clamp below min and prevent default', () => {
        const { wrapper } = createWrapper(undefined, { zoomMin: 50 });
        const zoomSpy = spyOn(wrapper as any, 'zoom');
        const preventDefault = jasmine.createSpy('preventDefault');

        (wrapper as any).zoomHandler({
            detail: { oldRatio: 1, ratio: 0.2 },
            preventDefault
        });

        expect(zoomSpy).toHaveBeenCalledWith(50);
        expect(preventDefault).toHaveBeenCalled();
    });

    it('addEventListener should return wrapper and register callback', () => {
        const { wrapper, image } = createWrapper();
        const callback = jasmine.createSpy('callback');

        const result = wrapper.addEventListener('custom-event', callback);
        image.dispatchEvent(new CustomEvent('custom-event'));

        expect(result).toBe(wrapper);
        expect(callback).toHaveBeenCalled();
    });

    it('destroy should detach zoom listener and destroy cropper', () => {
        const destroySpy = jasmine.createSpy('destroy');
        const cropper = { destroy: destroySpy };
        const { wrapper, image } = createWrapper(cropper);
        const zoomHandler = jasmine.createSpy('zoomHandler');
        wrapper._zoomHandlerRef = zoomHandler;
        image.addEventListener('zoom', zoomHandler);

        wrapper.destroy();
        image.dispatchEvent(new CustomEvent('zoom'));

        expect(zoomHandler).not.toHaveBeenCalled();
        expect(destroySpy).toHaveBeenCalled();
    });

    it('rotate should call cropper.rotate', () => {
        const rotateSpy = jasmine.createSpy('rotate');
        const { wrapper } = createWrapper({ rotate: rotateSpy });

        wrapper.rotate(90);

        expect(rotateSpy).toHaveBeenCalledWith(90);
    });

    it('flipHorizontally should use scaleX for rotated image and scaleY otherwise', () => {
        const scaleX = jasmine.createSpy('scaleX');
        const scaleY = jasmine.createSpy('scaleY');
        const getImageData = jasmine.createSpy('getImageData').and.returnValues(
            { rotate: 90, scaleX: 1 },
            { rotate: 0, scaleY: 1 }
        );
        const { wrapper } = createWrapper({ getImageData, scaleX, scaleY });

        wrapper.flipHorizontally();
        wrapper.flipHorizontally();

        expect(scaleX).toHaveBeenCalledWith(-1);
        expect(scaleY).toHaveBeenCalledWith(-1);
    });

    it('flipVertically should use scaleY for rotated image and scaleX otherwise', () => {
        const scaleX = jasmine.createSpy('scaleX');
        const scaleY = jasmine.createSpy('scaleY');
        const getImageData = jasmine.createSpy('getImageData').and.returnValues(
            { rotate: 270, scaleY: 1 },
            { rotate: 0, scaleX: 1 }
        );
        const { wrapper } = createWrapper({ getImageData, scaleX, scaleY });

        wrapper.flipVertically();
        wrapper.flipVertically();

        expect(scaleY).toHaveBeenCalledWith(-1);
        expect(scaleX).toHaveBeenCalledWith(-1);
    });

    it('zoom should ignore null and apply valid zoom', () => {
        const zoomTo = jasmine.createSpy('zoomTo');
        const { wrapper } = createWrapper({ zoomTo });

        wrapper.zoom(null as any);
        expect(zoomTo).not.toHaveBeenCalled();

        wrapper.zoom(75);
        expect(zoomTo).toHaveBeenCalledWith(0.75);
    });

    it('center should move image to container center', () => {
        const moveTo = jasmine.createSpy('moveTo');
        const { wrapper } = createWrapper({
            getImageData: () => ({ width: 200, height: 100 }),
            getContainerData: () => ({ width: 400, height: 300 }),
            moveTo
        });

        wrapper.center();

        expect(moveTo).toHaveBeenCalledWith(100, 100);
    });

    it('fitToOrignalSize should zoom to 1, center and return 100', () => {
        const zoomTo = jasmine.createSpy('zoomTo');
        const { wrapper } = createWrapper({ zoomTo });
        const centerSpy = spyOn(wrapper as any, 'center');

        const value = wrapper.fitToOrignalSize();

        expect(value).toBe(100);
        expect(zoomTo).toHaveBeenCalledWith(1);
        expect(centerSpy).toHaveBeenCalled();
    });

    it('fitToCanvas should compute zoom, clamp to bounds and center', () => {
        const zoomTo = jasmine.createSpy('zoomTo');
        const { wrapper } = createWrapper({
            zoomTo,
            getImageData: () => ({ naturalWidth: 1000, naturalHeight: 2000 }),
            getContainerData: () => ({ width: 800, height: 700 })
        }, { zoomMin: 20, zoomMax: 60 });
        const centerSpy = spyOn(wrapper as any, 'center');

        const value = wrapper.fitToCanvas();

        expect(value).toBe(35);
        expect(zoomTo).toHaveBeenCalledWith(0.35000000000000003);
        expect(centerSpy).toHaveBeenCalled();
    });

    it('getImageData should return normalized payload including crop and flips', () => {
        const { wrapper } = createWrapper({
            crossOriginUrl: '/img.jpg',
            getCropBoxData: () => ({ left: 15, top: 20, width: 50, height: 25 }),
            getCanvasData: () => ({ naturalWidth: 1000, width: 500, left: 5, top: 10 }),
            getImageData: () => ({ naturalWidth: 1000, naturalHeight: 700, rotate: 90, scaleX: -1, scaleY: -1 })
        });
        wrapper._zoomLevel = 120;

        const data = wrapper.getImageData();

        expect(data.src).toBe('/img.jpg');
        expect(data.crop_left).toBe(20);
        expect(data.crop_top).toBe(20);
        expect(data.crop_width).toBe(100);
        expect(data.crop_height).toBe(50);
        expect(data.flop).toBe(1);
        expect(data.flip).toBe(1);
        expect(data.zoomLevel).toBe(120);
    });

    it('methods should safely return null when cropper is missing', () => {
        const { wrapper } = createWrapper(null);
        wrapper._cropper = null;

        expect(wrapper.fitToCanvas()).toBeNull();
        expect(wrapper.fitToOrignalSize()).toBeNull();
        expect(wrapper.getImageData()).toBeNull();
    });
});
