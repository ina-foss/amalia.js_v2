import { ElementRef } from '@angular/core';
import { StoryboardPluginComponent } from './storyboard-plugin.component';

describe('StoryboardPluginComponent automatic synchronization', () => {
    function createComponent() {
        const mediaPlayer = {
            framerate: 25,
            getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(10),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(120)
        };
        const component = new StoryboardPluginComponent({} as any);
        component.mediaPlayerElement = {
            getMediaPlayer: () => mediaPlayer
        } as any;
        component.pluginConfiguration = {
            data: {
                ...component.getDefaultConfig().data,
                baseUrl: 'https://example.com/storyboard'
            }
        } as any;
        const storyboard = document.createElement('div');
        component.storyboardElement = new ElementRef(storyboard);

        return { component, mediaPlayer, storyboard };
    }

    function setOutOfView(component: StoryboardPluginComponent, storyboard: HTMLElement): void {
        const active = document.createElement('div');
        component.activeThumbnail = active;
        spyOn(storyboard, 'getBoundingClientRect').and.returnValue({ top: 100 } as DOMRect);
        spyOn(active, 'getBoundingClientRect').and.returnValue({ top: 10 } as DOMRect);
        Object.defineProperty(active, 'clientHeight', { value: 10, configurable: true });
        Object.defineProperty(storyboard, 'clientHeight', { value: 50, configurable: true });
    }

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('recenters an out-of-view active thumbnail after three seconds', () => {
        const { component, storyboard } = createComponent();
        setOutOfView(component, storyboard);
        component.currentTime = 42;
        const scrollSpy = spyOn(component, 'scrollToActiveThumbnail');
        jasmine.clock().install();

        component.updateSynchro();
        jasmine.clock().tick(2999);
        expect(scrollSpy).not.toHaveBeenCalled();
        jasmine.clock().tick(1);

        expect(scrollSpy).toHaveBeenCalledOnceWith(42);
    });

    it('cancels a pending recenter when the component is destroyed', () => {
        const { component, storyboard } = createComponent();
        setOutOfView(component, storyboard);
        const scrollSpy = spyOn(component, 'scrollToActiveThumbnail');
        jasmine.clock().install();

        component.updateSynchro();
        component.ngOnDestroy();
        jasmine.clock().tick(3000);

        expect(scrollSpy).not.toHaveBeenCalled();
    });

    it('rebuilds and synchronizes after metadata is loaded', () => {
        const { component, mediaPlayer } = createComponent();
        mediaPlayer.getCurrentTime.and.returnValue(27);
        const initSpy = spyOn(component, 'initStoryboard');
        const seekSpy = spyOn(component, 'handleSeeked');
        jasmine.clock().install();

        (component as any).handleMetadataLoaded();
        expect(initSpy).toHaveBeenCalled();
        jasmine.clock().tick(100);

        expect(component.currentTime).toBe(27);
        expect(seekSpy).toHaveBeenCalled();
    });
});
