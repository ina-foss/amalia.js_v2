import {ChangeDetectorRef, NgZone, Renderer2} from '@angular/core';
import {ControlBarPluginComponent} from './control-bar-plugin.component';

describe('ControlBarPluginComponent (additional coverage)', () => {
    let component: ControlBarPluginComponent;

    beforeEach(() => {
        const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass', 'removeClass']);
        const thumbnailService = {getThumbnail: jasmine.createSpy('getThumbnail').and.resolveTo('blob:data')};
        const cdrStub = {markForCheck: jasmine.createSpy('markForCheck')} as unknown as ChangeDetectorRef;
        const ngZoneStub = {run: (fn: any) => fn()} as unknown as NgZone;

        component = new ControlBarPluginComponent({} as any, thumbnailService as any, renderer, cdrStub, ngZoneStub);
        (component as any).logger = {
            debug: jasmine.createSpy('debug'),
            info: jasmine.createSpy('info'),
            warn: jasmine.createSpy('warn')
        };
    });

    describe('shouldShowControl()', () => {
        it('should return true for priority 1 regardless of display state', () => {
            component.displayState = 'l';
            expect(component.shouldShowControl(1)).toBeTrue();
            component.displayState = 'm';
            expect(component.shouldShowControl(1)).toBeTrue();
            component.displayState = 'sm';
            expect(component.shouldShowControl(1)).toBeTrue();
            component.displayState = 's';
            expect(component.shouldShowControl(1)).toBeTrue();
        });

        it('should return true for priorities 2-5 in large display state', () => {
            component.displayState = 'l';
            expect(component.shouldShowControl(2)).toBeTrue();
            expect(component.shouldShowControl(3)).toBeTrue();
            expect(component.shouldShowControl(4)).toBeTrue();
            expect(component.shouldShowControl(5)).toBeTrue();
        });

        it('should return true for priorities 2-4 in medium display state', () => {
            component.displayState = 'm';
            expect(component.shouldShowControl(2)).toBeTrue();
            expect(component.shouldShowControl(3)).toBeTrue();
            expect(component.shouldShowControl(4)).toBeTrue();
            expect(component.shouldShowControl(5)).toBeFalse();
        });

        it('should return true for priorities 2-3 in small-medium display state', () => {
            component.displayState = 'sm';
            expect(component.shouldShowControl(2)).toBeTrue();
            expect(component.shouldShowControl(3)).toBeTrue();
            expect(component.shouldShowControl(4)).toBeFalse();
            expect(component.shouldShowControl(5)).toBeFalse();
        });

        it('should return true only for priority 2 in small display state', () => {
            component.displayState = 's';
            expect(component.shouldShowControl(2)).toBeTrue();
            expect(component.shouldShowControl(3)).toBeFalse();
            expect(component.shouldShowControl(4)).toBeFalse();
            expect(component.shouldShowControl(5)).toBeFalse();
        });

        it('should return false for unknown display state', () => {
            component.displayState = 'unknown';
            expect(component.shouldShowControl(1)).toBeTrue();
            expect(component.shouldShowControl(2)).toBeFalse();
            expect(component.shouldShowControl(3)).toBeFalse();
        });
    });

    describe('picture control handlers (lines 795-813)', () => {
        let picturePlayer: any;

        beforeEach(() => {
            picturePlayer = {
                rotate: jasmine.createSpy('rotate'),
                flipH: jasmine.createSpy('flipH'),
                flipV: jasmine.createSpy('flipV'),
                magnify: jasmine.createSpy('magnify'),
                unZoom: jasmine.createSpy('unZoom'),
                fitToScreen: jasmine.createSpy('fitToScreen'),
                zoom: jasmine.createSpy('zoom'),
                center: jasmine.createSpy('center'),
                clearAnnotations: jasmine.createSpy('clearAnnotations'),
                disableAnnotationMode: jasmine.createSpy('disableAnnotationMode'),
                takeSnapshot: jasmine.createSpy('takeSnapshot').and.returnValue('snapshot-data')
            };
            component.magnifyEnabled = false;
            (component as any).annotationMode = null;
            (component as any).mediaPlayerElement = {
                getMediaPlayer: () => ({isPaused: () => true, playPause: jasmine.createSpy('playPause')}),
                getPicturePlayer: () => picturePlayer
            };
            spyOn<any>(component, 'toggleFullScreen').and.stub();
            spyOn<any>(component, 'pinControls').and.stub();
            spyOn<any>(component, 'toggleCropMode').and.callThrough();
            spyOn<any>(component, 'toggleAnnotationMode').and.callThrough();
            spyOn<any>(component, 'setAnnotationMode').and.callThrough();
            spyOn<any>(component, 'downloadSnapshot').and.stub();
        });

        it('should call rotate for rotate control', () => {
            component.controlClicked('rotate');
            expect(picturePlayer.rotate).toHaveBeenCalled();
        });

        it('should call flipH for fliph control', () => {
            component.controlClicked('fliph');
            expect(picturePlayer.flipH).toHaveBeenCalled();
        });

        it('should call flipV for flipv control', () => {
            component.controlClicked('flipv');
            expect(picturePlayer.flipV).toHaveBeenCalled();
        });

        it('should call magnify for magnify control', () => {
            component.controlClicked('magnify');
            expect(picturePlayer.magnify).toHaveBeenCalled();
        });

        it('should call fitToScreen for fitToScreen control', () => {
            component.controlClicked('fitToScreen');
            expect(picturePlayer.fitToScreen).toHaveBeenCalled();
        });

        it('should call zoom for zoomIn control', () => {
            component.controlClicked('zoomIn');
            expect(picturePlayer.zoom).toHaveBeenCalled();
        });

        it('should call unZoom for zoomOut control', () => {
            component.controlClicked('zoomOut');
            expect(picturePlayer.unZoom).toHaveBeenCalled();
        });

        it('should call center for center control', () => {
            component.controlClicked('center');
            expect(picturePlayer.center).toHaveBeenCalled();
        });

        it('should call toggleCropMode for crop control', () => {
            component.controlClicked('crop');
            expect((component as any).toggleCropMode).toHaveBeenCalledWith(picturePlayer);
        });

        it('should call toggleAnnotationMode with draw for draw control', () => {
            component.controlClicked('draw');
            expect((component as any).toggleAnnotationMode).toHaveBeenCalledWith(picturePlayer, 'draw');
        });

        it('should call toggleAnnotationMode with text for text control', () => {
            component.controlClicked('text');
            expect((component as any).toggleAnnotationMode).toHaveBeenCalledWith(picturePlayer, 'text');
        });

        it('should call toggleAnnotationMode with erase for erase control', () => {
            component.controlClicked('erase');
            expect((component as any).toggleAnnotationMode).toHaveBeenCalledWith(picturePlayer, 'erase');
        });

        it('should clear annotations and disable mode for reset control when annotation mode enabled', () => {
            (component as any).annotationMode = 'draw';
            component.controlClicked('reset');
            expect(picturePlayer.clearAnnotations).toHaveBeenCalled();
            expect(picturePlayer.disableAnnotationMode).toHaveBeenCalled();
            expect((component as any).setAnnotationMode).toHaveBeenCalledWith(null);
        });

        it('should only clear annotations for reset control when annotation mode disabled', () => {
            (component as any).annotationMode = null;
            component.controlClicked('reset');
            expect(picturePlayer.clearAnnotations).toHaveBeenCalled();
            expect(picturePlayer.disableAnnotationMode).not.toHaveBeenCalled();
        });

        it('should take snapshot and download for snapshot control', () => {
            component.controlClicked('snapshot');
            expect(picturePlayer.takeSnapshot).toHaveBeenCalled();
            expect((component as any).downloadSnapshot).toHaveBeenCalledWith('snapshot-data');
        });
    });

    describe('handleMuteUnmuteVolume()', () => {
        let mediaPlayer: any;

        beforeEach(() => {
            mediaPlayer = {
                getVolume: jasmine.createSpy('getVolume').and.returnValue(50),
                setVolume: jasmine.createSpy('setVolume'),
                mute: jasmine.createSpy('mute'),
                unmute: jasmine.createSpy('unmute')
            };
            component.volumeLeft = 50;
            component.volumeRight = 50;
            (component as any).mediaPlayerElement = { getMediaPlayer: () => mediaPlayer };
            spyOn(component, 'changeVolume').and.stub();
        });

        it('should do nothing when there is no media player', () => {
            (component as any).mediaPlayerElement = { getMediaPlayer: () => null };
            component.handleMuteUnmuteVolume();
            expect(mediaPlayer.mute).not.toHaveBeenCalled();
            expect(mediaPlayer.unmute).not.toHaveBeenCalled();
        });

        it('should mute both channels when no side specified and current volume > 0', () => {
            mediaPlayer.getVolume.and.returnValue(50);
            component.handleMuteUnmuteVolume();
            expect(component.volumeLeft).toBe(0);
            expect(component.volumeRight).toBe(0);
            expect(mediaPlayer.mute).toHaveBeenCalled();
        });

        it('should unmute both channels when no side specified and current volume is 0', () => {
            mediaPlayer.getVolume.and.callFake((side?: string) => side ? 0 : 0);
            component.handleMuteUnmuteVolume();
            expect(mediaPlayer.setVolume).toHaveBeenCalledWith(50, 'r');
            expect(mediaPlayer.setVolume).toHaveBeenCalledWith(50, 'l');
            expect(mediaPlayer.unmute).toHaveBeenCalled();
        });

        it('should toggle mute for left channel when side is l and volume > 0', () => {
            mediaPlayer.getVolume.and.callFake((side?: string) => side === 'l' ? 50 : 50);
            component.handleMuteUnmuteVolume('l');
            expect(component.volumeLeft).toBe(0);
            expect(component.changeVolume).toHaveBeenCalledWith(0, 'l');
        });

        it('should unmute left channel when side is l and volume is 0', () => {
            mediaPlayer.getVolume.and.callFake((side?: string) => side === 'l' ? 0 : 50);
            component.handleMuteUnmuteVolume('l');
            expect(component.volumeLeft).toBe(50);
            expect(component.changeVolume).toHaveBeenCalledWith(50, 'l');
        });

        it('should toggle mute for right channel when side is r and volume > 0', () => {
            mediaPlayer.getVolume.and.callFake((side?: string) => side === 'r' ? 50 : 50);
            component.handleMuteUnmuteVolume('r');
            expect(component.volumeRight).toBe(0);
            expect(component.changeVolume).toHaveBeenCalledWith(0, 'r');
        });

        it('should unmute right channel when side is r and volume is 0', () => {
            mediaPlayer.getVolume.and.callFake((side?: string) => side === 'r' ? 0 : 50);
            component.handleMuteUnmuteVolume('r');
            expect(component.volumeRight).toBe(50);
            expect(component.changeVolume).toHaveBeenCalledWith(50, 'r');
        });
    });

    describe('drag thumb functions (lines 1665-1894)', () => {
        beforeEach(() => {
            component.controlBarContainer = {
                nativeElement: {
                    querySelector: jasmine.createSpy('querySelector').and.returnValue({
                        offsetWidth: 100,
                        querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([])
                    })
                }
            } as any;
            component.dragElement = {
                nativeElement: {
                    style: { paddingLeft: '' },
                    setAttribute: jasmine.createSpy('setAttribute'),
                    getAttribute: jasmine.createSpy('getAttribute').and.returnValue('50')
                }
            } as any;
            component.selectedSlider = 'slider1';
            spyOn(component, 'changePlaybackrate').and.stub();
        });

        it('should handle thumb position when dragging', () => {
            const mockValues = [
                { setAttribute: jasmine.createSpy('setAttribute'), getAttribute: jasmine.createSpy('getAttribute').and.callFake((attr) => attr === 'data-x' ? '25' : '0'), nextElementSibling: { getAttribute: jasmine.createSpy('getAttribute').and.callFake((attr) => attr === 'data-x' ? '75' : '1') } }
            ];
            (component.controlBarContainer.nativeElement.querySelector as jasmine.Spy).and.returnValue({
                offsetWidth: 100,
                querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue(mockValues)
            });
            const event = { dx: 0, target: { style: { paddingLeft: '' }, setAttribute: jasmine.createSpy('setAttribute'), stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation') } };
            component['handleThumbPosition'](mockValues, event, { x: 50 }, 50);
            expect(event.target.style.paddingLeft).toBeDefined();
        });

        it('should handle stop move drag thumb', () => {
            const mockValues = [
                { getAttribute: jasmine.createSpy('getAttribute').and.returnValue('50') }
            ];
            component['handleStopMoveDragThumb'](mockValues, 50);
            expect(component.changePlaybackrate).toHaveBeenCalledWith('50');
        });

        it('should handle move drag thumb and update padding', () => {
            const event = {
                dx: 10,
                speed: 0,
                target: { style: { paddingLeft: '' }, setAttribute: jasmine.createSpy('setAttribute') },
                stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
            };
            component.handleMoveDragThumb(event, { x: 50 }, 50, 200);
            expect(event.speed).toBe(20);
            expect(event.target.setAttribute).toHaveBeenCalled();
        });

        it('should not change playback rate when pr is 0', () => {
            const mockValues = [
                { getAttribute: jasmine.createSpy('getAttribute').and.returnValue('0') }
            ];
            component['handleStopMoveDragThumb'](mockValues, 0);
            expect(component.changePlaybackrate).not.toHaveBeenCalled();
        });
    });
});
