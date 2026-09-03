import {fakeAsync, getTestBed, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {DefaultLogger} from '../../logger/default-logger';
import {HistogramLoader} from './histogram-loader';
import {AmaliaException} from '../../exception/amalia-exception';
import {PlayerErrorCode} from '../../constant/error-type';

describe('HistogramLoader', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let logger: DefaultLogger;
    let loader: HistogramLoader;
    const url = 'http://localhost/peaks.json';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);
        logger = new DefaultLogger();
        loader = new HistogramLoader(httpClient, logger);
    }));

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should expose a stable METADATA_ID constant', () => {
        expect(HistogramLoader.METADATA_ID).toEqual('histogram-waveform-surfer');
    });

    it('should throw AmaliaException when constructed without httpClient', () => {
        expect(() => new HistogramLoader(null as any, logger)).toThrowError(AmaliaException);
    });

    it('should resolve a single Metadata block when payload is valid', fakeAsync(() => {
        const payload = {posbins: [1, 2, 3], negbins: [-1, -2, -3]};
        let result: any = null;
        loader.load(url, []).then(metas => result = metas);

        const req: TestRequest = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');
        req.flush(payload);
        tick();

        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBe(1);
        expect(result[0].id).toEqual(HistogramLoader.METADATA_ID);
        expect(result[0].type).toEqual('WAVEFORM_PEAKS');
        expect(result[0].data).toEqual(payload as any);
    }));

    it('should parse "Name: value" headers and forward them to HttpClient', fakeAsync(() => {
        const payload = {posbins: [], negbins: []};
        loader.load(url, ['Authorization: Bearer abc', 'X-Trace: 42']);

        const req = httpTestingController.expectOne(url);
        expect(req.request.headers.get('Authorization')).toEqual('Bearer abc');
        expect(req.request.headers.get('X-Trace')).toEqual('42');
        req.flush(payload);
        tick();
    }));

    it('should accept headers without a colon (empty value)', fakeAsync(() => {
        const payload = {posbins: [], negbins: []};
        loader.load(url, ['Standalone-Header']);

        const req = httpTestingController.expectOne(url);
        expect(req.request.headers.has('Standalone-Header')).toBeTrue();
        req.flush(payload);
        tick();
    }));

    it('should work when headers is null/undefined', fakeAsync(() => {
        const payload = {posbins: [1], negbins: [-1]};
        loader.load(url, null as any);

        const req = httpTestingController.expectOne(url);
        req.flush(payload);
        tick();
    }));

    it('should reject with ERROR_TO_CONVERT_METADATA when payload is invalid', fakeAsync(() => {
        let rejected: any = null;
        const errorSpy = spyOn(logger, 'error');
        loader.load(url, []).catch(err => rejected = err);

        httpTestingController.expectOne(url).flush({foo: 'bar'} as any);
        tick();

        expect(rejected).toEqual(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
        expect(errorSpy).toHaveBeenCalled();
    }));

    it('should reject when payload is null', fakeAsync(() => {
        let rejected: any = null;
        loader.load(url, []).catch(err => rejected = err);

        httpTestingController.expectOne(url).flush(null);
        tick();

        expect(rejected).toEqual(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
    }));

    it('should reject when posbins is not an array', fakeAsync(() => {
        let rejected: any = null;
        loader.load(url, []).catch(err => rejected = err);

        httpTestingController.expectOne(url).flush({posbins: 'oops', negbins: []} as any);
        tick();

        expect(rejected).toEqual(PlayerErrorCode.ERROR_TO_CONVERT_METADATA);
    }));

    it('should reject with METADATA_HTTP_LOAD_ERROR on HTTP failure', fakeAsync(() => {
        let rejected: any = null;
        const errorSpy = spyOn(logger, 'error');
        loader.load(url, []).catch(err => rejected = err);

        httpTestingController.expectOne(url).flush('boom', {status: 500, statusText: 'Server error'});
        tick();

        expect(rejected).toEqual(PlayerErrorCode.METADATA_HTTP_LOAD_ERROR);
        expect(errorSpy).toHaveBeenCalled();
    }));
});
