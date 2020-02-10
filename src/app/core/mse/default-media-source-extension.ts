import {MediaSourceExtension} from './media-source-extension';

/**
 * In  charge to handle default media sources (Supported by browsers)
 */
export class DefaultMediaSourceExtension implements MediaSourceExtension {
  private src: string;

  getSrc(): string {
    return this.src;
  }

  setSrc(src: string) {
    this.src = src;
  }

}
