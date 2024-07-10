import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MediaPlayerElement} from './media-player-element';
import {DefaultLogger} from './logger/default-logger';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';
import {DefaultMetadataConverter} from './metadata/converter/default-metadata-converter';
import {DefaultMetadataLoader} from './metadata/loader/default-metadata-loader';
import {MediaElement} from './media/media-element';
import {EventEmitter} from 'events';
import {ConfigurationManager} from './config/configuration-manager';

describe('Test Media player element', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const logger = new DefaultLogger();
    const eventEmitter = new EventEmitter();
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    beforeEach(waitForAsync(() => {
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

    it('Init Media player element ', () => {
        const configData = require('tests/assets/config-mpe.json');
        const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const metadataConverter = new DefaultMetadataConverter();
        const metadataLoader = new DefaultMetadataLoader(httpClient, metadataConverter, logger);
        const mpe = new MediaPlayerElement();
        const configurationManager = new ConfigurationManager(loader, logger);
        expect(mpe.getState()).toEqual(PlayerState.CREATED);
        mpe.init(configData, metadataLoader, configLoader)
            .then((state) => {
                expect(state).toEqual(PlayerState.INITIALIZED);
            })
            .catch(() => {
                fail('Error to init player');
            });
        mpe.handleMetadataLoaded();
        expect(mpe.isMetadataLoaded).toEqual(true);
        expect(mpe.metadataManager).toEqual(mpe._metadataManager);
        const obj = document.createElement('video');
        mpe.setMediaPlayer(obj);
        const mediaPlayer = new MediaElement(obj, eventEmitter);
        mpe.configurationManager.configData = configData;
        expect(mpe.getMediaPlayer()).toEqual(mediaPlayer);
        mpe.setMediaPlayerWidth(620);
        expect(mpe.getDisplayState()).toEqual('s');
        mpe.setMediaPlayerWidth(940);
        expect(mpe.getDisplayState()).toEqual('l');
        mpe.aspectRatio = '4:3';
        mpe.metadataManager = mpe._metadataManager;
        configurationManager.load(configData).then(() => {
            expect(configurationManager.getCoreConfig().player.ratio).toContain('16:9');
        });
        // mpe.loadConfiguration(configData);
        expect(mpe.getThumbnailUrl(140)).toEqual('https://picsum.photos/id/237/200/300?tc=140');
        expect(mpe.getThumbnailUrl(180, true)).toEqual('https://picsum.photos/id/237/200/300?width=170&tc=180');
        expect(mpe.aspectRatio).toEqual('16:9');

    });
});
