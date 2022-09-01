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
     * Invoked on reverse mode
     */
    getBackwardsSrc(): string | MediaStream | MediaSource | Blob | null;

    /**
     * Invoked to set main source
     */
    switchToMainSrc(): Promise<void>;

    /**
     * Invoked to set backward source
     */
    switchToBackwardsSrc(): Promise<void>;

    /**
     * Invoked for clean buffer
     */
    destroy(): void;

    /**
     * Invoked when error to load source,
     * Emmit event Error
     */
    handleError(event): void;

    /**
     * Get config
     */
    getConfig(): object | void;
    /**
     * Get config
     */
    setMaxBufferLengthConfig(value): object | void;
}
