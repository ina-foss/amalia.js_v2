import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {MediaElement} from './media-element';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../config/model/player-config-data';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {PlayerEventType} from '../constant/event-type';

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

    it('handles pause and independent channel volumes', () => {
        const video = document.createElement('video');
        const emitter = new EventEmitter();
        const mediaElement = new MediaElement(video, emitter);
        const setPlaybackRate = spyOn<any>(mediaElement, 'setPlaybackRate');
        const pause = spyOn(video, 'pause');
        const emit = spyOn(emitter, 'emit').and.callThrough();

        mediaElement.pause();
        expect(setPlaybackRate).toHaveBeenCalledWith(1);
        expect(pause).toHaveBeenCalled();

        mediaElement.pause(true);
        expect(emit).toHaveBeenCalledWith(PlayerEventType.PLAYER_SIMULATE_PLAY, true);

        mediaElement.setVolumeSideValues(20, 'l');
        mediaElement.setVolumeSideValues(30, 'r');
        expect(mediaElement.getVolume('l')).toBe(20);
        expect(mediaElement.getVolume('r')).toBe(30);

        const leftGain = {gain: {value: 0, setValueAtTime: jasmine.createSpy('leftGain')}};
        const rightGain = {gain: {value: 0, setValueAtTime: jasmine.createSpy('rightGain')}};
        mediaElement.audioContext = {currentTime: 4} as AudioContext;
        mediaElement.panLeft = leftGain as unknown as GainNode;
        mediaElement.panRight = rightGain as unknown as GainNode;

        mediaElement.setVolumeSideValues(40, 'l');
        mediaElement.setVolumeSideValues(60, 'r');
        mediaElement.setVolumeSideValues(50);

        expect(leftGain.gain.setValueAtTime).toHaveBeenCalledWith(0.4, 4);
        expect(rightGain.gain.setValueAtTime).toHaveBeenCalledWith(0.6, 4);
        expect(leftGain.gain.value).toBe(0.5);
        expect(rightGain.gain.value).toBe(0.5);
        expect(video.volume).toBe(1);

        mediaElement.setVolume(25, 'l');
        expect(video.volume).toBe(0.5);
    });

    it('handles invalid time, reverse frames and forced play state', () => {
        const video = document.createElement('video');
        Object.defineProperty(video, 'duration', {configurable: true, value: 20});
        const emitter = new EventEmitter();
        const emit = spyOn(emitter, 'emit').and.callThrough();
        const mediaElement = new MediaElement(video, emitter);

        mediaElement.setCurrentTime(Number.NaN);
        expect(video.currentTime).toBe(0);
        expect(emit).toHaveBeenCalledWith(PlayerEventType.TIME_CHANGE);

        video.currentTime = 5;
        mediaElement.setReverseMode(true);
        expect(mediaElement.getCurrentTime()).toBe(15);

        mediaElement.framerate = 10;
        mediaElement.moveNextFrame(2);
        expect(video.currentTime).toBe(4.8);
        mediaElement.movePrevFrame(2);
        expect(video.currentTime).toBe(5);

        (mediaElement as any).simulatePlay(true);
        expect(mediaElement.isPaused()).toBeFalse();
        (mediaElement as any).simulatePlay(false);
        expect(mediaElement.isPaused()).toBeTrue();
    });

    it('captures an image only when one is available', () => {
        const emitter = new EventEmitter();
        const emit = spyOn(emitter, 'emit').and.callThrough();
        const mediaElement = new MediaElement(document.createElement('video'), emitter);
        spyOn<any>(mediaElement, 'getCurrentImage').and.returnValues('data:image/png;base64,test', null);

        expect(mediaElement.captureImage(0.5)).toBe('data:image/png;base64,test');
        expect(emit).toHaveBeenCalledWith(PlayerEventType.IMAGE_CAPTURE, 'data:image/png;base64,test');
        expect(mediaElement.captureImage(0.5)).toBeNull();
        expect(emit).toHaveBeenCalledTimes(1);
    });

    it('toggles playback according to the paused state', async () => {
        const mediaElement = new MediaElement(document.createElement('video'), new EventEmitter());
        const play = spyOn(mediaElement, 'play').and.returnValue(Promise.resolve());
        const pause = spyOn(mediaElement, 'pause');
        const isPaused = spyOn(mediaElement, 'isPaused');

        isPaused.and.returnValue(true);
        mediaElement.playPause();
        await Promise.resolve();
        expect(play).toHaveBeenCalled();

        isPaused.and.returnValue(false);
        mediaElement.playPause();
        expect(pause).toHaveBeenCalled();
    });

    it('configures left, right, mono and stereo audio routing', () => {
        const createAudioContext = () => {
            const leftGain = {gain: {value: 0, setValueAtTime: jasmine.createSpy()}, connect: jasmine.createSpy()};
            const rightGain = {gain: {value: 0, setValueAtTime: jasmine.createSpy()}, connect: jasmine.createSpy()};
            const splitter = {connect: jasmine.createSpy()};
            const source = {connect: jasmine.createSpy()};
            const panner = {
                positionX: {setValueAtTime: jasmine.createSpy()},
                connect: jasmine.createSpy()
            };
            const merger = {connect: jasmine.createSpy()};
            const audioContext = {
                currentTime: 2,
                destination: {},
                createMediaElementSource: jasmine.createSpy().and.returnValue(source),
                createGain: jasmine.createSpy().and.returnValues(leftGain, rightGain),
                createChannelSplitter: jasmine.createSpy().and.returnValue(splitter),
                createPanner: jasmine.createSpy().and.returnValue(panner),
                createChannelMerger: jasmine.createSpy().and.returnValue(merger)
            };
            return {audioContext, leftGain, rightGain, panner, merger};
        };
        const setup = (data: any) => {
            const mediaElement = new MediaElement(document.createElement('video'), new EventEmitter());
            const nodes = createAudioContext();
            mediaElement.audioContext = nodes.audioContext as unknown as AudioContext;
            (mediaElement as any).setupAudioNodes(data);
            return nodes;
        };

        const left = setup({channelMergerNode: 'l'});
        expect(left.panner.positionX.setValueAtTime).toHaveBeenCalledWith(-1, 2);

        const right = setup({channelMergerNode: 'r'});
        expect(right.panner.positionX.setValueAtTime).toHaveBeenCalledWith(1, 2);

        const mono = setup({channelMergeVolume: true});
        expect(mono.leftGain.connect).toHaveBeenCalledWith(mono.audioContext.destination, 0);
        expect(mono.rightGain.connect).toHaveBeenCalledWith(mono.audioContext.destination, 0);

        const stereo = setup(null);
        expect(stereo.leftGain.connect).toHaveBeenCalledWith(stereo.merger, 0, 0);
        expect(stereo.rightGain.connect).toHaveBeenCalledWith(stereo.merger, 0, 1);
        expect(stereo.merger.connect).toHaveBeenCalledWith(stereo.audioContext.destination);
    });

});


