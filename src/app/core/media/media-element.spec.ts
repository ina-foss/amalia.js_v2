import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {MediaElement} from './media-element';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../config/model/player-config-data';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';

describe('Test Media element', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const srcMedia = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backSrc = 'http://test-streams.mu.dev/9898.m3u8';
    const component = new MediaElement(document.createElement('video'), new EventEmitter());
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: srcMedia,
        backwardsSrc: backSrc , hls: {enable: true}
    };
    const config2: PlayerConfigData = {
        autoplay: true, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: srcMedia,
        backwardsSrc: backSrc , hls: {enable: true}
    };
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


    it('Media player element ', async () => {
        expect(component).toBeTruthy();
        component.setSrc(config);
        expect(component.mse).toBeTruthy();
        expect(component.audioChannel).toEqual(1);
        component.audioChannel = 2;
        expect(component.audioChannel).toEqual(2);
    });
    it('Tests framerate', async () => {
        expect(component.framerate).toEqual(25);
        component.framerate = 60;
        expect(component.framerate).toEqual(60);
        component.framerate = 25;
        expect(component.framerate).toEqual(25);
    });
    it('Tests poster', () => {
        component.poster = '../assets/image.png';
        expect(component.poster).toEqual('../assets/image.png');
    });
    it('Test events', async () => {
        component.pause();
        // expect(component.isPaused()).toEqual(true);
        component.seekToBegin();
        component.stop();
        expect(component.getCurrentTime()).toEqual(0);
        expect(component.isMute()).toEqual(false);
        component.muteUnmute();
        expect(component.isMute()).toEqual(true);
        component.muteUnmute();
        expect(component.isMute()).toEqual(false);
        expect(component.getCurrentTime()).toEqual(0);
        component.moveNextFrame(2);
        expect(component.getCurrentTime()).toEqual(0 + (1 / 25 * 2));
        component.movePrevFrame(1);
        expect(component.getCurrentTime()).toEqual((1 / 25 * 2) - (1 / 25 * 1));
        component.seekToEnd();
        expect(typeof (component.getDuration())).toBe('number');
        component.setCurrentTime(25);
        component.play().then(()=>{
            component.playPause();
            expect(component.isPaused()).toEqual(true);
        }).catch(error=>{

        });
        component.stop();
        expect(component.getCurrentTime()).toEqual(0);
        component.play().then(()=>{
            component.pause();
        }).catch(error => {
        });
    });

});


