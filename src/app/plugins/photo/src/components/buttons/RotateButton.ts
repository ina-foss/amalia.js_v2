import BaseButton from "./BaseButton";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings";

export default class RotateButton extends BaseButton {

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this.addClass('ajs-photo-icon-rotate');
    }

}

