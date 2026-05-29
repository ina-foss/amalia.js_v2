import AmaliaPlayer from './AmaliaPlayer';
import PlayerHtmlElement from './PlayerHtmlElement';

function createButtonStub() {
    const dom = document.createElement('div');
    return {
        dom,
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide'),
        enable: jasmine.createSpy('enable'),
        disable: jasmine.createSpy('disable'),
        toggleIcon: jasmine.createSpy('toggleIcon'),
        getDom: () => dom,
        removeFromDom: jasmine.createSpy('removeFromDom')
    };
}

describe('AmaliaPlayer', () => {
    beforeEach(() => {
        const host = document.createElement('div');
        host.id = 'photo-host';
        document.body.appendChild(host);
    });

    afterEach(() => {
        const host = document.getElementById('photo-host');
        host?.remove();
    });

    it('should handle empty gallery in constructor', () => {
        const player = new AmaliaPlayer('#photo-host', {
            imagesSrc: [],
            showGallery: false
        } as any);
        expect((player as any).dom.className).toContain('ajs-photo-amalia-photo');
    });

    it('should delegate actions to cropper component', () => {
        const player = new AmaliaPlayer('#photo-host', { imagesSrc: [], showGallery: false } as any);
        const cropper = {
            fullscreen: jasmine.createSpy('fullscreen'),
            zoom: jasmine.createSpy('zoom'),
            unZoom: jasmine.createSpy('unZoom'),
            showRealSize: jasmine.createSpy('showRealSize'),
            flipV: jasmine.createSpy('flipV'),
            flipH: jasmine.createSpy('flipH'),
            rotate: jasmine.createSpy('rotate'),
            magnify: jasmine.createSpy('magnify'),
            fitToScreen: jasmine.createSpy('fitToScreen'),
            getDisplayState: () => 's'
        };
        (player as any)._cropperComponent = cropper;

        player.toggleFullscreen();
        player.zoom();
        player.unZoom();
        player.showRealSize();
        player.flipV();
        player.flipH();
        player.rotate();
        player.magnify();
        player.fitToScreen();

        expect(cropper.fullscreen).toHaveBeenCalled();
        expect(cropper.zoom).toHaveBeenCalled();
        expect(cropper.unZoom).toHaveBeenCalled();
        expect(cropper.showRealSize).toHaveBeenCalled();
        expect(cropper.flipV).toHaveBeenCalled();
        expect(cropper.flipH).toHaveBeenCalled();
        expect(cropper.rotate).toHaveBeenCalled();
        expect(cropper.magnify).toHaveBeenCalled();
        expect(cropper.fitToScreen).toHaveBeenCalled();
    });

    it('setDisplayState should update dimensions and notify cropper', () => {
        const player = new AmaliaPlayer('#photo-host', { imagesSrc: [], showGallery: false } as any);
        const host = (player as any).dom as HTMLElement;
        Object.defineProperty(host, 'offsetWidth', { value: 400, configurable: true });
        Object.defineProperty(host, 'offsetHeight', { value: 200, configurable: true });

        const cropper = {
            getDisplayState: () => 's',
            setDisplayState: jasmine.createSpy('setDisplayState')
        };
        (player as any)._cropperComponent = cropper;

        player.setDisplayState('xs', 300, 180);
        expect(cropper.setDisplayState).toHaveBeenCalled();
    });

    it('setDisplayState should prefer parent container dimensions when width/height are not provided', () => {
        const player = new AmaliaPlayer('#photo-host', {
            imagesSrc: [{ name: 'img', path: '/img.jpg', thumbPath: '/thumb.jpg' }],
            showGallery: false
        } as any);
        const root = (player as any).dom as HTMLElement;
        const parent = root.parentElement as HTMLElement;
        Object.defineProperty(parent, 'offsetWidth', { value: 920, configurable: true });
        Object.defineProperty(parent, 'offsetHeight', { value: 510, configurable: true });
        Object.defineProperty(root, 'offsetWidth', { value: 320, configurable: true });
        Object.defineProperty(root, 'offsetHeight', { value: 180, configurable: true });

        const cropper = {
            getDisplayState: () => 's',
            setDisplayState: jasmine.createSpy('setDisplayState')
        };
        (player as any)._cropperComponent = cropper;

        player.setDisplayState('m');

        expect(root.style.width).toBe('920px');
        expect(root.style.height).toBe('510px');
        expect(cropper.setDisplayState).toHaveBeenCalled();
    });

    it('selectImageBySource should no-op on empty source and trigger event on valid source', () => {
        const player = new AmaliaPlayer('#photo-host', {
            imagesSrc: [{ name: 'img', path: '/img.jpg', thumbPath: '/thumb.jpg' }],
            showGallery: false
        } as any);
        const replaceSrc = jasmine.createSpy('replaceSrc');
        const dispatchSpy = spyOn((player as any).dom, 'dispatchEvent').and.callThrough();
        (player as any)._cropperComponent = {
            replaceSrc,
            getDisplayState: () => 'm'
        };

        player.selectImageBySource('');
        expect(replaceSrc).not.toHaveBeenCalled();

        player.selectImageBySource('/next.jpg', 'next');
        expect(replaceSrc).toHaveBeenCalledWith('/next.jpg', 'next');
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('destroy should cleanup component and host dom', () => {
        const player = new AmaliaPlayer('#photo-host', {
            imagesSrc: [{ name: 'img', path: '/img.jpg', thumbPath: '/thumb.jpg' }],
            showGallery: false
        } as any);
        const dom = (player as any).dom as HTMLElement;
        dom.appendChild(document.createElement('div'));
        const cropper = {
            removeFromDom: jasmine.createSpy('removeFromDom'),
            destroy: jasmine.createSpy('destroy'),
            getDisplayState: () => 'm'
        };
        (player as any)._cropperComponent = cropper;
        player.addClass('ajs-photo-m');

        player.destroy();

        expect(cropper.removeFromDom).toHaveBeenCalled();
        expect(cropper.destroy).toHaveBeenCalled();
        expect((player as any).dom).toBeNull();
    });
});

describe('PlayerHtmlElement (targeted behaviors)', () => {
    let comp: PlayerHtmlElement;
    let playerEventSpy: jasmine.Spy;

    beforeEach(() => {
        playerEventSpy = jasmine.createSpy('triggerEvent');
        comp = new PlayerHtmlElement(
            {
                imagesSrc: [{ name: 'img', path: '/img.jpg', thumbPath: '/thumb.jpg' }],
                showGallery: false,
                noToolbar: true,
                noTopbar: true,
                zoomMax: 300,
                zoomMin: 10,
                zoomStep: 10,
                zoomSteps: [10, 20, 30],
                magnifyValue: 300,
                magnifyMaxValue: 600,
                toolbar: {}
            } as any,
            { triggerEvent: playerEventSpy } as any
        );
        document.body.appendChild(comp.getDom());

        (comp as any)._btnClose = createButtonStub();
        (comp as any)._btnDownload = createButtonStub();
        (comp as any)._btnFitScreen = createButtonStub();
        (comp as any)._btnFullSize = createButtonStub();
        (comp as any)._btnMagnify = createButtonStub();
        (comp as any)._btnRotate = createButtonStub();
        (comp as any)._btnFlipH = createButtonStub();
        (comp as any)._btnFlipV = createButtonStub();
        (comp as any)._btnFullScreen = createButtonStub();
        (comp as any)._zoomInfo = {
            show: jasmine.createSpy('show'),
            hide: jasmine.createSpy('hide'),
            enable: jasmine.createSpy('enable'),
            disable: jasmine.createSpy('disable'),
            increment: jasmine.createSpy('increment'),
            decrement: jasmine.createSpy('decrement'),
            showRealSize: jasmine.createSpy('showRealSize'),
            setResultValue: jasmine.createSpy('setResultValue'),
            removeFromDom: jasmine.createSpy('removeFromDom')
        };
        (comp as any)._toolBar = document.createElement('div');
        (comp as any)._titleBox = document.createElement('div');
    });

    afterEach(() => {
        comp.removeFromDom();
    });

    it('should update container dimensions and ignore invalid state', () => {
        (comp as any).setDisplayState('invalid');
        expect((comp as any)._displayState).toBeUndefined();

        (comp as any).setDisplayState('s', 320, 180);
        expect((comp as any).getDom().style.width).toBe('320px');
        expect((comp as any).getDom().style.height).toBe('180px');
        expect((comp as any)._displayState).toBe('s');
    });

    it('should apply xs state and render reduced gallery', () => {
        (comp as any).setDisplayState('xs', 300, 180, ['a.jpg', 'b.jpg']);
        const reduced = (comp as any).getDom().querySelectorAll('.ajs-photo-reduced-view');
        expect(reduced.length).toBe(2);
    });

    it('should call cropper wrapper actions on events', () => {
        const cropperWrapper = {
            fitToCanvas: jasmine.createSpy('fitToCanvas'),
            fitToOrignalSize: jasmine.createSpy('fitToOrignalSize'),
            getImageData: jasmine.createSpy('getImageData').and.returnValue({ zoomLevel: 100 }),
            zoom: jasmine.createSpy('zoom'),
            center: jasmine.createSpy('center'),
            rotate: jasmine.createSpy('rotate'),
            flipHorizontally: jasmine.createSpy('flipHorizontally'),
            flipVertically: jasmine.createSpy('flipVertically'),
            destroy: jasmine.createSpy('destroy')
        };
        (comp as any)._cropperWrapper = cropperWrapper;

        (comp as any).eventFitToScreen();
        (comp as any).eventFullSize();
        (comp as any).eventDownload();
        (comp as any).eventZoom({ detail: { value: 120, center: true, hasOwnProperty: () => true } } as any);
        (comp as any).eventRotate();
        (comp as any).eventFlipH();
        (comp as any).eventFlipV();

        expect(cropperWrapper.fitToCanvas).toHaveBeenCalled();
        expect(cropperWrapper.fitToOrignalSize).toHaveBeenCalled();
        expect(cropperWrapper.zoom).toHaveBeenCalledWith(120);
        expect(cropperWrapper.center).toHaveBeenCalled();
        expect(cropperWrapper.rotate).toHaveBeenCalledWith(90);
        expect(cropperWrapper.flipHorizontally).toHaveBeenCalled();
        expect(cropperWrapper.flipVertically).toHaveBeenCalled();
    });

    it('should compute cropper image position from client coordinates', () => {
        const dom = (comp as any).getDom() as HTMLElement;
        spyOn(dom, 'getBoundingClientRect').and.returnValue({
            left: 10,
            top: 20
        } as DOMRect);
        const pos = (comp as any).getCropperImgPos({ clientX: 22, clientY: 39 });
        expect(pos).toEqual({ x: 12, y: 19 });
    });

    it('should block context menu on player root and cropper container', () => {
        const rootEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
        expect(comp.getDom().dispatchEvent(rootEvent)).toBeFalse();

        const cropperContainer = document.createElement('div');
        cropperContainer.className = 'cropper-container';
        comp.getDom().appendChild(cropperContainer);
        (comp as any).attachContextMenuBlockers();

        const cropperEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
        expect(cropperContainer.dispatchEvent(cropperEvent)).toBeFalse();
    });

    it('should toggle fullscreen through document/fullscreen API', async () => {
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        (comp as any).getDom().requestFullscreen = () => Promise.resolve();
        await (comp as any).eventFullscreen();
        expect(playerEventSpy).toHaveBeenCalled();

        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: {} });
        spyOn(document, 'exitFullscreen').and.returnValue(Promise.resolve());
        await (comp as any).eventFullscreen();
        expect((document.exitFullscreen as jasmine.Spy)).toHaveBeenCalled();
    });

    it('should replace image source and recreate cropper when needed', () => {
        jasmine.clock().install();
        const wrapper = { destroy: jasmine.createSpy('destroy') };
        (comp as any)._cropperWrapper = wrapper;
        (comp as any)._displayState = 'm';
        const recreateSpy = spyOn<any>(comp, 'createCropperInstance').and.callFake(() => undefined);
        const titleSpy = spyOn(comp, 'setTitle').and.callThrough();
        const magnifySpy = spyOn<any>(comp, 'eventMagnify').and.callFake(() => undefined);
        (comp as any)._magnify = true;

        comp.replaceSrc('/new.jpg', 'New Title');
        jasmine.clock().tick(301);

        expect(magnifySpy).toHaveBeenCalled();
        expect(wrapper.destroy).toHaveBeenCalled();
        expect(recreateSpy).toHaveBeenCalled();
        expect(titleSpy).toHaveBeenCalledWith('New Title');
        jasmine.clock().uninstall();
    });

    it('public wrappers should delegate and destroy should cleanup', () => {
        const destroySpy = jasmine.createSpy('destroy');
        (comp as any)._cropperWrapper = { destroy: destroySpy };
        const fitSpy = spyOn<any>(comp, 'eventFitToScreen').and.callFake(() => undefined);
        const magSpy = spyOn<any>(comp, 'eventMagnify').and.callFake(() => undefined);
        const rotSpy = spyOn<any>(comp, 'eventRotate').and.callFake(() => undefined);
        const fvSpy = spyOn<any>(comp, 'eventFlipV').and.callFake(() => undefined);
        const fhSpy = spyOn<any>(comp, 'eventFlipH').and.callFake(() => undefined);
        const fsSpy = spyOn<any>(comp, 'eventFullscreen').and.returnValue(Promise.resolve());

        comp.zoom();
        comp.unZoom();
        comp.showRealSize();
        comp.fitToScreen();
        comp.magnify();
        comp.rotate();
        comp.flipV();
        comp.flipH();
        comp.fullscreen();
        comp.destroy();

        expect((comp as any)._zoomInfo.increment).toHaveBeenCalled();
        expect((comp as any)._zoomInfo.decrement).toHaveBeenCalled();
        expect((comp as any)._zoomInfo.showRealSize).toHaveBeenCalled();
        expect(fitSpy).toHaveBeenCalled();
        expect(magSpy).toHaveBeenCalled();
        expect(rotSpy).toHaveBeenCalled();
        expect(fvSpy).toHaveBeenCalled();
        expect(fhSpy).toHaveBeenCalled();
        expect(fsSpy).toHaveBeenCalled();
        expect(destroySpy).toHaveBeenCalled();
    });
});

describe('PlayerHtmlElement (full toolbar branches)', () => {
    let comp: PlayerHtmlElement;
    let playerEventSpy: jasmine.Spy;

    beforeEach(() => {
        playerEventSpy = jasmine.createSpy('triggerEvent');
        comp = new PlayerHtmlElement(
            {
                imagesSrc: [{ name: 'very long title '.repeat(8), path: '/img.jpg', thumbPath: '/thumb.jpg' }],
                showGallery: false,
                noToolbar: false,
                noTopbar: false,
                zoomMax: 300,
                zoomMin: 10,
                zoomStep: 10,
                zoomSteps: [10, 20, 30],
                magnifyValue: 300,
                magnifyMaxValue: 600,
                toolbar: {}
            } as any,
            { triggerEvent: playerEventSpy } as any
        );
        document.body.appendChild(comp.getDom());

        const img = comp.getDom().querySelector('img') as HTMLImageElement;
        Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true });
    });

    afterEach(() => {
        comp.removeFromDom();
    });

    it('should initialize topbar/toolbar and manage controls visibility lifecycle', () => {
        const toolBar = (comp as any)._toolBar as HTMLElement;
        const topBar = (comp as any)._topBar as HTMLElement;
        expect(toolBar).toBeTruthy();
        expect(topBar).toBeTruthy();

        (comp as any)._displayState = 'm';
        (comp as any).showControls();
        expect(toolBar.style.display).toBe('block');
        expect(topBar.style.display).toBe('block');

        (comp as any).blockControls();
        (comp as any).hideControls();
        expect(toolBar.style.display).toBe('block');

        (comp as any).releaseControls();
        (comp as any).hideControls();
        expect(toolBar.style.display).toBe('none');
    });

    it('should apply medium state and create cropper instance', () => {
        const createSpy = spyOn<any>(comp, 'createCropperInstance').and.callFake(() => undefined);
        comp.setDisplayState('m', 480, 320);
        expect(createSpy).toHaveBeenCalled();
        expect(comp.getDisplayState()).toBe('m');
    });

    it('should handle escape magnify branch', () => {
        const eventMagnifySpy = spyOn<any>(comp, 'eventMagnify').and.callFake(() => undefined);
        const disableSpy = spyOn<any>(comp, 'disableMagnify').and.callFake(() => undefined);
        const e = {
            key: 'Escape',
            stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation'),
            stopPropagation: jasmine.createSpy('stopPropagation')
        } as any;

        (comp as any).escapeMagnify(e);
        expect(eventMagnifySpy).toHaveBeenCalled();
        expect(disableSpy).toHaveBeenCalled();
        expect(e.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('should cover setDisplayState branches xs/s/sm/l', () => {
        const createSpy = spyOn<any>(comp, 'createCropperInstance').and.callFake(() => undefined);
        comp.setDisplayState('xs', 320, 180, null);
        expect(comp.getDisplayState()).toBe('xs');

        comp.setDisplayState('s', 320, 180, null);
        expect(comp.getDisplayState()).toBe('s');

        comp.setDisplayState('sm', 320, 180, null);
        comp.setDisplayState('l', 320, 180, null);
        expect(createSpy).toHaveBeenCalledTimes(2);
    });

    it('should cover magnify enable/disable paths and close event', () => {
        (comp as any)._cropperWrapper = null;
        (comp as any).eventMagnify();
        expect((comp as any)._magnify).toBeTrue();

        (comp as any).eventMagnify();
        expect((comp as any)._magnify).toBeFalse();

        (comp as any).eventClose();
        expect(playerEventSpy).toHaveBeenCalled();
    });

    it('should cover no-cropper early returns', () => {
        (comp as any)._cropperWrapper = null;
        (comp as any).eventFitToScreen();
        (comp as any).eventFullSize();
        (comp as any).eventZoom({ detail: { value: 10, center: true } } as any);
        (comp as any).eventRotate();
        (comp as any).eventFlipH();
        (comp as any).eventFlipV();
        expect().nothing();
    });

    it('should execute fullscreenchange callback with cropper image data', () => {
        const fitSpy = jasmine.createSpy('fitToCanvas');
        (comp as any)._cropperWrapper = {
            getImageData: () => ({ zoomLevel: 100 }),
            fitToCanvas: fitSpy
        };
        jasmine.clock().install();
        comp.getDom().dispatchEvent(new Event('fullscreenchange'));
        jasmine.clock().tick(160);
        expect(fitSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should trigger switch mode from topbar button click', () => {
        const btn = (comp as any)._btnSwitchMode;
        btn.getDom().dispatchEvent(new Event('click'));
        expect(playerEventSpy).toHaveBeenCalled();
    });

    it('should no-op when hide events are already added', () => {
        (comp as any).addHideEvents();
        const spy = spyOn(comp.getDom(), 'addEventListener').and.callThrough();
        (comp as any).addHideEvents();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should schedule cropper creation retry when image dimensions are zero', () => {
        const img = comp.getDom().querySelector('img') as HTMLImageElement;
        Object.defineProperty(img, 'naturalWidth', { value: 0, configurable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 0, configurable: true });
        const timeoutSpy = spyOn(window, 'setTimeout').and.returnValue(1 as any);
        (comp as any).createCropperInstance();
        expect(timeoutSpy).toHaveBeenCalled();
    });
});
