import AmaliaPlayer from "./components/AmaliaPlayer";
import "./main.scss";
import Utils from "./business/Utils";

export function amaliaPhoto(target: string, settings: any): AmaliaPlayer {
    // default config
    settings = Utils.mergeDeep({}, {
            zoomStep: 25,
            zoomSteps: null,
            zoomMax: 300,
            zoomMin: 10,
            magnifyValue: 400,
            imagesSrc: [],
            showGallery: false,
            debug: false
        },
        settings || {});

    return new AmaliaPlayer(target, settings);
}


