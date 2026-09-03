import { HttpClient } from '@angular/common/http';
import { AmaliaException } from '../exception/amalia-exception';
import { THUMBNAIL_CANCELLED, ThumbnailLoader } from './thumbnail-loader';

type Observer = { next: (value: unknown) => void; error: (err: unknown) => void };

/** Mock HttpClient.get → observable minimal dont on pilote next/error/unsubscribe. */
function makeHttpClient() {
    const observers: Observer[] = [];
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    const getSpy = jasmine.createSpy('get').and.callFake(() => ({
        subscribe: (observer: Observer) => {
            observers.push(observer);
            return { unsubscribe: unsubscribeSpy };
        }
    }));
    return { httpClient: { get: getSpy } as unknown as HttpClient, getSpy, observers, unsubscribeSpy };
}

describe('ThumbnailLoader', () => {
    it('should throw when httpClient is missing', () => {
        expect(() => new ThumbnailLoader(null as unknown as HttpClient))
            .toThrowError(AmaliaException, 'Error to implement thumbnail loader');
    });

    it('should resolve blob URL on successful load', async () => {
        const blob = new Blob(['a'], { type: 'image/png' });
        const { httpClient, getSpy, observers } = makeHttpClient();
        const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:ok');

        const loader = new ThumbnailLoader(httpClient);
        const result = loader.load('/thumb');
        observers[0].next(blob);

        expect(getSpy).toHaveBeenCalled();
        expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
        expect(await result).toBe('blob:ok');
    });

    it('should reject with ERROR_LOAD_THUMBNAIL when request fails', async () => {
        const { httpClient, observers } = makeHttpClient();
        const loader = new ThumbnailLoader(httpClient);

        const result = loader.load('/thumb');
        observers[0].error(new Error('network'));

        await expectAsync(result).toBeRejectedWith('ERROR_LOAD_THUMBNAIL');
    });

    it('requête CORS « simple » : aucun header ajouté (sinon un preflight OPTIONS par URL de vignette)', () => {
        const { httpClient, getSpy } = makeHttpClient();
        const loader = new ThumbnailLoader(httpClient);

        loader.load('/thumb');

        expect(getSpy).toHaveBeenCalledWith('/thumb', jasmine.objectContaining({ responseType: 'blob' }));
        const options = getSpy.calls.mostRecent().args[1];
        expect('headers' in options).toBeFalse();
    });

    it('cancel() aborte la XHR (unsubscribe) et rejette THUMBNAIL_CANCELLED', async () => {
        const { httpClient, unsubscribeSpy } = makeHttpClient();
        const loader = new ThumbnailLoader(httpClient);

        const handle = loader.loadCancellable('/thumb');
        handle.cancel();

        expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
        await expectAsync(handle.promise).toBeRejectedWith(THUMBNAIL_CANCELLED);
    });

    it('cancel() après résolution est un no-op (pas d\'unsubscribe, promesse intacte)', async () => {
        const blob = new Blob(['a'], { type: 'image/png' });
        const { httpClient, observers, unsubscribeSpy } = makeHttpClient();
        spyOn(URL, 'createObjectURL').and.returnValue('blob:done');
        const loader = new ThumbnailLoader(httpClient);

        const handle = loader.loadCancellable('/thumb');
        observers[0].next(blob);
        handle.cancel();

        expect(unsubscribeSpy).not.toHaveBeenCalled();
        expect(await handle.promise).toBe('blob:done');
    });

    it('annulé avant réponse : aucun blob créé', () => {
        const { httpClient } = makeHttpClient();
        const createObjectURLSpy = spyOn(URL, 'createObjectURL');
        const loader = new ThumbnailLoader(httpClient);

        const handle = loader.loadCancellable('/thumb');
        handle.cancel();
        handle.promise.catch(() => undefined);

        expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
});
