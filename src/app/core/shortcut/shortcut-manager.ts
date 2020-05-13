import {LoggerInterface} from '../logger/logger-interface';
import {ConfigurationManager} from '../config/configuration-manager';
import {Shortcut} from './shortcut';


/**
 * In charge to handle amalia shortcut
 */
export class ShortcutManager {
    private readonly configurationManager: ConfigurationManager;
    private readonly logger: LoggerInterface;
    private listOfShortcut = new Map<string, Array<Promise<any>>>();
    public isAppleBrowser = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    public aliases: { [alias: string]: string } = {
        option: 'alt',
        command: 'meta',
        return: 'enter',
        escape: 'esc',
        plus: '+', // Necessary because + is used to specify combos.
        mod: this.isAppleBrowser ? 'meta' : 'ctrl'
    };

    codes: [number, string][] = [
        [8, 'backspace'],
        [9, 'tab'],
        [13, 'enter'],
        [16, 'shift'],
        [17, 'ctrl'],
        [18, 'alt'],
        [20, 'capslock'],
        [27, 'esc'],
        [32, 'space'],
        [33, 'pageup'],
        [34, 'pagedown'],
        [35, 'end'],
        [36, 'home'],
        [37, 'left'],
        [38, 'up'],
        [39, 'right'],
        [40, 'down'],
        [45, 'ins'],
        [46, 'del'],
        [91, 'meta'],
        [93, 'meta'],
        [224, 'meta']
    ];

    constructor(configurationManager: ConfigurationManager, logger: LoggerInterface) {
        this.configurationManager = configurationManager;
        this.logger = logger;
        // F1-F19
        for (let i = 0; i < 20; i++) {
            this.codes.push([111 + i, `f${i}`]);
        }
    }

    /**
     * Enable listener
     */
    public enableListener() {
        document.addEventListener('keydown', this.handleEvent);
    }

    /**
     * Disable listener
     */
    public disableListener() {
        document.removeEventListener('keydown', this.handleEvent);
    }

    /**
     * Handle keyboard event
     * @param event event
     */
    public handleEvent(event: KeyboardEvent) {
        this.logger.debug('Keyboard event', event);
        if (this.listOfShortcut) {
            for (const shortcut of this.listOfShortcut) {
                console.log(shortcut);
            }
        }
    }

    public isEventMatches(shortcut: string, event: KeyboardEvent): boolean {
        try {
            const definition = this.parseShortcut(shortcut);
            const modifiersMatch =
                definition.alt === event.altKey &&
                definition.ctrl === event.ctrlKey &&
                definition.shift === event.shiftKey &&
                definition.meta === event.metaKey;
            if (!modifiersMatch) {
                return false;
            }
            return this.nameToCode(definition.key) === Number(event.key);
        } catch (e) {
            return false;
        }
    }

    private parseShortcut(keys: string): Shortcut {
        const parts = keys.split(/[\s+\+]+/).map(this.normaliseKeyName);
        let key: string | null = null;
        let alt = false;
        let ctrl = false;
        let shift = false;
        let meta = false;
        parts.forEach(part => {
            switch (part) {
                case 'alt':
                    alt = true;
                    break;
                case 'ctrl':
                    ctrl = true;
                    break;
                case 'shift':
                    shift = true;
                    break;
                case 'meta':
                    meta = true;
                    break;
                default:
                    if (key !== null) {
                        throw new Error('multiple keys specified');
                    }
                    if (part.length > 1 && !this.isValidKeyName(part)) {
                        throw new Error(`invalid named key "${part}"`);
                    }
                    key = part;
            }
        });
        if (!key) {
            throw new Error('no key specified, only modifiers');
        }
        return {alt, ctrl, shift, meta, key};
    }

    public isValidKeyName(name: string): boolean {
        const actualName = this.normaliseKeyName(name);
        for (const pair of this.codes) {
            if (pair[1] === actualName) {
                return true;
            }
        }
        return false;
    }

    private nameToCode(name: string): number {
        const actualName = this.normaliseKeyName(name);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.codes.length; i++) {
            if (this.codes[i][1] === actualName) {
                return this.codes[i][0];
            }
        }
        return name.toUpperCase().charCodeAt(0);
    }

    private normaliseKeyName(name: string): string {
        return this.aliases[name] || name;
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
