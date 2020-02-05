import {MediaSourceExtension} from '../../mse/media-source-extension';

export interface PlayerConfigData {
  src: MediaSourceExtension;
  poster?: string;
  autoplay?: boolean;
  duration?: number;
  defaultVolume?: number;
  crossOrigin?: string;
  data?: any;
}
