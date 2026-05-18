import PlayerHtmlElement from './PlayerHtmlElement';
import AmaliaEventConstants from '../business/AmaliaEventConstants';

describe('PlayerHtmlElement', () => {
    function makeSetting(name = 'photo title') {
        return {
            mode: 'simple',
            showGallery: false,
            zoomStep: 25,
            zoomSteps: null,
            zoomMax: 300,
            zoomMin: 10,
            magnifyValue: 400,
            magnifyMaxValue: 800,
            toolbar: {},
            imagesSrc: [{ name, path: '/img-1.jpg', thumbPath: '/thumb-1.jpg' }]
        } as any;
    }

    function createPlayer(name = 'photo title') {
        const playerInstance = { triggerEvent: jasmine.createSpy('triggerEvent') } as any;
        const player = new PlayerHtmlElement(makeSetting(name), playerInstance);
        document.body.appendChild(player.getDom());
        return { player, playerInstance };
    }

    afterEach(() => {
        document.querySelectorAll('.ajs-photo-cropper-content').forEach((n) => n.remove());
    });

    it('should initialize DOM and set truncated title', () => {
        const longTitle = 'x'.repeat(80);
        const { player } = createPlayer(longTitle);
        const title = player.getDom().querySelector('.ajs-photo-top-middle') as HTMLDivElement;

        expect(player.getDom().className).toContain('ajs-photo-cropper-content');
        expect((player as any)._image.src).toContain('/img-1.jpg');
        expect(title.textContent?.length).toBe(63);
    });

    it('setMode should ignore unknown mode', () => {
        const { player } = createPlayer();
        player.setMode('unknown');

        expect(player.getMode()).toBeUndefined();
    });

    it('setMode reduced should render reduced gallery and apply dimensions', () => {
        const { player } = createPlayer();

        player.setMode('reduced', 400, 200, ['/a.jpg', '/b.jpg']);

        expect(player.getMode()).toBe('reduced');
        expect(player.getDom().style.width).toBe('400px');
        expect(player.getDom().style.height).toBe('200px');
        expect(player.getDom().querySelectorAll('div.ajs-photo-reduced-view').length).toBe(2);
        expect((player as any)._image.style.display).toBe('none');
    });

    it('setMode reduced without gallery should show main image', () => {
        const { player } = createPlayer();
        (player as any)._cropperWrapper = { destroy: jasmine.createSpy('destroy') };

        player.setMode('reduced', 400, 200, ['/a.jpg', '/b.jpg']);
        player.setMode('reduced', 400, 200, null as any);

        expect((player as any)._cropperWrapper.destroy).toHaveBeenCalled();
        expect((player as any)._image.style.display).toBe('block');
    });

    it('setMode simple should trigger ready event', () => {
        const { player } = createPlayer();

        player.setMode('simple');

        const call = ((player as any)._playerInstance.triggerEvent as jasmine.Spy).calls.mostRecent().args[0] as CustomEvent;
        expect(call.type).toBe(AmaliaEventConstants.ready);
        expect(player.getMode()).toBe('simple');
    });

    it('setMode advanced should create cropper instance', () => {
        const { player } = createPlayer();
        const createCropperInstanceSpy = spyOn(player as any, 'createCropperInstance');

        player.setMode('advanced');

        expect(createCropperInstanceSpy).toHaveBeenCalled();
        expect(player.getMode()).toBe('advanced');
    });

    it('eventZoom should zoom and center when requested', () => {
        const { player } = createPlayer();
        const zoom = jasmine.createSpy('zoom');
        const center = jasmine.createSpy('center');
        (player as any)._cropperWrapper = { zoom, center };

        (player as any).eventZoom(new CustomEvent('x', { detail: { value: 150, center: true } }));

        expect(zoom).toHaveBeenCalledWith(150);
        expect(center).toHaveBeenCalled();
    });

    it('event actions should call cropper wrapper and emit player events', () => {
        const { player, playerInstance } = createPlayer();
        const cropData = { zoomLevel: 100 };
        (player as any)._cropperWrapper = {
            fitToCanvas: jasmine.createSpy('fitToCanvas'),
            fitToOrignalSize: jasmine.createSpy('fitToOrignalSize'),
            rotate: jasmine.createSpy('rotate'),
            flipHorizontally: jasmine.createSpy('flipHorizontally'),
            flipVertically: jasmine.createSpy('flipVertically'),
            getImageData: jasmine.createSpy('getImageData').and.returnValue(cropData)
        };

        (player as any).eventFitToScreen();
        (player as any).eventFullSize();
        (player as any).eventDownload();
        (player as any).eventRotate();
        (player as any).eventFlipH();
        (player as any).eventFlipV();
        (player as any).eventClose();

        const triggeredTypes = (playerInstance.triggerEvent as jasmine.Spy).calls.allArgs().map((args) => args[0].type);
        expect(triggeredTypes).toContain(AmaliaEventConstants.fitToScreen);
        expect(triggeredTypes).toContain(AmaliaEventConstants.download);
        expect(triggeredTypes).toContain(AmaliaEventConstants.rotate);
        expect(triggeredTypes).toContain(AmaliaEventConstants.flipHorizontally);
        expect(triggeredTypes).toContain(AmaliaEventConstants.flipVertically);
        expect(triggeredTypes).toContain(AmaliaEventConstants.close);
    });

    it('eventMagnify should toggle magnify mode and trigger event', () => {
        const { player, playerInstance } = createPlayer();
        const enableSpy = spyOn(player as any, 'enableMagnify');
        const disableSpy = spyOn(player as any, 'disableMagnify');

        (player as any).eventMagnify();
        (player as any).eventMagnify();

        expect(enableSpy).toHaveBeenCalledTimes(1);
        expect(disableSpy).toHaveBeenCalledTimes(1);
        const magnifyCalls = (playerInstance.triggerEvent as jasmine.Spy).calls.allArgs().filter((args) => args[0].type === AmaliaEventConstants.magnify);
        expect(magnifyCalls.length).toBe(2);
    });

    it('enable/disable magnify should toggle controls and css state', () => {
        const { player } = createPlayer();
        const cropperContainer = document.createElement('div');
        cropperContainer.className = 'cropper-container';
        document.body.appendChild(cropperContainer);
        Object.defineProperty(cropperContainer, 'offsetWidth', { value: 200, configurable: true });
        Object.defineProperty(cropperContainer, 'offsetHeight', { value: 100, configurable: true });
        spyOn(player.getDom(), 'getBoundingClientRect').and.returnValue({ left: 0, top: 0 } as DOMRect);
        (player as any)._cropperWrapper = {
            getImageData: () => ({
                src: '/a.jpg',
                src_width: 1000,
                src_height: 500,
                left: 0,
                top: 0,
                rotate: 0,
                crop_left: null,
                crop_top: null,
                crop_width: null,
                crop_height: null,
                flop: 0,
                flip: 0,
                zoomLevel: 100
            })
        };

        (player as any).enableMagnify();
        expect(player.getDom().className).toContain('ajs-photo-magnify');

        (player as any).disableMagnify();
        expect(player.getDom().className).not.toContain('ajs-photo-magnify');
        cropperContainer.remove();
    });

    it('escapeMagnify should stop propagation on Escape key', () => {
        const { player } = createPlayer();
        const eventMagnifySpy = spyOn(player as any, 'eventMagnify');
        const disableSpy = spyOn(player as any, 'disableMagnify');
        const event: any = {
            key: 'Escape',
            stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation'),
            stopPropagation: jasmine.createSpy('stopPropagation')
        };

        (player as any).escapeMagnify(event);

        expect(eventMagnifySpy).toHaveBeenCalled();
        expect(disableSpy).toHaveBeenCalled();
        expect(event.stopImmediatePropagation).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('getCropperImgPos should compute pointer position from container bounds', () => {
        const { player } = createPlayer();
        spyOn(player.getDom(), 'getBoundingClientRect').and.returnValue({ left: 20, top: 10 } as DOMRect);
        spyOnProperty(window, 'pageXOffset', 'get').and.returnValue(5);
        spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(3);

        const pos = (player as any).getCropperImgPos({ pageX: 100, pageY: 80 });

        expect(pos).toEqual({ x: 75, y: 67 });
    });

    it('replaceSrc should update image and recreate cropper in advanced mode', () => {
        jasmine.clock().install();
        const { player } = createPlayer();
        const destroy = jasmine.createSpy('destroy');
        (player as any)._cropperWrapper = { destroy };
        (player as any)._mode = 'advanced';
        const createCropperSpy = spyOn(player as any, 'createCropperInstance');
        const setTitleSpy = spyOn(player as any, 'setTitle').and.callThrough();

        player.replaceSrc('/next.jpg', 'next title');
        jasmine.clock().tick(301);

        expect((player as any)._image.src).toContain('/next.jpg');
        expect(destroy).toHaveBeenCalled();
        expect(createCropperSpy).toHaveBeenCalled();
        expect(setTitleSpy).toHaveBeenCalledWith('next title');
        jasmine.clock().uninstall();
    });

    it('fullscreen should delegate to eventFullscreen', () => {
        const { player } = createPlayer();
        const spy = spyOn(player as any, 'eventFullscreen');

        player.fullscreen();

        expect(spy).toHaveBeenCalled();
    });

    it('eventFullscreen should use enter and exit fullscreen APIs', async () => {
        const { player, playerInstance } = createPlayer();
        const originalFullscreenElement = (document as any).fullscreenElement;
        const originalExit = document.exitFullscreen;
        const originalRequest = (player.getDom() as any).requestFullscreen;

        (player.getDom() as any).requestFullscreen = jasmine.createSpy('requestFullscreen').and.returnValue(Promise.resolve());
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        await (player as any).eventFullscreen();
        await Promise.resolve();

        document.exitFullscreen = jasmine.createSpy('exitFullscreen').and.returnValue(Promise.resolve() as any);
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: {} });
        await (player as any).eventFullscreen();
        await Promise.resolve();

        const events = (playerInstance.triggerEvent as jasmine.Spy).calls.allArgs().map((a) => a[0].type);
        expect(events.filter((e) => e === AmaliaEventConstants.fullscreen).length).toBe(2);

        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: originalFullscreenElement });
        document.exitFullscreen = originalExit;
        (player.getDom() as any).requestFullscreen = originalRequest;
    });

    it('fullscreenchange listener should toggle icon and refit cropper', () => {
        jasmine.clock().install();
        const { player } = createPlayer();
        (player as any)._cropperWrapper = {
            getImageData: jasmine.createSpy('getImageData').and.returnValue({ zoomLevel: 100 }),
            fitToCanvas: jasmine.createSpy('fitToCanvas')
        };
        const toggleIconSpy = spyOn((player as any)._btnFullScreen, 'toggleIcon').and.callThrough();

        player.getDom().dispatchEvent(new Event('fullscreenchange'));
        jasmine.clock().tick(151);

        expect(toggleIconSpy).toHaveBeenCalled();
        expect((player as any)._cropperWrapper.fitToCanvas).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('zoom helpers should delegate to IncrementInfo', () => {
        const { player } = createPlayer();
        (player as any)._zoomInfo = {
            increment: jasmine.createSpy('increment'),
            decrement: jasmine.createSpy('decrement'),
            showRealSize: jasmine.createSpy('showRealSize')
        };

        player.zoom();
        player.unZoom();
        player.showRealSize();

        expect((player as any)._zoomInfo.increment).toHaveBeenCalled();
        expect((player as any)._zoomInfo.decrement).toHaveBeenCalled();
        expect((player as any)._zoomInfo.showRealSize).toHaveBeenCalled();
    });

    it('public wrappers should call private actions', () => {
        const { player } = createPlayer();
        const flipVSpy = spyOn(player as any, 'eventFlipV');
        const flipHSpy = spyOn(player as any, 'eventFlipH');
        const rotateSpy = spyOn(player as any, 'eventRotate');
        const magnifySpy = spyOn(player as any, 'eventMagnify');

        player.flipV();
        player.flipH();
        player.rotate();
        player.magnify();

        expect(flipVSpy).toHaveBeenCalled();
        expect(flipHSpy).toHaveBeenCalled();
        expect(rotateSpy).toHaveBeenCalled();
        expect(magnifySpy).toHaveBeenCalled();
    });

    it('destroy should destroy cropper wrapper when present', () => {
        const { player } = createPlayer();
        const destroy = jasmine.createSpy('destroy');
        (player as any)._cropperWrapper = { destroy };

        player.destroy();

        expect(destroy).toHaveBeenCalled();
    });

    it('removeFromDom should remove all children widgets and host', () => {
        const { player } = createPlayer();
        (player as any)._zoomInfo = { removeFromDom: jasmine.createSpy('removeZoom') };
        (player as any)._btnFullScreen = { removeFromDom: jasmine.createSpy('removeFs') };
        (player as any)._btnFlipH = { removeFromDom: jasmine.createSpy('removeFH') };
        (player as any)._btnFlipV = { removeFromDom: jasmine.createSpy('removeFV') };
        (player as any)._btnRotate = { removeFromDom: jasmine.createSpy('removeRt') };
        (player as any)._btnMagnify = { removeFromDom: jasmine.createSpy('removeMag') };
        (player as any)._btnSwitchMode = { removeFromDom: jasmine.createSpy('removeSw') };
        (player as any)._btnClose = { removeFromDom: jasmine.createSpy('removeCls') };
        (player as any)._btnDownload = { removeFromDom: jasmine.createSpy('removeDl') };
        (player as any)._btnFitScreen = { removeFromDom: jasmine.createSpy('removeFit') };
        (player as any)._btnFullSize = { removeFromDom: jasmine.createSpy('removeFull') };

        player.removeFromDom();

        expect((player as any)._zoomInfo.removeFromDom).toHaveBeenCalled();
        expect(document.body.contains(player.getDom())).toBeFalse();
    });
});
