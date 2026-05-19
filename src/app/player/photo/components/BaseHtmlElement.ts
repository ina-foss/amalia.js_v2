import Utils from "../business/Utils.js";
import {AmaliaPlayerButtonSettings} from "../business/AmaliaPlayerSettings.js";

export default abstract class BaseHtmlElement {

    protected dom: HTMLElement;
    protected settings: AmaliaPlayerButtonSettings;
    private _tooltip: HTMLSpanElement;

    protected constructor(settings: AmaliaPlayerButtonSettings = null) {
        this.settings = settings;
    }

    protected addTooltip(str: string) {
        this.addClass('ajs-photo-tooltiped');
        this._tooltip = document.createElement('span');
        this.addClass('ajs-photo-tooltip', this._tooltip);
        this._tooltip.textContent = str;
        this.dom.appendChild(this._tooltip);
        this.addEventListener('mouseover', this.positionTooltip.bind(this));
    }

    private positionTooltip() {
        const p: HTMLDivElement = this.dom.closest('div.ajs-photo-cropper-content');
        const left: number = p.offsetWidth - (this.dom.offsetLeft + this._tooltip.offsetWidth);
        if (left < 0) {
            this._tooltip.style.left = left.toString() + 'px';
        }
    }

    public addClass(className: string, element: HTMLElement = null) {
        if (!element) {
            element = this.dom;
        }
        const classes: string[] = element.className.split(' ');
        if (!Utils.inArray(className, classes)) {
            classes.push(className);
        }
        element.className = classes.join(' ').trim();
        return this;
    }

    public removeClass(className: string, element: HTMLElement = null) {
        if (!element) {
            element = this.dom;
        }
        let classes: string[] = element.className.split(' ');
        classes = classes.filter((classe: string) => {
            return classe !== className;
        });
        element.className = classes.join(' ').trim();
        return this;
    }

    public removeEventListener(event: any, callback: any) {
        this.dom.removeEventListener(event, callback);
        return this;
    }

    public addEventListener(event: any, callback: any) {
        this.dom.addEventListener(event, callback);
        return this;
    }

    public getOffsetWidth(): number {
        return this.dom.offsetWidth;
    }

    public getOffsetHeight(): number {
        return this.dom.offsetHeight;
    }

    public getDom() {
        return this.dom;
    }

    public getTextContent(selector: string = null): string {
        const elem: HTMLElement = selector ? this.dom.querySelector(selector) : this.dom;
        return elem.textContent;
    }

    public setTextContent(str: string, selector: string = null) {
        const elem: HTMLElement = selector ? this.dom.querySelector(selector) : this.dom;
        elem.textContent = str;
    }

    public hide() {
        this.dom.style.visibility = 'hidden';
    }

    public show() {
        this.dom.style.visibility = 'visible';
    }

    public removeFromDom() {
        this.dom.remove();
    }
}
