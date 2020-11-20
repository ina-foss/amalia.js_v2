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

describe('Test Media player element', () => {
    /*let injector: TestBed;
    let httpTestingController: HttpTestingController;
    const configData = require('tests/assets/config-mpe.json');
    const logger =  new DefaultLogger('root-player');
    const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const metadataConverter = new DefaultMetadataConverter();
    const metadataLoader = new DefaultMetadataLoader(HttpClient, metadataConverter, logger);
    const mpe = new MediaPlayerElement();
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

    it('Init Media player element ', () => {
        expect(mpe.getState()).toEqual(PlayerState.CREATED);
        mpe.init(configData, metadataLoader, configLoader)
            .then((state) => {
                expect(state).toEqual(PlayerState.INITIALIZED);
            })
            .catch(() => {
                fail('Error to init player');
            });
    });
    it('test get aspect ratio', () => {
        expect(mpe.aspectRatio).toEqual('16:9');
    });*/
});


