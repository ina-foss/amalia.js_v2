/**
 * Player state
 */
export enum PlayerState {
  /**
   * Player initialized
   */
  CREATED = 0,
  /**
   * Player initialized
   */
  INITIALIZED = 1,
  /**
   * When error to load config
   */
  ERROR_LOAD_CONFIG = 1,
  /**
   * when error to load source
   */
  ERROR_LOAD_SOURCE = 2,
}
