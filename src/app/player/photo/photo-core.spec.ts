import Utils from './business/Utils';
import BaseHtmlElement from './components/BaseHtmlElement';
import BaseButton from './components/buttons/BaseButton';
import IncrementInfo from './components/widgets/IncrementInfo';
import Gallery from './components/widgets/Gallery';
import MagnifierHtmlElement from './components/MagnifierHtmlElement';

class TestHtmlElement extends BaseHtmlElement {
    constructor() {
        super();
        this.dom = document.createElement('div');
    }
}

describe('Photo Core Utils', () => {
    it('inArray should compare values by JSON serialization', () => {
        expect(Utils.inArray({ a: 1 }, [{ a: 1 }, { a: 2 }])).toBeTrue();
        expect(Utils.inArray({ a: 3 }, [{ a: 1 }, { a: 2 }])).toBeFalse();
    });

    it('guid should generate prefixed ids', () => {
        const id = Utils.guid();
        expect(id.startsWith('amaliaPhotoPlayer')).toBeTrue();
    });

    it('truncate should keep original string when length <= 60', () => {
        expect(Utils.truncate('short text')).toBe('short text');
    });

    it('truncate should shorten long strings', () => {
        const src = 'a'.repeat(80);
        expect(Utils.truncate(src, 10, '...')).toBe('aaaaaaaaaa...');
    });

    it('mergeDeep should merge nested objects', () => {
        const merged = Utils.mergeDeep({}, { a: { b: 1 } }, { a: { c: 2 } }, { d: 3 });
        expect(merged).toEqual({ a: { b: 1, c: 2 }, d: 3 });
    });

    it('isObject / round helpers should work', () => {
        expect(Utils.isObject({})).toBeTrue();
        expect(Utils.isObject([])).toBeFalse();
        expect(Utils.roundToMultiple(17, 5)).toBe(15);
        expect(Utils.roundToSteps(12, [10, 20, 30], 'next')).toBe(20);
        expect(Utils.roundToSteps(12, [10, 20, 30], 'prev')).toBe(10);
    });
});

describe('BaseHtmlElement', () => {
    let instance: TestHtmlElement;

    beforeEach(() => {
        instance = new TestHtmlElement();
        document.body.appendChild(instance.getDom());
    });

    afterEach(() => {
        instance.removeFromDom();
    });

    it('should add/remove classes and manage text', () => {
        instance.addClass('foo').addClass('bar');
        expect(instance.getDom().className).toContain('foo');
        expect(instance.getDom().className).toContain('bar');

        instance.removeClass('foo');
        expect(instance.getDom().className).not.toContain('foo');

        instance.setTextContent('hello');
        expect(instance.getTextContent()).toBe('hello');
    });

    it('should hide/show element', () => {
        instance.hide();
        expect(instance.getDom().style.visibility).toBe('hidden');
        instance.show();
        expect(instance.getDom().style.visibility).toBe('visible');
    });

    it('should bind and unbind event listeners', () => {
        const spy = jasmine.createSpy('clickSpy');
        instance.addEventListener('click', spy);
        instance.getDom().dispatchEvent(new Event('click'));
        expect(spy).toHaveBeenCalled();

        instance.removeEventListener('click', spy);
        instance.getDom().dispatchEvent(new Event('click'));
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('BaseButton', () => {
    afterEach(() => {
        document.querySelectorAll('a').forEach((el) => el.remove());
    });

    it('should trigger click action when enabled', () => {
        const action = jasmine.createSpy('action');
        const btn = new BaseButton({ className: 'my-btn', tooltip: null, shortcut: null } as any, action);
        document.body.appendChild(btn.getDom());

        btn.getDom().dispatchEvent(new Event('click'));
        expect(action).toHaveBeenCalled();
    });

    it('should remove click action when disabled', () => {
        const action = jasmine.createSpy('action');
        const btn = new BaseButton({ className: 'my-btn', tooltip: null, shortcut: null } as any, action);
        document.body.appendChild(btn.getDom());

        btn.disable();
        btn.getDom().dispatchEvent(new Event('click'));
        expect(action).not.toHaveBeenCalled();
    });

    it('should trigger keyboard shortcut action', () => {
        const action = jasmine.createSpy('action');
        const btn = new BaseButton({ className: 'my-btn', tooltip: null, shortcut: 'x' } as any, action);
        document.body.appendChild(btn.getDom());

        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'x' }));
        expect(action).toHaveBeenCalled();
        btn.removeFromDom();
    });
});

describe('IncrementInfo', () => {
    let widget: IncrementInfo;

    beforeEach(() => {
        widget = new IncrementInfo(10, null, 10, 100, {
            minus: { className: 'minus', tooltip: null, shortcut: null },
            plus: { className: 'plus', tooltip: null, shortcut: null },
            result: { className: 'result', tooltip: null, shortcut: null }
        } as any);
        document.body.appendChild(widget.getDom());
        widget.setResultValue(50);
    });

    afterEach(() => {
        widget.removeFromDom();
    });

    it('should increment and decrement value', () => {
        widget.increment();
        expect(widget.getTextContent('.ajs-photo-result')).toBe('60');

        widget.decrement();
        expect(widget.getTextContent('.ajs-photo-result')).toBe('50');
    });

    it('should emit change event on showRealSize', () => {
        const spy = jasmine.createSpy('changeSpy');
        widget.getDom().addEventListener(IncrementInfo.events.change, spy);

        widget.showRealSize();
        expect(spy).toHaveBeenCalled();
        expect(widget.getTextContent('.ajs-photo-result')).toBe('100');
    });
});

describe('Gallery', () => {
    const images = [
        { name: 'A', path: '/a.jpg', thumbPath: '/a_t.jpg' },
        { name: 'B', path: '/b.jpg', thumbPath: '/b_t.jpg' },
        { name: 'C', path: '/c.jpg', thumbPath: '/c_t.jpg' }
    ];

    let gallery: Gallery;

    beforeEach(() => {
        gallery = new Gallery(images as any, 300);
        document.body.appendChild(gallery.getDom());
    });

    afterEach(() => {
        gallery.removeFromDom();
    });

    it('should emit select event on thumb click', () => {
        const spy = jasmine.createSpy('selectSpy');
        gallery.getDom().addEventListener(Gallery.events.select, spy);

        const firstThumb = gallery.getDom().querySelector('.ajs-photo-img-thumb') as HTMLElement;
        firstThumb.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should return next images', () => {
        const next = gallery.getNextImages(2);
        expect(next).toBeTruthy();
        expect(next?.length).toBe(2);
    });

    it('should ignore non-navigation keys in moveHandler', () => {
        const prevent = jasmine.createSpy('preventDefault');
        gallery.moveHandler({ key: 'a', preventDefault: prevent } as any);
        expect(prevent).not.toHaveBeenCalled();
    });
});

describe('MagnifierHtmlElement', () => {
    const imgData = {
        src: '/x.jpg',
        src_width: 200,
        src_height: 100,
        left: 0,
        top: 0,
        rotate: 90,
        crop_left: 0,
        crop_top: 0,
        crop_width: 0,
        crop_height: 0,
        flop: 0,
        flip: 0,
        zoomLevel: 100
    };

    let target: HTMLDivElement;

    beforeEach(() => {
        target = document.createElement('div');
        target.className = 'cropper-container';
        Object.defineProperty(target, 'offsetWidth', { value: 200, configurable: true });
        Object.defineProperty(target, 'offsetHeight', { value: 100, configurable: true });
        document.body.appendChild(target);
    });

    afterEach(() => {
        document.querySelectorAll('.cropper-container, .ajs-photo-magnifier-glass').forEach((el) => el.remove());
    });

    it('should create and remove magnifier node', () => {
        const magnifier = new MagnifierHtmlElement(
            '.cropper-container',
            imgData as any,
            () => ({ x: 10, y: 10 }),
            300,
            600
        );
        document.body.appendChild(magnifier.getDom());
        expect(magnifier.getDom().className).toContain('ajs-photo-magnifier-glass');

        magnifier.removeFromDom();
        expect(document.querySelector('.ajs-photo-magnifier-glass')).toBeNull();
    });

    it('mouseWheel should update zoom and prevent propagation', () => {
        const magnifier = new MagnifierHtmlElement(
            '.cropper-container',
            imgData as any,
            () => ({ x: 30, y: 20 }),
            300,
            600
        );
        document.body.appendChild(magnifier.getDom());
        Object.defineProperty(magnifier.getDom(), 'offsetWidth', { value: 50, configurable: true });
        Object.defineProperty(magnifier.getDom(), 'offsetHeight', { value: 50, configurable: true });

        const evt: any = {
            deltaY: -1,
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
            stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
        };

        (magnifier as any).mouseWheel(evt);
        expect(evt.preventDefault).toHaveBeenCalled();
        expect(evt.stopPropagation).toHaveBeenCalled();
        expect(evt.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('moveMagnifier should clamp coordinates inside target bounds', () => {
        const magnifier = new MagnifierHtmlElement(
            '.cropper-container',
            imgData as any,
            () => ({ x: 999, y: -20 }),
            300,
            600
        );
        document.body.appendChild(magnifier.getDom());
        Object.defineProperty(magnifier.getDom(), 'offsetWidth', { value: 40, configurable: true });
        Object.defineProperty(magnifier.getDom(), 'offsetHeight', { value: 20, configurable: true });

        (magnifier as any).moveMagnifier({});
        expect(magnifier.getDom().style.left).toBe('180px');
        const targetRect = target.getBoundingClientRect();
        const parentRect = magnifier.getDom().parentElement?.getBoundingClientRect() ?? targetRect;
        const expectedTop = targetRect.top - parentRect.top - 10;
        expect(magnifier.getDom().style.top).toBe(`${expectedTop}px`);
    });

    it('transform and scale helpers should handle flip/flop combinations', () => {
        const magnifier = new MagnifierHtmlElement(
            '.cropper-container',
            { ...imgData, rotate: 180, flip: 1, flop: 1 } as any,
            () => ({ x: 10, y: 10 }),
            300,
            600
        );

        const nullScale = (magnifier as any).getScaleTransforms();
        expect(nullScale).toBeNull();
        expect((magnifier as any).getTransformStyle()).toBeNull();

        (magnifier as any)._imgData.rotate = 90;
        (magnifier as any)._imgData.flip = 1;
        (magnifier as any)._imgData.flop = 0;
        const style = (magnifier as any).getTransformStyle();
        expect(style).toContain('scaleX(-1)');
        expect(style).toContain('rotate(90deg)');

        const transformed = (magnifier as any).transformCoordinates(10, 20, 200, 100);
        expect(transformed.length).toBe(2);
    });
});
