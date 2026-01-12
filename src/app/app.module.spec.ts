import {TestBed} from '@angular/core/testing';
import {AmaliaComponent} from './player/amalia.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MediaPlayerService} from "./service/media-player-service";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";
import {ThumbnailService} from "./service/thumbnail-service";
import {AppModule} from "./app.module";

describe('AppModule', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AmaliaComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [AppModule], providers:
                    [MediaPlayerService, provideHttpClient(),
                        provideHttpClientTesting(), ThumbnailService]
        }).compileComponents();
    });
    it('should create the module', () => {
        const module = TestBed.inject(AppModule);
        expect(module).toBeTruthy();
    });

    it('should create AmaliaComponent', () => {
        const fixture = TestBed.createComponent(AmaliaComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
    it('should execute  ngBootStrap', () => {
        const module = TestBed.inject(AppModule);
        const mockAddCustomElement = spyOn(module, 'addCustomElement');
        mockAddCustomElement.and.callThrough();
        module.ngDoBootstrap();
        expect(mockAddCustomElement).toHaveBeenCalledTimes(9);
    });
});

