import {MediaSourceExtension} from './media-source-extension';
import {DefaultLogger} from '../logger/default-logger';
import * as Hls from 'hls.js';
import {PlayerConfigData} from '../config/model/player-config-data';
import {AmaliaException} from '../exception/amalia-exception';

/**
 * In  charge to handle HSL Media extension
 */
export class HLSMediaSourceExtension implements MediaSourceExtension {
    private static DEFAULT_HEADER_BASE64 = 'data:application/vnd.apple.mpegurl;base64,';
    private mediaSrc: string;
    private config: PlayerConfigData;
    private logger: DefaultLogger;
    private readonly mediaElement: HTMLVideoElement;
    private readonly hlsPlayer: Hls;

    constructor(mediaElement: HTMLVideoElement, config: PlayerConfigData, logger: DefaultLogger) {
        this.mediaElement = mediaElement;
        this.config = config;
        this.logger = logger;
        if (Hls.isSupported()) {
            throw new AmaliaException('Hls extension is not supported.');
        }
        this.hlsPlayer = new Hls(config.hls.config);
    }

    /**
     * Is valid url
     * @param value url
     * @return true is url
     */

    private static isUrl(value: string): boolean {
        try {
            const url = new URL(value);
            return (url !== null);
        } catch (e) {
            return false;
        }
    }

    getSrc(): string | MediaStream | MediaSource | Blob | null {
        return (this.hlsPlayer) ? this.mediaSrc : null;
    }

    /**
     * In charge to set hls source
     * When you set not valid url, we add default base 64 header
     * @param src media source
     */
    setSrc(config: PlayerConfigData) {
        if (config && typeof config.src === 'string') {
            this.mediaSrc = config.src;
            if (!HLSMediaSourceExtension.isUrl(this.mediaSrc)) {
                this.mediaSrc = `${HLSMediaSourceExtension.DEFAULT_HEADER_BASE64}${this.mediaSrc}`;
                this.logger.debug('Hls string source', this.mediaSrc);
            }
            // Reset Player
            this.hlsPlayer.destroy();
            this.hlsPlayer.loadSource(this.mediaSrc);
            this.hlsPlayer.attachMedia(this.mediaElement);

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
     * Invoked when manifest loaded
     */
    private handleOnManifestLoaded() {
        this.logger.debug('Manifest loaded');
    }

    /**
     * Invoked when error events
     */
    private handleError() {
        this.logger.error('Error to load hls file');
    }


    // setSrc: function (url) {
    // var hlsPlayer;
    // if (this.isSupported) {
    //     if (this.settings.hasOwnProperty('hlsConfig')) {
    //         var config = this.settings.hlsConfig;
    //         hlsPlayer = new Hls(config);
    //     }
    //     else {
    //         hlsPlayer = new Hls();
    //     }
    //     var self = this;
    //     hlsPlayer.on(Hls.Events.ERROR,function(event,data) {
    //         if(data.fatal === false ) {
    //             //Reset Player
    //             hlsPlayer.destroy();
    //             hlsPlayer.loadSource(url);
    //             hlsPlayer.attachMedia(self.mediaPlayer.get(0));
    //         }
    //         else if (data.fatal === true && self.mainObj.rewinding !== true && data.response.code === 404)  {
    //             hlsPlayer.destroy();
    //             self.mainObj.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.ERROR, {
    //                 self: self,
    //                 errorCode: fr.ina.amalia.player.PlayerErrorCode.MEDIA_FILE_NOT_FOUND
    //             });
    //         }
    //     });
    //     hlsPlayer.loadSource(url);
    //     if (this.logger !== null && typeof(this.logger) !== "undefined") {
    //         this.logger.trace(this.Class.fullName, "set hls src :" + url);
    //         hlsPlayer.config.debug = true;
    //     }
    //     else {
    //         hlsPlayer.config.debug = false;
    //     }
    //     hlsPlayer.attachMedia(this.mediaPlayer.get(0));
    //     /* jshint undef: false */
    //     /*var self = this;
    //     this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED,function() {
    //         self.hlsPlayer.play();
    //     });*/
    //
    // }


}
