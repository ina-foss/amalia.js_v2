import {async, getTestBed, TestBed} from '@angular/core/testing';
import {MediaElement} from './media-element';
import {EventEmitter} from 'events';
import {DefaultLogger} from '../logger/default-logger';
import {PlayerConfigData} from '../config/model/player-config-data';

describe('Test Media element', () => {
    let injector: TestBed;
    const mediaSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
    const component = new MediaElement(document.createElement('video'), new EventEmitter(), new DefaultLogger());
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    afterEach(() => {
    });

    it('Media player element ', () => {
        expect(component).toBeTruthy();
        component.setSrc(config);
        expect(component.audioChannel).toEqual(1);
        component.audioChannel = 2;
        expect(component.audioChannel).toEqual(2);
    });
    it('test playbackrate setter and getter' , () => {
        expect(component.playbackRate).toEqual(1);
        expect(component.getPlaybackRate()).toEqual(1);
        component.playbackRate = 2;
        expect(component.playbackRate).toEqual(2);
        component.setPlaybackRate(4);
        expect(component.getPlaybackRate()).toEqual(4);
    });
    it('Tests merge volume' , () => {
        expect(component.withMergeVolume).toEqual(true);
        component.withMergeVolume = false;
        expect(component.withMergeVolume).toEqual(false);
    });
    it('Tests framerate' , () => {
        expect(component.framerate).toEqual(25);
        component.framerate = 60;
        expect(component.framerate).toEqual(60);
        component.framerate = 25;
        expect(component.framerate).toEqual(25);
    });
    it('Tests poster' , () => {
        component.poster = '../assets/image.png';
        expect(component.poster).toEqual('../assets/image.png');
    });
    it('Test currentTime' , () => {
        component.stop();
        expect(component.getCurrentTime()).toEqual(0);
    });
    it('Test events' , () => {
        expect(component.isPaused()).toEqual(true);
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
        expect(component.isPaused()).toEqual(true);
        expect(component.getCurrentTime()).toEqual(0 + (1 / 25 * 2) );
        component.movePrevFrame(1);
        expect(component.getCurrentTime()).toEqual((1 / 25 * 2)  - (1 / 25 * 1));
        component.seekToEnd();
        expect(typeof (component.getDuration())).toBe('number');

    });
    it('Test Volume' , () => {
        component.setVolume(50);
        expect(component.getVolume()).toEqual(50);
    });
    it('Test Image' , () => {
        expect(typeof(component.captureImage(50))).toBe('string');
    });
});


