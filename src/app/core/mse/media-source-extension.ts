/**
 * In charge to handle MediaSourceExtension
 */
export interface MediaSourceExtension {
  /**
   * In charge to set source
   * @param src media source
   */
  setSrc(src: string | MediaStream | MediaSource | Blob | null);


  /**
   * In charge to get source
   */
  getSrc(): string | MediaStream | MediaSource | Blob | null;
}
