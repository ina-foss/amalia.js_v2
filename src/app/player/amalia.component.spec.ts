import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {AmaliaComponent} from './amalia.component';
import {MediaPlayerService} from '../service/media-player-service';
import {ThumbnailService} from '../service/thumbnail-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaPlayerElement} from "../core/media-player-element";
import {DefaultLogger} from "../core/logger/default-logger";
import {HttpClient} from "@angular/common/http";
import {DefaultConfigLoader} from "../core/config/loader/default-config-loader";
import {DefaultConfigConverter} from "../core/config/converter/default-config-converter";
import {ConfigurationManager} from "../core/config/configuration-manager";
import {DefaultMetadataLoader} from "../core/metadata/loader/default-metadata-loader";
import {DefaultMetadataConverter} from "../core/metadata/converter/default-metadata-converter";
import {MetadataManager} from "../core/metadata/metadata-manager";
import {PlayerEventType} from "../core/constant/event-type";

const config = {...require('tests/assets/config-mpe.json'), player: {autoplay: false}};

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
    let mediaPlayerService: MediaPlayerService;
    let thumbnailService: ThumbnailService;
    let sanitizer: DomSanitizer;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AmaliaComponent],
            imports: [HttpClientTestingModule],
            providers: [
                MediaPlayerService,
                ThumbnailService,
                {provide: DomSanitizer, useValue: {bypassSecurityTrustUrl: (url) => url}}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmaliaComponent);
        component = fixture.componentInstance;
        mediaPlayerService = TestBed.inject(MediaPlayerService);
        thumbnailService = TestBed.inject(ThumbnailService);
        sanitizer = TestBed.inject(DomSanitizer);
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
        const event = new MouseEvent('contextmenu', {clientX: 100, clientY: 100});
        component.onContextMenu(event);
        expect(component.contextMenuState).toBeTrue();
    });

    it('should handle play event', () => {
        fixture.detectChanges();
        component._setEnableThumbnailForTesting(true);
        spyOn(component as any, 'handlePlay').and.callThrough();
        component._handlePlayForTesting()
        2;
        expect(component.enablePreviewThumbnail).toBeFalse();
        expect(component.previewThumbnailUrl).toBe('');
    });

    it('should handle error event', () => {
        fixture.detectChanges();
        const errorEvent = {message: 'Error'};
        component._handleErrorForTesting(errorEvent);
        expect(component.inError).toBeTrue();
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

        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);


    });
    afterEach(() => {
        fixture.destroy();
    });
});
