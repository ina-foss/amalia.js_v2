import {ApplicationRef} from '@angular/core';
import {AMALIA_CUSTOM_ELEMENTS, bootstrapAmaliaElements} from './bootstrap';
import {AmaliaComponent} from './player/amalia.component';
import {MediaPlayerService} from './service/media-player-service';
import {ThumbnailService} from './service/thumbnail-service';
import {FileService} from './service/file.service';

describe('bootstrapAmaliaElements', () => {
    let appRef: ApplicationRef;

    beforeAll(async () => {
        appRef = await bootstrapAmaliaElements();
    });

    it('should create the application', () => {
        expect(appRef).toBeTruthy();
        expect(appRef.injector).toBeTruthy();
    });

    it('should expose the 9 amalia custom elements', () => {
        expect(AMALIA_CUSTOM_ELEMENTS.length).toBe(9);
        for (const [selector] of AMALIA_CUSTOM_ELEMENTS) {
            expect(customElements.get(selector)).withContext(selector).toBeTruthy();
        }
    });

    it('should register amalia-player against AmaliaComponent', () => {
        const entry = AMALIA_CUSTOM_ELEMENTS.find(([selector]) => selector === 'amalia-player');
        expect(entry).toBeTruthy();
        expect(entry[1]).toBe(AmaliaComponent);
        expect(customElements.get('amalia-annotation')).toBeTruthy();
    });

    it('should be idempotent when a selector is already defined', async () => {
        // Les 9 sélecteurs sont déjà enregistrés : un second bootstrap ne doit pas jeter
        // (customElements.define lèverait NotSupportedError sans le garde customElements.get).
        const secondAppRef = await bootstrapAmaliaElements();
        expect(secondAppRef).toBeTruthy();
        secondAppRef.destroy();
    });

    it('should provide the player services', () => {
        expect(appRef.injector.get(MediaPlayerService)).toBeTruthy();
        expect(appRef.injector.get(ThumbnailService)).toBeTruthy();
        expect(appRef.injector.get(FileService)).toBeTruthy();
    });
});
