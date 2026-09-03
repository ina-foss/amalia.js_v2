import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DefaultMetadataLoader } from './default-metadata-loader';
import { DefaultMetadataConverter } from '../converter/default-metadata-converter';
import { DefaultLogger } from '../../logger/default-logger';
import { PlayerErrorCode } from '../../constant/error-type';
import { AmaliaException } from '../../exception/amalia-exception';

describe('DefaultMetadataLoader', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let loader: DefaultMetadataLoader;
    const logger = new DefaultLogger();
    const converter = new DefaultMetadataConverter();
    const testUrl = 'http://localhost/test.json';
    const sampleMetadata = require('tests/assets/metadata/sample-transcription.json');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        loader = new DefaultMetadataLoader(httpClient, converter, logger);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should create an instance', () => {
        expect(loader).toBeTruthy();
    });

    it('should throw AmaliaException if httpClient is null', () => {
        expect(() => new DefaultMetadataLoader(null as any, converter, logger))
            .toThrowError(AmaliaException);
    });

    it('getHttpClient should return the httpClient instance', () => {
        expect(loader.getHttpClient()).toBe(httpClient);
    });

    it('load should fetch metadata and convert it', fakeAsync(() => {
        let result: any;
        loader.load(testUrl, null).then(data => {
            result = data;
        });

        const req = httpTestingController.expectOne(testUrl);
        expect(req.request.method).toBe('GET');
        req.flush(sampleMetadata);
        tick();

        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
    }));

    it('load should parse headers with colon separator', fakeAsync(() => {
        let result: any;
        const headers = ['Authorization: Bearer token123', 'Content-Type: application/json'];
        loader.load(testUrl, headers).then(data => {
            result = data;
        });

        const req = httpTestingController.expectOne(testUrl);
        expect(req.request.headers.get('Authorization')).toBe(' Bearer token123');
        expect(req.request.headers.get('Content-Type')).toBe(' application/json');
        req.flush(sampleMetadata);
        tick();

        expect(result).toBeTruthy();
    }));

    it('load should handle headers without colon', fakeAsync(() => {
        let result: any;
        const headers = ['X-Custom-Header'];
        loader.load(testUrl, headers).then(data => {
            result = data;
        });

        const req = httpTestingController.expectOne(testUrl);
        expect(req.request.headers.has('X-Custom-Header')).toBe(true);
        req.flush(sampleMetadata);
        tick();

        expect(result).toBeTruthy();
    }));

    it('load should use arraybuffer responseType for msgpack', fakeAsync(() => {
        const headers = ['Accept: application/x-msgpack'];
        loader.load(testUrl, headers).catch(() => {
            // Expected to fail due to msgpack decode
        });

        const req = httpTestingController.expectOne(testUrl);
        expect(req.request.responseType).toBe('arraybuffer');
        req.flush(new ArrayBuffer(0));
        tick();
    }));

    it('load should reject with ERROR_TO_CONVERT_METADATA when response is null', fakeAsync(() => {
        let error: any;
        loader.load(testUrl, null).catch(err => {
            error = err;
        });

        const req = httpTestingController.expectOne(testUrl);
        req.flush(null);
        tick();

        expect(error).toBe(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
    }));

    it('load should reject with METADATA_HTTP_LOAD_ERROR on http error', fakeAsync(() => {
        let error: any;
        loader.load(testUrl, null).catch(err => {
            error = err;
        });

        const req = httpTestingController.expectOne(testUrl);
        req.error(new ProgressEvent('error'));
        tick();

        expect(error).toBe(PlayerErrorCode.METADATA_HTTP_LOAD_ERROR);
    }));

    it('load should handle array metadata response', fakeAsync(() => {
        let result: any;
        const arrayMetadata = [sampleMetadata, sampleMetadata];
        loader.load(testUrl, null).then(data => {
            result = data;
        });

        const req = httpTestingController.expectOne(testUrl);
        req.flush(arrayMetadata);
        tick();

        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
    }));

    it('load should handle single object metadata response', fakeAsync(() => {
        let result: any;
        loader.load(testUrl, null).then(data => {
            result = data;
        });

        const req = httpTestingController.expectOne(testUrl);
        req.flush(sampleMetadata);
        tick();

        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
    }));
});
