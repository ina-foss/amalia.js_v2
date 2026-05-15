import AmaliaPlayer from './src/components/AmaliaPlayer';
import Utils from './src/business/Utils';

export function amaliaPhoto(target: string, settings: any): AmaliaPlayer {
    settings = Utils.mergeDeep({}, {
            mode: 'standard',
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

