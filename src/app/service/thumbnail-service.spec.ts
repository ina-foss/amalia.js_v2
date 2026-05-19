import { HttpClient } from '@angular/common/http';
import { ThumbnailService } from './thumbnail-service';

describe('ThumbnailService', () => {
    let service: ThumbnailService;

    beforeEach(() => {
        service = new ThumbnailService({} as HttpClient);
    });

    it('should return cached thumbnail when available', async () => {
        service.listThumbnails[10] = { url: '/a', blob: 'blob:cached' };
        const result = await service.getThumbnail('/a', 10);
        expect(result).toBe('blob:cached');
    });

    it('should delegate to loadThumbnail when cache is empty', async () => {
        const loadSpy = spyOn(service, 'loadThumbnail').and.resolveTo('blob:loaded');
        const result = await service.getThumbnail('/a', 2);
        expect(loadSpy).toHaveBeenCalledWith('/a', 2);
        expect(result).toBe('blob:loaded');
    });

    it('should load thumbnail and update cache', async () => {
        const loader = (service as any).loader;
        spyOn(loader, 'load').and.resolveTo('blob:new');

        const result = await service.loadThumbnail('/new', 4);

        expect(result).toBe('blob:new');
        expect(service.listThumbnails[4]).toEqual({ url: '/new', blob: 'blob:new' });
    });
});

