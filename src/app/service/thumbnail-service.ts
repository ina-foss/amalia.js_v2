import {ThumbnailLoader} from '../core/loader/thumbnail-loader';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/**
 * Service contain all instance of players
 */
@Injectable()
export class ThumbnailService {
    private httpClient: HttpClient;
    private loader: ThumbnailLoader;
    public listThumbnails: Array<object>;
    public image;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.loader = new ThumbnailLoader(this.httpClient);
        this.listThumbnails = new Array<Array<{'url': string, 'blob': string}>>();
    }
    getThumbnail(url, tc) {
        if (typeof (this.listThumbnails[tc]) === 'undefined') {
            this.getImage(url, tc);
            } else {
                const key = 'blob';
                this.image = this.listThumbnails[tc][key];
            }
        return(this.image);

    }
    async loadThumbnail(url, tc) {
        return await new Promise((resolve, reject) => {
            this.loader
                .load(url)
                .then(blob => {
                    this.listThumbnails[tc] = {url, blob};
                    resolve(blob);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    public async getImage(url, tc) {
        this.loadThumbnail(url, tc).then(blob => {
            this.image = blob;
        });
    }
}
