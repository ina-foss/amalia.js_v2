import AnnotationCanvas, { TextAnnotation, StrokeAnnotation } from './AnnotationCanvas';

describe('AnnotationCanvas', () => {
    let container: HTMLElement;
    let canvas: AnnotationCanvas;

    beforeEach(() => {
        container = document.createElement('div');
        container.style.width = '400px';
        container.style.height = '300px';
        document.body.appendChild(container);
        canvas = new AnnotationCanvas(container);
    });

    afterEach(() => {
        canvas.destroy();
        container.remove();
    });

    it('should create canvas and attach to container', () => {
        const canvasElement = canvas.getCanvas();
        expect(canvasElement).toBeTruthy();
        expect(container.contains(canvasElement)).toBeTrue();
        expect(canvasElement.style.position).toBe('absolute');
    });

    it('should set color, line width, and font size', () => {
        canvas.setColor('#ff0000');
        canvas.setLineWidth(5);
        canvas.setFontSize(24);

        // Verify settings are applied (via private access for testing)
        expect((canvas as any)._settings.color).toBe('#ff0000');
        expect((canvas as any)._settings.lineWidth).toBe(5);
        expect((canvas as any)._settings.fontSize).toBe(24);
    });

    it('should enable draw mode with correct cursor and pointer events', () => {
        canvas.enableDrawMode();
        const canvasElement = canvas.getCanvas();
        expect(canvasElement.style.cursor).toBe('crosshair');
        expect(canvasElement.style.pointerEvents).toBe('auto');
    });

    it('should enable text mode with correct cursor and pointer events', () => {
        canvas.enableTextMode();
        const canvasElement = canvas.getCanvas();
        expect(canvasElement.style.cursor).toBe('text');
        expect(canvasElement.style.pointerEvents).toBe('auto');
    });

    it('should enable erase mode with correct cursor and pointer events', () => {
        canvas.enableEraseMode();
        const canvasElement = canvas.getCanvas();
        expect(canvasElement.style.cursor).toBe('cell');
        expect(canvasElement.style.pointerEvents).toBe('auto');
    });

    it('should disable mode with default cursor and no pointer events', () => {
        canvas.disableMode();
        const canvasElement = canvas.getCanvas();
        expect(canvasElement.style.cursor).toBe('default');
        expect(canvasElement.style.pointerEvents).toBe('none');
    });

    it('should add text annotation and redraw', () => {
        const redrawSpy = spyOn<any>(canvas, 'redraw').and.callThrough();
        canvas.addTextAnnotation(100, 100, 'Test');

        const annotations = (canvas as any)._textAnnotations as TextAnnotation[];
        expect(annotations.length).toBe(1);
        expect(annotations[0].text).toBe('Test');
        expect(annotations[0].x).toBe(100);
        expect(annotations[0].y).toBe(100);
        expect(redrawSpy).toHaveBeenCalled();
    });

    it('should clear all annotations', () => {
        canvas.addTextAnnotation(100, 100, 'Test');
        canvas.clear();

        const textAnnotations = (canvas as any)._textAnnotations as TextAnnotation[];
        const strokeAnnotations = (canvas as any)._strokeAnnotations as StrokeAnnotation[];
        expect(textAnnotations.length).toBe(0);
        expect(strokeAnnotations.length).toBe(0);
    });

    it('should get snapshot as data URL', () => {
        const snapshot = canvas.getSnapshot();
        expect(snapshot).toContain('data:image/png;base64');
    });

    it('should destroy canvas and remove from DOM', () => {
        canvas.destroy();
        const canvasElement = canvas.getCanvas();
        expect(container.contains(canvasElement)).toBeFalse();
    });

    it('should handle right mouse button for drawing', () => {
        canvas.enableDrawMode();
        const canvasElement = canvas.getCanvas();

        // Simulate right mouse button (button 2)
        const mousedownEvent = new MouseEvent('mousedown', { button: 2, clientX: 50, clientY: 50 });
        canvasElement.dispatchEvent(mousedownEvent);

        expect((canvas as any)._isDrawing).toBeTrue();
    });

    it('should ignore left mouse button for drawing', () => {
        canvas.enableDrawMode();
        const canvasElement = canvas.getCanvas();

        // Simulate left mouse button (button 0)
        const mousedownEvent = new MouseEvent('mousedown', { button: 0, clientX: 50, clientY: 50 });
        canvasElement.dispatchEvent(mousedownEvent);

        expect((canvas as any)._isDrawing).toBeFalse();
    });

    it('should store stroke points during drawing', () => {
        canvas.enableDrawMode();
        const canvasElement = canvas.getCanvas();

        const mousedownEvent = new MouseEvent('mousedown', { button: 2, clientX: 50, clientY: 50 });
        canvasElement.dispatchEvent(mousedownEvent);

        const mousemoveEvent = new MouseEvent('mousemove', { clientX: 60, clientY: 60 });
        canvasElement.dispatchEvent(mousemoveEvent);

        const mouseupEvent = new MouseEvent('mouseup', { button: 2 });
        canvasElement.dispatchEvent(mouseupEvent);

        const strokeAnnotations = (canvas as any)._strokeAnnotations as StrokeAnnotation[];
        expect(strokeAnnotations.length).toBe(1);
        expect(strokeAnnotations[0].points.length).toBeGreaterThan(1);
    });

    it('should not store strokes in erase mode', () => {
        canvas.enableEraseMode();
        const canvasElement = canvas.getCanvas();

        const mousedownEvent = new MouseEvent('mousedown', { button: 2, clientX: 50, clientY: 50 });
        canvasElement.dispatchEvent(mousedownEvent);

        const mousemoveEvent = new MouseEvent('mousemove', { clientX: 60, clientY: 60 });
        canvasElement.dispatchEvent(mousemoveEvent);

        const mouseupEvent = new MouseEvent('mouseup', { button: 2 });
        canvasElement.dispatchEvent(mouseupEvent);

        const strokeAnnotations = (canvas as any)._strokeAnnotations as StrokeAnnotation[];
        expect(strokeAnnotations.length).toBe(0);
    });

    it('should redraw strokes and text annotations', () => {
        canvas.addTextAnnotation(100, 100, 'Test');
        canvas.enableDrawMode();
        const canvasElement = canvas.getCanvas();

        const mousedownEvent = new MouseEvent('mousedown', { button: 2, clientX: 50, clientY: 50 });
        canvasElement.dispatchEvent(mousedownEvent);

        const mousemoveEvent = new MouseEvent('mousemove', { clientX: 60, clientY: 60 });
        canvasElement.dispatchEvent(mousemoveEvent);

        const mouseupEvent = new MouseEvent('mouseup', { button: 2 });
        canvasElement.dispatchEvent(mouseupEvent);

        const redrawSpy = spyOn<any>(canvas, 'redraw').and.callThrough();
        canvas.addTextAnnotation(150, 150, 'Test2');

        expect(redrawSpy).toHaveBeenCalled();
    });
});
