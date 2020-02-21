import {MediaSourceExtension} from './media-source-extension';
import {PlayerConfigData} from '../config/model/player-config-data';
import {DefaultLogger} from '../logger/default-logger';
import {AutoBind} from '../decorator/auto-bind.decorator';
import {PlayerEventType} from '../constant/event-type';
import {EventEmitter} from 'events';

/**
 * In  charge to handle default media sources (Supported by browsers)
 */
export class DefaultMediaSourceExtension implements MediaSourceExtension {
    private mediaSrc: string;
    private config: PlayerConfigData;
    private logger: DefaultLogger;
    private readonly eventEmitter: EventEmitter;
    private readonly mediaElement: HTMLVideoElement;

    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, config: PlayerConfigData, logger: DefaultLogger) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
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
            // Error handle
            source.addEventListener('error', this.handleError);
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

    @AutoBind
    handleError(): void {
        this.logger.error('Error to load source');
        this.eventEmitter.emit(PlayerEventType.ERROR);
    }


}
