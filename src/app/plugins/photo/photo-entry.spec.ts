import { amaliaPhoto } from './photo-entry';

describe('photo-entry', () => {
    const hostId = 'photo-entry-host';

    beforeEach(() => {
        const host = document.createElement('div');
        host.id = hostId;
        document.body.appendChild(host);
    });

    afterEach(() => {
        const host = document.getElementById(hostId);
        if (host) {
            host.remove();
        }
    });

    it('should create a photo player instance with merged defaults', () => {
        const player = amaliaPhoto(`#${hostId}`, {
            mode: 'simple',
            imagesSrc: [{ name: 'img-1', path: '/img-1.jpg', thumbPath: '/thumb-1.jpg' }],
            zoomStep: 10
        } as any);

        expect(player).toBeTruthy();
        expect((player as any)._settings.zoomStep).toBe(10);
        expect((player as any)._settings.zoomMax).toBe(300);
        expect((player as any)._settings.showGallery).toBeFalse();

        player.destroy();
    });
});

