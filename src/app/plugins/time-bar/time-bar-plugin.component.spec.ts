import {async, getTestBed, TestBed} from '@angular/core/testing';
import {TimeBarPluginComponent} from './time-bar-plugin.component';
import {MediaPlayerService} from '../../service/media-player-service';
import {ConfigurationManager} from '../../core/config/configuration-manager';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../../core/config/model/player-config-data';
import {MediaElement} from '../../core/media/media-element';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {TimeBarConfig} from '../../core/config/model/time-bar-config';
import {DefaultLogger} from '../../core/logger/default-logger';
import {LoggerInterface} from '../../core/logger/logger-interface';
import {DefaultConfigLoader} from '../../core/config/loader/default-config-loader';
import {DefaultConfigConverter} from '../../core/config/converter/default-config-converter';
import {ConfigDataSource} from '../../core/config/model/config-data-source';
import {ConfigData} from '../../core/config/model/config-data';

describe('TimeBar plugin test', () => {
    let injector: TestBed;
    const logger: LoggerInterface = new DefaultLogger();
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const mediaSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
    const configurationManager = new ConfigurationManager(loader, logger);
    const configPlugin: PluginConfigData<TimeBarConfig> = {name: 'TIME_BAR', data: {timeFormat: 'f', theme : 'outside'}};
    const component = new MediaElement(document.createElement('video'), new EventEmitter());
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: 5000, poster: '', src: mediaSrc
    };
    component.setSrc(config);
    const pluginsConfiguration: Map<string, PluginConfigData<any>> = new Map<string, PluginConfigData<any>>();
    const dataSources: Array<ConfigDataSource> = new Array<ConfigDataSource>();
    const playerService = new MediaPlayerService();

    const player: PlayerConfigData = {
        autoplay: false,
        crossOrigin: null,
        data: null,
        defaultVolume: 0,
        duration: null,
        poster: '',
        src: mediaSrc,
        ratio: '16:9'
    };
    const c: ConfigData = {
        player,
        pluginsConfiguration,
        dataSources
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));
    /*it('Test configuration Manager',() => {
        configurationManager.load(c).then(() => {
            expect(configurationManager.getCoreConfig().player.src).toContain(mediaSrc);
        });
        configurationManager.addPluginConfiguration('TIME_BAR', configPlugin);
    });*/
    /*it('initalisation Plugin',() => {
        let plugin = new TimeBarPluginComponent(playerService);
        expect(plugin).toBeTruthy();
    });
    it('Test configuration',() => {
        let plugin = new TimeBarPluginComponent(playerService);
        expect (plugin.getDefaultConfig()).toEqual(configPlugin);
    });*/
    /*it('Test currentTime TimeCodeBar plugin', () => {
        let plugin = new TimeBarPluginComponent(playerService);
        expect(component).toBeTruthy();
        plugin.init();
        component.setCurrentTime(10);
        expect(plugin.currentTime).toEqual(10);
        component.getDuration();
        expect(plugin.duration).toEqual(5000);
    });*/
});
