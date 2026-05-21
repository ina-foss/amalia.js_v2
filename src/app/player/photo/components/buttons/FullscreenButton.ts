import BaseButton from "./BaseButton";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings";

export default class FullscreenButton extends BaseButton {

    private _isFullscreen: boolean = false;
    private readonly _tooltipLabel: string;
    private readonly _tooltip_offLabel: string;

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this._tooltipLabel = this.settings.tooltip;
        this._tooltip_offLabel = this.settings.tooltip_off;
        this.addClass('ajs-photo-icon-fullscreen');
        this._isFullscreen = false;
    }

    public toggleIcon() {
        this._isFullscreen = !this._isFullscreen;
        if (this._isFullscreen) {
            this.removeClass('ajs-photo-icon-fullscreen');
            this.addClass('ajs-photo-icon-fullscreen-off');
            if (this._tooltip_offLabel) {
                this.setTextContent(this._tooltip_offLabel, 'span.ajs-photo-tooltip');
            }
        } else {
            this.addClass('ajs-photo-icon-fullscreen');
            this.removeClass('ajs-photo-icon-fullscreen-off');
            if (this._tooltipLabel) {
                this.setTextContent(this._tooltipLabel, 'span.ajs-photo-tooltip');
            }
        }
    }

}
