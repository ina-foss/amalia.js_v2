import {PlayerConfigData} from '../config/model/player-config-data';

/**
 * In charge to handle MediaSourceExtension
 */
export interface MediaSourceExtension {

    /**
     * In charge to set source
     * @param src media source
     * @param crossOrigin media crossOrigin
     */
    setSrc(config: PlayerConfigData);


    /**
     * In charge to get source
     */
    getSrc(): string | MediaStream | MediaSource | Blob | null;

    /**
     * In charge clean buffer
     */
    destroy(): void;
}
