import BaseHtmlElement from "../BaseHtmlElement";
import Utils from "../../business/Utils";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings";

export default class BaseButton extends BaseHtmlElement {

    protected span: HTMLElement;
    protected internalActionEventRef: any;

    private readonly _actionClickEventRef: any;
    private readonly _actionShorcutEventRef: any;

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(Utils.mergeDeep({}, {
            className: 'ajs-photo-btn',
            tooltip: null,
            tooltip_off: null,
            shortcut: null
        }, settings));
        this.dom = document.createElement('a');
        if (this.settings.hasOwnProperty('tooltip') && this.settings.tooltip) {
            this.addTooltip(this.settings.tooltip);
        }
        this.span = document.createElement('span');
        this.addClass(this.settings.className);
        this.dom.appendChild(this.span);

        if (this.settings.disable) {
            this.addClass('ajs-photo-btn-disable');
        }

        this._actionClickEventRef = action;
        if (!this.settings.disable && this.settings.hasOwnProperty('shortcut') && this.settings.shortcut) {
            this._actionShorcutEventRef = this.actionShorcutEvent.bind(this);
        }
        this.enable();
    }

    private actionShorcutEvent(event: KeyboardEvent) {
        if (event.key === this.settings.shortcut) {
            this._actionClickEventRef(event);
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
    }

    public addClass(className: string, element: HTMLElement = null) {
        return super.addClass(className, element || this.span);
    }

    public removeClass(className: string, element: HTMLElement = null) {
        return super.removeClass(className, element || this.span);
    }

    public enable() {
        this.removeClass('ajs-photo-disable');
        if (this.settings.disable) {
            return;
        }
        if (this._actionClickEventRef) {
            this.addEventListener('click', this._actionClickEventRef);
        }
        if (this._actionShorcutEventRef) {
            document.addEventListener('keyup', this._actionShorcutEventRef);
        }
        if (this.internalActionEventRef) {
            this.addEventListener('click', this.internalActionEventRef);
        }
    }

    public disable() {
        this.addClass('ajs-photo-disable');
        if (this.settings.disable) {
            return;
        }
        if (this._actionClickEventRef) {
            this.removeEventListener('click', this._actionClickEventRef);
        }
        if (this._actionShorcutEventRef) {
            document.removeEventListener('keyup', this._actionShorcutEventRef);
        }
        if (this.internalActionEventRef) {
            this.removeEventListener('click', this.internalActionEventRef);
        }
    }

    public removeFromDom() {
        this.disable();
        super.removeFromDom();
    }
}

