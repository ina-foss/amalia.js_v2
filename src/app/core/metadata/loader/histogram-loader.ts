import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Metadata} from '../model/metadata';
import {AmaliaException} from '../../exception/amalia-exception';
import {LoggerInterface} from '../../logger/logger-interface';
import {PlayerErrorCode} from '../../constant/error-type';
import {Loader} from '../../loader/loader';

/**
 * Shape of the JSON returned by the `?surfer=1` waveform endpoint.
 */
interface SurferPeaks {
    posbins: number[];
    negbins: number[];
}

/**
 * Loader dedicated to the wavesurfer-based histogram plugin.
 *
 * Fetches a JSON payload of the form `{posbins, negbins}` from the configured
 * URL and wraps it into a {@link Metadata} block under the well-known id
 * {@link HistogramLoader.METADATA_ID}, so that the histogram plugin can read
 * it from amalia's {@link MetadataManager} like any other metadata.
 *
 * This loader is used by {@link MetadataManager} when a {@link ConfigDataSource}
 * is declared with `plugin === 'histogram'`. It cannot be plugged in via the
 * `dataSource.loader` field because the player configuration is serialized via
 * `JSON.stringify` before being passed to the web component, which would strip
 * any function — hence the in-core registration.
 */
export class HistogramLoader implements Loader<Array<Metadata>> {
    /** Well-known metadata id under which the peaks are stored. */
    public static readonly METADATA_ID = 'histogram-waveform-surfer';

    private readonly httpClient: HttpClient;
    private readonly logger: LoggerInterface;

    constructor(httpClient: HttpClient, logger: LoggerInterface) {
        this.httpClient = httpClient;
        this.logger = logger;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
    }

    /**
     * Load the surfer peaks JSON and wrap it into a single {@link Metadata}.
     * @param url     URL of the surfer endpoint.
     * @param headers Optional headers, each entry of the form `'Name: value'`.
     */
    load(url: string, headers: Array<string>): Promise<Array<Metadata>> {
        return new Promise<Array<Metadata>>((resolve, reject) => {
            const httpHeaders: Record<string, string> = {};
            if (headers) {
                headers.forEach(h => {
                    const idx = h.indexOf(':');
                    if (idx !== -1) {
                        httpHeaders[h.substring(0, idx).trim()] = h.substring(idx + 1).trim();
                    } else {
                        httpHeaders[h] = '';
                    }
                });
            }
            this.httpClient.get<SurferPeaks>(url, {headers: new HttpHeaders(httpHeaders)})
                .toPromise()
                .then(payload => {
                    if (!payload || !Array.isArray(payload.posbins) || !Array.isArray(payload.negbins)) {
                        this.logger.error('Histogram loader: invalid peaks payload', payload);
                        reject(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
                        return;
                    }
                    this.logger.info('Histogram peaks loaded');
                    resolve([{
                        id: HistogramLoader.METADATA_ID,
                        type: 'WAVEFORM_PEAKS',
                        data: payload as { [key: string]: any }
                    } as Metadata]);
                })
                .catch(error => {
                    this.logger.error('Error to load histogram peaks', error);
                    reject(PlayerErrorCode.METADATA_HTTP_LOAD_ERROR);
                });
        });
    }
}
