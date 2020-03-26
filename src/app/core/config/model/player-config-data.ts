import * as Hls from 'hls.js';

export interface PlayerConfigData {
    src: string | MediaStream | MediaSource | Blob | null;
    backwardsSrc?: string | MediaStream | MediaSource | Blob | null;
    poster?: string;
    autoplay?: boolean;
    duration?: number;
    defaultVolume?: number;
    crossOrigin?: string;
    data?: any;
    framerate?: number;
    hls?: { enable: boolean, config?: Hls.Config };
    mpegDash?: { enable: boolean, config?: any };
}
