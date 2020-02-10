import {LoggerInterface} from './logger-interface';
import {LoggerLevel} from './logger-level';
import {LoggerData} from './logger-data';

/**
 * In charge to outputs a message to the web console
 */
export class DefaultLogger implements LoggerInterface {

  /**
   * Outputs the message to the web console
   * @param level log level
   * @param log log message
   */
  private static log(level: LoggerLevel, log: LoggerData): void {
    if (console) {
      const msg = `[${LoggerLevel.valToString(level)}] - ${log.msg}`;
      let logConsole = null;
      switch (level) {
        case LoggerLevel.Trace:
          // tslint:disable-next-line:no-console
          logConsole = console.log;
          break;
        case LoggerLevel.Debug:
          // tslint:disable-next-line:no-console
          logConsole = console.debug;
          break;
        case LoggerLevel.Info:
          // tslint:disable-next-line:no-console
          logConsole = console.info;
          break;
        case LoggerLevel.Warn:
          // tslint:disable-next-line:no-console
          logConsole = console.warn;
          break;
        case LoggerLevel.Error:
          // tslint:disable-next-line:no-console
          logConsole = console.error;
          break;
        case LoggerLevel.Fatal:
          // tslint:disable-next-line:no-console
          logConsole = console.error;
          break;
      }

      if (logConsole && log) {
        if (log.data) {
          logConsole(msg, log.data);
        } else {
          logConsole(msg);
        }
      }
    }
  }

  debug(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Debug, {msg, data});
  }

  error(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Error, {msg, data});
  }

  fatal(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Fatal, {msg, data});
  }

  info(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Info, {msg, data});
  }


  trace(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Trace, {msg, data});
  }

  warn(msg: string, data?: any): void {
    DefaultLogger.log(LoggerLevel.Warn, {msg, data});
  }

}
