import FullscreenButton from './FullscreenButton';

describe('FullscreenButton', () => {
    it('should toggle classes and tooltip labels', () => {
        const button = new FullscreenButton({
            className: 'btn',
            tooltip: 'Activer',
            tooltip_off: 'Quitter',
            shortcut: null
        } as any, () => undefined);

        document.body.appendChild(button.getDom());
        const tooltip = document.createElement('span');
        tooltip.className = 'ajs-photo-tooltip';
        button.getDom().appendChild(tooltip);

        button.toggleIcon();
        expect(button.getDom().textContent).toContain('Quitter');

        button.toggleIcon();
        expect(button.getDom().textContent).toContain('Activer');

        button.removeFromDom();
    });
});

