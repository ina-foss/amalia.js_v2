import { PicturesGalleryPluginComponent } from './pictures-gallery-plugin.component';

class MediaPlayerServiceStub {
    get() {
        return null as any;
    }
}

describe('PicturesGalleryPluginComponent', () => {
    let component: PicturesGalleryPluginComponent;
    let emitSpy: jasmine.Spy;

    beforeEach(() => {
        component = new PicturesGalleryPluginComponent(new MediaPlayerServiceStub() as any);
        emitSpy = jasmine.createSpy('emit');
        (component as any).mediaPlayerElement = {
            metadataManager: {
                getMetadata: () => null
            },
            eventEmitter: { emit: emitSpy }
        };
        component.pluginConfiguration = {
            metadataIds: ['m1'],
            data: { height: 300, thumbSize: 70, lazyLoadOffset: 100, enableKeyboardNavigation: true }
        } as any;
    });

    function createContainerWithThumbs(count = 3): HTMLElement {
        const container = document.createElement('div');
        Object.defineProperty(container, 'clientWidth', { value: 320, configurable: true });
        Object.defineProperty(container, 'clientHeight', { value: 120, configurable: true });
        Object.defineProperty(container, 'offsetHeight', { value: 120, configurable: true });
        container.scrollTop = 0;
        for (let i = 0; i < count; i++) {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb';
            Object.defineProperty(thumb, 'offsetTop', { value: i * 40, configurable: true });
            Object.defineProperty(thumb, 'offsetHeight', { value: 40, configurable: true });

            const img = document.createElement('img');
            img.setAttribute('data-src', `/img-${i}.jpg`);
            thumb.appendChild(img);
            container.appendChild(thumb);
        }
        spyOn(container, 'scrollTo');
        return container;
    }

    it('should expose default config', () => {
        const cfg = component.getDefaultConfig();
        expect(cfg.name).toBe(PicturesGalleryPluginComponent.PLUGIN_NAME);
        expect(cfg.data.thumbSize).toBe(70);
    });

    it('processMetadata should keep only valid image entries', () => {
        (component as any).processMetadata([
            { name: 'A', path: '/a', thumbPath: '/ta', resourceRef: 'r1' },
            { label: 'B', url: '/b', thumbnail: '/tb' },
            { no: 'path' }
        ]);

        expect(component.images.length).toBe(2);
        expect(component.images[0].name).toBe('A');
        expect(component.images[1].name).toBe('B');
    });

    it('loadImages should read metadata and build gallery', () => {
        const buildSpy = spyOn<any>(component, 'buildGallery');
        (component as any).mediaPlayerElement.metadataManager.getMetadata = () => ({
            data: [{ name: 'A', path: '/a', thumbPath: '/ta' }]
        });

        (component as any).loadImages();
        expect(component.images.length).toBe(1);
        expect(buildSpy).toHaveBeenCalled();
    });

    it('onMetadataChange should reset then reload images', () => {
        component.images = [{ name: 'x', path: '/x', thumbPath: '/tx' } as any];
        component.currentItemIndex = 2;
        const loadSpy = spyOn<any>(component, 'loadImages');

        (component as any).onMetadataChange();
        expect(component.images).toEqual([]);
        expect(component.currentItemIndex).toBe(0);
        expect(loadSpy).toHaveBeenCalled();
    });

    it('buildGallery should attach keydown listener when container exists', (done) => {
        const container = createContainerWithThumbs();
        component.galleryContainer = { nativeElement: container } as any;
        const lazySpy = spyOn<any>(component, 'loadAsyncThumbs');
        const addSpy = spyOn(document, 'addEventListener');

        (component as any).buildGallery();
        setTimeout(() => {
            expect(lazySpy).toHaveBeenCalled();
            expect(addSpy).toHaveBeenCalledWith('keydown', (component as any)._moveEventRef);
            done();
        }, 350);
    });

    it('selectImage should emit selected payload', () => {
        component.images = [{ name: 'A', path: '/a', thumbPath: '/ta', resourceRef: 'r1' } as any];
        component.selectImage(0);
        expect(component.currentItemIndex).toBe(0);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('moveHandler should ignore non-arrow keys', () => {
        const prevent = jasmine.createSpy('preventDefault');
        component.moveHandler({ key: 'A', preventDefault: prevent } as any);
        expect(prevent).not.toHaveBeenCalled();
    });

    it('moveHandler should navigate and scroll for ArrowRight', () => {
        component.images = [
            { name: 'A', path: '/a', thumbPath: '/ta' } as any,
            { name: 'B', path: '/b', thumbPath: '/tb' } as any
        ];
        component.currentItemIndex = 0;
        const container = createContainerWithThumbs(2);
        component.galleryContainer = { nativeElement: container } as any;
        const selectSpy = spyOn(component, 'selectImage').and.callThrough();

        component.moveHandler({ key: 'ArrowRight', preventDefault: () => undefined } as any);
        expect(selectSpy).toHaveBeenCalledWith(1);
    });

    it('loadAsyncThumbs should resolve deferred src attributes', () => {
        const container = createContainerWithThumbs(2);
        component.galleryContainer = { nativeElement: container } as any;

        (component as any).loadAsyncThumbs();
        const imgs = container.querySelectorAll('img');
        expect(imgs[0].getAttribute('data-src')).toBeNull();
    });

    it('onScroll should call loadAsyncThumbs', () => {
        const spy = spyOn<any>(component, 'loadAsyncThumbs');
        component.onScroll();
        expect(spy).toHaveBeenCalled();
    });

    it('onImageClick should delegate to selectImage', () => {
        const spy = spyOn(component, 'selectImage');
        component.onImageClick(1);
        expect(spy).toHaveBeenCalledWith(1);
    });

    it('scrollToActive should call scrollToIndex with current index', () => {
        component.currentItemIndex = 3;
        const spy = spyOn<any>(component, 'scrollToIndex');
        component.scrollToActive();
        expect(spy).toHaveBeenCalledWith(3);
    });

    it('getNextImages should return null for single item', () => {
        component.images = [{ name: 'A', path: '/a', thumbPath: '/ta' } as any];
        expect(component.getNextImages(4)).toBeNull();
    });

    it('getNextImages should return a slice for multiple items', () => {
        component.images = [
            { name: 'A', path: '/a', thumbPath: '/ta' } as any,
            { name: 'B', path: '/b', thumbPath: '/tb' } as any,
            { name: 'C', path: '/c', thumbPath: '/tc' } as any
        ];
        component.currentItemIndex = 1;

        const list = component.getNextImages(2);
        expect(list).toEqual(['/b', '/c']);
    });

    it('ngOnDestroy should remove keydown listener', () => {
        const rmSpy = spyOn(document, 'removeEventListener');
        component.ngOnDestroy();
        expect(rmSpy).toHaveBeenCalledWith('keydown', (component as any)._moveEventRef);
    });
});
