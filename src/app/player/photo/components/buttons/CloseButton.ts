import BaseButton from "./BaseButton.js";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings.js";

export default class CloseButton extends BaseButton {

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this.addClass('ajs-photo-icon-close');
    }

}
