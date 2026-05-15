import BaseHtmlElement from './BaseHtmlElement';

class TestHtmlElement extends BaseHtmlElement {
    constructor() {
        super();
        this.dom = document.createElement('div');
        this.dom.className = 'root';
    }

    public addTooltipPublic(label: string) {
        (this as any).addTooltip(label);
    }
}

describe('BaseHtmlElement', () => {
    let element: TestHtmlElement;

    beforeEach(() => {
        element = new TestHtmlElement();
        document.body.appendChild(element.getDom());
    });

    afterEach(() => {
        const dom = element?.getDom();
        if (dom && dom.parentElement) {
            dom.parentElement.removeChild(dom);
        }
    });

    it('should add and remove classes', () => {
        element.addClass('a').addClass('b').addClass('a');
        expect(element.getDom().className).toContain('a');
        expect(element.getDom().className).toContain('b');

        element.removeClass('a');
        expect(element.getDom().className).not.toContain('a');
    });

    it('should set and get text content', () => {
        const span = document.createElement('span');
        span.className = 'txt';
        element.getDom().appendChild(span);

        element.setTextContent('hello', '.txt');
        expect(element.getTextContent('.txt')).toBe('hello');
    });

    it('should add and remove DOM event listeners', () => {
        const cb = jasmine.createSpy('cb');
        element.addEventListener('click', cb);
        element.getDom().click();
        expect(cb).toHaveBeenCalledTimes(1);

        element.removeEventListener('click', cb);
        element.getDom().click();
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('should hide and show element', () => {
        element.hide();
        expect(element.getDom().style.visibility).toBe('hidden');
        element.show();
        expect(element.getDom().style.visibility).toBe('visible');
    });

    it('should position tooltip when it overflows on the right', () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ajs-photo-cropper-content';
        wrapper.appendChild(element.getDom());
        document.body.appendChild(wrapper);

        Object.defineProperty(wrapper, 'offsetWidth', { value: 100, configurable: true });
        Object.defineProperty(element.getDom(), 'offsetLeft', { value: 90, configurable: true });

        element.addTooltipPublic('tooltip');
        const tooltip = element.getDom().querySelector('span.ajs-photo-tooltip') as HTMLSpanElement;
        Object.defineProperty(tooltip, 'offsetWidth', { value: 40, configurable: true });

        element.getDom().dispatchEvent(new MouseEvent('mouseover'));
        expect(tooltip.style.left).toBe('-30px');

        wrapper.remove();
    });

    it('should remove itself from dom', () => {
        expect(document.body.contains(element.getDom())).toBeTrue();
        element.removeFromDom();
        expect(document.body.contains(element.getDom())).toBeFalse();
    });
});

