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

  it('Test FormatTime', () => {
    const defaultFps = 25;
    const customFps = 60;
    expect(FormatUtils.formatTime(3600)).toContain('01:00:00:00');
    expect(FormatUtils.formatTime(3600 + 2700)).toContain('01:45:00:00');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (1 / defaultFps), defaultFps, 'f')).toContain('01:45:25:01');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (1 / defaultFps * 2), defaultFps, 'f')).toContain('01:45:25:02');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 10), defaultFps, 'f')).toContain('01:45:25:10');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 20), defaultFps, 'f')).toContain('01:45:25:20');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 23), defaultFps, 'f')).toContain('01:45:25:23');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 25), defaultFps, 'f')).toContain('01:45:26:00');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 50), defaultFps, 'f')).toContain('01:45:27:00');
    expect(FormatUtils.formatTime(3600 + 2700 + 25 + (0.04 * 51), defaultFps, 'f')).toContain('01:45:27:01');

    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps), customFps, 'f')).toContain('01:28:08:01');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 2), customFps, 'f')).toContain('01:28:08:02');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 10), customFps, 'f')).toContain('01:28:08:10');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 20), customFps, 'f')).toContain('01:28:08:20');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 23), customFps, 'f')).toContain('01:28:08:23');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 25), customFps, 'f')).toContain('01:28:08:25');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 50), customFps, 'f')).toContain('01:28:08:50');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 60), customFps, 'f')).toContain('01:28:09:00');
    expect(FormatUtils.formatTime(3600 + (28 * 60) + 8 + (1 / customFps * 61), customFps, 'f')).toContain('01:28:09:01');

    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps), customFps, 'f')).toContain('01:48:58:01');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 2), customFps, 'f')).toContain('01:48:58:02');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 10), customFps, 'f')).toContain('01:48:58:10');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 20), customFps, 'f')).toContain('01:48:58:20');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 23), customFps, 'f')).toContain('01:48:58:23');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 25), customFps, 'f')).toContain('01:48:58:25');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 50), customFps, 'f')).toContain('01:48:58:50');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 60), customFps, 'f')).toContain('01:48:59:00');
    expect(FormatUtils.formatTime(3600 + (48 * 60) + 58 + (1 / customFps * 61), customFps, 'f')).toContain('01:48:59:01');
  });

});
