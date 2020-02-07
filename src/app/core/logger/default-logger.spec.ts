import {async, getTestBed, TestBed} from '@angular/core/testing';
import {DefaultLogger} from './default-logger';
import {LoggerLevel} from './logger-level';


describe('Test Logger', () => {
  let injector: TestBed;
  const logger = new DefaultLogger();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
    }).compileComponents();
    injector = getTestBed();
  }));


  it('Test log level', () => {
    expect(LoggerLevel.Trace).toEqual(0);
    expect(LoggerLevel.Debug).toEqual(1);
    expect(LoggerLevel.Info).toEqual(2);
    expect(LoggerLevel.Warn).toEqual(3);
    expect(LoggerLevel.Error).toEqual(4);
    expect(LoggerLevel.Fatal).toEqual(5);

    expect(LoggerLevel.valToString(LoggerLevel.Trace)).toEqual('trace');
    expect(LoggerLevel.valToString(LoggerLevel.Debug)).toEqual('debug');
    expect(LoggerLevel.valToString(LoggerLevel.Info)).toEqual('info');
    expect(LoggerLevel.valToString(LoggerLevel.Warn)).toEqual('warn');
    expect(LoggerLevel.valToString(LoggerLevel.Error)).toEqual('error');
    expect(LoggerLevel.valToString(LoggerLevel.Fatal)).toEqual('fatal');
    // expect(LoggerLevel.valToString(null)).toThrow(new AmaliaException("Argument must be set"));
    // expect(LoggerLevel.valToString(9)).toThrow(new AmaliaException("Unsupported value for conversion: 9."));

    expect(LoggerLevel.fromString('trace')).toEqual(LoggerLevel.Trace);
    expect(LoggerLevel.fromString('debug')).toEqual(LoggerLevel.Debug);
    expect(LoggerLevel.fromString('info')).toEqual(LoggerLevel.Info);
    expect(LoggerLevel.fromString('warn')).toEqual(LoggerLevel.Warn);
    expect(LoggerLevel.fromString('error')).toEqual(LoggerLevel.Error);
    expect(LoggerLevel.fromString('fatal')).toEqual(LoggerLevel.Fatal);
    // expect(LoggerLevel.fromString(null)).toThrow(new AmaliaException("Argument must be set"));
    // expect(LoggerLevel.fromString('test')).toThrow(new AmaliaException("Unsupported value for conversion: test."));
  });
});
