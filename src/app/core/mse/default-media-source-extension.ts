import {MediaSourceExtension} from './media-source-extension';

/**
 * In  charge to handle default media sources (Supported by browsers)
 */
export class DefaultMediaSourceExtension implements MediaSourceExtension {
  private src: string;

  setSrc(src: any) {
    this.src = src;
  }

  getSrc(): any {
    return this.src;
  }

}
