import {async, getTestBed, TestBed} from '@angular/core/testing';
import {DefaultLogger} from '../logger/default-logger';
import {LoggerInterface} from '../logger/logger-interface';
import {PlayerEventType} from './event-type';


describe('Test Event', () => {
    let injector: TestBed;
    const logger: LoggerInterface = new DefaultLogger();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    it('Test player event type', () => {
        expect(PlayerEventType.INIT).toContain('ina.player.INIT');
        expect(PlayerEventType.STARTED).toContain('ina.player.STARTED');
        expect(PlayerEventType.CAST_PLAYING).toContain('ina.player.CAST_PLAYING');
        expect(PlayerEventType.CAST_PAUSED).toContain('ina.player.CAST_PAUSED');
        expect(PlayerEventType.PLAYING).toContain('ina.player.PLAYING');
        expect(PlayerEventType.PAUSED).toContain('ina.player.PAUSED');
        expect(PlayerEventType.ENDED).toContain('ina.player.ENDED');
        expect(PlayerEventType.MUTE).toContain('ina.player.MUTE');
        expect(PlayerEventType.UN_MUTE).toContain('ina.player.UN_MUTE');
        expect(PlayerEventType.VOLUME_CHANGE).toContain('ina.player.VOLUME_CHANGE');
        expect(PlayerEventType.TIME_CHANGE).toContain('ina.player.TIME_CHANGE');
        expect(PlayerEventType.DURATION_CHANGE).toContain('ina.player.DURATION_CHANGE');
        expect(PlayerEventType.FULLSCREEN_STATE_CHANGE).toContain('ina.player.FULLSCREEN_STATE_CHANGE');
        expect(PlayerEventType.SEEKING).toContain('ina.player.SEEKING');
        expect(PlayerEventType.SEEKED).toContain('ina.player.SEEKED');
        expect(PlayerEventType.ERROR).toContain('ina.player.ERROR');
        expect(PlayerEventType.PLUGIN_ERROR).toContain('ina.player.PLUGIN_ERROR');
        expect(PlayerEventType.DATA_CHANGE).toContain('ina.player.DATA_CHANGE');
        expect(PlayerEventType.BEGIN_DATA_CHANGE).toContain('ina.player.BEGIN_DATA_CHANGE');
        expect(PlayerEventType.END_DATA_CHANGE).toContain('ina.player.END_DATA_CHANGE');
        expect(PlayerEventType.IMAGE_CAPTURE).toContain('ina.player.IMAGE_CAPTURE');
        expect(PlayerEventType.ZOOM_RANGE_CHANGE).toContain('ina.player.ZOOM_RANGE_CHANGE');
        expect(PlayerEventType.SELECTED_METADATA_CHANGE).toContain('ina.player.SELECTED_METADATA_CHANGE');
        expect(PlayerEventType.SELECTED_ITEMS_CHANGE).toContain('ina.player.SELECTED_ITEMS_CHANGE');
        expect(PlayerEventType.METADATA_LOADED).toContain('ina.player.METADATA_LOADED');
        expect(PlayerEventType.BIND_METADATA).toContain('ina.player.BIND_METADATA');
        expect(PlayerEventType.UNBIND_METADATA).toContain('ina.player.UNBIND_METADATA');
        expect(PlayerEventType.PLAYBACK_RATE_CHANGE).toContain('ina.player.PLAYBACK_RATE_CHANGE');
        expect(PlayerEventType.START_SEEKING).toContain('ina.player.START_SEEKING');
        expect(PlayerEventType.STOP_SEEKING).toContain('ina.player.STOP_SEEKING');
        expect(PlayerEventType.SEEKING).toContain('ina.player.SEEKING');
    });

});
