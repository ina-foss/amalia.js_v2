/**
 * In  charge to handle MPEG DASH extension
 */
import {MediaSourceExtension} from './media-source-extension';
import {AmaliaException} from '../exception/amalia-exception';

export class MPEGDashMediaSourceExtension implements MediaSourceExtension {
    mediaType: 'AUDIO' | 'VIDEO';


    /**
     * Not implemented
     * @throws AmaliaException
     */
    getSrc(): any {
        throw new AmaliaException('Not implemented');
    }

    /**
     * Not implemented
     * @param src media source
     * @throws AmaliaException
     */
    setSrc(src: any) {
        throw new AmaliaException('Not implemented');
    }

    /**
     * Not implemented
     * @param src media source
     * @throws AmaliaException
     */
    getBackwardsSrc(): string | MediaStream | MediaSource | Blob | null {
        throw new AmaliaException('Not implemented');
    }

    /**
     * Invoked to set main source
     */
    switchToMainSrc(): Promise<void> {
        return new Promise(() => {
            throw new AmaliaException('Not implemented');
        });
    }

    /**
     * Invoked to set backward source
     */
    switchToBackwardsSrc(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
            throw new AmaliaException('Not implemented');
        });
    }

    /**
     * Not implemented
     * @throws AmaliaException
     */
    destroy(): void {
        throw new AmaliaException('Not implemented');
    }

    /**
     * Not implemented
     * @throws AmaliaException
     */
    handleError(): void {
        throw new AmaliaException('Not implemented');
    }
    /**
     * Not implemented
     * @throws AmaliaException
     */
    getConfig() {
        throw new AmaliaException('Not implemented');
    }
    /**
     * Not implemented
     * @throws AmaliaException
     */
    setMaxBufferLengthConfig() {
        throw new AmaliaException('Not implemented');
    }
}
