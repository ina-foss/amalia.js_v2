import BaseButton from './BaseButton';

describe('BaseButton', () => {
    it('should trigger action on click and shortcut', () => {
        const action = jasmine.createSpy('action');
        const button = new BaseButton({
            className: 'my-btn',
            tooltip: 'tip',
            shortcut: 'k'
        } as any, action);

        button.getDom().click();
        expect(action).toHaveBeenCalledTimes(1);

        const keyboardEvent = {
            key: 'k',
            stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation'),
            stopPropagation: jasmine.createSpy('stopPropagation')
        } as any;
        (button as any).actionShorcutEvent(keyboardEvent);
        expect(action).toHaveBeenCalledTimes(2);
        expect(keyboardEvent.stopImmediatePropagation).toHaveBeenCalled();
        expect(keyboardEvent.stopPropagation).toHaveBeenCalled();

        button.removeFromDom();
    });

    it('should disable and enable events', () => {
        const action = jasmine.createSpy('action');
        const button = new BaseButton({
            className: 'my-btn',
            tooltip: null,
            shortcut: null
        } as any, action);

        button.disable();
        button.getDom().click();
        expect(action).not.toHaveBeenCalled();

        button.enable();
        button.getDom().click();
        expect(action).toHaveBeenCalledTimes(1);

        button.removeFromDom();
    });

    it('should keep disabled state when settings.disable is true', () => {
        const action = jasmine.createSpy('action');
        const button = new BaseButton({
            className: 'my-btn',
            tooltip: null,
            shortcut: null,
            disable: true
        } as any, action);

        button.getDom().click();
        expect(action).not.toHaveBeenCalled();
        expect(button.getDom().querySelector('span')?.className).toContain('ajs-photo-btn-disable');

        button.enable();
        button.getDom().click();
        expect(action).not.toHaveBeenCalled();

        button.removeFromDom();
    });
});

