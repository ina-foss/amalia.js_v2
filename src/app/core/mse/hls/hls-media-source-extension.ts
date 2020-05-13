import {MediaSourceExtension} from '../media-source-extension';
import * as Hls from 'hls.js';
import {PlayerConfigData} from '../../config/model/player-config-data';
import {AmaliaException} from '../../exception/amalia-exception';
import {AutoBind} from '../../decorator/auto-bind.decorator';
import {PlayerEventType} from '../../constant/event-type';
import {EventEmitter} from 'events';
import {HlsCustomFLoader} from './hls-custom-f-loader';
import {LoggerInterface} from '../../logger/logger-interface';

/**
 * In  charge to handle HSL Media extension
 */
export class HLSMediaSourceExtension implements MediaSourceExtension {
    private static DEFAULT_HEADER_BASE64 = 'data:application/vnd.apple.mpegurl;base64,';
    private reverseMode = false;
    private currentTime: number;
    private duration: number;
    private mainMediaSrc: string;
    private backwardsMediaSrc: string;
    private config: PlayerConfigData;
    private logger: LoggerInterface;
    private readonly mediaElement: HTMLVideoElement;
    private readonly eventEmitter: EventEmitter;
    private readonly hlsPlayer: Hls;


    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, config: PlayerConfigData, logger: LoggerInterface) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
        this.config = config;
        this.logger = logger;
        // Checks whether your browser is supporting MediaSource Extensions
        if (!Hls.isSupported()) {
            throw new AmaliaException('Hls extension is not supported.');
        }
        if (!config.hls) {
            config.hls = {enable: true};
        }
        if (!config.hls.config) {
            config.hls.config = Hls.DefaultConfig;
            config.hls.config.debug = false;
        }
        config.hls.config.fLoader = HlsCustomFLoader;
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
        return (this.hlsPlayer) ? this.mainMediaSrc : null;
    }

    /**
     * Invoked to set hls source
     * When you set not valid url, we add default base 64 header
     * @param config media source configuration
     */
    public setSrc(config: PlayerConfigData) {
        if (config && typeof config.src === 'string') {
            this.mainMediaSrc = (!HLSMediaSourceExtension.isUrl(config.src)) ? `${HLSMediaSourceExtension.DEFAULT_HEADER_BASE64}${config.src}` : config.src;
            if (typeof config.backwardsSrc === 'string') {
                this.backwardsMediaSrc = (!HLSMediaSourceExtension.isUrl(config.backwardsSrc))
                    ? `${HLSMediaSourceExtension.DEFAULT_HEADER_BASE64}${config.backwardsSrc}` : config.backwardsSrc;
            }
            this.logger.debug('Hls string source', this.mainMediaSrc);
            this.hlsPlayer.attachMedia(this.mediaElement);
            this.hlsPlayer.loadSource(this.mainMediaSrc);
            // handle events
            this.hlsPlayer.on(Hls.Events.MANIFEST_LOADED, this.handleOnManifestLoaded);
            this.hlsPlayer.on(Hls.Events.ERROR, this.handleError);

            if (config.autoplay) {
                this.mediaElement.play();
            }
        } else {
            this.logger.warn('Error to set source', config.src);
            this.mainMediaSrc = null;
        }
    }

    getBackwardsSrc(): string | MediaStream | MediaSource | Blob | null {
        return this.backwardsMediaSrc;
    }

    switchToMainSrc(): Promise<void> {
        return (this.reverseMode) ? this.switchSrc(this.mainMediaSrc, false) : Promise.resolve();
    }

    switchToBackwardsSrc(): Promise<void> {
        return (!this.reverseMode) ? this.switchSrc(this.backwardsMediaSrc, true) : Promise.resolve();
    }

    /**
     * Media source
     * @param src media source
     */
    private switchSrc(src: string, reverseMode: boolean): Promise<void> {
        return new Promise((resolve) => {
            this.logger.debug(`Switch src :${src}  ${reverseMode}`);
            this.currentTime = this.mediaElement.currentTime;
            this.duration = this.mediaElement.duration;
            this.hlsPlayer.attachMedia(this.mediaElement);
            this.hlsPlayer.loadSource(src);
            this.reverseMode = reverseMode;
            resolve();
        });
    }


    public destroy() {
        this.hlsPlayer.stopLoad();
        this.hlsPlayer.detachMedia();
        this.hlsPlayer.destroy();
    }

    /**
     * Invoked when error events
     */
    @AutoBind
    public handleError(event) {
        this.logger.info('Error to load hls file', event);
        if (event !== 'hlsError') {
            this.eventEmitter.emit(PlayerEventType.ERROR);
        } else if (event.fatal === true && !this.reverseMode) {
            this.hlsPlayer.destroy();
            this.eventEmitter.emit(PlayerEventType.ERROR);
        }
    }

    /**
     * Invoked when manifest loaded
     */
    @AutoBind
    private handleOnManifestLoaded() {
        this.logger.debug('Manifest loaded');
        if (this.reverseMode) {
            this.hlsPlayer.startLoad(Math.max(0, this.duration - this.currentTime));
            this.mediaElement.play();
        }
    }

    /**
     * Invoked on channel change
     * @param event channel
     */
    @AutoBind
    private handleAudioChannelChange(event) {
        // (this.config.hls.config.pLoader as HlsCustomFLoader).audioChannel = 2;
        this.logger.debug('Manifest loaded', event);
    }
}
