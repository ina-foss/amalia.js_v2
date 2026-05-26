import CropperWrapper from './CropperWrapper';

function createWrapper() {
    const wrapper = Object.create(CropperWrapper.prototype) as any;
    const image = document.createElement('img');
    wrapper._image = image;
    wrapper._settings = { zoomMin: 50, zoomMax: 200, target: image };
    wrapper._zoomLevel = 100;
    wrapper._isReady = true;
    wrapper._zoomHandlerRef = jasmine.createSpy('zoomHandlerRef');
    wrapper._cropper = {
        destroy: jasmine.createSpy('destroy'),
        rotate: jasmine.createSpy('rotate'),
        getImageData: jasmine.createSpy('getImageData').and.returnValue({
            width: 200,
            height: 100,
            naturalWidth: 400,
            naturalHeight: 200,
            rotate: 0,
            scaleX: 1,
            scaleY: 1
        }),
        getContainerData: jasmine.createSpy('getContainerData').and.returnValue({
            width: 800,
            height: 600
        }),
        getCropBoxData: jasmine.createSpy('getCropBoxData').and.returnValue({
            left: 20,
            top: 10,
            width: 100,
            height: 50
        }),
        getCanvasData: jasmine.createSpy('getCanvasData').and.returnValue({
            naturalWidth: 400,
            width: 200,
            left: 5,
            top: 3
        }),
        scaleX: jasmine.createSpy('scaleX'),
        scaleY: jasmine.createSpy('scaleY'),
        zoomTo: jasmine.createSpy('zoomTo'),
        moveTo: jasmine.createSpy('moveTo'),
        crossOriginUrl: '/image.jpg'
    };
    return wrapper;
}

describe('CropperWrapper', () => {
    it('addEventListener should register and return this', () => {
        const wrapper = createWrapper();
        const cb = jasmine.createSpy('cb');
        spyOn((wrapper as any)._image, 'addEventListener').and.callThrough();

        const out = wrapper.addEventListener('x-event', cb);

        expect((wrapper as any)._image.addEventListener).toHaveBeenCalledWith('x-event', cb);
        expect(out).toBe(wrapper);
    });

    it('destroy should remove listeners and destroy cropper', () => {
        const wrapper = createWrapper();
        spyOn((wrapper as any)._image, 'removeEventListener').and.callThrough();

        wrapper.destroy();

        expect((wrapper as any)._image.removeEventListener).toHaveBeenCalledWith('zoom', (wrapper as any)._zoomHandlerRef);
        expect((wrapper as any)._cropper.destroy).toHaveBeenCalled();
    });

    it('rotate/zoom/center should delegate to cropper', () => {
        const wrapper = createWrapper();
        wrapper.rotate(90);
        wrapper.zoom(140);
        wrapper.center();

        expect((wrapper as any)._cropper.rotate).toHaveBeenCalledWith(90);
        expect((wrapper as any)._cropper.zoomTo).toHaveBeenCalled();
        expect((wrapper as any)._cropper.zoomTo.calls.mostRecent().args[0]).toBeCloseTo(1.4, 5);
        expect((wrapper as any)._cropper.moveTo).toHaveBeenCalled();
    });

    it('flipHorizontally and flipVertically should use rotation-aware axis', () => {
        const wrapper = createWrapper();

        (wrapper as any)._cropper.getImageData.and.returnValue({ rotate: 90, scaleX: 2, scaleY: 3 });
        wrapper.flipHorizontally();
        wrapper.flipVertically();
        expect((wrapper as any)._cropper.scaleX).toHaveBeenCalledWith(-2);
        expect((wrapper as any)._cropper.scaleY).toHaveBeenCalledWith(-3);

        (wrapper as any)._cropper.scaleX.calls.reset();
        (wrapper as any)._cropper.scaleY.calls.reset();
        (wrapper as any)._cropper.getImageData.and.returnValue({ rotate: 0, scaleX: 2, scaleY: 3 });
        wrapper.flipHorizontally();
        wrapper.flipVertically();
        expect((wrapper as any)._cropper.scaleY).toHaveBeenCalledWith(-3);
        expect((wrapper as any)._cropper.scaleX).toHaveBeenCalledWith(-2);
    });

    it('fitToOrignalSize should set 100% and center', () => {
        const wrapper = createWrapper();
        const centerSpy = spyOn(wrapper, 'center').and.callThrough();
        const zoom = wrapper.fitToOrignalSize();

        expect(zoom).toBe(100);
        expect((wrapper as any)._cropper.zoomTo).toHaveBeenCalledWith(1);
        expect(centerSpy).toHaveBeenCalled();
    });

    it('fitToCanvas should compute and clamp zoom from container/image ratios', () => {
        const wrapper = createWrapper();
        (wrapper as any)._cropper.getImageData.and.returnValue({
            naturalWidth: 1200,
            naturalHeight: 400,
            width: 1200,
            height: 400
        });
        (wrapper as any)._cropper.getContainerData.and.returnValue({ width: 1000, height: 900 });

        const zoom = wrapper.fitToCanvas();

        expect(zoom).toBe(83);
        expect((wrapper as any)._cropper.zoomTo).toHaveBeenCalledWith(0.8300000000000001);
    });

    it('zoomHandler should emit zoom event when value in bounds', () => {
        const wrapper = createWrapper();
        const triggerSpy = spyOn<any>(wrapper, 'triggerEvent').and.callFake(() => undefined);
        const event = { detail: { oldRatio: 1, ratio: 1.2 }, preventDefault: jasmine.createSpy('preventDefault') };

        (wrapper as any).zoomHandler(event);

        expect((wrapper as any)._zoomLevel).toBe(120);
        expect(triggerSpy).toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('zoomHandler should clamp out-of-bounds values and prevent default', () => {
        const wrapper = createWrapper();
        const zoomSpy = spyOn(wrapper, 'zoom').and.callThrough();
        const tooHigh = { detail: { oldRatio: 1, ratio: 3 }, preventDefault: jasmine.createSpy('preventDefault') };
        const tooLow = { detail: { oldRatio: 2, ratio: 0.1 }, preventDefault: jasmine.createSpy('preventDefault') };

        (wrapper as any).zoomHandler(tooHigh);
        (wrapper as any).zoomHandler(tooLow);

        expect(zoomSpy).toHaveBeenCalledWith(200);
        expect(zoomSpy).toHaveBeenCalledWith(50);
        expect(tooHigh.preventDefault).toHaveBeenCalled();
        expect(tooLow.preventDefault).toHaveBeenCalled();
    });

    it('getImageData should map cropper data to Amalia image data', () => {
        const wrapper = createWrapper();
        (wrapper as any)._zoomLevel = 140;
        (wrapper as any)._cropper.getImageData.and.returnValue({
            naturalWidth: 400,
            naturalHeight: 200,
            rotate: 180,
            scaleX: -1,
            scaleY: -1
        });
        (wrapper as any)._cropper.getCanvasData.and.returnValue({
            naturalWidth: 400,
            width: 200,
            left: 10,
            top: 20
        });
        (wrapper as any)._cropper.getCropBoxData.and.returnValue({
            left: 20,
            top: 30,
            width: 100,
            height: 50
        });

        const data = wrapper.getImageData();

        expect(data.src).toBe('/image.jpg');
        expect(data.src_width).toBe(400);
        expect(data.src_height).toBe(200);
        expect(data.crop_left).toBe(20);
        expect(data.crop_top).toBe(20);
        expect(data.crop_width).toBe(200);
        expect(data.crop_height).toBe(100);
        expect(data.flop).toBe(1);
        expect(data.flip).toBe(1);
        expect(data.zoomLevel).toBe(140);
    });
});
