import {LoggerInterface} from '../logger/logger-interface';
import {EventEmitter} from 'events';
import {PlayerEventType} from '../constant/event-type';
import {AutoBind} from '../decorator/auto-bind.decorator';
import {MediaSourceExtension} from '../mse/media-source-extension';
import {PlayerConfigData} from '../config/model/player-config-data';
import {DefaultMediaSourceExtension} from '../mse/default-media-source-extension';
import {HLSMediaSourceExtension} from '../mse/hls/hls-media-source-extension';
import {DefaultLogger} from '../logger/default-logger';

/**
 * Media element
 */
export class MediaElement {
    public static DEFAULT_FRAMERATE = 25;
    private readonly mediaElement: HTMLVideoElement;
    private readonly eventEmitter: EventEmitter;
    private readonly logger: LoggerInterface;
    public mse: MediaSourceExtension;
    public volumeLeft = 50;
    public volumeRight = 50;
    /**
     * Selected audio channel
     */
    public _audioChannel = 1;
    public _playbackRate = 1;
    /**
     * Video framerate used for foreword and backward
     */
    private _framerate = 25;
    /**
     * Media poster
     */
    private _poster: string;
    /**
     * To handle merge channel state
     */
    public _withMergeVolume = true;
    public audioContext: AudioContext = null;
    public audioContextSplitter = null;
    public panLeft: GainNode = null;
    public panRight: GainNode = null;
    public stereoNode: PannerNode = null;
    /**
     * play a video backwards
     */
    public reverseMode = false;
    private intervalRewind = null;
    // switched to backward src
    private switched = false;

    /**
     * Player initalized
     */
    private initialized = false;
    /**
     * Default buffersize hls player
     */
    private defaultBufferSize = 12;

    /**
     * Force show button play when video is paused (handle playbackrate change by images)
     */
    private force = false;

    /**
     * Init media element for handle html video element
     * @param mediaElement html video element
     * @param eventEmitter event emitter
     */
    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
        this.logger = new DefaultLogger('media-element');
    }

    /**
     * Init log level
     * @param logEnable true for enable log
     * @param logLevel log level
     */
    public initLoggerState(logEnable: boolean, logLevel: string) {
        this.logger.state(logEnable);
        this.logger.logLevel(logLevel);
    }


    get audioChannel(): number {
        return this._audioChannel;
    }

    set audioChannel(value: number) {
        this._audioChannel = value;
    }


    set playbackRate(value: number) {
        this._playbackRate = value;
        this.setPlaybackRate(value);
    }


    get withMergeVolume(): boolean {
        return this._withMergeVolume;
    }

    set withMergeVolume(value: boolean) {
        this._withMergeVolume = value;
    }

    get framerate(): number {
        return this._framerate;
    }

    set framerate(value: number) {
        this._framerate = value;
    }

    get poster(): string {
        return this._poster;
    }

    set poster(value: string) {
        this._poster = value;
    }

    play(): Promise<void> {
        return this.mediaElement.play();
    }

    /**
     * Invoked for paused player
     */
    pause(ignore?): void {
        if (!ignore) {
            this.setPlaybackRate(1);
            this.mediaElement.pause();
        } else {
            this.mediaElement.pause();
            this.eventEmitter.emit(PlayerEventType.PLAYER_SIMULATE_PLAY, true);
        }
    }

    stop(): void {
        this.mediaElement.pause();
        this.mediaElement.currentTime = 0;
    }

    /**
     * Invoked to set mute state
     */
    mute() {
        this.mediaElement.volume = 0;
    }

    /**
     * Invoked to set unmute state
     */
    unmute() {
        this.mediaElement.volume = 1;
    }

    /**
     * Invoked to set media source and autoplay, by default
     * @param config PlayerConfigData
     */
    setSrc(config: PlayerConfigData): void {
        // remove old mse config
        if (this.mse) {
            this.mse.destroy();
        }
        if ((config.hls && config.hls.enable) || config.src.toString().search(/.m3u8/) !== -1) {
            this.mse = new HLSMediaSourceExtension(this.mediaElement, this.eventEmitter, config, this.logger);
            this.logger.info('Init media source with HLS media extension');
        } else {
            this.mse = new DefaultMediaSourceExtension(this.mediaElement, this.eventEmitter, config, this.logger);
        }
        this.mse.setSrc(config);
        this._framerate = config.framerate ? config.framerate : MediaElement.DEFAULT_FRAMERATE;
        // Init handle events
        this.initPlayerEvents();
    }

    /**
     * Returns the player's current volume, an integer between 0 and 100. Note that getVolume()
     * will return the volume even if the player is muted.
     */
    getVolume(side?: 'r' | 'l'): number {
        if (side) {
            return (side === 'l') ? this.volumeLeft : this.volumeRight;
        } else {
            return this.mediaElement ? this.mediaElement.volume * 100 : 0;
        }
    }

    /**
     * Sets the volume. Accepts an integer between 0 and 100.
     */
    setVolume(volumePercent: number, volumeSide?: string) {
        this.setVolumeSideValues(volumePercent, volumeSide);
        this.mediaElement.volume = Math.max(this.volumeLeft, this.volumeRight) / 100;
        this.logger.info(`setVolume side ${volumeSide} - volume: ${volumePercent} - volume global: ${this.mediaElement.volume}`);
    }

    setVolumeSideValues(volumePercent: number, volumeSide?: string) {
        const panVolume = volumePercent / 100;
        this.logger.debug(`setVolume change side ${volumeSide} / vol : ${volumePercent}  panVolume:${panVolume}`);
        if (volumeSide === 'r') {
            this.volumeRight = volumePercent;
            if (this.audioContext && this.panRight) {
                this.panRight.gain.setValueAtTime(panVolume, this.audioContext.currentTime);
            }
        } else if (volumeSide === 'l') {
            this.volumeLeft = volumePercent;
            if (this.audioContext && this.panLeft) {
                this.panLeft.gain.setValueAtTime(panVolume, this.audioContext.currentTime);
            }
        } else {
            this.volumeRight = volumePercent;
            this.volumeLeft = volumePercent;
            if (this.audioContext && this.panLeft && this.panRight) {
                this.panRight.gain.value = panVolume;
                this.panLeft.gain.value = panVolume;
            }
        }
    }

    /*
    Set value of reverseMode
     */
    setReverseMode(value: boolean) {
        this.reverseMode = value;
    }

    /**
     * Return current position in seconds
     */
    getCurrentTime(): number {
        return this.mediaElement && this.reverseMode ? Math.max(0, this.getDuration() - this.mediaElement.currentTime) : this.mediaElement.currentTime;
    }

    /**
     * Set seek position in seconds
     */
    public setCurrentTime(value: number): void {
        const currentTime = isNaN(value) ? 0 : value;
        if (this.mediaElement) {
            this.mediaElement.currentTime = Math.max(0, currentTime);
            this.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        }
    }

    /**
     * Return playback rate
     * @returns the current playback speed of the audio/video.
     */
    getPlaybackRate(): number | null {
        return this.playbackRate ? this.playbackRate : this.mediaElement.playbackRate;
    }

    /**
     * Set playback rate
     * @param speed the current playback speed of the audio/video.
     * @returns the current playback speed of the audio/video.
     */
    private setPlaybackRate(speed: number) {
        this.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        const lastStateIsReverseMode = this.reverseMode;
        this.reverseMode = (speed < 0);
        if (this.getDuration() > 0 && this.getCurrentTime() >= 0) {
            if (this.reverseMode) {
                this.setNegativePlaybackrate(speed);
            } else {
                if (lastStateIsReverseMode === true) {
                    const tc = this.getDuration() - this.getCurrentTime();
                    this.mse.switchToMainSrc().then(() => {
                        this.setCurrentTime((Math.max(0, tc)));
                        this.mediaElement.playbackRate = speed;
                        this.switched = false;
                    });
                } else {
                    this.setPositivePlaybackrate(speed);
                }
            }
            this._playbackRate = speed;
            this.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_CHANGE, speed);
        }
    }

    // Change src if negative playbackrate
    private setNegativePlaybackrate(speed: number) {
        const currentTime = this.getCurrentTime();
        if (this.switched === false) {
            if (this.mse.getBackwardsSrc()) {
                this.mse.switchToBackwardsSrc().then(() => {
                    if (this.mediaElement) {
                        this.mediaElement.playbackRate = Math.abs(speed);
                    }
                });
            } else {
                this.setRewindInterval(speed, currentTime);
            }
        } else {
            if (this.mediaElement) {
                this.mediaElement.playbackRate = Math.abs(speed);
            }
            this.switched = true;
        }

    }

    // Rewind by interval if backwardSrc is not configured
    private setRewindInterval(speed: number, currentTime: number) {
        clearInterval(this.intervalRewind);
        this.intervalRewind = setInterval(() => {
            // this.mediaElement.playbackRate = 1;
            if (currentTime === 0) {
                clearInterval(this.intervalRewind);
                speed = 1;
                this.pause();
            } else {
                currentTime += speed;
                this.setCurrentTime(currentTime);
            }
        }, 30);
    }

    private setPositivePlaybackrate(speed: number) {
        if (this.mediaElement) {
            this.mediaElement.playbackRate = Math.abs(speed);
            if (speed === 1) {
                this.mse.setMaxBufferLengthConfig(this.defaultBufferSize);
            }
        }
    }

    /**
     * Return true if media is paused
     * @return boolean true is paused
     */
    isPaused(): boolean {
        const force = this.force;
        if (force) {
            return false;
        } else {
            return this.mediaElement ? this.mediaElement.paused : false;
        }
    }

    /**
     * In charge to move next number of frame
     * @param nbFrames number of frame
     */
    moveNextFrame(nbFrames = 1) {
        this.setCurrentTime(Math.max(0, this.getCurrentTime() + ((1 / this.framerate) * nbFrames)));
    }

    /**
     * In charge to move prev number of frame
     * @param nbFrames number of frame
     */
    movePrevFrame(nbFrames = 1) {
        this.setCurrentTime(Math.max(0, this.getCurrentTime() - ((1 / this.framerate) * nbFrames)));
    }

    /**
     * Return media duration with tc offset
     * @return return duration
     */
    getDuration(): number {
        return this.mediaElement.duration;
    }

    /**
     * Set current time to the beginning of the file
     * @method seekToBegin
     * @return number current time
     */
    seekToBegin(): void {
        this.setCurrentTime(0);
    }

    /**
     * Set current time to the end of the file
     * @return number current time
     */
    seekToEnd(): void {
        this.setCurrentTime(this.getDuration());
    }

    /**
     * Return true if is mute
     * @method isMute
     * @event ina.player.PlayerEventType.UN_MUTE
     */
    isMute(): boolean {
        return this.getVolume() === 0;
    }

    /**
     * Return player instance
     */
    muteUnmute() {
        if (this.isMute()) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * In charge to capture image
     * @return image base 64
     */
    captureImage(scale: number): string {
        const image = this.getCurrentImage(scale);
        if (image) {
            this.eventEmitter.emit(PlayerEventType.IMAGE_CAPTURE, image);
        }
        return image;
    }

    /**
     * Play if paused, if paused play
     */
    playPause() {
        if (this.isPaused()) {
            this.play().then(() => this.logger.debug('Played'));
        } else {
            this.pause();
        }
    }

    /**
     * In charge to init player events
     */
    private initPlayerEvents() {
        this.mediaElement.addEventListener('loadstart', this.handleLoadstart);
        this.mediaElement.addEventListener('playing', this.handlePlay);
        this.mediaElement.addEventListener('pause', this.handlePause);
        this.mediaElement.addEventListener('ended', this.handleEnd);
        this.mediaElement.addEventListener('durationchange', this.handleDurationchange);
        this.mediaElement.addEventListener('timeupdate', this.handleTimeupdate);
        this.mediaElement.addEventListener('volumechange', this.handleVolumeChange);
        this.mediaElement.addEventListener('seeked', this.handleSeeked);
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('resizeend', this.handleResize);
        this.mediaElement.addEventListener('waiting', this.handleWaiting);
        this.mediaElement.addEventListener('suspend', this.handleWaiting);
        document.addEventListener('fullscreenchange ', this.handleFullscreenChange);
        this.eventEmitter.on(PlayerEventType.PLAYER_SIMULATE_PLAY, this.simulatePlay);
    }

    /**
     * Simulate play on playback change by images
     */
    @AutoBind
    private simulatePlay(event) {
        this.force = event;
    }

    /**
     * Invoked when first frame of the media has finished loading.
     */
    @AutoBind
    private handleLoadstart() {
        if (!this.initialized) {
            this.logger.debug('onLoadstart');
            this.eventEmitter.emit(PlayerEventType.INIT);
            this.logger.info(PlayerEventType.INIT);
            this.mediaElement.removeEventListener('loadstart', this.handleLoadstart);
            this.initialized = true;
        }
    }

    /**
     * Invoked when Playback has begun.
     */
    @AutoBind
    private handlePlay() {
        this.eventEmitter.emit(PlayerEventType.PLAYING);
    }

    /**
     * Invoked when Playback has been paused.
     */
    @AutoBind
    private handlePause() {
        this.logger.debug('handlePause');
        this.eventEmitter.emit(PlayerEventType.PAUSED);
        this.getPlaybackRate();
    }

    /**
     * Invoked when playback has stopped because the end of the media was reached.
     */
    @AutoBind
    private handleEnd() {
        this.logger.debug('handleEnd');
        this.eventEmitter.emit(PlayerEventType.ENDED);
    }

    /**
     * Invoked when the duration attribute has been updated.
     */
    @AutoBind
    private handleDurationchange() {
        this.logger.debug('handleDurationchange');
        this.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
    }

    /**
     * The time indicated by the currentTime attribute has been updated.
     */
    @AutoBind
    private handleTimeupdate() {
        this.logger.debug('handleTimeupdate');
        this.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
    }

    /**
     * Invoked when a seek operation completed.
     */
    @AutoBind
    private handleSeeked() {
        this.logger.debug('handleSeeked');
        this.eventEmitter.emit(PlayerEventType.SEEKED);
    }

    /**
     * Invoked when the volume has changed.
     */
    @AutoBind
    private handleVolumeChange() {
        this.logger.debug('handleVolumeChange');
        this.eventEmitter.emit(PlayerEventType.VOLUME_CHANGE);
    }


    /**
     * Invoked when the fullscreen state changed.
     */
    @AutoBind
    private handleFullscreenChange() {
        this.logger.debug('handleFullscreenChange');
        this.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
    }


    /**
     * Invoked when  The volume has changed.
     */
    @AutoBind
    private handleWaiting() {
        this.logger.debug('handleWaiting');
    }

    /**
     * Invoked when player resized
     */
    @AutoBind
    private handleResize() {
        this.logger.debug('Player resized !');
        this.eventEmitter.emit(PlayerEventType.PLAYER_RESIZED);
    }

    /**
     * Return current image
     * @param scale max 1=> 100%
     */
    private getCurrentImage(scale: number) {
        try {
            const videoContent = this.mediaElement;
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            scale = (scale) ? Math.min(1, scale) : 1;
            canvas.width = videoContent.videoWidth * scale;
            canvas.height = videoContent.videoHeight * scale;
            canvas.getContext('2d').drawImage(videoContent, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/png');
        } catch (error) {
            this.logger.warn('Error to create image capture', error.stack);
        }
        return null;
    }

    /**
     * In charge to init audio chanel merger
     */
    public initAudioChannelMerger(data: any) {
        if (this.audioContext == null) {
            this.logger.info('initAudioChannelMerger');
            this.audioContext = new AudioContext();
            this.mediaElement.crossOrigin = 'anonymous';
            this.setupAudioNodes(data);
        }
    }

    /**
     * Set Audio Nodes
     */
    private setupAudioNodes(data: any) {
        const source = this.audioContext.createMediaElementSource(this.mediaElement);
        this.panLeft = this.audioContext.createGain();
        this.panRight = this.audioContext.createGain();
        this.audioContextSplitter = this.audioContext.createChannelSplitter(2);
        // Connect the source to the splitter
        source.connect(this.audioContextSplitter, 0, 0);
        // Connect splitter outputs to each Gain Nodes
        this.audioContextSplitter.connect(this.panLeft, 0);
        this.audioContextSplitter.connect(this.panRight, 1);
        const channelMergerNode = data?.channelMergerNode || null;
        const channelMerger = data?.channelMergeVolume || false;
        if (channelMergerNode !== null) {
            this.logger.info(`Enable channelMergerNode: ${channelMergerNode}`);
            this.stereoNode = this.audioContext.createPanner();
            this.stereoNode.coneOuterGain = 1;
            this.stereoNode.coneOuterAngle = 180;
            this.stereoNode.coneInnerAngle = 0;
            if (channelMergerNode === 'l') {
                this.stereoNode.positionX.setValueAtTime(-1, this.audioContext.currentTime);
            } else if (channelMergerNode === 'r') {
                this.stereoNode.positionX.setValueAtTime(1, this.audioContext.currentTime);
            }
            this.panLeft.connect(this.stereoNode);
            this.panRight.connect(this.stereoNode);
            this.stereoNode.connect(this.audioContext.destination);
        } else {
            if (channelMerger === true) {
                this.logger.info(`Enable channelMerger mono`);
                // Connect Left and Right Nodes to the output
                // Assuming stereo as initial status
                this.panLeft.connect(this.audioContext.destination, 0);
                this.panRight.connect(this.audioContext.destination, 0);
            } else if (channelMergerNode === null) {
                this.logger.info(`Enable channelMerger stereo`);
                // Create a merger node, to get both signals back together
                const merger = this.audioContext.createChannelMerger(2);
                // Connect both channels to the Merger
                this.panLeft.connect(merger, 0, 0);
                this.panRight.connect(merger, 0, 1);
                // Connect the Merger Node to the final audio destination
                merger.connect(this.audioContext.destination);
            }
        }
    }


}
