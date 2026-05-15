import CloseButton from './CloseButton';
import DownloadButton from './DownloadButton';
import FitScreenButton from './FitScreenButton';
import FlipHButton from './FlipHButton';
import FlipVButton from './FlipVButton';
import FullscreenButton from './FullscreenButton';
import FullsizeButton from './FullsizeButton';
import MagnifyButton from './MagnifyButton';
import RotateButton from './RotateButton';
import SwitchModeButton from './SwitchModeButton';

describe('Photo button variants', () => {
    const baseSettings = {
        className: 'ajs-photo-btn',
        tooltip: 'on',
        tooltip_off: 'off',
        shortcut: null
    } as any;

    it('should apply icon classes on simple buttons', () => {
        const instances = [
            new CloseButton(baseSettings),
            new DownloadButton(baseSettings),
            new FitScreenButton(baseSettings),
            new FlipHButton(baseSettings),
            new FlipVButton(baseSettings),
            new FullsizeButton(baseSettings),
            new RotateButton(baseSettings),
            new SwitchModeButton(baseSettings)
        ];

        instances.forEach((instance) => {
            const span = instance.getDom().querySelector('span:last-child') as HTMLElement;
            expect(span.className).toContain('ajs-photo-icon-');
            instance.removeFromDom();
        });
    });

    it('should toggle fullscreen icon and tooltip text', () => {
        const button = new FullscreenButton(baseSettings);
        const span = button.getDom().querySelector('span:last-child') as HTMLElement;
        const tooltip = button.getDom().querySelector('span.ajs-photo-tooltip') as HTMLElement;

        expect(span.className).toContain('ajs-photo-icon-fullscreen');

        button.toggleIcon();
        expect(span.className).toContain('ajs-photo-icon-fullscreen-off');
        expect(tooltip.textContent).toBe('off');

        button.toggleIcon();
        expect(span.className).toContain('ajs-photo-icon-fullscreen');
        expect(tooltip.textContent).toBe('on');

        button.removeFromDom();
    });

    it('should toggle magnify icon and tooltip text', () => {
        const button = new MagnifyButton(baseSettings);
        const span = button.getDom().querySelector('span:last-child') as HTMLElement;
        const tooltip = button.getDom().querySelector('span.ajs-photo-tooltip') as HTMLElement;

        expect(span.className).toContain('ajs-photo-icon-magnify');

        button.toggleIcon();
        expect(span.className).toContain('ajs-photo-icon-magnify-off');
        expect(tooltip.textContent).toBe('off');

        button.toggleIcon();
        expect(span.className).toContain('ajs-photo-icon-magnify');
        expect(tooltip.textContent).toBe('on');

        button.removeFromDom();
    });
});
