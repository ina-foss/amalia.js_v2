import BaseButton from "./BaseButton";
import {AmaliaPlayerButtonSettings} from "../../business/AmaliaPlayerSettings";

export default class FullsizeButton extends BaseButton {

    constructor(settings: AmaliaPlayerButtonSettings, action: any = null) {
        super(settings, action);
        this.addClass('ajs-photo-icon-fullsize');
    }

}

