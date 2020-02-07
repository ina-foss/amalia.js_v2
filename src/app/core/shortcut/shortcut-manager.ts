import {LoggerInterface} from '../logger/logger-interface';
import {ConfigurationManager} from '../config/configuration-manager';


/**
 * In charge to handle amalia shortcut
 */
export class ShortcutManager {
  private readonly configurationManager: ConfigurationManager;
  private readonly logger: LoggerInterface;
  private listOfShortcut = new Map<string, Array<Promise<any>>>();

  constructor(configurationManager: ConfigurationManager, logger: LoggerInterface) {
    this.configurationManager = configurationManager;
    this.logger = logger;
  }

  /**
   * Return all shortcut with promise
   */
  getListOfShortcutKeys(): IterableIterator<string> {
    return this.listOfShortcut.keys();
  }

  /**
   * In charge to add shortcut
   *
   * @param key shortcut key
   * @param promise called when shortcut called
   */
  addShortcut(key: string, promise: Promise<void>) {
    if (!this.listOfShortcut.has(key)) {
      this.listOfShortcut.set(key, new Array<Promise<any>>());
    }
    this.listOfShortcut.get(key).push(promise);
  }

  /**
   * In charge to add shortcut
   *
   * @param key shortcut key
   * @param promise called when shortcut called
   */
  removeShortcut(key: string, promise: Promise<void>) {
    if (this.listOfShortcut.has(key)) {
      let listOfPromise = this.listOfShortcut.get(key);
      const idx = listOfPromise.indexOf(promise);
      if (idx !== -1) {
        listOfPromise = listOfPromise.filter(p => p !== promise);
        if (listOfPromise.length === 0) {
          this.listOfShortcut.delete(key);
        } else {
          this.listOfShortcut.set(key, listOfPromise);
        }
      } else {
        this.logger.warn(`Error to remove promise for specified key (${key}).`);
      }
    }
  }
}
