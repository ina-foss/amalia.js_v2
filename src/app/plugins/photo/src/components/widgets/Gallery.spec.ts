import Gallery from './Gallery';

describe('Gallery', () => {
    const images = [
        { name: 'One', path: '/1.jpg', thumbPath: '/1_t.jpg' },
        { name: 'Two', path: '/2.jpg', thumbPath: '/2_t.jpg' },
        { name: 'Three', path: '/3.jpg', thumbPath: '/3_t.jpg' }
    ];

    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create gallery and dispatch select on click', () => {
        const gallery = new Gallery(images as any, 300);
        document.body.appendChild(gallery.getDom());

        let selectedIndex = -1;
        gallery.getDom().addEventListener(Gallery.events.select, (e: any) => {
            selectedIndex = e.detail.index;
        });

        const thumbs = gallery.getDom().querySelectorAll('.ajs-photo-img-thumb');
        expect(thumbs.length).toBe(3);

        (thumbs[1] as HTMLElement).click();
        expect(selectedIndex).toBe(1);

        gallery.removeFromDom();
    });

    it('should return next images from current index', () => {
        const gallery = new Gallery(images as any, 300);
        document.body.appendChild(gallery.getDom());

        const thumbs = gallery.getDom().querySelectorAll('.ajs-photo-img-thumb');
        (thumbs[2] as HTMLElement).click();

        const next = gallery.getNextImages(2);
        expect(next).toEqual(['/2_t.jpg', '/3_t.jpg']);
        expect(gallery.getNextImages(1)).toBeNull();

        gallery.removeFromDom();
    });

    it('should handle keyboard navigation and mode listeners', () => {
        const gallery = new Gallery(images as any, 300);
        document.body.appendChild(gallery.getDom());

        const dom = gallery.getDom();
        if (!(dom as any).scrollTo) {
            (dom as any).scrollTo = () => undefined;
        }
        spyOn(dom as any, 'scrollTo').and.callThrough();
        spyOn(document, 'addEventListener').and.callThrough();
        spyOn(document, 'removeEventListener').and.callThrough();

        Object.defineProperty(dom, 'clientWidth', { value: 200, configurable: true });
        Object.defineProperty(dom, 'offsetTop', { value: 0, configurable: true });
        Object.defineProperty(dom, 'offsetHeight', { value: 200, configurable: true });

        const event = { key: 'ArrowRight', preventDefault: jasmine.createSpy('preventDefault') } as any;
        gallery.moveHandler(event);
        expect(event.preventDefault).toHaveBeenCalled();

        gallery.setMode('advanced');
        expect(document.addEventListener).toHaveBeenCalledWith('keydown', jasmine.any(Function));

        gallery.setMode('reduced');
        expect(document.removeEventListener).toHaveBeenCalledWith('keydown', jasmine.any(Function));

        gallery.removeFromDom();
    });

    it('should lazy-load thumbnails and scroll to active', () => {
        const gallery = new Gallery(images as any, 300);
        document.body.appendChild(gallery.getDom());
        const dom = gallery.getDom();
        if (!(dom as any).scrollTo) {
            (dom as any).scrollTo = () => undefined;
        }
        spyOn(dom as any, 'scrollTo').and.callThrough();

        Object.defineProperty(dom, 'offsetTop', { value: 0, configurable: true });
        Object.defineProperty(dom, 'offsetHeight', { value: 400, configurable: true });
        Object.defineProperty(dom, 'scrollTop', { value: 50, configurable: true });

        jasmine.clock().tick(350);
        (gallery as any).loadAsyncThumbs();

        const imgs = dom.querySelectorAll('.ajs-photo-thumb') as NodeListOf<HTMLImageElement>;
        imgs.forEach((img) => {
            expect(img.getAttribute('src')).toBeTruthy();
        });

        gallery.scrollToActive();
        expect((dom as any).scrollTo).toHaveBeenCalled();

        gallery.removeFromDom();
    });
});

