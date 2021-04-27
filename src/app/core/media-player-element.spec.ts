import {async, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MediaPlayerElement} from './media-player-element';
import {DefaultLogger} from './logger/default-logger';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';
import {DefaultMetadataConverter} from './metadata/converter/default-metadata-converter';
import {DefaultMetadataLoader} from './metadata/loader/default-metadata-loader';
import {EventEmitter} from 'events';
import {MediaElement} from './media/media-element';
import {MetadataManager} from './metadata/metadata-manager';
import {ConfigurationManager} from './config/configuration-manager';

describe('Test Media player element', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const configData = require('tests/assets/config-mpe.json');
    const logger =  new DefaultLogger('root-player');
    const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const metadataConverter = new DefaultMetadataConverter();
    const mpe = new MediaPlayerElement();
    const eventEmitter = new EventEmitter();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);


    }));
    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('Test Media player element ', () => {
        const metadataLoader = new DefaultMetadataLoader(httpClient, metadataConverter, logger);
        expect(mpe.getState()).toEqual(PlayerState.CREATED);
        mpe.init(configData, metadataLoader, configLoader)
            .then((state) => {
                expect(state).toEqual(PlayerState.INITIALIZED);
                expect(mpe.eventEmitter).toEqual(eventEmitter);
                const obj = document.createElement('video');
                mpe.setMediaPlayer(obj);
                const mediaPlayer = new MediaElement(obj, eventEmitter);
                expect(mpe.getMediaPlayer()).toEqual(mediaPlayer);
                mpe.setMediaPlayerWidth(840);
                expect(mpe.width).toEqual(840);
                let displayState = mpe.getDisplayState();
                expect(displayState).toEqual('m');
                mpe.setMediaPlayerWidth(650);
                displayState = mpe.getDisplayState();
                expect(displayState).toEqual('sm');
                mpe.setMediaPlayerWidth(250);
                displayState = mpe.getDisplayState();
                expect(displayState).toEqual('s');
                mpe.setMediaPlayerWidth(1850);
                displayState = mpe.getDisplayState();
                expect(displayState).toEqual('l');
                const config = mpe.configurationManager.getCoreConfig();
                expect(config).toEqual(mpe.configurationManager.getCoreConfig());
                expect(config.player.ratio).toEqual('16:9');
                expect(mpe.aspectRatio).toEqual(config.player.ratio);
                expect(config.thumbnail.baseUrl).toEqual('https://picsum.photos/id/237/200/300');
                const res = mpe.getThumbnailUrl(120);
                const url = 'https://picsum.photos/id/237/200/300?tc=120';
                expect(res).toEqual(url);
                mpe.handleMetadataLoaded();
                expect(mpe.isMetadataLoaded).toEqual(true);
                const pluginConfig = mpe.getPluginConfiguration('CONTROL_BAR-PLAYER');
                expect(pluginConfig).toEqual(mpe.configurationManager.getPluginConfiguration('CONTROL_BAR-PLAYER'));
                mpe.aspectRatio = '4:3';
                expect(mpe._aspectRatio).toEqual('4:3');
                const metadataManager = new MetadataManager(mpe.configurationManager, mpe.defaultLoader, logger);
                mpe.metadataManager = new MetadataManager(mpe.configurationManager, mpe.defaultLoader, logger);
                expect(mpe.metadataManager).toEqual(metadataManager);
            })
            .catch(() => {
                console.log('Error to init player');
            });


    });
    it('test handleMetadata', () => {

    });
    it('Test Plugin Configuration ', () => {

    });
    it('Test set aspect Ratio ', () => {

    });
    it('Test metadata manager ', () => {

    });
});


