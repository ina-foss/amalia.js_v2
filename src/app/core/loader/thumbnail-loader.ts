import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {AmaliaException} from '../exception/amalia-exception';
import {Loader} from './loader';

/** Raison de rejet d'un chargement annulé (supersede, préemption, clear). */
export const THUMBNAIL_CANCELLED = 'THUMBNAIL_CANCELLED';

/** Chargement annulable : la promesse rejette THUMBNAIL_CANCELLED si cancel() gagne. */
export interface ThumbnailLoadHandle {
    promise: Promise<string>;

    cancel(): void;
}

/**
 * in charge to get thumbnail
 */
export class ThumbnailLoader implements Loader<any> {
    private readonly httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement thumbnail loader');
        }
    }

    /**
     * GET volontairement « simple » au sens CORS : aucun header ajouté (le token est déjà
     * dans l'URL) — un Content-Type explicite ferait payer un preflight OPTIONS à chaque
     * URL unique de vignette (le cache preflight est par URL). XhrBackend : unsubscribe()
     * aborte la requête en vol ; une observable désabonnée n'appelant ni next ni error,
     * cancel() doit rejeter lui-même la promesse (sinon elle pendrait pour toujours).
     */
    loadCancellable(url: any): ThumbnailLoadHandle {
        let settled = false;
        let rejectFn: (reason?: any) => void;
        let subscription: Subscription;
        const promise = new Promise<string>((resolve, reject) => {
            rejectFn = reject;
            subscription = this.httpClient.get(url, {responseType: 'blob' as 'json'})
                    .subscribe({
                        next: res => {
                            settled = true;
                            resolve(window.URL.createObjectURL(res as Blob));
                        },
                        error: () => {
                            settled = true;
                            reject('ERROR_LOAD_THUMBNAIL');
                        }
                    });
        });
        return {
            promise,
            cancel: () => {
                if (settled) {
                    return;
                }
                settled = true;
                subscription.unsubscribe();
                rejectFn(THUMBNAIL_CANCELLED);
            }
        };
    }

    load(url: any): Promise<any> {
        return this.loadCancellable(url).promise;
    }
}
