/**
 * In  charge to handle MPEG DASH extension
 */
import {MediaSourceExtension} from './media-source-extension';
import {AmaliaException} from '../exception/amalia-exception';

export class MPEGDashMediaSourceExtension implements MediaSourceExtension {


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
}
