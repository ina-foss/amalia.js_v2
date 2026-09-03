import {DefaultLogger} from '../logger/default-logger';

/**
 * In charge to handle storage
 */
export class PreferenceStorageManager {

    public logger: DefaultLogger = null;
    /**
     * Local storage data
     */
    public data: any = null;
    /**
     * Storage name
     */
    private readonly storageNamespace: string;

    /**
     * Init this class preference storage manager with namespace default namespace is `ina.amalia.player`
     */
    constructor(storageNamespace: string = 'ina.amalia.player') {
        this.storageNamespace = storageNamespace;
        this.initializeStorage();
    }

    /**
     * Initialize local storage data
     * @method initialize
     */
    initializeStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                if (!localStorage.hasOwnProperty(this.storageNamespace)) {
                    localStorage.setItem(this.storageNamespace, JSON.stringify({}));
                }
                this.data = JSON.parse(localStorage.getItem(this.storageNamespace) || '');
            } catch (e) {
                this.data = null;
            }
        } else {
            this.data = null;
        }
    }

    /**
     * Update local storage data
     * @method initialize
     */
    updateDataStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this.storageNamespace, JSON.stringify(this.data));
            }
        } catch (e) {
            this.data = null;
        }
    }

    /**
     * Method check if has key
     * @method hasItem
     * @param  key control key
     */
    hasItem(key: string): boolean {
        return (this.data !== null && this.data.hasOwnProperty(key));
    }

    /**
     * Return key data
     * @param  key get key
     */
    getItem(key: string): string {
        if (this.data !== null && this.data.hasOwnProperty(key)) {
            return this.data[key];
        }
        return null;
    }

    /**
     * Set item with key and value
     * @param  key set key
     * @param  value set value
     */
    setItem(key: string, value: string) {
        try {
            if (this.data !== null && typeof key !== 'undefined' && typeof value !== 'undefined') {
                this.data[key] = value;
                this.updateDataStorage();
            }
        } catch (e) {
            return null;
        }
        return true;
    }

    /**
     * Remove item with key
     * @param  key remove key
     */
    removeItem(key: string): boolean {
        if (this.data !== null && key) {
            delete this.data[key];
            this.updateDataStorage();
            return true;
        }
        return false;
    }

    /**
     * Clear all data
     */
    clear() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.storageNamespace);
        }
    }
}
