import {MediaSourceExtension} from './media-source-extension';
import {PlayerConfigData} from '../config/model/player-config-data';
import {DefaultLogger} from '../logger/default-logger';

/**
 * In  charge to handle default media sources (Supported by browsers)
 */
export class DefaultMediaSourceExtension implements MediaSourceExtension {
    private mediaSrc: string;
    private config: PlayerConfigData;
    private logger: DefaultLogger;
    private readonly mediaElement: HTMLVideoElement;

    constructor(mediaElement: HTMLVideoElement, config: PlayerConfigData, logger: DefaultLogger) {
        this.mediaElement = mediaElement;
        this.config = config;
        this.logger = logger;
    }

    getSrc(): string {
        return this.mediaSrc;
    }

    setSrc(config: PlayerConfigData) {
        this.mediaSrc = config.src as string;
        if (typeof this.mediaSrc === 'string') {
            const source = document.createElement('source');
            source.src = this.mediaSrc;
            if (config.crossOrigin) {
                source.setAttribute('crossorigin', config.crossOrigin);
            }
            this.mediaElement.append(source);
        }
    }

    destroy(): void {
        try {
            this.mediaElement
                .querySelectorAll('source')
                .forEach(e => e.parentNode.removeChild(e));
        } catch (e) {
            this.logger.warn('Destroy old source');
        }
    }


}
