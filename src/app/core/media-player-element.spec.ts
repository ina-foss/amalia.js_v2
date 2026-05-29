import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MediaPlayerElement} from './media-player-element';
import {DefaultLogger} from './logger/default-logger';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';
import {DefaultMetadataConverter} from './metadata/converter/default-metadata-converter';
import {DefaultMetadataLoader} from './metadata/loader/default-metadata-loader';
import {MediaElement} from './media/media-element';
import {EventEmitter} from 'events';
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
        const mediaPlayer = new MediaElement(obj, eventEmitter);
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
});


