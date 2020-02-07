import {async, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DefaultLogger} from '../logger/default-logger';
import {ConfigurationManager} from '../config/configuration-manager';
import {DefaultMediaSourceExtension} from '../mse/default-media-source-extension';
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
    }).compileComponents();
    injector = getTestBed();
    httpTestingController = injector.get(HttpTestingController);
    httpClient = injector.get(HttpClient);
    const src = new DefaultMediaSourceExtension();
    const player: PlayerConfigData = {
      autoplay: false,
      crossOrigin: null,
      data: null,
      defaultVolume: 0,
      duration: null,
      poster: '',
      src
    };
    const pluginsConfiguration: Map<string, PluginConfigData> = new Map<string, PluginConfigData>();
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
    });
    const pausePromise = new Promise<void>(() => {
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
  });
});


