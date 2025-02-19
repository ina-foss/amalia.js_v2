import {ThumbnailLoader} from '../core/loader/thumbnail-loader';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultLogger} from '../core/logger/default-logger';

/**
 * Service contain all instance of players
 */
@Injectable()
export class ThumbnailService {
    public static key = 'blob';
    private readonly httpClient: HttpClient;
    private loader: ThumbnailLoader;
    public listThumbnails: Array<{ 'url': string, 'blob': string }> = [];
    /**
     * Default loader
     */
    public logger = new DefaultLogger();

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.loader = new ThumbnailLoader(this.httpClient);
    }

    /**
     * If tc exist in listThumbnails return blob else call api to get blob
     */
    getThumbnail(url, tc): Promise<string> {
        if (typeof (this.listThumbnails[tc]) === 'undefined') {
            return this.loadThumbnail(url, tc);
        }
        return Promise.resolve(this.listThumbnails[tc][ThumbnailService.key]);
    }

    /**
     * Call loader to get blob
     */
    loadThumbnail(url, tc): Promise<string> {
        return new Promise((resolve, reject) => {
            this.loader
                    .load(url)
                    .then(blob => {
                        this.listThumbnails[tc] = {url, blob};
                        resolve(blob.toString());
                    })
                    .catch(error => {
                        this.logger.warn('Error to load image', error);
                    });
        });
    }
}
