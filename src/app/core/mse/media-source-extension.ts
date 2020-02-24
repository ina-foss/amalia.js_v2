import {PlayerConfigData} from '../config/model/player-config-data';

/**
 * In charge to handle MediaSourceExtension
 */
export interface MediaSourceExtension {

    /**
     * Invoked to set source
     * @param src media source
     * @param crossOrigin media crossOrigin
     */
    setSrc(config: PlayerConfigData);


    /**
     * Invoked to get source
     */
    getSrc(): string | MediaStream | MediaSource | Blob | null;

    /**
     * Invoked for clean buffer
     */
    destroy(): void;

    /**
     * Invoked when error to load source,
     * Emmit event Error
     */
    handleError(event): void;
}
