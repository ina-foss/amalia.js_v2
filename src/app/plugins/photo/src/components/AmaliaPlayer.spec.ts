import AmaliaPlayer from './AmaliaPlayer';
import AmaliaEventConstants from '../business/AmaliaEventConstants';

describe('AmaliaPlayer', () => {
    let host: HTMLDivElement;

    beforeEach(() => {
        host = document.createElement('div');
        host.id = 'amalia-player-host';
        host.style.width = '600px';
        host.style.height = '400px';
        document.body.appendChild(host);
    });

    afterEach(() => {
        host.remove();
    });

    function makeSettings(showGallery = true) {
        return {
            mode: 'simple',
            showGallery,
            zoomStep: 25,
            zoomSteps: null,
            zoomMax: 300,
            zoomMin: 10,
            magnifyValue: 400,
            imagesSrc: [
                { name: 'img-1', path: '/img-1.jpg', thumbPath: '/thumb-1.jpg' },
                { name: 'img-2', path: '/img-2.jpg', thumbPath: '/thumb-2.jpg' },
                { name: 'img-3', path: '/img-3.jpg', thumbPath: '/thumb-3.jpg' }
            ],
            toolbar: {}
        } as any;
    }

    it('should initialize player, select images, change mode and destroy cleanly', () => {
        const player = new AmaliaPlayer('#amalia-player-host', makeSettings(true));
        expect(player).toBeTruthy();
        expect((player as any).dom.className).toContain('ajs-photo-amalia-photo');
        expect(player.getMode()).toBe('simple');

        let selectEventIndex = -1;
        player.addEventListener(AmaliaEventConstants.select, (e: any) => {
            selectEventIndex = e.detail.index;
            expect(e.detail.player).toBe(player);
        });

        const secondThumb = host.querySelectorAll('.ajs-photo-img-thumb')[1] as HTMLElement;
        secondThumb.click();
        expect(selectEventIndex).toBe(1);

        player.setMode('reduced', 500, 300);
        expect((player as any).dom.className).toContain('ajs-photo-reduced');
        expect(host.style.width).toBe('500px');
        expect(host.style.height).toBe('300px');

        player.setMode('simple', 500, 300);
        expect(player.getMode()).toBe('simple');

        player.destroy();
        expect((player as any)._settings).toBeNull();
        expect((player as any).dom).toBeNull();
    });

    it('should trigger custom events with player reference', () => {
        const player = new AmaliaPlayer('#amalia-player-host', makeSettings(false));
        let payload: any = null;
        player.addEventListener('custom-photo-event', (e: any) => {
            payload = e.detail;
        });

        player.triggerEvent(new CustomEvent('custom-photo-event', { detail: { foo: 'bar' } }));
        expect(payload.foo).toBe('bar');
        expect(payload.player).toBe(player);

        player.destroy();
    });
});

