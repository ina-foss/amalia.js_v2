/**
 * Log level for a logger.
 */
import {AmaliaException} from '../exception/amalia-exception';

export enum LoggerLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Fatal
}

// tslint:disable-next-line:no-namespace
export namespace LoggerLevel {

    /**
     * Returns LogLevel based on string representation
     * @param val Value
     * @return Error is thrown if invalid.
     */
    export function fromString(val: string): LoggerLevel {
        if (val == null) {
            throw new AmaliaException('Argument must be set');
        }
        switch (val.toLowerCase()) {
            case 'trace':
                return LoggerLevel.Trace;
            case 'debug':
                return LoggerLevel.Debug;
            case 'info':
                return LoggerLevel.Info;
            case 'warn':
                return LoggerLevel.Warn;
            case 'error':
                return LoggerLevel.Error;
            case 'fatal':
                return LoggerLevel.Fatal;
            default:
                throw new AmaliaException('Unsupported value for conversion: ' + val);
        }
    }

    /**
     * Returns LogLevel based on string representation
     * @param val Value
     * @returns Error is thrown if invalid.
     */
    export function valToString(val: LoggerLevel): string {
        if (val == null) {
            throw new AmaliaException('Argument must be set');
        }
        switch (val) {
            case LoggerLevel.Trace:
                return 'trace';
            case LoggerLevel.Debug:
                return 'debug';
            case LoggerLevel.Info:
                return 'info';
            case LoggerLevel.Warn:
                return 'warn';
            case LoggerLevel.Error:
                return 'error';
            case LoggerLevel.Fatal:
                return 'fatal';
            default:
                throw new AmaliaException('Unsupported value for conversion: ' + val);
        }
    }

}
