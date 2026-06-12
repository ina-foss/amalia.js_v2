import { ChangeDetectorRef } from '@angular/core';
import { ControlBarPluginComponent } from './control-bar-plugin.component';

describe('ControlBarPluginComponent (annotation and crop methods)', () => {
    let component: ControlBarPluginComponent;
    let mediaPlayer: any;
    let picturePlayer: any;
    let cdr: ChangeDetectorRef;

    beforeEach(() => {
        cdr = { markForCheck: jasmine.createSpy('markForCheck') } as unknown as ChangeDetectorRef;
        picturePlayer = {
            enableDrawMode: jasmine.createSpy('enableDrawMode'),
            enableTextMode: jasmine.createSpy('enableTextMode'),
            enableEraseMode: jasmine.createSpy('enableEraseMode'),
            enableAnnotationMode: jasmine.createSpy('enableAnnotationMode'),
            disableAnnotationMode: jasmine.createSpy('disableAnnotationMode'),
            enableCropMode: jasmine.createSpy('enableCropMode'),
            disableCropMode: jasmine.createSpy('disableCropMode'),
            clearAnnotations: jasmine.createSpy('clearAnnotations'),
            setAnnotationColor: jasmine.createSpy('setAnnotationColor'),
            setAnnotationLineWidth: jasmine.createSpy('setAnnotationLineWidth'),
            setAnnotationFontSize: jasmine.createSpy('setAnnotationFontSize')
        };
        mediaPlayer = {
            getPicturePlayer: jasmine.createSpy('getPicturePlayer').and.returnValue(picturePlayer)
        };
        component = new ControlBarPluginComponent(
            {} as any,
            {} as any,
            {} as any,
            cdr,
            {} as any
        );
        component.mediaPlayerElement = mediaPlayer;
        component.annotationMode = null;
        component.cropModeEnabled = false;
        component.annotationColor = '#ff0000';
        component.annotationLineWidth = 5;
    });

    it('drawModeEnabled should return true when annotationMode is draw', () => {
        component.annotationMode = 'draw';
        expect(component.drawModeEnabled).toBeTrue();
    });

    it('drawModeEnabled should return false when annotationMode is not draw', () => {
        component.annotationMode = 'text';
        expect(component.drawModeEnabled).toBeFalse();
    });

    it('textModeEnabled should return true when annotationMode is text', () => {
        component.annotationMode = 'text';
        expect(component.textModeEnabled).toBeTrue();
    });

    it('textModeEnabled should return false when annotationMode is not text', () => {
        component.annotationMode = 'draw';
        expect(component.textModeEnabled).toBeFalse();
    });

    it('eraseModeEnabled should return true when annotationMode is erase', () => {
        component.annotationMode = 'erase';
        expect(component.eraseModeEnabled).toBeTrue();
    });

    it('eraseModeEnabled should return false when annotationMode is not erase', () => {
        component.annotationMode = 'draw';
        expect(component.eraseModeEnabled).toBeFalse();
    });

    it('annotationModeEnabled should return true when annotationMode is not null', () => {
        component.annotationMode = 'draw';
        expect(component.annotationModeEnabled).toBeTrue();
    });

    it('annotationModeEnabled should return false when annotationMode is null', () => {
        component.annotationMode = null;
        expect(component.annotationModeEnabled).toBeFalse();
    });

    it('onEscapeKey should disable crop mode when crop is enabled', () => {
        component.cropModeEnabled = true;
        component.onEscapeKey();
        expect(picturePlayer.disableCropMode).toHaveBeenCalled();
        expect(component.cropModeEnabled).toBeFalse();
    });

    it('onEscapeKey should disable annotation mode when annotation is enabled', () => {
        component.annotationMode = 'draw';
        component.onEscapeKey();
        expect(picturePlayer.disableAnnotationMode).toHaveBeenCalled();
        expect(component.annotationMode).toBeNull();
    });

    it('toggleCropMode should disable crop when enabled', () => {
        component.cropModeEnabled = true;
        component['toggleCropMode'](picturePlayer);
        expect(picturePlayer.disableCropMode).toHaveBeenCalled();
        expect(component.cropModeEnabled).toBeFalse();
    });

    it('toggleCropMode should enable crop when disabled and annotation is off', () => {
        component.cropModeEnabled = false;
        component.annotationMode = null;
        component['toggleCropMode'](picturePlayer);
        expect(picturePlayer.enableCropMode).toHaveBeenCalled();
        expect(component.cropModeEnabled).toBeTrue();
    });

    it('toggleCropMode should disable annotation when enabling crop', () => {
        component.cropModeEnabled = false;
        component.annotationMode = 'draw';
        component['toggleCropMode'](picturePlayer);
        expect(picturePlayer.disableAnnotationMode).toHaveBeenCalled();
        expect(component.annotationMode).toBeNull();
        expect(picturePlayer.enableCropMode).toHaveBeenCalled();
        expect(component.cropModeEnabled).toBeTrue();
    });

    it('toggleAnnotationMode should disable annotation when same mode is active', () => {
        component.annotationMode = 'draw';
        component['toggleAnnotationMode'](picturePlayer, 'draw');
        expect(picturePlayer.disableAnnotationMode).toHaveBeenCalled();
        expect(component.annotationMode).toBeNull();
    });

    it('toggleAnnotationMode should enable draw mode', () => {
        component.annotationMode = null;
        component['toggleAnnotationMode'](picturePlayer, 'draw');
        expect(picturePlayer.enableAnnotationMode).toHaveBeenCalled();
        expect(picturePlayer.enableDrawMode).toHaveBeenCalled();
        expect(component.annotationMode).toBe('draw');
    });

    it('toggleAnnotationMode should enable text mode', () => {
        component.annotationMode = null;
        component['toggleAnnotationMode'](picturePlayer, 'text');
        expect(picturePlayer.enableAnnotationMode).toHaveBeenCalled();
        expect(picturePlayer.enableTextMode).toHaveBeenCalled();
        expect(component.annotationMode).toBe('text');
    });

    it('toggleAnnotationMode should enable erase mode', () => {
        component.annotationMode = null;
        component['toggleAnnotationMode'](picturePlayer, 'erase');
        expect(picturePlayer.enableAnnotationMode).toHaveBeenCalled();
        expect(picturePlayer.enableEraseMode).toHaveBeenCalled();
        expect(component.annotationMode).toBe('erase');
    });

    it('toggleAnnotationMode should disable crop when enabling annotation', () => {
        component.cropModeEnabled = true;
        component.annotationMode = null;
        component['toggleAnnotationMode'](picturePlayer, 'draw');
        expect(picturePlayer.disableCropMode).toHaveBeenCalled();
        expect(component.cropModeEnabled).toBeFalse();
        expect(component.annotationMode).toBe('draw');
    });

    it('applyAnnotationSettings should set color, line width and matching font size', () => {
        component.annotationColor = '#00ff00';
        component.annotationLineWidth = 10;
        component['applyAnnotationSettings'](picturePlayer);
        expect(picturePlayer.setAnnotationColor).toHaveBeenCalledWith('#00ff00');
        expect(picturePlayer.setAnnotationLineWidth).toHaveBeenCalledWith(10);
        const matching = component.annotationSizes.find(s => s.lineWidth === 10);
        expect(picturePlayer.setAnnotationFontSize).toHaveBeenCalledWith(matching.fontSize);
    });

    it('applyAnnotationSettings should not set font size when no matching size', () => {
        component.annotationColor = '#00ff00';
        component.annotationLineWidth = 999;
        component['applyAnnotationSettings'](picturePlayer);
        expect(picturePlayer.setAnnotationColor).toHaveBeenCalledWith('#00ff00');
        expect(picturePlayer.setAnnotationLineWidth).toHaveBeenCalledWith(999);
        expect(picturePlayer.setAnnotationFontSize).not.toHaveBeenCalled();
    });

    it('selectAnnotationColor should update color and call picture player', () => {
        component.selectAnnotationColor('#0000ff');
        expect(component.annotationColor).toBe('#0000ff');
        expect(picturePlayer.setAnnotationColor).toHaveBeenCalledWith('#0000ff');
        expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('selectAnnotationSize should update line width and font size', () => {
        const size = component.annotationSizes[2];
        component.selectAnnotationSize(size);
        expect(component.annotationLineWidth).toBe(size.lineWidth);
        expect(picturePlayer.setAnnotationLineWidth).toHaveBeenCalledWith(size.lineWidth);
        expect(picturePlayer.setAnnotationFontSize).toHaveBeenCalledWith(size.fontSize);
        expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('downloadSnapshot should create link and trigger download', () => {
        const dataUrl = 'data:image/png;base64,test';
        const linkSpy = spyOn(document, 'createElement').and.callThrough();
        const appendSpy = spyOn(document.body, 'appendChild').and.callThrough();
        const removeSpy = spyOn(document.body, 'removeChild').and.callThrough();
        const clickSpy = spyOn(HTMLAnchorElement.prototype, 'click').and.callThrough();

        component['downloadSnapshot'](dataUrl);

        expect(linkSpy).toHaveBeenCalledWith('a');
        expect(appendSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
    });
});
