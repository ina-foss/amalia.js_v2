import { HttpClient } from '@angular/common/http';
import { AmaliaException } from '../exception/amalia-exception';
import { ThumbnailLoader } from './thumbnail-loader';

describe('ThumbnailLoader', () => {
    it('should throw when httpClient is missing', () => {
        expect(() => new ThumbnailLoader(null as unknown as HttpClient))
            .toThrowError(AmaliaException, 'Error to implement thumbnail loader');
    });

    it('should resolve blob URL on successful load', async () => {
        const blob = new Blob(['a'], { type: 'image/png' });
        const getSpy = jasmine.createSpy('get').and.returnValue({
            toPromise: () => Promise.resolve(blob)
        });
        const httpClient = { get: getSpy } as unknown as HttpClient;
        const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:ok');

        const loader = new ThumbnailLoader(httpClient);
        const result = await loader.load('/thumb');

        expect(getSpy).toHaveBeenCalled();
        expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
        expect(result).toBe('blob:ok');
    });

    it('should reject with ERROR_LOAD_THUMBNAIL when request fails', async () => {
        const getSpy = jasmine.createSpy('get').and.returnValue({
            toPromise: () => Promise.reject(new Error('network'))
        });
        const httpClient = { get: getSpy } as unknown as HttpClient;
        const loader = new ThumbnailLoader(httpClient);

        await expectAsync(loader.load('/thumb')).toBeRejectedWith('ERROR_LOAD_THUMBNAIL');
    });
});

