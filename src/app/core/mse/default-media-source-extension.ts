import {MediaSourceExtension} from './media-source-extension';
import {PlayerConfigData} from '../config/model/player-config-data';
import {AutoBind} from '../decorator/auto-bind.decorator';
import {PlayerEventType} from '../constant/event-type';
import {EventEmitter} from 'events';
import {LoggerInterface} from '../logger/logger-interface';

/**
 * In  charge to handle default media sources (Supported by browsers)
 */
export class DefaultMediaSourceExtension implements MediaSourceExtension {
    private mediaSrc: string = null;
    private backwardsMediaSrc: string = null;
    private mainSource: HTMLSourceElement;
    private config: PlayerConfigData;
    private logger: LoggerInterface;
    private readonly eventEmitter: EventEmitter;
    private readonly mediaElement: HTMLVideoElement;

    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, config: PlayerConfigData, logger: LoggerInterface) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.logger = logger;
    }

    getSrc(): string {
        return this.mediaSrc;
    }

    getBackwardsSrc(): string | null {
        return this.backwardsMediaSrc;
    }

    setSrc(config: PlayerConfigData) {
        this.mediaSrc = config.src as string;
        this.backwardsMediaSrc = config.backwardsSrc as string;
        if (this.mediaSrc) {
            this.mainSource = document.createElement('source');
            this.mainSource.src = this.mediaSrc;
            if (config.crossOrigin) {
                this.mainSource.setAttribute('crossorigin', config.crossOrigin);
            }
            // Error handle
            this.mainSource.addEventListener('error', this.handleError);
            this.mediaElement.append(this.mainSource);
            if (config.autoplay) {
                this.mediaElement.play();
            }
        }
    }

    switchToMainSrc(): Promise<void> {
        return new Promise((resolve) => {
            this.mainSource.src = this.mediaSrc;
            this.mediaElement.load();
            this.mediaElement.play().then(() => resolve());
        });
    }

    switchToBackwardsSrc(): Promise<void> {
        return new Promise((resolve) => {
            this.mainSource.src = this.backwardsMediaSrc;
            this.mediaElement.load();
            this.mediaElement.play().then(() => resolve());
        });
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
    handleError(event): void {
        this.logger.error('Error to load source', event);
        this.eventEmitter.emit(PlayerEventType.ERROR);
    }

}
