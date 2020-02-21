import {MediaSourceExtension} from './media-source-extension';
import {DefaultLogger} from '../logger/default-logger';
import * as Hls from 'hls.js';
import {PlayerConfigData} from '../config/model/player-config-data';
import {AmaliaException} from '../exception/amalia-exception';
import {AutoBind} from '../decorator/auto-bind.decorator';
import {PlayerEventType} from '../constant/event-type';
import {EventEmitter} from 'events';
import {HlsCustomFLoader} from './hls-custom-f-loader';

/**
 * In  charge to handle HSL Media extension
 */
export class HLSMediaSourceExtension implements MediaSourceExtension {
    private static DEFAULT_HEADER_BASE64 = 'data:application/vnd.apple.mpegurl;base64,';
    private mediaSrc: string;
    private config: PlayerConfigData;
    private logger: DefaultLogger;
    private readonly mediaElement: HTMLVideoElement;
    private readonly eventEmitter: EventEmitter;
    private readonly hlsPlayer: Hls;
    private readonly hlsCustomFLoader: HlsCustomFLoader;
    private readonly loaderConfig = {
        /**
         * Max number of load retries
         */
        maxRetry: 3,
        /**
         * Timeout after which `onTimeOut` callback will be triggered (if loading is still not finished after that delay)
         */
        timeout: 60000,
        /**
         * Delay between an I/O error and following connection retry (ms). This to avoid spamming the server
         */
        retryDelay: 60000,
        /**
         * max connection retry delay (ms)
         */
        maxRetryDelay: 60000,
    };

    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, config: PlayerConfigData, logger: DefaultLogger) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.logger = logger;
        if (Hls.isSupported()) {
            throw new AmaliaException('Hls extension is not supported.');
        }
        if (config.hls.config) {
            config.hls.config = Hls.DefaultConfig;
        }
        this.hlsCustomFLoader = new HlsCustomFLoader(this.loaderConfig);
        // @ts-ignore
        config.hls.config.pLoader = this.hlsCustomFLoader;
        this.hlsPlayer = new Hls(config.hls.config);
        this.eventEmitter.on(PlayerEventType.AUDIO_CHANNEL_CHANGE, this.handleAudioChannelChange);
    }

    /**
     * Is valid url
     * @param value url
     * @return true is url
     */

    public static isUrl(value: string): boolean {
        try {
            const url = new URL(value);
            return (url !== null);
        } catch (e) {
            return false;
        }
    }

    /**
     * Return media source
     */
    public getSrc(): string | MediaStream | MediaSource | Blob | null {
        return (this.hlsPlayer) ? this.mediaSrc : null;
    }

    /**
     * Invoked to set hls source
     * When you set not valid url, we add default base 64 header
     * @param config media source configuration
     */
    public setSrc(config: PlayerConfigData) {
        if (config && typeof config.src === 'string') {
            this.mediaSrc = config.src;
            if (!HLSMediaSourceExtension.isUrl(this.mediaSrc)) {
                this.mediaSrc = `${HLSMediaSourceExtension.DEFAULT_HEADER_BASE64}${this.mediaSrc}`;
                this.logger.debug('Hls string source', this.mediaSrc);
            }
            // reset Player
            this.hlsPlayer.destroy();
            // load source
            this.hlsPlayer.loadSource(this.mediaSrc);
            this.hlsPlayer.attachMedia(this.mediaElement);
            // handle events
            this.hlsPlayer.on(Hls.Events.MANIFEST_LOADED, this.handleOnManifestLoaded);
            this.hlsPlayer.on(Hls.Events.ERROR, this.handleError);
        } else {
            this.logger.warn('Error to set source', config.src);
            this.mediaSrc = null;
        }
    }

    public destroy() {
        this.hlsPlayer.detachMedia();
        this.hlsPlayer.destroy();
    }

    /**
     * Invoked when error events
     */
    @AutoBind
    public handleError() {
        this.logger.error('Error to load hls file');
        this.eventEmitter.emit(PlayerEventType.ERROR);
    }

    /**
     * Invoked when manifest loaded
     */
    @AutoBind
    private handleOnManifestLoaded() {
        this.logger.debug('Manifest loaded');
    }

    /**
     * Invoked on channel change
     * @param event channel
     */
    @AutoBind
    private handleAudioChannelChange(event) {
        this.logger.debug('Manifest loaded', event);
    }
}
