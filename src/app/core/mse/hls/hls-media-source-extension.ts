import {MediaSourceExtension} from '../media-source-extension';
import {DefaultLogger} from '../../logger/default-logger';
import * as Hls from 'hls.js';
import {PlayerConfigData} from '../../config/model/player-config-data';
import {AmaliaException} from '../../exception/amalia-exception';
import {AutoBind} from '../../decorator/auto-bind.decorator';
import {PlayerEventType} from '../../constant/event-type';
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


    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, config: PlayerConfigData, logger: DefaultLogger) {
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
    public handleError(event) {
        this.logger.error('Error to load hls file', event);
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
        // (this.config.hls.config.pLoader as HlsCustomFLoader).audioChannel = 2;
        this.logger.debug('Manifest loaded', event);
    }
}
