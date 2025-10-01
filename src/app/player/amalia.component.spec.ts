import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
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
class DomSanitizerStub {
    bypassSecurityTrustUrl(v: string) { return v; }
}

describe('AmaliaComponent - keyboard shortcuts', () => {
    let component: AmaliaComponent;
    let emitSpy: jasmine.Spy;

    beforeEach(() => {
        component = new AmaliaComponent(
            new MediaPlayerServiceStub() as any,
            {} as any,                       // HttpClient non utilisé ici
            new ThumbnailServiceStub() as any,
            new DomSanitizerStub() as any
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
            component.handleMuteShortcuts({ target: el,composedPath: () => [el] } as any);
            //`cible: <${el.tagName.toLowerCase()}>`
            expect(component.muteShortcuts).toBeTrue();
        }
    });

    it('handleMuteShortcuts: doit activer mute pour un élément contentEditable', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        component.muteShortcuts = false;

        component.handleMuteShortcuts({ target: div,composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeTrue();
    });

    it('handleMuteShortcuts: ne doit pas activer mute pour un élément non prévu', () => {
        const div = document.createElement('div'); // non contentEditable
        component.muteShortcuts = false;

        component.handleMuteShortcuts({ target: div,composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    // ---------- handleUnmuteShortcuts ----------
    it('handleUnmuteShortcuts: doit désactiver mute si $event est undefined', () => {
        component.muteShortcuts = true;
        component.handleUnmuteShortcuts(undefined as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    it('handleUnmuteShortcuts: doit désactiver mute pour les cibles <input>, <textarea>, <select>, <button>', () => {
        const cases = [
            document.createElement('input'),
            document.createElement('textarea'),
            document.createElement('select'),
            document.createElement('button')
        ];

        for (const el of cases) {
            component.muteShortcuts = true;
            component.handleUnmuteShortcuts({ target: el,composedPath: () => [el] } as any);
            //`cible: <${el.tagName.toLowerCase()}>`
            expect(component.muteShortcuts).toBeFalse();
        }
    });

    it('handleUnmuteShortcuts: doit désactiver mute pour un élément contentEditable', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        component.muteShortcuts = true;

        component.handleUnmuteShortcuts({ target: div,composedPath: () => [div] } as any);
        expect(component.muteShortcuts).toBeFalse();
    });

    it('handleUnmuteShortcuts: ne doit pas modifier mute pour un élément non prévu', () => {
        const div = document.createElement('div'); // non contentEditable
        component.muteShortcuts = true;

        component.handleUnmuteShortcuts({ target: div,composedPath: () => [div] } as any);
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

    it('handleShortCutsKeyDownEvent: transforme la barre d’espace en "espace"', () => {
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

    it('handleShortCutsKeyDownEvent: n’émet rien quand muteShortcuts=true', () => {
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
});
