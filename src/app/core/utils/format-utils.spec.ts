import {async, getTestBed, TestBed} from '@angular/core/testing';
import {FormatUtils} from './format-utils';


describe('Test Format utils', () => {
    let injector: TestBed;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    it('Test FormatTime test default', () => {
        expect(FormatUtils.formatTime(3600)).toContain('01:00:00');
        expect(FormatUtils.formatTime(3600 + 2700 + 1.21)).toContain('01:45:01');
    });
    it('Test FormatTime test hour', () => {
        expect(FormatUtils.formatTime(3600 + 2700, 'h')).toContain('01');
        expect(FormatUtils.formatTime(3600 * 2 + 2700, 'h')).toContain('02');
    });

    it('Test FormatTime test minutes', () => {
        expect(FormatUtils.formatTime(3600, 'm')).toContain('01:00');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.21, 'm')).toContain('02:45');
    });

    it('Test FormatTime test seconds', () => {
        expect(FormatUtils.formatTime(3600, 's')).toContain('01:00:00');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.21, 's')).toContain('02:45:01');
    });

    it('Test FormatTime test seconds in unit', () => {
        expect(FormatUtils.formatTime(3600, 'seconds')).toContain('36000.0000');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.21, 'seconds')).toContain('99001.2100');
    });

    it('Test FormatTime test ms', () => {
        expect(FormatUtils.formatTime(3600, 'mms')).toContain('01:00:00');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.212121, 'mms')).toContain('02:45:01.21');
    });

    it('Test FormatTime test mms', () => {
        expect(FormatUtils.formatTime(3600, 'mms')).toContain('01:00:00');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.212121, 'mms')).toContain('02:45:01.2121');
    });

    it('Test FormatTime test ms', () => {
        expect(FormatUtils.formatTime(3600, 'ms')).toContain('01:00:00');
        expect(FormatUtils.formatTime(3600 * 2 + 2700 + 1.212121, 'ms')).toContain('02:45:01.21');
    });

    it('Test FormatTime test frames', () => {
        const defaultFps = 25;
        const customFps = 60;
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (1 / defaultFps), 'f', defaultFps)).toContain('01:45:25:01');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (1 / defaultFps * 2), 'f', defaultFps)).toContain('01:45:25:02');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 10), 'f', defaultFps)).toContain('01:45:25:10');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 20), 'f', defaultFps)).toContain('01:45:25:20');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 23), 'f', defaultFps)).toContain('01:45:25:23');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 25), 'f', defaultFps)).toContain('01:45:26:00');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 50), 'f', defaultFps)).toContain('01:45:27:00');
        expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 51), 'f', defaultFps)).toContain('01:45:27:01');

        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps), 'f', customFps)).toContain('01:28:08:01');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 2), 'f', customFps)).toContain('01:28:08:02');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 10), 'f', customFps)).toContain('01:28:08:10');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 20), 'f', customFps)).toContain('01:28:08:20');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 23), 'f', customFps)).toContain('01:28:08:23');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 25), 'f', customFps)).toContain('01:28:08:25');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 50), 'f', customFps)).toContain('01:28:08:50');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 60), 'f', customFps)).toContain('01:28:09:00');
        expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 61), 'f', customFps)).toContain('01:28:09:01');

        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps), 'f', customFps)).toContain('01:48:58:01');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 2), 'f', customFps)).toContain('01:48:58:02');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 10), 'f', customFps)).toContain('01:48:58:10');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 20), 'f', customFps)).toContain('01:48:58:20');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 23), 'f', customFps)).toContain('01:48:58:23');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 25), 'f', customFps)).toContain('01:48:58:25');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 50), 'f', customFps)).toContain('01:48:58:50');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 60), 'f', customFps)).toContain('01:48:59:00');
        expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 61), 'f', customFps)).toContain('01:48:59:01');
    });
    it('Test Format string', () => {
        expect(FormatUtils.formatString('{0} is {1} {2}', 'This', 'formatting', 'hack')).toContain('This is formatting hack');
    });


});
