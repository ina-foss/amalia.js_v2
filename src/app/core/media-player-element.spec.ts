import {async, getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MediaPlayerElement} from './media-player-element';
import {DefaultLogger} from './logger/default-logger';
import {DefaultConfigConverter} from './config/converter/default-config-converter';
import {DefaultConfigLoader} from './config/loader/default-config-loader';
import {PlayerState} from './constant/player-state';

describe('Test Media player element', () => {
  let injector: TestBed;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const logger = new DefaultLogger();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
    }).compileComponents();
    injector = getTestBed();
    httpTestingController = injector.get(HttpTestingController);
    httpClient = injector.get(HttpClient);

  }));

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('Init Media player element ', () => {
    const configData = require('tests/assets/config-mpe.json');
    const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    const mpe = new MediaPlayerElement(logger);
    expect(mpe.getState()).toEqual(PlayerState.CREATED);
    mpe.init(configData, configLoader)
      .then((state) => {
        expect(state).toEqual(PlayerState.INITIALIZED);
      })
      .catch(() => {
        fail('Error to init player');
      });
  });
});


