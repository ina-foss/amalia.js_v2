import * as Hls from 'hls.js';



export interface PlayerConfigData {
    src: string | MediaStream | MediaSource | Blob | null;
    backwardsSrc?: string | MediaStream | MediaSource | Blob | null;
    poster?: string;
    posterBackground?: 'amalia-player-bg-color1' | 'amalia-primary-color' | 'amalia-secondary-color' ;
    autoplay?: boolean;
    duration?: number;
    defaultVolume?: number;
    crossOrigin?: string;
    data?: any;
    framerate?: number;
    hls?: { enable: boolean, config?: Hls.HlsConfig};
    mpegDash?: { enable: boolean, config?: any };
    ratio?: '16:9' | '4:3';
}
