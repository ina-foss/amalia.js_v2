import { EventEmitter } from 'events';
import { MediaElement } from './media-element';
import { PlayerEventType } from '../constant/event-type';
import { Utils } from '../utils/utils';

describe('MediaElement extra coverage', () => {
    let media: MediaElement;
    let video: HTMLVideoElement;
    let emitter: EventEmitter;

    beforeEach(() => {
        video = document.createElement('video');
        Object.defineProperty(video, 'duration', { value: 120, writable: true, configurable: true });
        Object.defineProperty(video, 'paused', { value: true, writable: true, configurable: true });
        video.currentTime = 10;
        emitter = new EventEmitter();
        media = new MediaElement(video, emitter);
        (media as any).mse = {
            setMaxBufferLengthConfig: jasmine.createSpy('setMaxBufferLengthConfig'),
            getBackwardsSrc: jasmine.createSpy('getBackwardsSrc').and.returnValue('bwd'),
            switchToBackwardsSrc: jasmine.createSpy('switchToBackwardsSrc').and.resolveTo(),
            switchToMainSrc: jasmine.createSpy('switchToMainSrc').and.resolveTo(),
            destroy: jasmine.createSpy('destroy')
        };
    });

    it('pause(ignore) should emit simulated play and setCurrentTime should sanitize NaN', () => {
        const emitSpy = spyOn(emitter, 'emit').and.callThrough();
        const pauseSpy = spyOn(video, 'pause');

        media.pause(true);
        media.setCurrentTime(NaN as any);

        expect(pauseSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_SIMULATE_PLAY, true);
        expect(video.currentTime).toBe(0);
    });

    it('setVolume should update channels and merged volume', () => {
        media.setVolume(30, 'l');
        expect(media.volumeLeft).toBe(30);
        expect(media.volumeRight).toBe(50);

        media.setVolume(80, 'r');
        expect(media.volumeRight).toBe(80);
        expect(video.volume).toBeCloseTo(0.8, 5);

        media.setVolume(60);
        expect(media.volumeLeft).toBe(60);
        expect(media.volumeRight).toBe(60);
    });

    it('reverse mode should impact current time and frame movement', () => {
        media.setReverseMode(true);
        video.currentTime = 30;
        expect(media.getCurrentTime()).toBe(90);

        media.moveNextFrame(2);
        expect(video.currentTime).toBeCloseTo(29.92, 2);
        media.movePrevFrame(2);
        expect(video.currentTime).toBeCloseTo(30, 1);
    });

    it('playPause should call play when paused and pause otherwise', async () => {
        const playSpy = spyOn(media, 'play').and.resolveTo();
        const pauseSpy = spyOn(media, 'pause');
        Object.defineProperty(video, 'paused', { value: true, configurable: true });
        media.playPause();
        expect(playSpy).toHaveBeenCalled();

        Object.defineProperty(video, 'paused', { value: false, configurable: true });
        media.playPause();
        expect(pauseSpy).toHaveBeenCalled();
    });

    it('captureImage should emit image event when frame extraction succeeds', () => {
        const emitSpy = spyOn(emitter, 'emit').and.callThrough();
        spyOn<any>(media, 'getCurrentImage').and.returnValue('data:image/png;base64,x');

        const output = media.captureImage(1);

        expect(output).toContain('data:image/png');
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.IMAGE_CAPTURE, output);
    });

    it('set playbackRate negative then positive should switch media source correctly', async () => {
        media.playbackRate = -2;
        await Promise.resolve();
        expect((media as any).mse.switchToBackwardsSrc).toHaveBeenCalled();

        media.playbackRate = 1;
        await Promise.resolve();
        expect((media as any).mse.switchToMainSrc).toHaveBeenCalled();
    });

    it('private handlers should emit corresponding player events', () => {
        const emitSpy = spyOn(emitter, 'emit').and.callThrough();
        (media as any).handlePlay();
        (media as any).handlePause();
        (media as any).handleEnd();
        (media as any).handleDurationchange();
        (media as any).handleTimeupdate();
        (media as any).handleSeeked();
        (media as any).handleVolumeChange();
        (media as any).handleResize();

        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYING);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PAUSED);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.ENDED);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.DURATION_CHANGE);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.TIME_CHANGE);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.SEEKED);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.VOLUME_CHANGE);
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.PLAYER_RESIZED);
    });

    it('unsubscribeListeners should unregister on mse and current instance', () => {
        const unsubSpy = spyOn(Utils, 'unsubscribeTargetedElementEventListeners').and.stub();
        media.unsubscribeListeners();
        expect(unsubSpy).toHaveBeenCalledTimes(2);
    });
});
