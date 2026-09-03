import {THUMBNAIL_CANCELLED, ThumbnailLoader, ThumbnailLoadHandle} from '../core/loader/thumbnail-loader';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultLogger} from '../core/logger/default-logger';
import {quantizeThumbnailTc} from '../core/utils/thumbnail-tc';

/** Taille de vignette : 'small' = survol progress-bar + éclaireur rafale, 'large' = overlay plein cadre. */
export type ThumbnailSize = 'small' | 'large';

/**
 * Priorité d'une requête : 'display' = la vignette attendue à l'écran maintenant
 * (overlay, tooltip du survol), 'prefetch' = anticipation opportuniste.
 */
export type ThumbnailPriority = 'display' | 'prefetch';

export interface ThumbnailRequestOptions {
    priority?: ThumbnailPriority;
}

/** Requête ordonnancée : en file (queued, pas encore de XHR) ou en vol (inflight). */
interface ThumbnailTask {
    pendingKey: string;
    cacheKey: number | string;
    url: string;
    size: ThumbnailSize;
    priority: ThumbnailPriority;
    state: 'queued' | 'inflight';
    handle: ThumbnailLoadHandle | null;
    promise: Promise<string>;
    resolve: (blob: string) => void;
    reject: (reason?: any) => void;
    /** Ordre de départ monotone (préemption : on annule le prefetch parti le plus récemment). */
    startedAt: number;
}

/**
 * Cache de vignettes par timecode, séparé par taille (un même timecode existe en
 * petite et en grande sans collision), avec ordonnanceur réseau : concurrence bornée,
 * priorité display > prefetch, annulation réelle des XHR devenus inutiles. Le serveur
 * met ~600-800 ms à extraire une vignette — sans plafond ni annulation, une rafale de
 * clics empile des dizaines de requêtes et la position COURANTE fait la queue derrière
 * des préchargements périmés.
 */
@Injectable()
export class ThumbnailService {
    /**
     * Bornes mémoire par taille : les rafales ±5s et les drags de slider accumulent
     * une vignette par position visitée — au-delà du plafond, éviction FIFO avec
     * révocation de l'object URL. Les petites (~300 px, bien plus légères) sont
     * plus nombreuses car elles servent d'éclaireur loin en avance.
     */
    public static readonly CACHE_MAX_ENTRIES: Record<ThumbnailSize, number> = {small: 120, large: 60};
    /**
     * Plafond de XHR simultanées. HTTP/2 multiplexe (pas de rareté de sockets) : le cap
     * protège la file du serveur et la fraîcheur — à ~700 ms de latence serveur, 4 en vol
     * ≈ 5,7 vignettes/s soutenues, et un display préempteur part immédiatement.
     */
    public static readonly MAX_CONCURRENT_REQUESTS = 4;
    /**
     * Borne de la file prefetch : le fan-out d'un tick (8 small + 3 large + 1 de marge).
     * Au-delà, éviction du plus ancien — en glissement, chaque tick pousse dehors les
     * cibles périmées du tick précédent.
     */
    public static readonly MAX_QUEUED_PREFETCH = 12;
    private readonly httpClient: HttpClient;
    private readonly loader: ThumbnailLoader;
    /** Un Map par taille : l'ordre d'insertion natif des Map donne le FIFO d'éviction. */
    private readonly caches: Record<ThumbnailSize, Map<number | string, { url: string, blob: string }>> = {
        small: new Map(),
        large: new Map()
    };
    /**
     * Requêtes connues (en file ou en vol) par `${size}:${tc}` : en rafale, les fenêtres
     * de préchargement se recouvrent — sans dédup, la même cible serait re-fetchée avant
     * d'être en cache.
     */
    private readonly pending = new Map<string, ThumbnailTask>();
    /** Files FIFO par bande de priorité ; pump() sert displayQueue d'abord. */
    private readonly displayQueue: ThumbnailTask[] = [];
    private readonly prefetchQueue: ThumbnailTask[] = [];
    private readonly inflight = new Set<ThumbnailTask>();
    /**
     * Dernier display par taille : un nouveau display de la même taille annule le
     * précédent encore en file/en vol (« le dernier gagne » — c'est ce qui empêche
     * l'empilement pendant un glissement). Service partagé entre players : le
     * supersede est global par taille, comme le cache (trait préexistant).
     */
    private readonly currentDisplayTask: Record<ThumbnailSize, ThumbnailTask | null> = {small: null, large: null};
    /** Compteur monotone d'ordres de départ (évite les égalités de Date.now). */
    private startCounter = 0;
    /** Incrémenté par clear() : un blob résolu après destruction est révoqué, pas re-stocké. */
    private generation = 0;
    /**
     * Default loader
     */
    public logger = new DefaultLogger();

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.loader = new ThumbnailLoader(this.httpClient);
    }

    /**
     * Normalise une clé de cache : les timecodes numériques sont quantifiés sur la
     * grille des vignettes (le même représentant que celui soudé dans l'URL par
     * getThumbnailUrl), les clés string passent telles quelles. Garde-fou structurel :
     * aucun appelant ne peut désaligner clé et URL — deux tc du même pas de grille
     * partagent entrée de cache et requête en vol.
     */
    private static normalizeKey(tc: number | string): number | string {
        return typeof tc === 'number' ? quantizeThumbnailTc(tc) : tc;
    }

    /**
     * Lecture synchrone du cache : renvoie le blob si la vignette de ce timecode
     * (quantifié sur la grille des vignettes) est déjà chargée dans cette taille,
     * undefined sinon (affichage immédiat en rafale).
     */
    getCached(tc: number | string, size: ThumbnailSize): string | undefined {
        return this.caches[size].get(ThumbnailService.normalizeKey(tc))?.blob;
    }

    /**
     * If tc exist in cache return blob else call api to get blob
     */
    getThumbnail(url: string, tc: number | string, size: ThumbnailSize,
                 options?: ThumbnailRequestOptions): Promise<string> {
        const cached = this.getCached(tc, size);
        if (cached !== undefined) {
            return Promise.resolve(cached);
        }
        return this.loadThumbnail(url, tc, size, options);
    }

    /**
     * Enfile une requête vers l'ordonnanceur (dédupliqué : une seule requête connue par
     * (taille, timecode)). priority 'display' (défaut rétro-compatible) : supersede du
     * display précédent de la même taille, passage devant les prefetches, préemption
     * d'un prefetch en vol si les slots sont saturés.
     */
    loadThumbnail(url: string, tc: number | string, size: ThumbnailSize,
                  options?: ThumbnailRequestOptions): Promise<string> {
        const priority: ThumbnailPriority = options?.priority ?? 'display';
        const key = ThumbnailService.normalizeKey(tc);
        const pendingKey = `${size}:${key}`;

        if (priority === 'display') {
            this.supersedeDisplay(size, pendingKey);
        }

        const existing = this.pending.get(pendingKey);
        if (existing !== undefined) {
            if (priority === 'display') {
                // Cas chaud de la rafale : la cible affichée a été préfetchée 1-3 ticks avant.
                this.promoteToDisplay(existing);
                this.currentDisplayTask[size] = existing;
                if (existing.state === 'queued') {
                    // Un display promu part tout de suite, comme un display neuf.
                    this.preemptForDisplayIfSaturated();
                }
            } else if (existing.state === 'queued' && existing.priority === 'prefetch') {
                // Rafraîchissement LRU : cible encore voulue, repoussée en fin de file
                // (sinon la rafale éviverait ses propres cibles encore utiles).
                const idx = this.prefetchQueue.indexOf(existing);
                if (idx !== -1) {
                    this.prefetchQueue.splice(idx, 1);
                    this.prefetchQueue.push(existing);
                }
            }
            return existing.promise;
        }

        const task = this.createTask(pendingKey, key, url, size, priority);
        this.pending.set(pendingKey, task);
        if (priority === 'display') {
            this.displayQueue.push(task);
            this.currentDisplayTask[size] = task;
            this.preemptForDisplayIfSaturated();
        } else {
            this.prefetchQueue.push(task);
            this.evictOverflowingPrefetches();
        }
        this.pump();
        return task.promise;
    }

    /**
     * Vide entièrement le pipeline : annule files et XHR en vol (destruction du player —
     * le burst meurt au lieu de laisser des dizaines de requêtes se vider), puis révoque
     * les object URLs des caches.
     */
    clear(): void {
        this.generation++;
        for (const task of [...this.displayQueue, ...this.prefetchQueue]) {
            this.pending.delete(task.pendingKey);
            task.reject(THUMBNAIL_CANCELLED);
        }
        this.displayQueue.length = 0;
        this.prefetchQueue.length = 0;
        for (const task of [...this.inflight]) {
            task.handle?.cancel();
        }
        this.pending.clear();
        this.currentDisplayTask.small = null;
        this.currentDisplayTask.large = null;
        for (const size of Object.keys(this.caches) as Array<ThumbnailSize>) {
            for (const entry of this.caches[size].values()) {
                this.revokeBlob(entry.blob);
            }
            this.caches[size].clear();
        }
    }

    private createTask(pendingKey: string, cacheKey: number | string, url: string,
                       size: ThumbnailSize, priority: ThumbnailPriority): ThumbnailTask {
        let resolve!: (blob: string) => void;
        let reject!: (reason?: any) => void;
        const promise = new Promise<string>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        if (priority === 'prefetch') {
            // Chaîne interne séparée : neutralise l'unhandledrejection d'un prefetch
            // annulé sans masquer les .catch() des appelants.
            promise.catch(() => undefined);
        }
        return {pendingKey, cacheKey, url, size, priority, state: 'queued', handle: null, promise, resolve, reject, startedAt: 0};
    }

    /** Sert les files tant qu'il reste des slots : display d'abord, puis prefetch. */
    private pump(): void {
        while (this.inflight.size < ThumbnailService.MAX_CONCURRENT_REQUESTS) {
            const task = this.displayQueue.shift() ?? this.prefetchQueue.shift();
            if (!task) {
                return;
            }
            this.startTask(task);
        }
    }

    private startTask(task: ThumbnailTask): void {
        task.state = 'inflight';
        task.startedAt = ++this.startCounter;
        this.inflight.add(task);
        const generation = this.generation;
        task.handle = this.loader.loadCancellable(task.url);
        task.handle.promise
                .then(blob => {
                    const blobUrl = blob.toString();
                    if (generation !== this.generation) {
                        // clear() est passé entre-temps (destruction du player) : ne pas re-remplir le cache
                        this.revokeBlob(blobUrl);
                    } else {
                        this.storeThumbnail(task.cacheKey, task.url, blobUrl, task.size);
                    }
                    this.settleTask(task);
                    task.resolve(blobUrl);
                })
                .catch(error => {
                    this.settleTask(task);
                    if (error !== THUMBNAIL_CANCELLED) {
                        this.logger.warn('Error to load image', error);
                    }
                    task.reject(error);
                });
    }

    /** Sortie du pipeline (succès, erreur ou annulation en vol) + relance de la pompe. */
    private settleTask(task: ThumbnailTask): void {
        this.pending.delete(task.pendingKey);
        this.inflight.delete(task);
        if (this.currentDisplayTask[task.size] === task) {
            this.currentDisplayTask[task.size] = null;
        }
        this.pump();
    }

    /**
     * « Le dernier display gagne » par taille : annule le display précédent encore en
     * file/en vol quand une nouvelle position arrive (glissement : les ticks de 150 ms
     * ne peuvent plus empiler 4-5 overlays de ~700 ms).
     */
    private supersedeDisplay(size: ThumbnailSize, newPendingKey: string): void {
        const current = this.currentDisplayTask[size];
        if (current && current.pendingKey !== newPendingKey) {
            this.currentDisplayTask[size] = null;
            this.cancelTask(current);
        }
    }

    /** Promotion d'un prefetch dédupliqué réclamé à l'affichage. */
    private promoteToDisplay(task: ThumbnailTask): void {
        if (task.priority === 'prefetch') {
            task.priority = 'display';
            if (task.state === 'queued') {
                const idx = this.prefetchQueue.indexOf(task);
                if (idx !== -1) {
                    this.prefetchQueue.splice(idx, 1);
                }
                this.displayQueue.push(task);
                this.pump();
            }
            // En vol : déjà le chemin le plus court vers un pixel — le re-taguer display
            // le protège seulement de la préemption.
        }
    }

    /**
     * Slots saturés et un display attend : annule le prefetch en vol parti le plus
     * récemment (le plus ancien est le plus proche d'aboutir, l'annuler gaspillerait
     * le plus de travail serveur déjà consenti).
     */
    private preemptForDisplayIfSaturated(): void {
        if (this.inflight.size < ThumbnailService.MAX_CONCURRENT_REQUESTS) {
            return;
        }
        let victim: ThumbnailTask | null = null;
        for (const task of this.inflight) {
            if (task.priority === 'prefetch' && (!victim || task.startedAt > victim.startedAt)) {
                victim = task;
            }
        }
        if (victim) {
            this.cancelTask(victim);
        }
    }

    /** Borne la file prefetch : éviction des plus anciens (cibles périmées des ticks passés). */
    private evictOverflowingPrefetches(): void {
        while (this.prefetchQueue.length > ThumbnailService.MAX_QUEUED_PREFETCH) {
            const evicted = this.prefetchQueue.shift();
            if (evicted) {
                this.pending.delete(evicted.pendingKey);
                evicted.reject(THUMBNAIL_CANCELLED);
            }
        }
    }

    private cancelTask(task: ThumbnailTask): void {
        if (task.state === 'inflight') {
            // Le reject THUMBNAIL_CANCELLED du handle déclenche le catch de startTask,
            // qui settle la tâche et relance la pompe.
            task.handle?.cancel();
        } else {
            const queue = task.priority === 'display' ? this.displayQueue : this.prefetchQueue;
            const idx = queue.indexOf(task);
            if (idx !== -1) {
                queue.splice(idx, 1);
            }
            this.pending.delete(task.pendingKey);
            if (this.currentDisplayTask[task.size] === task) {
                this.currentDisplayTask[task.size] = null;
            }
            task.reject(THUMBNAIL_CANCELLED);
        }
    }

    private storeThumbnail(tc: number | string, url: string, blob: string, size: ThumbnailSize): void {
        const cache = this.caches[size];
        const existing = cache.get(tc);
        if (existing && existing.blob !== blob) {
            this.revokeBlob(existing.blob);
        }
        cache.set(tc, {url, blob});
        while (cache.size > ThumbnailService.CACHE_MAX_ENTRIES[size]) {
            const oldest = cache.keys().next().value;
            this.revokeBlob(cache.get(oldest)?.blob);
            cache.delete(oldest);
        }
    }

    private revokeBlob(blob: string | undefined): void {
        if (blob?.startsWith('blob:')) {
            URL.revokeObjectURL(blob);
        }
    }
}
