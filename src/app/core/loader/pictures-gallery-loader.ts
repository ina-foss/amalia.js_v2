import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AmaliaException } from '../exception/amalia-exception';
import { Loader } from './loader';
import { Metadata } from '@ina/amalia-model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Loader for Pictures Gallery plugin
 * Makes GET requests on metadataUrls to retrieve thumbnail URLs
 */
export class PicturesGalleryLoader implements Loader<Array<Metadata>> {
    private readonly httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement pictures gallery loader');
        }
    }

    /**
     * Load pictures gallery data
     * @param params { urls: Array<{ metadataUrl: string, photo: any }> } - List of metadata URLs with photo info
     * @param headers optional headers
     */
    load(params: { urls: Array<{ metadataUrl: string; photo: any }> }, headers?: Array<string>): Promise<Array<Metadata>> {
        const httpHeaders = this.buildHeaders(headers);

        if (!params.urls || params.urls.length === 0) {
            return Promise.resolve([{
                id: 'pictures-gallery-metadata',
                type: 'pictures-gallery',
                data: []
            }]);
        }

        // Create GET requests for each metadataUrl
        const requests = params.urls.map(item =>
            this.httpClient.get(item.metadataUrl, { headers: httpHeaders, responseType: 'text' }).pipe(
                map(thumbPath => ({
                    name: item.photo?.imageId || '',
                    path: item.photo?.thumbPath,
                    thumbPath: thumbPath,
                    resourceRef: item.photo?.idTech || ''
                })),
                catchError(error => {
                    console.error('Error loading thumbnail:', item.metadataUrl, error);
                    return of(null);
                })
            )
        );

        return new Promise<Array<Metadata>>((resolve, reject) => {
            forkJoin(requests).subscribe({
                next: (results) => {
                    const images = results.filter(img => img !== null);
                    console.log(`PicturesGalleryLoader: Loaded ${images.length} images`);
                    
                    const metadata: Metadata = {
                        id: 'pictures-gallery-metadata',
                        type: 'pictures-gallery',
                        data: images
                    };
                    resolve([metadata]);
                },
                error: (error) => {
                    console.error('Error loading pictures gallery:', error);
                    reject('ERROR_LOAD_PICTURES_GALLERY');
                }
            });
        });
    }

    /**
     * Build HTTP headers from string array
     */
    private buildHeaders(headers?: Array<string>): HttpHeaders {
        let httpHeaders = new HttpHeaders();

        if (headers) {
            headers.forEach((header) => {
                const parts = header.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    httpHeaders = httpHeaders.set(key, value);
                }
            });
        }

        return httpHeaders;
    }
}

