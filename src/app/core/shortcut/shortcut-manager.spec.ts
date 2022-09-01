import {async, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DefaultLogger} from '../logger/default-logger';
import {ConfigurationManager} from '../config/configuration-manager';
import {PlayerConfigData} from '../config/model/player-config-data';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {ConfigDataSource} from '../config/model/config-data-source';
import {ConfigData} from '../config/model/config-data';
import {DefaultConfigLoader} from '../config/loader/default-config-loader';
import {DefaultConfigConverter} from '../config/converter/default-config-converter';
import {ShortcutManager} from './shortcut-manager';


describe('Test Shortcut manager', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const logger = new DefaultLogger();
    let configurationManager;
    const mediaSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);

        const player: PlayerConfigData = {
            autoplay: false,
            crossOrigin: null,
            data: null,
            defaultVolume: 0,
            duration: null,
            poster: '',
            src: mediaSrc
        };
        const pluginsConfiguration: Map<string, PluginConfigData<any>> = new Map<string, PluginConfigData<any>>();
        const dataSources: Array<ConfigDataSource> = new Array<ConfigDataSource>();
        const c: ConfigData = {
            player,
            pluginsConfiguration,
            dataSources
        };
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        configurationManager = new ConfigurationManager(loader, logger);
    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('Test list of Shortcut ', () => {
        const shortcutManager = new ShortcutManager(configurationManager, logger);
        const playPromise = new Promise<void>(() => {
            // Play Promise
        });
        const pausePromise = new Promise<void>(() => {
            // Pause Promise
        });
        shortcutManager.addShortcut('p', playPromise);
        shortcutManager.addShortcut('p', pausePromise);
        shortcutManager.addShortcut('l', playPromise);
        let list = shortcutManager.getListOfShortcutKeys();
        expect(list.next().value).toContain(`p`);
        expect(list.next().value).toContain(`l`);
        shortcutManager.removeShortcut('l', playPromise);
        list = shortcutManager.getListOfShortcutKeys();
        let item = list.next();
        expect(item.value).toContain('p');
        expect(item.done).toEqual(false);
        item = list.next();
        expect(item.done).toEqual(true);
        const event = new KeyboardEvent('keydown');
        shortcutManager.handleEvent(event);
        const f = shortcutManager.isEventMatches('p', event);
        expect(f).toBeFalsy();
        shortcutManager.addShortcut('alt', playPromise);
        const altEv = new KeyboardEvent('keydown', {
            code : '18',
            key : 'alt',
            altKey : true,
            ctrlKey : false,
            metaKey : false,
            shiftKey: false
        });
        const fun = shortcutManager.isEventMatches('alt', altEv);
        expect(fun).toBeTruthy();
        expect(shortcutManager.isValidKeyName('&éç')).toBeFalsy();
        expect(shortcutManager.isValidKeyName('alt')).toBeTruthy();
        shortcutManager.enableListener();
        shortcutManager.disableListener();
        const ctrlEv = new KeyboardEvent('keydown', {
            code : '18',
            key : 'c',
            altKey : false,
            ctrlKey : true,
            metaKey : false,
            shiftKey : false
        });
        const func = shortcutManager.isEventMatches('ctrl', ctrlEv);
        expect(func).toBeFalsy();
        const shiftEv = new KeyboardEvent('keydown', {
            code : '16',
            key : 'shift',
            altKey : false,
            ctrlKey : false,
            metaKey : false,
            shiftKey : true
        });
        const funct = shortcutManager.isEventMatches('shift', shiftEv);
        expect(funct).toBeTruthy();
        const metaEv = new KeyboardEvent('keydown', {
            code : '16',
            key : 'meta',
            altKey : false,
            ctrlKey : false,
            metaKey : false,
            shiftKey : false
        });
        const functi = shortcutManager.isEventMatches('meta', metaEv);
        expect(functi).toBeFalsy();
    });
});


