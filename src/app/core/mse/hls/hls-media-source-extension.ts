import { MediaSourceExtension } from '../media-source-extension';
import Hls, { FragmentLoaderConstructor, FragmentLoaderContext, Loader } from 'hls.js';
import { PlayerConfigData } from '../../config/model/player-config-data';
import { AmaliaException } from '../../exception/amalia-exception';
import { PlayerEventType } from '../../constant/event-type';
import { EventEmitter } from 'events';
import { CustomFragmentLoader } from './hls-custom-f-loader';
import { LoggerInterface } from '../../logger/logger-interface';
import { Utils } from '../../utils/utils';
import { C2PAConfig, C2paHlsBridge, C2paManifestHelper } from '../../utils/hls-c2pa-bridge';

/* tslint:disable:no-string-literal */
function createCustomFragmentLoader(config: any): Loader<FragmentLoaderContext> {
    return new CustomFragmentLoader(config);
}

/**
 * In  charge to handle HSL Media extension
 */
export class HLSMediaSourceExtension implements MediaSourceExtension {
    private static DEFAULT_HEADER_BASE64 = 'data:application/vnd.apple.mpegurl;base64,';
    public reverseMode = false;
    private currentTime: number;
    private duration: number;
    private mainMediaSrc: string;
    private backwardsMediaSrc: string;
    public config: PlayerConfigData;
    private logger: LoggerInterface;
    public readonly mediaElement: HTMLVideoElement;
    private readonly eventEmitter: EventEmitter;
    private hlsPlayer: Hls;

    // C2PA Bridge Integration
    private c2paBridge: C2paHlsBridge | null = null;
    private c2paEnabled = false;

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
            config.hls = { enable: true };
        }
        if (!config.hls.config) {
            config.hls.config = Hls.DefaultConfig;
            config.hls.config.debug = this.logger.status();
        }
        config.hls.config.enableWorker = false;
        config.hls.config.fLoader = createCustomFragmentLoader as unknown as FragmentLoaderConstructor;
        this.config.hls = config.hls;
        this.hlsPlayer = new Hls(config.hls.config);
        Utils.addListener(this, this.eventEmitter, PlayerEventType.AUDIO_CHANNEL_CHANGE, this.handleAudioChannelChange);
    }
    mediaType: 'AUDIO' | 'VIDEO' = 'AUDIO';

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
            this.mediaType = config.media;
            Utils.addListener(this, this.hlsPlayer, PlayerEventType.ERROR, this.handleError);
            if (config.autoplay) {
                this.mediaElement.play();
            }
        } else {
            this.logger.warn('Error to set source', config.src);
            this.mainMediaSrc = null;
            this.hlsPlayer.destroy();
        }
    }

    handleManifestParsed(_, data) {
        this.mediaType = 'AUDIO';
        data.levels.forEach((level) => {
            if (level.videoCodec) this.mediaType = 'VIDEO';
        });
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
            this.mediaElement.pause();
            this.destroy();
            this.reverseMode = reverseMode;
            if (this.reverseMode) {
                this.config.hls.config.startPosition = Math.max(0, this.duration - this.currentTime);
            } else {
                this.config.hls.config.startPosition = this.currentTime;
            }
            this.hlsPlayer = new Hls(this.config.hls.config);
            this.hlsPlayer.attachMedia(this.mediaElement);
            this.hlsPlayer.loadSource(src);
            resolve();
        });
    }

    public destroy() {
        // Cleanup C2PA bridge
        if (this.c2paBridge) {
            this.c2paBridge.dispose();
            this.c2paBridge = null;
            this.c2paEnabled = false;
        }
        this.hlsPlayer.stopLoad();
        this.hlsPlayer.detachMedia();
        Utils.unsubscribeTargetedElementEventListeners(this, this.hlsPlayer);
        Utils.unsubscribeTargetedElementEventListeners(this, this.eventEmitter);
        this.hlsPlayer.destroy();
    }

    /**
     * Invoked when error events
     */

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
     * Invoked on channel change
     * @param event channel
     */

    private handleAudioChannelChange(event) {
        this.logger.debug('handleAudioChannelChange', event);
        this.hlsPlayer.config.fragLoadPolicy.default['audioChannel'] = event;
    }

    getConfig() {
        return this.hlsPlayer.config;
    }

    setMaxBufferLengthConfig(value) {
        this.hlsPlayer.config.maxBufferLength = value;
    }

    // =========================================================================
    // C2PA Integration Methods
    // =========================================================================

    /**
     * Enable C2PA validation for HLS streams
     * @param c2paConfig Optional C2PA configuration
     */
    public enableC2PA(c2paConfig?: C2PAConfig): void {
        if (this.c2paEnabled) {
            this.logger.warn('C2PA already enabled');
            return;
        }

        const config: C2PAConfig = c2paConfig || {
            enableTrustListVerification: false,
            wasmSrc: 'https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.4.1/dist/resources/c2pa_bg.wasm'
        };

        this.c2paBridge = new C2paHlsBridge(config, this.hlsPlayer);
        this.c2paEnabled = true;
        this.logger.info('C2PA validation enabled for HLS stream');
    }

    /**
     * Disable C2PA validation
     */
    public disableC2PA(): void {
        if (this.c2paBridge) {
            this.c2paBridge.dispose();
            this.c2paBridge = null;
        }
        this.c2paEnabled = false;
        this.logger.info('C2PA validation disabled');
    }

    /**
     * Check if C2PA validation is enabled
     */
    public isC2PAEnabled(): boolean {
        return this.c2paEnabled;
    }

    /**
     * Check if C2PA runtime is ready
     */
    public isC2PAReady(): boolean {
        return this.c2paBridge?.libReady() ?? false;
    }

    /**
     * Get C2PA metadata for a specific timecode
     * @param timeCode The timecode in seconds
     * @returns C2paManifestHelper or null if not found
     */
    public getC2PAMetaByTimeCode(timeCode: number): C2paManifestHelper | null {
        if (!this.c2paBridge) {
            return null;
        }
        return this.c2paBridge.getC2PAMetaByTimeCode(timeCode);
    }

    /**
     * Get the C2PA bridge instance for advanced usage
     */
    public getC2PABridge(): C2paHlsBridge | null {
        return this.c2paBridge;
    }

    /**
     * Get the underlying HLS.js instance
     */
    public getHlsPlayer(): Hls {
        return this.hlsPlayer;
    }
}

/* tslint:enable:no-string-literal */
