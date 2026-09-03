import { HttpClient } from '@angular/common/http';
import { ThumbnailService } from './thumbnail-service';
import { THUMBNAIL_CANCELLED } from '../core/loader/thumbnail-loader';

interface FakeHandle {
    url: string;
    resolve: (blob: string) => void;
    reject: (err?: unknown) => void;
    cancel: jasmine.Spy;
}

/** Vide microtâches et chaînes de promesses de l'ordonnanceur (settle → pump). */
const drain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('ThumbnailService', () => {
    let service: ThumbnailService;

    const smallCache = () => (service as any).caches.small as Map<number | string, { url: string, blob: string }>;
    const largeCache = () => (service as any).caches.large as Map<number | string, { url: string, blob: string }>;

    /** Stub de loadCancellable : handles pilotables ; cancel rejette le sentinel (comme le vrai),
     *  sauf cancelNoop (simule la course « réponse arrivée juste avant l'abort »). */
    const stubLoader = (options?: { cancelNoop?: boolean, autoResolve?: (url: string) => string }) => {
        const handles: FakeHandle[] = [];
        const spy = spyOn((service as any).loader, 'loadCancellable').and.callFake((url: string) => {
            let resolveFn: (blob: string) => void;
            let rejectFn: (err?: unknown) => void;
            let settled = false;
            const promise = new Promise<string>((res, rej) => {
                resolveFn = (blob) => { settled = true; res(blob); };
                rejectFn = (err) => { settled = true; rej(err); };
            });
            const cancel = jasmine.createSpy('cancel').and.callFake(() => {
                if (settled || options?.cancelNoop) { return; }
                rejectFn(THUMBNAIL_CANCELLED);
            });
            handles.push({ url, resolve: resolveFn, reject: rejectFn, cancel });
            if (options?.autoResolve) {
                resolveFn(options.autoResolve(url));
            }
            return { promise, cancel };
        });
        return { spy, handles };
    };

    beforeEach(() => {
        service = new ThumbnailService({} as HttpClient);
        service.logger = { warn: jasmine.createSpy('warn'), debug: () => undefined, info: () => undefined } as any;
    });

    it('should return cached thumbnail when available', async () => {
        smallCache().set(10, { url: '/a', blob: 'blob:cached' });
        const result = await service.getThumbnail('/a', 10, 'small');
        expect(result).toBe('blob:cached');
    });

    it('getCached lit le cache en synchrone sans déclencher de fetch', () => {
        smallCache().set(10, { url: '/a', blob: 'blob:cached' });
        expect(service.getCached(10, 'small')).toBe('blob:cached');
        expect(service.getCached(10, 'large')).toBeUndefined();
        expect(service.getCached(99, 'small')).toBeUndefined();
    });

    it('should delegate to loadThumbnail when cache is empty', async () => {
        const loadSpy = spyOn(service, 'loadThumbnail').and.resolveTo('blob:loaded');
        const result = await service.getThumbnail('/a', 2, 'large');
        expect(loadSpy).toHaveBeenCalledWith('/a', 2, 'large', undefined);
        expect(result).toBe('blob:loaded');
    });

    it('should load thumbnail and update cache', async () => {
        stubLoader({ autoResolve: () => 'blob:new' });

        const result = await service.loadThumbnail('/new', 4, 'large');

        expect(result).toBe('blob:new');
        expect(largeCache().get(4)).toEqual({ url: '/new', blob: 'blob:new' });
        expect(smallCache().get(4)).toBeUndefined();
    });

    it('sépare les caches petites et grandes pour un même timecode', async () => {
        const { spy } = stubLoader({ autoResolve: (url) => `blob:${url}` });

        await service.getThumbnail('/small10', 10, 'small');
        await service.getThumbnail('/large10', 10, 'large');

        expect(spy).toHaveBeenCalledTimes(2);
        expect(service.getCached(10, 'small')).toBe('blob:/small10');
        expect(service.getCached(10, 'large')).toBe('blob:/large10');
    });

    it('évince les entrées les plus anciennes au-delà du plafond de chaque taille et révoque leurs object URLs', async () => {
        stubLoader({ autoResolve: (url) => `blob:${url}` });
        const revokeSpy = spyOn(URL, 'revokeObjectURL');
        await service.loadThumbnail('/large0', 0, 'large');

        for (let tc = 0; tc <= ThumbnailService.CACHE_MAX_ENTRIES.small; tc++) {
            await service.loadThumbnail(`/t${tc}`, tc, 'small');
        }

        expect(smallCache().get(0)).toBeUndefined(); // premier inséré => évincé (FIFO)
        expect(smallCache().get(ThumbnailService.CACHE_MAX_ENTRIES.small)).toBeDefined();
        expect(revokeSpy).toHaveBeenCalledOnceWith('blob:/t0');
        // le budget des grandes est indépendant : son unique entrée est intacte
        expect(service.getCached(0, 'large')).toBe('blob:/large0');
    });

    it('déduplique les requêtes en vol pour un même couple (taille, timecode)', async () => {
        const { spy, handles } = stubLoader();

        const first = service.getThumbnail('/a', 5, 'large');
        const second = service.getThumbnail('/a', 5, 'large');
        expect(spy).toHaveBeenCalledTimes(1);

        // clé distincte (autre taille) => nouvelle requête
        const small = service.getThumbnail('/a-small', 5, 'small');
        expect(spy).toHaveBeenCalledTimes(2);

        handles[0].resolve('blob:shared');
        handles[1].resolve('blob:small');
        expect(await first).toBe('blob:shared');
        expect(await second).toBe('blob:shared');
        expect(await small).toBe('blob:small');
        expect(((service as any).pending as Map<string, unknown>).size).toBe(0);
    });

    it('clear() vide les caches et révoque les object URLs', async () => {
        stubLoader({ autoResolve: (url) => `blob:${url}` });
        const revokeSpy = spyOn(URL, 'revokeObjectURL');
        await service.loadThumbnail('/a', 1, 'small');
        await service.loadThumbnail('/b', 2, 'large');

        service.clear();

        expect(smallCache().size).toBe(0);
        expect(largeCache().size).toBe(0);
        expect(revokeSpy).toHaveBeenCalledTimes(2);
    });

    it('clear() neutralise un stockage tardif : blob résolu après clear révoqué et non stocké', async () => {
        // cancelNoop : simule la course où la réponse aboutit juste avant l'abort effectif
        const { handles } = stubLoader({ cancelNoop: true });
        const revokeSpy = spyOn(URL, 'revokeObjectURL');

        const request = service.loadThumbnail('/late', 7, 'large');
        service.clear();
        handles[0].resolve('blob:late');
        await request;

        expect(largeCache().size).toBe(0);
        expect(revokeSpy).toHaveBeenCalledOnceWith('blob:late');
    });

    describe('normalisation des clés sur la grille des vignettes (0,04 s)', () => {
        it('deux tc à moins de 0,04 s => une seule requête HTTP (dédup en vol) et une seule entrée de cache', async () => {
            const { spy, handles } = stubLoader();

            // 36.15 (ex-clé toFixed(2)) et 36.17 tombent sur le même pas de grille => URL identique
            const first = service.getThumbnail('/img?width=300&start=36.16', 36.15, 'small');
            const second = service.getThumbnail('/img?width=300&start=36.16', 36.17, 'small');
            expect(spy).toHaveBeenCalledTimes(1);

            handles[0].resolve('blob:one');
            expect(await first).toBe('blob:one');
            expect(await second).toBe('blob:one');
            expect(smallCache().size).toBe(1);
            expect(smallCache().get(36.16)).toBeDefined(); // stockée sous le représentant quantifié
            // relecture par n'importe quel tc du même pas
            expect(service.getCached(36.152, 'small')).toBe('blob:one');
            expect(service.getCached(36.16, 'small')).toBe('blob:one');
        });

        it('getCached retrouve sous un tc brut une entrée stockée par loadThumbnail (clé ⇔ URL 1:1)', async () => {
            stubLoader({ autoResolve: () => 'blob:aligned' });

            await service.loadThumbnail('/u', 21.152, 'large'); // cible réelle mesurée en rafale

            expect(largeCache().get(21.16)).toBeDefined();
            expect(service.getCached(21.16, 'large')).toBe('blob:aligned');
            expect(service.getCached(21.152, 'large')).toBe('blob:aligned');
            expect(service.getCached(21.17, 'large')).toBe('blob:aligned'); // même pas de grille
        });

        it('les clés string passent inchangées (passthrough)', async () => {
            stubLoader({ autoResolve: () => 'blob:poster' });

            await service.loadThumbnail('/p', 'poster', 'small');

            expect(smallCache().get('poster')).toBeDefined();
            expect(service.getCached('poster', 'small')).toBe('blob:poster');
        });

        it('l\'éviction FIFO compte des images réellement distinctes (pas de doublon de pas)', async () => {
            stubLoader({ autoResolve: (url) => `blob:${url}` });

            await service.loadThumbnail('/a', 36.15, 'small');
            await service.loadThumbnail('/a', 36.17, 'small'); // même pas => aucune entrée nouvelle
            expect(smallCache().size).toBe(1);

            await service.loadThumbnail('/b', 36.21, 'small'); // autre pas (36.2) => entrée distincte
            expect(smallCache().size).toBe(2);
            expect(smallCache().get(36.2)).toBeDefined();
        });
    });

    describe('ordonnanceur : concurrence bornée, priorité display, annulation', () => {
        const prefetch = (tc: number) =>
            service.getThumbnail(`/p${tc}`, tc, 'small', { priority: 'prefetch' }).catch((e) => e);

        it('plafonne à MAX_CONCURRENT_REQUESTS XHR simultanées, la file se vide au fil des réponses', async () => {
            const { spy, handles } = stubLoader();

            for (let tc = 1; tc <= 6; tc++) {
                prefetch(tc);
            }
            expect(spy).toHaveBeenCalledTimes(ThumbnailService.MAX_CONCURRENT_REQUESTS);

            handles[0].resolve('blob:done');
            await drain();
            expect(spy).toHaveBeenCalledTimes(5); // un slot libéré => la 5e part
        });

        it('un display préempte le prefetch en vol parti le plus récemment quand les slots sont saturés', async () => {
            const { spy, handles } = stubLoader();
            const rejections: unknown[] = [];
            for (let tc = 1; tc <= 4; tc++) {
                service.getThumbnail(`/p${tc}`, tc, 'small', { priority: 'prefetch' }).catch((e) => rejections.push(e));
            }
            expect(spy).toHaveBeenCalledTimes(4);

            const display = service.getThumbnail('/display', 100, 'large', { priority: 'display' });
            await drain();

            expect(handles[3].cancel).toHaveBeenCalled(); // victime = le plus récent
            expect(handles[0].cancel).not.toHaveBeenCalled();
            expect(rejections).toEqual([THUMBNAIL_CANCELLED]);
            expect(spy).toHaveBeenCalledTimes(5);
            expect(spy.calls.mostRecent().args[0]).toBe('/display');

            handles[4].resolve('blob:display');
            expect(await display).toBe('blob:display');
        });

        it('promotion : un display réclamant une cible préfetchée en file réutilise la même requête et part devant', async () => {
            const { spy, handles } = stubLoader();
            for (let tc = 1; tc <= 4; tc++) {
                prefetch(tc);
            }
            const queued = prefetch(50); // 5e => en file
            expect(spy).toHaveBeenCalledTimes(4);

            const display = service.getThumbnail('/p50', 50, 'small', { priority: 'display' });
            await drain();

            // La promotion a préempté un slot et démarré LA même requête (pas de doublon /p50)
            expect(spy).toHaveBeenCalledTimes(5);
            expect(spy.calls.mostRecent().args[0]).toBe('/p50');
            handles[4].resolve('blob:promoted');
            expect(await display).toBe('blob:promoted');
            expect(await queued).toBe('blob:promoted'); // promesse partagée
        });

        it('supersede par taille : un nouveau display annule le display précédent de la même taille', async () => {
            const { spy, handles } = stubLoader();

            const first = service.getThumbnail('/d1', 1, 'large');
            const otherSize = service.getThumbnail('/small1', 1, 'small');
            const second = service.getThumbnail('/d2', 2, 'large');
            await drain();

            expect(handles[0].cancel).toHaveBeenCalled();
            await expectAsync(first).toBeRejectedWith(THUMBNAIL_CANCELLED);
            expect(handles[1].cancel).not.toHaveBeenCalled(); // autre taille : non concerné
            expect(spy.calls.count()).toBe(3);

            handles[1].resolve('blob:small');
            handles[2].resolve('blob:d2');
            expect(await otherSize).toBe('blob:small');
            expect(await second).toBe('blob:d2');
        });

        it('borne la file prefetch : au-delà de MAX_QUEUED_PREFETCH, éviction du plus ancien en file', async () => {
            const { spy } = stubLoader();
            const results: Array<Promise<unknown>> = [];
            const total = ThumbnailService.MAX_CONCURRENT_REQUESTS + ThumbnailService.MAX_QUEUED_PREFETCH + 1;
            for (let tc = 1; tc <= total; tc++) {
                results.push(prefetch(tc));
            }

            expect(spy).toHaveBeenCalledTimes(ThumbnailService.MAX_CONCURRENT_REQUESTS);
            // le 5e appel (premier en file) a été évincé par le débordement
            expect(await results[ThumbnailService.MAX_CONCURRENT_REQUESTS]).toBe(THUMBNAIL_CANCELLED);
            expect(((service as any).prefetchQueue as unknown[]).length).toBe(ThumbnailService.MAX_QUEUED_PREFETCH);
        });

        it('rafraîchissement LRU : une cible re-demandée en file survit au débordement suivant', async () => {
            stubLoader();
            const results = new Map<number, Promise<unknown>>();
            const base = ThumbnailService.MAX_CONCURRENT_REQUESTS; // 4 en vol
            for (let tc = 1; tc <= base + ThumbnailService.MAX_QUEUED_PREFETCH; tc++) {
                results.set(tc, prefetch(tc));
            }
            const oldestQueuedTc = base + 1;
            prefetch(oldestQueuedTc); // dédup => repoussé en fin de file
            prefetch(999); // débordement => évince le 2e plus ancien, pas le rafraîchi
            await drain();

            expect(await results.get(base + 2)).toBe(THUMBNAIL_CANCELLED);
            const queuedKeys = ((service as any).prefetchQueue as Array<{ pendingKey: string }>).map(t => t.pendingKey);
            expect(queuedKeys).toContain(`small:${oldestQueuedTc}`);
        });

        it('clear() annule les XHR en vol et rejette les requêtes en file', async () => {
            const { handles } = stubLoader();
            const inflightResults: Array<Promise<unknown>> = [];
            const queuedResults: Array<Promise<unknown>> = [];
            for (let tc = 1; tc <= 4; tc++) {
                inflightResults.push(prefetch(tc));
            }
            for (let tc = 5; tc <= 7; tc++) {
                queuedResults.push(prefetch(tc));
            }

            service.clear();
            await drain();

            for (const handle of handles) {
                expect(handle.cancel).toHaveBeenCalled();
            }
            for (const result of [...inflightResults, ...queuedResults]) {
                expect(await result).toBe(THUMBNAIL_CANCELLED);
            }
            expect(((service as any).pending as Map<string, unknown>).size).toBe(0);
        });

        it('les annulations ne loggent pas (le sentinel n\'est pas un échec), les vraies erreurs si', async () => {
            const { handles } = stubLoader();

            const first = service.getThumbnail('/d1', 1, 'large');
            service.getThumbnail('/d2', 2, 'large').catch(() => undefined); // supersede de /d1
            await expectAsync(first).toBeRejectedWith(THUMBNAIL_CANCELLED);
            await drain();
            expect(service.logger.warn).not.toHaveBeenCalled();

            handles[1].reject('ERROR_LOAD_THUMBNAIL');
            await drain();
            expect(service.logger.warn).toHaveBeenCalled();
        });
    });
});
