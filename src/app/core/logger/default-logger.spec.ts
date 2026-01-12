import {waitForAsync, getTestBed, TestBed} from '@angular/core/testing';
import {DefaultLogger} from './default-logger';
import {LoggerLevel} from './logger-level';
import {AmaliaException} from '../exception/amalia-exception';


describe('Test Logger', () => {
    let injector: TestBed;
    const logger = new DefaultLogger('root', true, LoggerLevel.Trace);
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
    }));

    it('Default loader', () => {
        console.log = jasmine.createSpy('log');
        // tslint:disable-next-line:no-console
        console.debug = jasmine.createSpy('debug');
        // tslint:disable-next-line:no-console
        console.info = jasmine.createSpy('info');
        // tslint:disable-next-line:no-console
        console.warn = jasmine.createSpy('warn');
        // tslint:disable-next-line:no-console
        console.error = jasmine.createSpy('error');
        const data = {log: 'test'};

        let msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Trace)}] - Test`;
        logger.trace('Test', data);
        expect(console.log).toHaveBeenCalledWith(msg, data);

        msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Debug)}] - Test`;
        logger.debug('Test', data);
        // tslint:disable-next-line:no-console
        expect(console.debug).toHaveBeenCalledWith(msg, data);

        msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Info)}] - Test`;
        logger.info('Test', data);
        // tslint:disable-next-line:no-console
        expect(console.info).toHaveBeenCalledWith(msg, data);

        msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Warn)}] - Test`;
        logger.warn('Test', data);
        expect(console.warn).toHaveBeenCalledWith(msg, data);

        msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Error)}] - Test`;
        logger.error('Test', data);
        expect(console.error).toHaveBeenCalledWith(msg, data);

        msg = `[root]-[${LoggerLevel.valToString(LoggerLevel.Fatal)}] - Test`;
        logger.fatal('Test', data);

    });

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
        expect(() => LoggerLevel.valToString(null)).toThrow(new AmaliaException('Argument must be set'));

        expect(LoggerLevel.fromString('trace')).toEqual(LoggerLevel.Trace);
        expect(LoggerLevel.fromString('debug')).toEqual(LoggerLevel.Debug);
        expect(LoggerLevel.fromString('info')).toEqual(LoggerLevel.Info);
        expect(LoggerLevel.fromString('warn')).toEqual(LoggerLevel.Warn);
        expect(LoggerLevel.fromString('error')).toEqual(LoggerLevel.Error);
        expect(LoggerLevel.fromString('fatal')).toEqual(LoggerLevel.Fatal);
        expect(() => LoggerLevel.fromString(null)).toThrow(new AmaliaException('Argument must be set'));
        expect(() => LoggerLevel.fromString('test')).toThrow(new AmaliaException('Unsupported value for conversion: test'));
    });
});
