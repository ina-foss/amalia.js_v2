import BaseButton from "./BaseButton.js";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings.js";

export default class RotateButton extends BaseButton {

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this.addClass('ajs-photo-icon-rotate');
    }

}
