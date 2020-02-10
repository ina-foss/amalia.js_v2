export interface PlayerConfigData {
  src: string | MediaStream | MediaSource | Blob | null;
  poster?: string;
  autoplay?: boolean;
  duration?: number;
  defaultVolume?: number;
  crossOrigin?: string;
  data?: any;
}
