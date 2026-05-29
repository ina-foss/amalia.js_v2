import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { AmaliaComponent } from './amalia.component';
import { MediaPlayerService } from '../service/media-player-service';
import { ThumbnailService } from '../service/thumbnail-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaPlayerElement } from "../core/media-player-element";
import { DefaultLogger } from "../core/logger/default-logger";
import { HttpClient } from "@angular/common/http";
import { DefaultConfigLoader } from "../core/config/loader/default-config-loader";
import { DefaultConfigConverter } from "../core/config/converter/default-config-converter";
import { ConfigurationManager } from "../core/config/configuration-manager";
import { DefaultMetadataLoader } from "../core/metadata/loader/default-metadata-loader";
import { DefaultMetadataConverter } from "../core/metadata/converter/default-metadata-converter";
import { MetadataManager } from "../core/metadata/metadata-manager";
import { PlayerEventType } from "../core/constant/event-type";

const config = { ...require('tests/assets/config-mpe.json'), player: { autoplay: false } };

const initTestData = (component: AmaliaComponent, mediaPlayerElement: MediaPlayerElement, httpClient: HttpClient) => {
    mediaPlayerElement = new MediaPlayerElement();
    const logger = new DefaultLogger();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
    mediaPlayerElement.configurationManager.configData = config;
    httpClient = TestBed.inject(HttpClient);
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
    component.mediaPlayerElement = mediaPlayerElement;
    return mediaPlayerElement;
}

describe('AmaliaComponent', () => {
    let component: AmaliaComponent;
    let fixture: ComponentFixture<AmaliaComponent>;
    let thumbnailService: ThumbnailService;
    let httpClient: HttpClient;
    let mediaPlayerElement: MediaPlayerElement;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AmaliaComponent],
            imports: [HttpClientTestingModule],
            providers: [
                MediaPlayerService,
                ThumbnailService,
                { provide: DomSanitizer, useValue: { bypassSecurityTrustUrl: (url) => url } }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmaliaComponent);
        component = fixture.componentInstance;
        thumbnailService = TestBed.inject(ThumbnailService);
        component.config = config;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should initialize media player on init', () => {
        const initDefaultHandlersMock = spyOn(component as any, 'initDefaultHandlers').and.callThrough();
        const bindEventsMock = spyOn(component as any, 'bindEvents').and.callThrough();
        fixture.detectChanges();
        expect(initDefaultHandlersMock).toHaveBeenCalled();
        expect(bindEventsMock).toHaveBeenCalled();
    });
    it('should initialize media player on init with the config on and type string', () => {
        const initDefaultHandlersMock = spyOn(component as any, 'initDefaultHandlers').and.callThrough();
        const bindEventsMock = spyOn(component as any, 'bindEvents').and.callThrough();
        component.config = 'http://localhost:9876/assets/dummy';
        fixture.detectChanges();
        expect(initDefaultHandlersMock).toHaveBeenCalled();
        expect(bindEventsMock).toHaveBeenCalled();
    });
    it('should initialize media player on init with the config on and call onInitConfig', fakeAsync(() => {
        mediaPlayerElement = initTestData(component, mediaPlayerElement, httpClient);
        const initDefaultHandlersMock = spyOn(component as any, 'initDefaultHandlers').and.callThrough();
        const bindEventsMock = spyOn(component as any, 'bindEvents').and.callThrough();
        const mediaPlayerElementInitMock = spyOn(component.mediaPlayerElement, 'init').and.resolveTo(1);
        const getPlayer = spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        const mediaPlayerElementGetConfigurationMock = spyOn(component.mediaPlayerElement, 'getConfiguration').and.returnValue(config);
        component.config = config;
        fixture.detectChanges();
        tick(100);
        expect(initDefaultHandlersMock).toHaveBeenCalled();
        expect(bindEventsMock).toHaveBeenCalled();
        expect(getPlayer).toHaveBeenCalled();
        expect(mediaPlayerElementInitMock).toHaveBeenCalled();
        expect(mediaPlayerElementGetConfigurationMock).toHaveBeenCalled();
    }));
    it('should handle window resize', () => {
        fixture.detectChanges();
        const updatePlayerSizeWithAspectRatioMock = spyOn(component as any, 'updatePlayerSizeWithAspectRatio').and.callThrough();
        component.handleWindowResize();
        expect(updatePlayerSizeWithAspectRatioMock).not.toHaveBeenCalled();
    });

    it('should handle context menu', () => {
        fixture.detectChanges();
        const event = new MouseEvent('contextmenu', { clientX: 100, clientY: 100 });
        component.onContextMenu(event);
        expect(component.contextMenuState).toBeTrue();
    });

    it('should handle play event', () => {
        fixture.detectChanges();
        component._setEnableThumbnailForTesting(true);
        spyOn(component as any, 'handlePlay').and.callThrough();
        component._handlePlayForTesting();
        expect(component.enablePreviewThumbnail).toBeFalse();
        expect(component.previewThumbnailUrl).toBe('');
    });

    it('should handle error event', () => {
        fixture.detectChanges();
        const errorEvent = { message: 'Error' };
        component._handleErrorForTesting(errorEvent);
        expect(component.inError).toBeTrue();
        expect(component.errorMessage).toEqual(errorEvent);
    });
    it('should handle erase error event', () => {
        fixture.detectChanges();
        const errorEvent = { message: 'Error Erased' };
        component._handleEraseErrorForTesting(errorEvent);
        expect(component.inError).toBeFalse();
        expect(component.errorMessage).toEqual(errorEvent);
    });

    it('should set preview thumbnail', () => {
        fixture.detectChanges();
        component._setEnableThumbnailForTesting(true);

        const getThumbnailUrlMock = spyOn(component.mediaPlayerElement, 'getThumbnailUrl');
        getThumbnailUrlMock.and.returnValue('blobUrl');

        const getThumbnailMock = spyOn(thumbnailService, 'getThumbnail');
        getThumbnailMock.and.returnValue(Promise.resolve('blobUrl'));

        component._setPreviewThumbnailForTesting(10);

        expect(getThumbnailUrlMock).toHaveBeenCalled();
        expect(getThumbnailMock).toHaveBeenCalled();
    });

    it('should handlePinnedControlbarChange', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(thumbnailService, 'getThumbnail').and.returnValue(Promise.resolve('blobUrl'));
        spyOn(component as any, 'setPreviewThumbnail').and.callThrough().withArgs(10);
        const emitMock = spyOn(component.mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_CONTROLBAR_CHANGE, true);
        tick(100);
        expect(component.pinnedControlbar).toBeTrue();
        const expects = emitMock.calls.all();
        expect(expects[0].args[0]).toEqual(PlayerEventType.PINNED_CONTROLBAR_CHANGE);  //TIME_CHANGE
        expect(expects[0].args[1]).toBeTrue(); //handleOnTimeChange
        expect(expects[1].args[0]).toEqual(PlayerEventType.CONTROL_BAR_TOGGLED);  //TIME_CHANGE
        expect(expects[1].args[1]).toEqual({
            pinnedControlBar: true,
            pinned: false
        });
        flush();
    }));

    it('should handlePinnedSliderChange', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(thumbnailService, 'getThumbnail').and.returnValue(Promise.resolve('blobUrl'));
        spyOn(component as any, 'setPreviewThumbnail').and.callThrough().withArgs(10);
        const emitMock = spyOn(component.mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_SLIDER_CHANGE, true);
        tick(100);
        expect(component.pinnedControlbar).toBeFalse();
        expect(emitMock).toHaveBeenCalledWith(PlayerEventType.CONTROL_BAR_TOGGLED, {
            pinnedControlbar: false,
            pinned: true
        });
        flush();
    }));
    it('should displayControlBar', () => {
        fixture.detectChanges();
        const emitMock = spyOn(component.mediaPlayerElement.eventEmitter, 'emit');
        emitMock.and.callThrough();
        component.displayControlBar(true);
        expect(emitMock).toHaveBeenCalledWith(PlayerEventType.PLAYER_MOUSE_ENTER);
        component.displayControlBar(false);
        expect(emitMock).toHaveBeenCalledWith(PlayerEventType.PLAYER_MOUSE_LEAVE);
    });
    it('should handleFullScreenChange', () => {
        fixture.detectChanges();
        component.mediaPlayer.nativeElement.style.display = 'block';
        const mockToggleFullscreenspyOn = spyOn(component.mediaPlayerElement, 'toggleFullscreen');
        mockToggleFullscreenspyOn.and.callThrough();
        const mediaContaineElementParent: HTMLElement = component.mediaContainer.nativeElement.offsetParent as unknown as HTMLElement;
        const mockRequestFullScreen = spyOn(mediaContaineElementParent, 'requestFullscreen');
        mockRequestFullScreen.and.resolveTo();
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
        expect(mockToggleFullscreenspyOn).toHaveBeenCalled();
    });
    it('should handleFullScreenChange second path', () => {
        fixture.detectChanges();
        component.mediaPlayer.nativeElement.style.display = 'block';
        component.mediaContainer.nativeElement.style.position = 'fixed';
        const mockToggleFullscreenspyOn = spyOn(component.mediaPlayerElement, 'toggleFullscreen');
        mockToggleFullscreenspyOn.and.callThrough();
        const mockRequestFullScreen = spyOn(component.mediaContainer.nativeElement, 'requestFullscreen');
        mockRequestFullScreen.and.resolveTo();
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
        expect(mockToggleFullscreenspyOn).toHaveBeenCalled();
    });
    afterEach(() => {
        fixture.destroy();
    });
});

describe('AmaliaComponent - runtime controls', () => {
    let component: AmaliaComponent;
    let emitSpy: jasmine.Spy;
    let mediaMock: any;

    beforeEach(() => {
        component = new AmaliaComponent(
            new MediaPlayerServiceStub() as any,
            {} as any,
            new ThumbnailServiceStub() as any,
            { detectChanges: () => { } } as any
        );

        emitSpy = jasmine.createSpy('emit');
        mediaMock = {
            reverseMode: false,
            framerate: 25,
            pause: jasmine.createSpy('pause'),
            play: jasmine.createSpy('play'),
            setCurrentTime: jasmine.createSpy('setCurrentTime'),
            getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(10),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(20),
            getPlaybackRate: jasmine.createSpy('getPlaybackRate').and.returnValue(1),
            playPause: jasmine.createSpy('playPause')
        };
        (component as any).mediaPlayerElement = {
            eventEmitter: { emit: emitSpy },
            getMediaPlayer: () => mediaMock,
            getThumbnailUrl: jasmine.createSpy('getThumbnailUrl').and.returnValue('/thumb.jpg'),
            getConfiguration: jasmine.createSpy('getConfiguration').and.returnValue({
                player: { autoplay: true, ratio: '16:9', poster: '/poster.jpg', posterBackground: 'amalia-primary-color' },
                thumbnail: { enableThumbnail: true },
                debug: false,
                logLevel: 'Info'
            }),
            preferenceStorageManager: {
                getItem: jasmine.createSpy('getItem').and.returnValue(null)
            },
            toggleFullscreen: jasmine.createSpy('toggleFullscreen')
        };
        component.previewThumbnailElement = { nativeElement: document.createElement('img') } as any;
        component.mediaContainer = { nativeElement: document.createElement('div') } as any;
        const video = document.createElement('video');
        const videoParent = document.createElement('div');
        Object.defineProperty(videoParent, 'offsetWidth', { configurable: true, value: 500 });
        Object.defineProperty(videoParent, 'offsetHeight', { configurable: true, value: 300 });
        videoParent.appendChild(video);
        component.mediaPlayer = { nativeElement: video } as any;
        (component as any).thumbnailService = {
            getThumbnail: () => Promise.resolve('blob'),
            listThumbnails: []
        };
        component.playerHover = true;
    });

    it('should emit keydown/keyup and manage pressed keys list', () => {
        const evt = { key: ' ', preventDefault: jasmine.createSpy('preventDefault') } as any;
        component.emitKeyDownEvent(evt);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.KEYDOWN, 'espace');
        expect(evt.preventDefault).toHaveBeenCalled();

        component.emitKeyUpEvent();
        expect(component.listKeys).toEqual([]);
    });

    it('handleKeyDownEvent should set hover and forward to emitKeyDownEvent', () => {
        const spy = spyOn(component, 'emitKeyDownEvent');
        component.playerHover = false;
        component.handleKeyDownEvent({ key: 'a' } as any);
        expect(component.playerHover).toBeTrue();
        expect(spy).toHaveBeenCalled();
    });

    it('timer helpers should start/reset timer and hide controls', () => {
        spyOn(window, 'setTimeout').and.returnValue(123 as any);
        const clearSpy = spyOn(window, 'clearTimeout');
        const startSpy = spyOn(component, 'startTimer').and.callThrough();

        component.startTimer();
        component.resetTimer();
        component.hideControls();

        expect(component.chrono).toBe(123 as any);
        expect(clearSpy).toHaveBeenCalled();
        expect(startSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_MOUSE_LEAVE);
    });

    it('scrollPlaybackRateImages and clearInterval should control simulated playback', () => {
        const intervalSpy = spyOn(window, 'setInterval').and.returnValue(55 as any);
        const clearSpy = spyOn(window, 'clearInterval');

        component.scrollPlaybackRateImages(-2);
        expect(intervalSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_SIMULATE_SLIDER);

        component.intervalImages = 55 as any;
        component.tc = 12;
        component.clearInterval();
        expect(clearSpy).toHaveBeenCalledWith(55 as any);
        expect(mediaMock.setCurrentTime).toHaveBeenCalledWith(12);
        expect(mediaMock.play).toHaveBeenCalled();
    });

    it('displayImages should advance and rewind with thumbnail loop', () => {
        component._setEnableThumbnailForTesting(true);
        const loopSpy = spyOn(component, 'loopImages').and.stub();

        component.tc = 1;
        component.displayImages(50, 1000, false);
        expect(component.enablePreviewThumbnail).toBeTrue();
        expect(loopSpy).toHaveBeenCalled();

        component.tc = 1;
        component.displayImages(50, 1000, true);
        expect(mediaMock.setCurrentTime).toHaveBeenCalled();
    });

    it('showImage should resolve on image load and set thumbnail URL', fakeAsync(() => {
        const img = component.previewThumbnailElement.nativeElement as unknown as HTMLImageElement;
        const p = component.showImage(5) as Promise<number>;
        img.onload(new Event('load'));
        tick();

        expect((component as any).thumbnailBlobVideo).toBe('/thumb.jpg');
        p.then((value) => expect(value).toBeGreaterThanOrEqual(0));
    }));

    it('handleSeeking/handleSeeked should request thumbnails when enabled', () => {
        component._setEnableThumbnailForTesting(true);
        const throttleSpy = spyOn(component as any, 'throttleFunc').and.stub();
        const setPreviewSpy = spyOn<any>(component, 'setPreviewThumbnail').and.callThrough();

        (component as any).handleSeeking(3.14159);
        expect(component.enablePreviewThumbnail).toBeTrue();
        expect(throttleSpy).toHaveBeenCalled();

        setPreviewSpy.calls.reset();
        (component as any).handleSeeked();
        expect(setPreviewSpy).toHaveBeenCalled();
    });

    it('onInitConfig/onErrorInitConfig and control click should update state', () => {
        component.handleLoading();
        expect(component.inLoading).toBeTrue();
        component.handleLoadingEnd();
        expect(component.inLoading).toBeFalse();

        (component as any).onInitConfig('READY' as any);
        expect(component.autoplay).toBeTrue();
        expect(component.videoPoster).toBe('/poster.jpg');
        expect(component.posterBackgound['amalia-primary-color']).toBeTrue();

        (component as any).onErrorInitConfig('ERROR' as any);
        expect(component.inError).toBeTrue();

        component.controlClicked({} as any);
        expect(mediaMock.playPause).toHaveBeenCalled();
    });

    it('handleFullScreenChange should choose module parent when available', () => {
        const moduleParent = document.createElement('div');
        moduleParent.classList.add('module', 'player');
        const mid = document.createElement('div');
        const child = document.createElement('div');
        Object.defineProperty(child, 'offsetParent', { configurable: true, value: mid });
        Object.defineProperty(mid, 'offsetParent', { configurable: true, value: moduleParent });
        Object.defineProperty(component.mediaPlayer.nativeElement, 'offsetParent', { configurable: true, value: child });
        Object.defineProperty(component.mediaContainer.nativeElement, 'offsetWidth', { configurable: true, value: 400 });
        Object.defineProperty(component.mediaContainer.nativeElement, 'offsetHeight', { configurable: true, value: 300 });

        (component as any).handleFullScreenChange();
        expect((component as any).mediaPlayerElement.toggleFullscreen).toHaveBeenCalledWith(moduleParent);
    });
});



describe('AmaliaComponent - targeted new code coverage', () => {
    let component: AmaliaComponent;
    let mediaPlayerElementMock: any;

    beforeEach(() => {
        component = new AmaliaComponent(
            {
                get: jasmine.createSpy('get'),
                increment: jasmine.createSpy('increment'),
                decrement: jasmine.createSpy('decrement')
            } as any,
            {} as any,
            { getThumbnail: () => Promise.resolve('blob'), listThumbnails: [] } as any,
            { detectChanges: jasmine.createSpy('detectChanges') } as any
        );

        mediaPlayerElementMock = {
            eventEmitter: { emit: jasmine.createSpy('emit') },
            init: jasmine.createSpy('init').and.resolveTo(1),
            setPicturePlayer: jasmine.createSpy('setPicturePlayer'),
            setMediaPlayer: jasmine.createSpy('setMediaPlayer'),
            setMediaPlayerWidth: jasmine.createSpy('setMediaPlayerWidth'),
            getThumbnailUrl: jasmine.createSpy('getThumbnailUrl').and.returnValue('/thumb.jpg'),
            getMediaPlayer: jasmine.createSpy('getMediaPlayer').and.returnValue({
                framerate: 25,
                reverseMode: false,
                pause: jasmine.createSpy('pause'),
                play: jasmine.createSpy('play'),
                setCurrentTime: jasmine.createSpy('setCurrentTime'),
                getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(1),
                getDuration: jasmine.createSpy('getDuration').and.returnValue(10),
                getPlaybackRate: jasmine.createSpy('getPlaybackRate').and.returnValue(1)
            })
        };

        (component.playerService as any).get.and.returnValue(mediaPlayerElementMock);

        component.mediaPlayer = { nativeElement: document.createElement('video') } as any;
        component.photoHost = { nativeElement: document.createElement('div') } as any;
        component.mediaContainer = { nativeElement: document.createElement('div') } as any;
        Object.defineProperty(component.mediaContainer.nativeElement, 'offsetWidth', { value: 500, configurable: true });
        Object.defineProperty(component.mediaContainer.nativeElement, 'offsetHeight', { value: 300, configurable: true });
        component.previewThumbnailElement = { nativeElement: document.createElement('img') } as any;

        component.configLoader = {} as any;
        component.metadataConverter = {} as any;
        component.metadataLoader = {} as any;
    });

    it('ngOnInit should configure picture player when media is PICTURE', fakeAsync(() => {
        component.config = {
            player: {
                media: 'PICTURE',
                src: '/fallback.jpg',
                data: {
                    images: [null, { url: '/a.jpg', label: 'A' }, { src: '' }]
                }
            }
        } as any;

        component.ngOnInit();
        tick();

        expect(mediaPlayerElementMock.setPicturePlayer).toHaveBeenCalled();
        const args = mediaPlayerElementMock.setPicturePlayer.calls.mostRecent().args;
        expect(args[1].imagesSrc[0].path).toBe('/a.jpg');
    }));

    it('ngOnInit should log error when handlers are missing', () => {
        component.configLoader = undefined as any;
        component.metadataConverter = undefined as any;
        component.metadataLoader = undefined as any;
        component.config = { player: { media: 'VIDEO' } } as any;

        spyOn<any>(component, 'initDefaultHandlers').and.callFake(() => undefined);
        const loggerSpy = spyOn(component.logger, 'error');

        component.ngOnInit();

        expect(loggerSpy).toHaveBeenCalledWith('Error to initialize media player element.');
    });

    it('ngOnInit should call setPreviewThumbnail(0) when thumbnail is already enabled', fakeAsync(() => {
        component.config = { player: { media: 'VIDEO' } } as any;
        (component as any).enableThumbnail = true;
        const previewSpy = spyOn<any>(component, 'setPreviewThumbnail').and.callFake(() => undefined);

        component.ngOnInit();
        tick();

        expect(previewSpy).toHaveBeenCalledWith(0);
    }));

    it('resolvePictureImages should fallback to player.src when data is invalid', () => {
        const result = (component as any).resolvePictureImages({
            src: '/fallback.png',
            data: { images: [null, { foo: 'bar' }] }
        });

        expect(result.length).toBe(1);
        expect(result[0].path).toBe('/fallback.png');
    });

    it('handleAspectRatioChange and document click should emit expected events', () => {
        const resizeSpy = spyOn(component, 'updatePlayerSizeWithAspectRatio');
        (component as any).mediaPlayerElement = mediaPlayerElementMock;

        (component as any).handleAspectRatioChange('4:3');
        component.hideControlsMenuOnClickDocument({ any: 'event' } as any);

        expect(component.aspectRatio).toBe('4:3');
        expect(resizeSpy).toHaveBeenCalled();
        expect(mediaPlayerElementMock.eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.DOCUMENT_CLICK, { any: 'event' } as any);
    });

    it('emitKeyDownEvent should append additional keys to listKeys', () => {
        component.playerHover = true;
        component.listKeys = ['Control'];
        (component as any).mediaPlayerElement = mediaPlayerElementMock;

        component.emitKeyDownEvent({ key: 'a', preventDefault: jasmine.createSpy('preventDefault') } as any);

        expect(component.listKeys).toContain('a');
    });

    it('scrollPlaybackRateImages should invoke displayImages in interval callback', () => {
        (component as any).mediaPlayerElement = mediaPlayerElementMock;
        const displaySpy = spyOn(component, 'displayImages').and.callFake(() => undefined);
        spyOn(window, 'setInterval').and.callFake((cb: any) => {
            cb();
            return 1 as any;
        });

        component.scrollPlaybackRateImages(2);

        expect(displaySpy).toHaveBeenCalled();
    });

    it('loopImages should reschedule with min delay', fakeAsync(() => {
        const timeoutSpy = spyOn(window, 'setTimeout').and.returnValue(1 as any);
        spyOn(component, 'showImage').and.returnValue(Promise.resolve(10));

        component.loopImages(1);
        flushMicrotasks();

        expect(timeoutSpy).toHaveBeenCalled();
    }));

    it('showImage should resolve with 0 on error callback', fakeAsync(() => {
        (component as any).mediaPlayerElement = mediaPlayerElementMock;
        component.previewThumbnailElement = { nativeElement: document.createElement('img') } as any;
        const promise = component.showImage(5);
        component.previewThumbnailElement.nativeElement.onerror(new Event('error'));
        tick();
        promise.then((value) => expect(value).toBe(0));
    }));
});
describe('AmaliaComponent contribution juridique', () => {
    let component: AmaliaComponent;
    let fixture: ComponentFixture<AmaliaComponent>;
    let mockMediaPlayerElement: any;
    let mockMediaPlayer: any;

    beforeEach(() => {
        mockMediaPlayer = {
            getCurrentTime: () => 42,
            getDuration: () => 120,
            setCurrentTime: jasmine.createSpy('setCurrentTime')
        };
        mockMediaPlayerElement = {
            eventEmitter: {
                emit: jasmine.createSpy('emit')
            },
            getMediaPlayer: () => mockMediaPlayer
        };

        TestBed.configureTestingModule({
            declarations: [AmaliaComponent],
            imports: [HttpClientTestingModule],
            providers: [
                MediaPlayerService,
                ThumbnailService,
                { provide: MediaPlayerElement, useValue: mockMediaPlayerElement }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AmaliaComponent);
        component = fixture.componentInstance;
        component.mediaPlayerElement = mockMediaPlayerElement;
        // fixture.detectChanges();
    });

    it('should emit current time in sendCurrentTime', () => {
        component.sendCurrentTime();
        expect(mockMediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(
            PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_CURRENT_TIME,
            { currentTime: 42 }
        );
    });

    it('should set current time in setCurrentTime', () => {
        const event = { currentTime: 55 };
        component.setCurrentTime(event);
        expect(mockMediaPlayerElement.getMediaPlayer().setCurrentTime).toHaveBeenCalledWith(55);
    });

    it('should emit duration in sendDuration', () => {
        component.sendDuration();
        expect(mockMediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(
            PlayerEventType.NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_DURATION,
            { duration: 120 }
        );
    });
});

// Mocks minimaux pour satisfaire le constructeur
class MediaPlayerServiceStub {
    get() { return null as any; }
    increment() { }
    decrement() { }
}
class ThumbnailServiceStub { }

describe('AmaliaComponent - keyboard shortcuts', () => {
    let component: AmaliaComponent;
    let emitSpy: jasmine.Spy;

    beforeEach(() => {
        component = new AmaliaComponent(
            new MediaPlayerServiceStub() as any,
            {} as any,                       // HttpClient non utilisé ici
            new ThumbnailServiceStub() as any,
            { detectChanges: () => { } } as any
        );

        // Stub très simple du mediaPlayerElement + eventEmitter
        emitSpy = jasmine.createSpy('emit');
        (component as any).mediaPlayerElement = {
            eventEmitter: { emit: emitSpy }
        };
    });

    // ---------- handleMuteShortcuts ----------
    it('handleMuteShortcuts: doit activer mute si $event est undefined', () => {
        component.muteShortcuts = false;
        component.handleMuteShortcuts(undefined as any);
        expect(component.muteShortcuts).toBeTrue();
    });

    it('handleMuteShortcuts: doit activer mute pour les cibles <input>, <textarea>, <select>, <button>', () => {
        const cases = [
            document.createElement('input'),
            document.createElement('textarea'),
            document.createElement('select'),
            document.createElement('button')
        ];

        for (const el of cases) {
            component.muteShortcuts = false;
            component.handleMuteShortcuts({ target: el, composedPath: () => [el] } as any);
            //`cible: <${el.tagName.toLowerCase()}>`
            if (el instanceof HTMLButtonElement) {
                expect(component.muteShortcuts).toBeFalse();
            } else {
                expect(component.muteShortcuts).toBeTrue();
            }
        }
    });

    it('handleMuteShortcuts: doit activer mute pour un élément contentEditable', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        component.muteShortcuts = false;

        component.handleMuteShortcuts({ target: div, composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeTrue();
    });

    it('handleMuteShortcuts: ne doit pas activer mute pour un élément non prévu', () => {
        const div = document.createElement('div'); // non contentEditable
        component.muteShortcuts = false;

        component.handleMuteShortcuts({ target: div, composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    // ---------- handleUnmuteShortcuts ----------
    it('handleUnmuteShortcuts: doit désactiver mute si $event est undefined', () => {
        component.muteShortcuts = true;
        component.handleUnmuteShortcuts(undefined as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    it('handleUnmuteShortcuts: doit désactiver mute pour les cibles <input>, <textarea>, <select> et non <button>', () => {
        const cases = [
            document.createElement('input'),
            document.createElement('textarea'),
            document.createElement('select'),
            document.createElement('button')
        ];

        for (const el of cases) {
            component.muteShortcuts = true;
            component.handleUnmuteShortcuts({ target: el, composedPath: () => [el] } as any);
            //`cible: <${el.tagName.toLowerCase()}>`
            if (el instanceof HTMLButtonElement) {
                expect(component.muteShortcuts).toBeTrue();
            } else {
                expect(component.muteShortcuts).toBeFalse();
            }
        }
    });

    it('handleUnmuteShortcuts: doit désactiver mute pour un élément contentEditable', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        component.muteShortcuts = true;

        component.handleUnmuteShortcuts({ target: div, composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    it('handleUnmuteShortcuts: ne doit pas modifier mute pour un élément non prévu', () => {
        const div = document.createElement('div'); // non contentEditable
        component.muteShortcuts = true;

        component.handleUnmuteShortcuts({ target: div, composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeTrue();
    });

    // ---------- handleShortCutsKeyDownEvent ----------
    it('handleShortCutsKeyDownEvent: émet SHORTCUT_KEYDOWN quand muteShortcuts=false', () => {
        component.muteShortcuts = false;
        emitSpy.calls.reset();

        const evt = {
            key: 'A',
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        component.handleShortCutsKeyDownEvent(evt);

        expect(emitSpy).toHaveBeenCalled();
        const [, payload] = emitSpy.calls.mostRecent().args;

        expect(payload.targets).toEqual(['CONTROL_BAR', 'ANNOTATIONS']);
        expect(payload.shortcut.key).toBe('a'); // toLowerCase
        expect(payload.shortcut.ctrl).toBeTrue();
        expect(payload.shortcut.shift).toBeFalse();
        expect(payload.shortcut.alt).toBeFalse();
        expect(payload.shortcut.meta).toBeFalse();
    });

    it(`handleShortCutsKeyDownEvent: transforme la barre d'espace en "espace"`, () => {
        component.muteShortcuts = false;
        emitSpy.calls.reset();

        const evt = {
            key: ' ',
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        component.handleShortCutsKeyDownEvent(evt);

        expect(emitSpy).toHaveBeenCalled();
        const [, payload] = emitSpy.calls.mostRecent().args;

        expect(payload.shortcut.key).toBe('espace');
    });

    it(`handleShortCutsKeyDownEvent: n'émet rien quand muteShortcuts=true`, () => {
        component.muteShortcuts = true;
        emitSpy.calls.reset();

        const evt = {
            key: 'x',
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false
        } as any;

        component.handleShortCutsKeyDownEvent(evt);
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('handleShortCutsKeyDownEvent: ne bloque pas Ctrl+C (raccourci natif copier)', () => {
        component.muteShortcuts = false;
        emitSpy.calls.reset();

        const evt = {
            key: 'c',
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        component.handleShortCutsKeyDownEvent(evt);

        expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('handleShortCutsKeyDownEvent: ne bloque pas Meta+C (raccourci natif Mac copier)', () => {
        component.muteShortcuts = false;
        emitSpy.calls.reset();

        const evt = {
            key: 'c',
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: true,
            preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        component.handleShortCutsKeyDownEvent(evt);

        expect(evt.preventDefault).not.toHaveBeenCalled();
    });

    it('handleShortCutsKeyDownEvent: bloque les raccourcis personnalisés non-natifs', () => {
        component.muteShortcuts = false;
        emitSpy.calls.reset();

        const evt = {
            key: 'f',
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        component.handleShortCutsKeyDownEvent(evt);

        expect(evt.preventDefault).toHaveBeenCalled();
    });
});




