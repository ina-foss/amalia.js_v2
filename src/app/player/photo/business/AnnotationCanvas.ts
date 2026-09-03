export interface AnnotationSettings {
    color: string;
    lineWidth: number;
    fontSize: number;
    fontFamily: string;
}

export interface TextAnnotation {
    x: number;
    y: number;
    text: string;
    color: string;
    fontSize: number;
    fontFamily: string;
}

export interface StrokeAnnotation {
    points: { x: number; y: number }[];
    color: string;
    lineWidth: number;
}

export default class AnnotationCanvas {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _isDrawing: boolean = false;
    private _lastX: number = 0;
    private _lastY: number = 0;
    private _settings: AnnotationSettings;
    private _textAnnotations: TextAnnotation[] = [];
    private _strokeAnnotations: StrokeAnnotation[] = [];
    private _isTextMode: boolean = false;
    private _isEraseMode: boolean = false;
    private _pendingText: { x: number; y: number } | null = null;
    private _currentStroke: { x: number; y: number }[] = [];

    constructor(container: HTMLElement, settings: Partial<AnnotationSettings> = {}) {
        this._canvas = document.createElement('canvas');
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
        this._canvas.style.pointerEvents = 'auto';
        this._canvas.style.zIndex = '10';
        
        this._ctx = this._canvas.getContext('2d');
        
        this._settings = {
            color: settings.color || '#ff0000',
            lineWidth: settings.lineWidth || 3,
            fontSize: settings.fontSize || 24,
            fontFamily: settings.fontFamily || 'Arial, sans-serif'
        };

        this.resizeCanvas(container);
        this.attachEventListeners();
        container.appendChild(this._canvas);
    }

    private resizeCanvas(container: HTMLElement): void {
        const rect = container.getBoundingClientRect();
        this._canvas.width = rect.width;
        this._canvas.height = rect.height;
        this.redraw();
    }

    private attachEventListeners(): void {
        const startDrawing = (e: MouseEvent) => {
            // Only the right mouse button draws/writes, leaving the left button free.
            if (e.button !== 2) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if (this._isTextMode) {
                this._pendingText = { x: e.offsetX, y: e.offsetY };
                const text = prompt('Entrez le texte:');
                if (text) {
                    this.addTextAnnotation(e.offsetX, e.offsetY, text);
                }
                this._pendingText = null;
                return;
            }
            this._isDrawing = true;
            this._lastX = e.offsetX;
            this._lastY = e.offsetY;
            if (!this._isEraseMode) {
                this._currentStroke = [{ x: e.offsetX, y: e.offsetY }];
            }
        };

        const draw = (e: MouseEvent) => {
            e.stopPropagation();
            if (!this._isDrawing || this._isTextMode) return;

            this._ctx.beginPath();
            this._ctx.moveTo(this._lastX, this._lastY);
            this._ctx.lineTo(e.offsetX, e.offsetY);

            if (this._isEraseMode) {
                this._ctx.globalCompositeOperation = 'destination-out';
                this._ctx.strokeStyle = 'rgba(0,0,0,1)';
                this._ctx.lineWidth = this._settings.lineWidth * 2;
            } else {
                this._ctx.globalCompositeOperation = 'source-over';
                this._ctx.strokeStyle = this._settings.color;
                this._ctx.lineWidth = this._settings.lineWidth;
                this._currentStroke.push({ x: e.offsetX, y: e.offsetY });
            }

            this._ctx.lineCap = 'round';
            this._ctx.lineJoin = 'round';
            this._ctx.stroke();

            this._lastX = e.offsetX;
            this._lastY = e.offsetY;
        };

        const stopDrawing = (e: MouseEvent) => {
            e.stopPropagation();
            this._isDrawing = false;
            if (!this._isEraseMode && this._currentStroke.length > 1) {
                this._strokeAnnotations.push({
                    points: [...this._currentStroke],
                    color: this._settings.color,
                    lineWidth: this._settings.lineWidth
                });
                this._currentStroke = [];
            }
        };

        this._canvas.addEventListener('mousedown', startDrawing);
        this._canvas.addEventListener('mousemove', draw);
        this._canvas.addEventListener('mouseup', stopDrawing);
        this._canvas.addEventListener('mouseout', stopDrawing);
        this._canvas.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
    }

    public setColor(color: string): void {
        this._settings.color = color;
    }

    public setLineWidth(width: number): void {
        this._settings.lineWidth = width;
    }

    public setFontSize(size: number): void {
        this._settings.fontSize = size;
    }

    public setFontFamily(font: string): void {
        this._settings.fontFamily = font;
    }

    public enableDrawMode(): void {
        this._isTextMode = false;
        this._isEraseMode = false;
        this._canvas.style.cursor = 'crosshair';
        this._canvas.style.pointerEvents = 'auto';
    }

    public enableTextMode(): void {
        this._isTextMode = true;
        this._isEraseMode = false;
        this._canvas.style.cursor = 'text';
        this._canvas.style.pointerEvents = 'auto';
    }

    public enableEraseMode(): void {
        this._isTextMode = false;
        this._isEraseMode = true;
        this._canvas.style.cursor = 'cell';
        this._canvas.style.pointerEvents = 'auto';
    }

    public disableMode(): void {
        this._isTextMode = false;
        this._isEraseMode = false;
        this._canvas.style.cursor = 'default';
        this._canvas.style.pointerEvents = 'none';
    }

    public addTextAnnotation(x: number, y: number, text: string): void {
        this._textAnnotations.push({
            x,
            y,
            text,
            color: this._settings.color,
            fontSize: this._settings.fontSize,
            fontFamily: this._settings.fontFamily
        });
        this.redraw();
    }

    private redraw(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // Redraw stroke annotations
        this._strokeAnnotations.forEach(stroke => {
            if (stroke.points.length < 2) return;
            this._ctx.beginPath();
            this._ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
                this._ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            this._ctx.strokeStyle = stroke.color;
            this._ctx.lineWidth = stroke.lineWidth;
            this._ctx.lineCap = 'round';
            this._ctx.lineJoin = 'round';
            this._ctx.stroke();
        });

        // Redraw text annotations
        this._textAnnotations.forEach(annotation => {
            this._ctx.font = `${annotation.fontSize}px ${annotation.fontFamily}`;
            this._ctx.fillStyle = annotation.color;
            this._ctx.fillText(annotation.text, annotation.x, annotation.y);
        });
    }

    public clear(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._textAnnotations = [];
        this._strokeAnnotations = [];
    }

    public getCanvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public getSnapshot(): string {
        return this._canvas.toDataURL('image/png');
    }

    public destroy(): void {
        this._canvas.remove();
    }
}
