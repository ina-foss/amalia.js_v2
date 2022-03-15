import {async, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
import {ConfigurationManager} from './configuration-manager';
import {ConfigData} from './model/config-data';
import {PlayerConfigData} from './model/player-config-data';
import {PluginConfigData} from './model/plugin-config-data';
import {ConfigDataSource} from './model/config-data-source';
import {DefaultConfigConverter} from './converter/default-config-converter';
import {HttpConfigLoader} from './loader/http-config-loader';
import {HttpClient} from '@angular/common/http';
import {DefaultLogger} from '../logger/default-logger';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AmaliaException} from '../exception/amalia-exception';
import {LoggerInterface} from '../logger/logger-interface';
import {DefaultConfigLoader} from './loader/default-config-loader';
describe('ConfigurationManager', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const logger: LoggerInterface = new DefaultLogger();
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const configUrl = './tests/assets/config-mpe.json';
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpClient = injector.inject(HttpClient);
        httpTestingController = injector.inject(HttpTestingController);
    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });


    it('Create configuration manager with default loader', () => {
        const player: PlayerConfigData = {
            autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc,
            backwardsSrc: backwardSrc , hls: {enable: true}
        };
        const pluginsConfiguration: Map<string, PluginConfigData<any>> = new Map<string, PluginConfigData<any>>();
        const dataSources: Array<ConfigDataSource> = new Array<ConfigDataSource>();
        const c: ConfigData = {
            timeFormat: 'f',
            player,
            pluginsConfiguration,
            dataSources
        };
        const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const configurationManager = new ConfigurationManager(loader, logger);
        configurationManager.load(c).then(() => {
            expect(configurationManager.getCoreConfig().player.src).toContain(mediaSrc);
            configurationManager.addPluginConfiguration('plugin-test', {
                data: null,
                debug: false,
                metadataIds: ['test'],
                name: 'test'
            });
            const configTest = {
                data: null,
                debug: false,
                metadataIds: ['test'],
                name: 'test'
            };
            if (configurationManager.getPluginConfiguration('plugin-test')) {
                expect(configurationManager.getPluginConfiguration('plugin-test')).toEqual(configTest);
            } else {
                expect(() => configurationManager.getPluginConfiguration('plugin-test'))
                    .toThrow(new AmaliaException(`Error to get configuration for plugin 'plugin-test'.`));
            }
            expect(() => configurationManager.getPluginConfiguration('test1'))
                .toThrow(new AmaliaException(`Error to get configuration for plugin test1.`));
        });
        expect(configurationManager).toBeTruthy();
    });

    it('Create configuration manager with http loader', fakeAsync(() => {
            const configData = require('tests/assets/config-mpe.json');
            const loader = new HttpConfigLoader(new DefaultConfigConverter(), httpClient, logger);
            const configurationManager = new ConfigurationManager(loader, logger);
            configurationManager.load(configUrl).then(() => {
                expect(configurationManager.getCoreConfig()).toBeTruthy();
            }).catch(() => {
                fail('Error to call assert');
            });
            httpTestingController.expectOne(configUrl).flush(configData, {status: 200, statusText: 'Ok'});
            expect(configurationManager).toBeTruthy();
            tick();
            configurationManager.load(configUrl).then(() => {
                fail('Error to call assert');
            }).catch(() => {
                expect().nothing();
            });
            httpTestingController.expectOne(configUrl).flush(null, {status: 200, statusText: 'Ok'});

            expect(configurationManager).toBeTruthy();

            tick();

        })
    );


});
