import BaseButton from "./BaseButton.js";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings.js";

export default class MagnifyButton extends BaseButton {

    private _isActif: boolean = false;
    private readonly _tooltipLabel: string;
    private readonly _tooltip_offLabel: string;

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this._tooltipLabel = this.settings.tooltip;
        this._tooltip_offLabel = this.settings.tooltip_off;
        this.addClass('ajs-photo-icon-magnify');
        this._isActif = false;
    }

    public toggleIcon() {
        this._isActif = !this._isActif;
        if (this._isActif) {
            this.removeClass('ajs-photo-icon-magnify');
            this.addClass('ajs-photo-icon-magnify-off');
            if (this._tooltip_offLabel) {
                this.setTextContent(this._tooltip_offLabel, 'span.ajs-photo-tooltip');
            }
        } else {
            this.addClass('ajs-photo-icon-magnify');
            this.removeClass('ajs-photo-icon-magnify-off');
            if (this._tooltipLabel) {
                this.setTextContent(this._tooltipLabel, 'span.ajs-photo-tooltip');
            }
        }
    }

}
