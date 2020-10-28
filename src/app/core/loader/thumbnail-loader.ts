import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AmaliaException} from '../exception/amalia-exception';
import {Loader} from '../loader/loader';
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
    load(url: any): Promise<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return new Promise <any> ((resolve, reject) => {
            this.httpClient.get(url,
                {headers, responseType: 'blob' as 'json' })
                .toPromise()
                .then(
                    res => {
                         const windowUrl = window.URL;
                         const blob = windowUrl.createObjectURL(res);
                         resolve(blob);
                        },
                        error => {
                            reject('ERROR_LOAD_THUMBNAIL');
                        });
            });
    }

}
