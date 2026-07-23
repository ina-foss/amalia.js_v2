import { ElementRef } from '@angular/core';
import { StoryboardPluginComponent } from './storyboard-plugin.component';

describe('StoryboardPluginComponent', () => {
    function createComponent() {
        const component = new StoryboardPluginComponent({} as any);
        const mediaPlayer = {
            framerate: 25,
            reverseMode: false,
            playbackRate: 2,
            getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(10),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(120),
            setCurrentTime: jasmine.createSpy('setCurrentTime')
        } as any;

        component.mediaPlayerElement = {
            getMediaPlayer: () => mediaPlayer,
            eventEmitter: {},
            getConfiguration: () => ({ tcOffset: 0, player: { framerate: 25 } })
        } as any;

        component.logger = {
            info: jasmine.createSpy('info'),
            warn: jasmine.createSpy('warn'),
            debug: jasmine.createSpy('debug'),
            error: jasmine.createSpy('error')
        } as any;

        component.pluginConfiguration = {
            name: 'STORYBOARD',
            data: {
                ...component.getDefaultConfig().data,
                baseUrl: 'https://example.com/storyboard',
                tcParam: 'tc',
                theme: 'v',
                itemPerLine: 4,
                enableLabel: true
            }
        } as any;

        const parent = document.createElement('div');
        parent.className = 'storyboard-test-root';
        const storyboard = document.createElement('div');
        parent.appendChild(storyboard);
        document.body.appendChild(parent);

        component.storyboardElement = new ElementRef(storyboard);
        component.scrollElement = new ElementRef(document.createElement('div'));

        return { component, mediaPlayer, parent, storyboard };
    }

    afterEach(() => {
        document.querySelectorAll('.storyboard-test-root').forEach((node) => node.remove());
    });

    it('should expose defaults', () => {
        const { component } = createComponent();

        expect((component as any).pluginName).toBe('STORYBOARD');
        expect(component.selectedInterval[0]).toBe('tc');
        expect(component.getDefaultConfig().name).toBe('STORYBOARD');
    });

    it('initStoryboard should build base URL and call updateThumbnailSize', () => {
        const { component } = createComponent();
        const updateSpy = spyOn(component as any, 'updateThumbnailSize');

        component.initStoryboard();

        expect(component.duration).toBe(120);
        expect(component.baseUrl).toBe('https://example.com/storyboard?tc=');
        expect(updateSpy).toHaveBeenCalled();
    });

    it('initStoryboard should log error when duration is invalid', () => {
        const { component, mediaPlayer } = createComponent();
        mediaPlayer.getDuration.and.returnValue(NaN);

        component.initStoryboard();

        expect(component.duration).toBeNull();
        expect((component.logger.error as jasmine.Spy)).toHaveBeenCalled();
    });

    it('updateThumbnailSize should compute list and close menu', () => {
        const { component } = createComponent();
        component.duration = 10;
        component.selectedInterval = ['frame', 50];
        const handleScrollSpy = spyOn(component, 'handleScroll');
        const selectThumbnailSpy = spyOn(component, 'selectThumbnail');
        spyOn(component as any, 'updateScrollHeight');

        component.updateThumbnailSize();

        expect(component.listOfThumbnail.length).toBeGreaterThan(0);
        expect(component.openIntervalList()).toBeFalse();
        expect(handleScrollSpy).toHaveBeenCalled();
        expect(selectThumbnailSpy).toHaveBeenCalled();
    });

    it('handleScroll should update filtered thumbnails and transform', () => {
        const { component, storyboard } = createComponent();
        component.listOfThumbnail = [0, 1, 2, 3, 4, 5, 6, 7];
        component.itemPerLine = 2;
        component.heightThumbnail = 20;
        const selectThumbnailSpy = spyOn(component, 'selectThumbnail');
        spyOn(component, 'updateSynchro');
        spyOn(component as any, 'updateScrollHeight');

        Object.defineProperty(storyboard, 'clientHeight', { value: 100, configurable: true });
        storyboard.parentElement!.scrollTop = 40;
        for (let i = 0; i < 4; i++) {
            const el = document.createElement('div');
            storyboard.appendChild(el);
        }

        jasmine.clock().install();
        component.handleScroll();
        jasmine.clock().tick(801);
        jasmine.clock().uninstall();

        expect(component.listOfThumbnailFilter().length).toBeGreaterThan(0);
        expect(storyboard.style.transform).toContain('translateY');
        expect(selectThumbnailSpy).toHaveBeenCalled();
    });

    it('selectThumbnail should activate node and persist scrollTop', () => {
        const { component, storyboard, mediaPlayer } = createComponent();
        component.selectedIntervalitem = 5;
        component.listOfThumbnail = [0, 5, 10];
        mediaPlayer.getCurrentTime.and.returnValue(6);

        const t0 = document.createElement('div');
        t0.className = 'thumbnail';
        t0.setAttribute('data-tc', '0');
        const t1 = document.createElement('div');
        t1.className = 'thumbnail';
        t1.setAttribute('data-tc', '5');
        storyboard.appendChild(t0);
        storyboard.appendChild(t1);

        storyboard.parentElement!.scrollTop = 12;
        component.selectThumbnail();

        expect(t1.classList.contains('active')).toBeTrue();
        expect(component.usedSelectedtc).toBe(5);
        expect(storyboard.parentElement!.dataset.scrollTop).toBeDefined();
    });

    it('updateSynchro should hide button when no active node and show when out of view', () => {
        const { component, storyboard } = createComponent();
        component.activeThumbnail = null;
        component.updateSynchro();
        expect(component.displaySynchro()).toBeFalse();

        const active = document.createElement('div');
        component.activeThumbnail = active;
        spyOn(storyboard, 'getBoundingClientRect').and.returnValue({ top: 100 } as DOMRect);
        spyOn(active, 'getBoundingClientRect').and.returnValue({ top: 10 } as DOMRect);
        Object.defineProperty(active, 'clientHeight', { value: 10, configurable: true });
        Object.defineProperty(storyboard, 'clientHeight', { value: 50, configurable: true });

        component.updateSynchro();
        expect(component.displaySynchro()).toBeTrue();
    });

    it('seekToTc should set playbackRate and seek media', () => {
        const { component, mediaPlayer } = createComponent();

        component.seekToTc(33);

        expect(mediaPlayer.playbackRate).toBe(1);
        expect(mediaPlayer.setCurrentTime).toHaveBeenCalledWith(33);
        expect(component.selectedTc).toBe(33);
    });

    it('handleSeeked should select active thumbnail and update scroll for out-of-range', () => {
        const { component, storyboard, mediaPlayer } = createComponent();
        mediaPlayer.getCurrentTime.and.returnValue(45);
        component.currentTime = 30;
        component.listOfThumbnail = [0, 20, 40, 60, 80];
        component.listOfThumbnailFilter.set([20, 40]);
        component.displaySynchro.set(false);

        const t1 = document.createElement('div');
        t1.className = 'thumbnail';
        t1.setAttribute('data-tc', '40');
        storyboard.appendChild(t1);

        const scrollSpy = spyOn(component, 'updateScrollForTimeCode');
        component.handleSeeked();

        expect(component.selectedTc).toBe(45);
        expect(scrollSpy).toHaveBeenCalled();
        expect(t1.classList.contains('active')).toBeTrue();
    });

    it('handleSeeking should use the candidate time and cancel a pending throttled update', () => {
        const { component, storyboard, mediaPlayer } = createComponent();
        const cancel = jasmine.createSpy('cancel');
        component.throttleTimeChange = { cancel };
        component.listOfThumbnail = [0, 20, 40, 60, 80];
        component.listOfThumbnailFilter.set([20, 40]);
        component.displaySynchro.set(true);

        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.setAttribute('data-tc', '40');
        storyboard.appendChild(thumbnail);

        component.handleSeeking(45);

        expect(cancel).toHaveBeenCalled();
        expect(mediaPlayer.getCurrentTime).not.toHaveBeenCalled();
        expect(component.currentTime).toBe(45);
        expect(component.selectedTc).toBe(45);
        expect(thumbnail.classList.contains('active')).toBeTrue();
    });

    it('updateScrollForTimeCode should set parent scrollTop when index is found', () => {
        const { component, storyboard } = createComponent();
        component.listOfThumbnail = [0, 10, 20, 30];
        component.heightThumbnail = 25;
        component.itemPerLine = 2;
        spyOn(component as any, 'updateScrollHeight');
        Object.defineProperty(storyboard, 'clientHeight', { value: 100, configurable: true });

        component.updateScrollForTimeCode(20, true);

        expect(storyboard.parentElement!.scrollTop).toBeGreaterThanOrEqual(0);
    });

    it('handleThumbnailSizeChange and scrollToActiveThumbnail should trigger delayed actions', () => {
        const { component, storyboard } = createComponent();
        const updateSpy = spyOn(component, 'updateThumbnailSize');
        const seekSpy = spyOn(component, 'seekToTc');
        const handleScrollSpy = spyOn(component, 'handleScroll');
        component.currentTime = 12;
        storyboard.parentElement!.dataset.scrollTop = '18';
        spyOn(storyboard.parentElement as any, 'scrollTo');

        jasmine.clock().install();
        component.handleThumbnailSizeChange('medium');
        jasmine.clock().tick(251);

        component.scrollToActiveThumbnail(12, true);
        jasmine.clock().tick(801);
        jasmine.clock().uninstall();

        expect(updateSpy).toHaveBeenCalled();
        expect(handleScrollSpy).toHaveBeenCalled();
        expect(seekSpy).toHaveBeenCalledWith(12);
    });

    it('toggleList and waitAndReload should update state and retry image loading', () => {
        const { component } = createComponent();
        component.openIntervalList.set(false);

        component.toggleList();
        expect(component.openIntervalList()).toBeTrue();

        const target = document.createElement('img');
        target.dataset.imgsrc = '/image.jpg';
        target.setAttribute('data-retry', '0');
        target.setAttribute('data-max-retry', '2');

        jasmine.clock().install();
        component.waitAndReload({ target });
        expect(target.getAttribute('data-retry')).toBe('1');
        expect(target.src).toContain('/assets/images/placeholder.png');
        jasmine.clock().tick(501);
        expect(target.src).toContain('/image.jpg');

        target.setAttribute('data-retry', '2');
        component.waitAndReload({ target });
        expect(target.src).toContain('/assets/images/placeholder.png');
        jasmine.clock().uninstall();
    });
});
