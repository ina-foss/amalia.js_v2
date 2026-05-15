import MagnifierHtmlElement from './MagnifierHtmlElement';

describe('MagnifierHtmlElement', () => {
    let target: HTMLDivElement;

    beforeEach(() => {
        target = document.createElement('div');
        target.className = 'cropper-container';
        document.body.appendChild(target);
        Object.defineProperty(target, 'offsetWidth', { value: 200, configurable: true });
        Object.defineProperty(target, 'offsetHeight', { value: 100, configurable: true });
    });

    afterEach(() => {
        target.remove();
    });

    function createData(override: Partial<any> = {}) {
        return {
            src: '/a.jpg',
            src_width: 1000,
            src_height: 500,
            left: 10,
            top: 20,
            rotate: 90,
            crop_left: null,
            crop_top: null,
            crop_width: null,
            crop_height: null,
            flop: 0,
            flip: 0,
            zoomLevel: 100,
            ...override
        };
    }

    it('should move and zoom magnifier then cleanup listeners', () => {
        const magnifier = new MagnifierHtmlElement('.cropper-container', createData(), (e: any) => e.mockPos, 200, 300);
        const glass = magnifier.getDom();
        document.body.appendChild(glass);

        Object.defineProperty(glass, 'offsetWidth', { value: 100, configurable: true });
        Object.defineProperty(glass, 'offsetHeight', { value: 100, configurable: true });

        (magnifier as any).moveMagnifier({ mockPos: { x: 400, y: -40 } });
        expect(glass.style.left).toBe('150px');
        expect(glass.style.top).toBe('-50px');
        expect(glass.style.backgroundPosition).toContain('px');

        const wheelEvent = {
            deltaY: -10,
            mockPos: { x: 50, y: 40 },
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
            stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
        } as any;
        (magnifier as any).mouseWheel(wheelEvent);
        expect(wheelEvent.preventDefault).toHaveBeenCalled();
        expect(wheelEvent.stopPropagation).toHaveBeenCalled();
        expect(wheelEvent.stopImmediatePropagation).toHaveBeenCalled();
        expect(glass.style.backgroundSize).toContain('px');

        magnifier.removeFromDom();
    });

    it('should compute transform style for multiple orientations', () => {
        const m1 = new MagnifierHtmlElement('.cropper-container', createData({ rotate: 180, flip: 1, flop: 1 }), (e: any) => e.mockPos);
        expect((m1 as any).getTransformStyle()).toBeNull();
        m1.removeFromDom();

        const m2 = new MagnifierHtmlElement('.cropper-container', createData({ rotate: 270, flip: 1, flop: 0 }), (e: any) => e.mockPos);
        const t2 = (m2 as any).getTransformStyle();
        expect(t2).toContain('scaleX(-1)');
        expect(t2).toContain('rotate(270deg)');
        m2.removeFromDom();

        const m3 = new MagnifierHtmlElement('.cropper-container', createData({ rotate: 0, flip: 0, flop: 1 }), (e: any) => e.mockPos);
        const t3 = (m3 as any).getTransformStyle();
        expect(t3).toContain('scaleX(-1)');
        m3.removeFromDom();
    });
});

