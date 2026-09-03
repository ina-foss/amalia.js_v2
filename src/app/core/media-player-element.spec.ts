import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MediaPlayerElement} from './media-player-element';
import {DefaultLogger} from './logger/default-logger';
import {LoggerLevel} from './logger/logger-level';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';
import {DefaultMetadataConverter} from './metadata/converter/default-metadata-converter';
import {DefaultMetadataLoader} from './metadata/loader/default-metadata-loader';
import {MediaElement} from './media/media-element';
import { EventEmitter } from './utils/event-emitter';
import {ConfigurationManager} from './config/configuration-manager';
import {PlayerEventType} from './constant/event-type';

describe('Test Media player element', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const logger = new DefaultLogger();
    const eventEmitter = new EventEmitter();
    eventEmitter.setMaxListeners(1001);
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);

    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('Init Media player element ', () => {
        const configData = require('tests/assets/config-mpe.json');
        const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const metadataConverter = new DefaultMetadataConverter();
        const metadataLoader = new DefaultMetadataLoader(httpClient, metadataConverter, logger);
        const mpe = new MediaPlayerElement();
        const configurationManager = new ConfigurationManager(loader, logger);
        expect(mpe.getState()).toEqual(PlayerState.CREATED);
        mpe.init(configData, metadataLoader, configLoader)
            .then((state) => {
                expect(state).toEqual(PlayerState.INITIALIZED);
            })
            .catch(() => {
                fail('Error to init player');
            });
        mpe.handleMetadataLoaded();
        expect(mpe.isMetadataLoaded).toEqual(true);
        expect(mpe.metadataManager).toEqual(mpe._metadataManager);
        const obj = document.createElement('video');
        mpe.setMediaPlayer(obj);
        // Référence construite avec l'emitter du mpe : depuis la phase 6, setMediaPlayer connecte
        // le store PlaybackState sur l'emitter interne (11 abonnements), un emitter vierge ne
        // serait plus deep-equal.
        const mediaPlayer = new MediaElement(obj, mpe.eventEmitter);
        mpe.configurationManager.configData = configData;
        expect(mpe.getMediaPlayer()).toEqual(mediaPlayer);
        mpe.setMediaPlayerWidth(620);
        expect(mpe.getDisplayState()).toEqual('s');
        mpe.setMediaPlayerWidth(940);
        expect(mpe.getDisplayState()).toEqual('l');
        mpe.aspectRatio = '4:3';
        mpe.metadataManager = mpe._metadataManager;
        configurationManager.load(configData).then(() => {
            expect(configurationManager.getCoreConfig().player.ratio).toContain('16:9');
        });
        // mpe.loadConfiguration(configData);
        expect(mpe.getThumbnailUrl(140)).toEqual('https://picsum.photos/id/237/200/300?tc=140');
        expect(mpe.getThumbnailUrl(180, true)).toEqual('https://picsum.photos/id/237/200/300?width=170&tc=180');
        expect(mpe.getThumbnailUrl(247.592909, true)).toEqual('https://picsum.photos/id/237/200/300?width=170&tc=247.6');
        expect(mpe.aspectRatio).toEqual('16:9');

    });

    it('should forward host height when resizing picture player', () => {
        const mpe = new MediaPlayerElement() as any;
        const picturePlayer = { setDisplayState: jasmine.createSpy('setDisplayState') };
        const host = document.createElement('div');
        spyOn(host, 'getBoundingClientRect').and.returnValue({ width: 800, height: 450 } as DOMRect);
        mpe.picturePlayer = picturePlayer;
        mpe._picturePlayerHost = host;

        mpe.setMediaPlayerWidth(800);

        expect(picturePlayer.setDisplayState).toHaveBeenCalledWith('l', 800, 450);
    });

    it('should return sm in picture mode when width maps to xs/s', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { media: 'PICTURE' },
                displaySizes: { xsmall: 340, small: 550, medium: 700, large: 900 }
            })
        };
        mpe.width = 300;
        expect(mpe.getDisplayState()).toBe('sm');
    });

    it('should no-op thumbnail url when thumbnail config disabled', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                thumbnail: { enableThumbnail: false, baseUrl: 'https://example.local/img' }
            })
        };
        expect(mpe.getThumbnailUrl(12.34)).toBeUndefined();
    });

    it('getThumbnailUrl applique previewWidth hors survol et width au survol', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                thumbnail: {
                    enableThumbnail: true,
                    baseUrl: 'https://example.local/img',
                    width: 300,
                    previewWidth: 740
                }
            })
        };
        expect(mpe.getThumbnailUrl(10)).toBe('https://example.local/img?width=740&start=10');
        expect(mpe.getThumbnailUrl(10, true)).toBe('https://example.local/img?width=300&start=10');
    });

    it('getThumbnailUrl ne double pas width quand le baseUrl le soude déjà (rétro-compat hôte non migré)', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                thumbnail: {
                    enableThumbnail: true,
                    baseUrl: 'https://example.local/img?width=740',
                    width: 300,
                    previewWidth: 500
                }
            })
        };
        // le width soudé par l'hôte garde la priorité : un seul width= dans l'URL
        expect(mpe.getThumbnailUrl(10)).toBe('https://example.local/img?width=740&start=10');
        expect(mpe.getThumbnailUrl(10, true)).toBe('https://example.local/img?width=740&start=10');
    });

    it('toggleFullscreen should request and exit fullscreen', async () => {
        const mpe = new MediaPlayerElement() as any;
        const element = { requestFullscreen: jasmine.createSpy('requestFullscreen').and.returnValue(Promise.resolve()) };
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        await mpe.toggleFullscreen(element as any);
        expect(element.requestFullscreen).toHaveBeenCalled();

        spyOn(document, 'exitFullscreen').and.returnValue(Promise.resolve());
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: {} });
        await mpe.toggleFullscreen(element as any);
        expect(document.exitFullscreen).toHaveBeenCalled();
    });

    it('setPicturePlayer should warn and return when host is missing', () => {
        const mpe = new MediaPlayerElement() as any;
        const warnSpy = spyOn(mpe.logger, 'warn');
        mpe.setPicturePlayer(null, {} as any);
        expect(warnSpy).toHaveBeenCalled();
    });

    it('init should emit INIT and PICTURE_ZOOM_CHANGE when picture player is active', async () => {
        const configData = require('tests/assets/config-mpe.json');
        configData.loadMetadataOnDemand = true;

        const mpe = new MediaPlayerElement() as any;
        mpe.picturePlayer = {};
        const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const emitSpy = spyOn(mpe.eventEmitter, 'emit').and.callThrough();
        spyOn<any>(mpe, 'setMediaSource').and.callFake(() => undefined);

        await mpe.init(configData, undefined, configLoader);

        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.INIT);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PICTURE_ZOOM_CHANGE, 100);
    });

    it('init should reject with ERROR_LOAD_CONFIG when configuration loading fails', async () => {
        const mpe = new MediaPlayerElement() as any;
        spyOn<any>(mpe, 'loadConfiguration').and.returnValue(Promise.reject('boom'));

        await expectAsync(mpe.init({})).toBeRejectedWith(PlayerState.ERROR_LOAD_CONFIG);
        expect(mpe.getState()).toBe(PlayerState.ERROR_LOAD_CONFIG);
    });

    it('setMediaPlayer should unsubscribe previous media player listeners', () => {
        const mpe = new MediaPlayerElement() as any;
        const unsubscribeSpy = jasmine.createSpy('unsubscribeListeners');
        mpe.mediaPlayer = { unsubscribeListeners: unsubscribeSpy };

        mpe.setMediaPlayer(document.createElement('video'));

        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('selectPictureImage should delegate to picture player', () => {
        const mpe = new MediaPlayerElement() as any;
        const selectSpy = jasmine.createSpy('selectImageBySource');
        mpe.picturePlayer = { selectImageBySource: selectSpy };

        mpe.selectPictureImage('/img.jpg', 'img');

        expect(selectSpy).toHaveBeenCalledWith('/img.jpg', 'img');
    });

    it('applyPicturePlayerLayoutFromHost should apply size and emit resize', () => {
        const mpe = new MediaPlayerElement() as any;
        const setDisplayStateSpy = jasmine.createSpy('setDisplayState');
        const host = document.createElement('div');
        spyOn(host, 'getBoundingClientRect').and.returnValue({ width: 640, height: 360 } as DOMRect);
        mpe.picturePlayer = { setDisplayState: setDisplayStateSpy };
        mpe._picturePlayerHost = host;
        spyOn(mpe, 'getDisplayState').and.returnValue('m');
        const emitSpy = spyOn(mpe.eventEmitter, 'emit');

        const result = mpe.applyPicturePlayerLayoutFromHost(true);

        expect(result).toBeTrue();
        expect(mpe.width).toBe(640);
        expect(setDisplayStateSpy).toHaveBeenCalledWith('m', 640, 360);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_RESIZED);
    });

    it('applyPicturePlayerLayoutFromHost should return false when host size is invalid', () => {
        const mpe = new MediaPlayerElement() as any;
        const host = document.createElement('div');
        spyOn(host, 'getBoundingClientRect').and.returnValue({ width: 0, height: 0 } as DOMRect);
        mpe.picturePlayer = { setDisplayState: jasmine.createSpy('setDisplayState') };
        mpe._picturePlayerHost = host;

        expect(mpe.applyPicturePlayerLayoutFromHost()).toBeFalse();
    });

    it('schedulePicturePlayerLayoutRefresh should no-op when picture player host is missing', () => {
        const mpe = new MediaPlayerElement() as any;
        const rafSpy = spyOn(window, 'requestAnimationFrame').and.callThrough();

        mpe.picturePlayer = null;
        mpe._picturePlayerHost = null;
        mpe.schedulePicturePlayerLayoutRefresh(true);

        expect(rafSpy).not.toHaveBeenCalled();
    });

    it('schedulePicturePlayerLayoutRefresh should refresh via RAF and timeout', () => {
        jasmine.clock().install();
        const mpe = new MediaPlayerElement() as any;
        mpe.picturePlayer = {};
        mpe._picturePlayerHost = document.createElement('div');
        const applySpy = spyOn(mpe, 'applyPicturePlayerLayoutFromHost').and.returnValue(true);
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
            cb(0);
            return 1;
        });

        mpe.schedulePicturePlayerLayoutRefresh(false);
        jasmine.clock().tick(210);

        expect(applySpy).toHaveBeenCalledTimes(2);
        jasmine.clock().uninstall();
    });

    it('unsubscribeListeners should clear picture listeners and delegate media unsubscribe', () => {
        const mpe = new MediaPlayerElement() as any;
        const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();
        const disconnectSpy = jasmine.createSpy('disconnect');
        const unsubscribeSpy = jasmine.createSpy('unsubscribeListeners');
        mpe._picturePlayerResizeHandler = () => undefined;
        mpe._picturePlayerHostResizeRaf = requestAnimationFrame(() => undefined);
        mpe._picturePlayerLayoutTimeout = setTimeout(() => undefined, 1000);
        mpe._picturePlayerHostResizeObserver = { disconnect: disconnectSpy };
        mpe.mediaPlayer = { unsubscribeListeners: unsubscribeSpy };

        mpe.unsubscribeListeners();

        expect(removeSpy).toHaveBeenCalled();
        expect(disconnectSpy).toHaveBeenCalled();
        expect(unsubscribeSpy).toHaveBeenCalled();
        expect(mpe._picturePlayerHost).toBeNull();
    });

    it('aspectRatio should fallback to 16:9 when configuration value is unsupported', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { ratio: '1:1' }
            })
        };

        expect(mpe.aspectRatio).toBe('16:9');
    });

    it('getDisplayState should return m for medium widths and normalize s/xs to sm in picture mode', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { media: 'PICTURE' },
                displaySizes: { xsmall: 340, small: 550, medium: 700, large: 900 }
            })
        };

        mpe.width = 750;
        expect(mpe.getDisplayState()).toBe('m');

        mpe.width = 500;
        expect(mpe.getDisplayState()).toBe('sm');
    });

    it('getThumbnailUrl should keep non finite tc values untouched', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                thumbnail: {
                    enableThumbnail: true,
                    baseUrl: 'https://example.local/t.jpg',
                    tcParam: 'start',
                    width: 120
                }
            })
        };

        expect(mpe.getThumbnailUrl(Number.NaN as any)).toBe('https://example.local/t.jpg?start=NaN');
    });

    it('setPicturePlayer should cleanup previous listeners and emit zoom updates', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { media: 'PICTURE' },
                displaySizes: { xsmall: 340, small: 550, medium: 700, large: 900 }
            })
        };
        const host = document.createElement('div');
        const shadowParent = document.createElement('div');
        const shadowRoot = shadowParent.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(host);
        spyOn(host, 'getBoundingClientRect').and.returnValue({ width: 640, height: 360 } as DOMRect);

        const previousResizeHandler = () => undefined;
        mpe._picturePlayerResizeHandler = previousResizeHandler;
        const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.callThrough();
        const previousObserverDisconnect = jasmine.createSpy('previousObserverDisconnect');
        mpe._picturePlayerHostResizeObserver = { disconnect: previousObserverDisconnect };
        const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();
        mpe._picturePlayerLayoutTimeout = 123 as any;
        const cancelAnimationFrameSpy = spyOn(window, 'cancelAnimationFrame').and.callThrough();
        mpe._picturePlayerHostResizeRaf = 10;

        let resizeObserverCallback: ((entries: ResizeObserverEntry[]) => void) | null = null;
        const observeSpy = jasmine.createSpy('observe');
        const originalResizeObserver = (globalThis as any).ResizeObserver;
        const resizeObserverCtor = function(this: any, cb: (entries: ResizeObserverEntry[]) => void) {
            resizeObserverCallback = cb;
            this.observe = observeSpy;
            this.disconnect = jasmine.createSpy('disconnect');
        } as any;
        (globalThis as any).ResizeObserver = resizeObserverCtor;
        (window as any).ResizeObserver = resizeObserverCtor;
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
            cb(0);
            return 1;
        });

        const emitSpy = spyOn(mpe.eventEmitter, 'emit').and.callThrough();
        mpe.setPicturePlayer(host, {
            imagesSrc: [{ name: 'img-1', path: '/img.jpg', thumbPath: '/img.jpg' }],
            showGallery: false,
            noToolbar: true,
            noTopbar: true
        } as any);

        expect(host.id).toContain('amalia-picture-host-');
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', previousResizeHandler);
        expect(previousObserverDisconnect).toHaveBeenCalled();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(cancelAnimationFrameSpy).toHaveBeenCalled();
        expect(observeSpy).toHaveBeenCalledWith(host);

        mpe.getPicturePlayer().getDom().dispatchEvent(new CustomEvent(PlayerEventType.PICTURE_ZOOM, {
            detail: { imageData: { zoomLevel: 135 } }
        }));
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PICTURE_ZOOM_CHANGE, 135);

        if (resizeObserverCallback) {
            resizeObserverCallback([]);
            resizeObserverCallback([{ contentRect: { width: 700, height: 390 } } as ResizeObserverEntry]);
        }
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_RESIZED);

        mpe.unsubscribeListeners();
        host.remove();
        shadowParent.remove();
        (globalThis as any).ResizeObserver = originalResizeObserver;
        (window as any).ResizeObserver = originalResizeObserver;
    });

    it('setPicturePlayer should drop a stale media player so init() emits INIT for pictures', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { media: 'PICTURE' },
                displaySizes: { xsmall: 340, small: 550, medium: 700, large: 900 }
            })
        };
        spyOn<any>(mpe, 'applyPicturePlayerLayoutFromHost').and.returnValue(false);
        const unsubscribeSpy = jasmine.createSpy('unsubscribeListeners');
        // Recycled instance scenario: same player-id re-registered while the host swaps
        // video → picture; the previous media wrapper must not survive.
        mpe.mediaPlayer = { unsubscribeListeners: unsubscribeSpy };
        const host = document.createElement('div');

        mpe.setPicturePlayer(host, {
            imagesSrc: [{ name: 'img-1', path: '/img.jpg', thumbPath: '/img.jpg' }],
            showGallery: false,
            noToolbar: true,
            noTopbar: true
        } as any);

        expect(unsubscribeSpy).toHaveBeenCalled();
        expect(mpe.getMediaPlayer()).toBeNull();
        expect(mpe.getPicturePlayer()).toBeTruthy();
        mpe.unsubscribeListeners();
    });

    it('setMediaPlayer should drop a stale picture player and its listeners', () => {
        const mpe = new MediaPlayerElement() as any;
        // Recycled instance scenario in the opposite direction (picture → video/audio).
        const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();
        const disconnectSpy = jasmine.createSpy('disconnect');
        mpe.picturePlayer = {};
        mpe._picturePlayerResizeHandler = () => undefined;
        mpe._picturePlayerHostResizeObserver = { disconnect: disconnectSpy };
        mpe._picturePlayerHost = document.createElement('div');

        mpe.setMediaPlayer(document.createElement('video'));

        expect(mpe.getPicturePlayer()).toBeNull();
        expect(mpe._picturePlayerHost).toBeNull();
        expect(removeSpy).toHaveBeenCalled();
        expect(disconnectSpy).toHaveBeenCalled();
        expect(mpe.getMediaPlayer()).toBeTruthy();
    });

    it('setPicturePlayer should fallback to default display state when host layout is unavailable', () => {
        const mpe = new MediaPlayerElement() as any;
        mpe.configurationManager = {
            getCoreConfig: () => ({
                player: { media: 'PICTURE' },
                displaySizes: { xsmall: 340, small: 550, medium: 700, large: 900 }
            })
        };
        spyOn<any>(mpe, 'applyPicturePlayerLayoutFromHost').and.returnValue(false);
        const host = document.createElement('div');
        Object.defineProperty(host, 'offsetWidth', { configurable: true, value: 0 });
        Object.defineProperty(host, 'offsetHeight', { configurable: true, value: 0 });

        mpe.setPicturePlayer(host, {
            imagesSrc: [{ name: 'img-1', path: '/img.jpg', thumbPath: '/img.jpg' }],
            showGallery: false,
            noToolbar: true,
            noTopbar: true
        } as any);

        expect(mpe.getPicturePlayer()).toBeTruthy();
        mpe.unsubscribeListeners();
    });
});



