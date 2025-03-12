import {TestBed, ComponentFixture} from '@angular/core/testing';
import {AmaliaComponent} from './amalia.component';
import {MediaPlayerService} from '../service/media-player-service';
import {ThumbnailService} from '../service/thumbnail-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ElementRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {of} from 'rxjs';

describe('AmaliaComponent', () => {
    let component: AmaliaComponent;
    let fixture: ComponentFixture<AmaliaComponent>;
    let mediaPlayerService: MediaPlayerService;
    let thumbnailService: ThumbnailService;
    let sanitizer: DomSanitizer;

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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize media player on init', () => {
        const initDefaultHandlersMock = spyOn(component as any, 'initDefaultHandlers').and.callThrough();
        const bindEventsMock = spyOn(component as any, 'bindEvents').and.callThrough();
        component.ngOnInit();
        expect(initDefaultHandlersMock).toHaveBeenCalled();
        expect(bindEventsMock).toHaveBeenCalled();
    });

    it('should handle window resize', () => {
        const updatePlayerSizeWithAspectRatioMock = spyOn(component as any, 'updatePlayerSizeWithAspectRatio').and.callThrough();
        component.handleWindowResize();
        expect(updatePlayerSizeWithAspectRatioMock).not.toHaveBeenCalled();
    });

    it('should handle context menu', () => {
        const event = new MouseEvent('contextmenu', {clientX: 100, clientY: 100});
        component.onContextMenu(event);
        expect(component.contextMenuState).toBeTrue();
    });

    it('should handle play event', () => {
        component._setEnableThumbnailForTesting(true);
        spyOn(component as any, 'handlePlay').and.callThrough();
        component._handlePlayForTesting()
        2;
        expect(component.enablePreviewThumbnail).toBeFalse();
        expect(component.previewThumbnailUrl).toBe('');
    });

    it('should handle error event', () => {
        const errorEvent = {message: 'Error'};
        spyOn(component as any, 'handleError').and.callThrough().withArgs(errorEvent);
        component._handleErrorForTesting(errorEvent);
        expect(component.inError).toBeTrue();
        expect(component.errorMessage).toEqual(errorEvent);
    });

    it('should set preview thumbnail', () => {
        component._setEnableThumbnailForTesting(true);
        spyOn(thumbnailService, 'getThumbnail').and.returnValue(Promise.resolve('blobUrl'));
        spyOn(component as any, 'setPreviewThumbnail').and.callThrough().withArgs(10);
        component._setPreviewThumbnailForTesting(10);
        expect(thumbnailService.getThumbnail).not.toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
    });
});
