import {LoggerInterface} from './logger-interface';
import {LoggerLevel} from './logger-level';
import {LoggerData} from './logger-data';
import {AmaliaException} from '../exception/amalia-exception';

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
      switch (level) {
        case LoggerLevel.Trace:
          // tslint:disable-next-line:no-console
          console.log(msg, log.data);
          break;
        case LoggerLevel.Debug:
          // tslint:disable-next-line:no-console
          console.debug(msg, log.data);
          break;
        case LoggerLevel.Info:
          // tslint:disable-next-line:no-console
          console.info(msg, log.data);
          break;
        case LoggerLevel.Warn:
          // tslint:disable-next-line:no-console
          console.warn(msg, log.data);
          break;
        case LoggerLevel.Error:
          // tslint:disable-next-line:no-console
          console.error(msg, log.data);
          break;
        case LoggerLevel.Fatal:
          // tslint:disable-next-line:no-console
          console.error(msg, log.data);
          break;
        default:
          throw new AmaliaException('Unsupported log level');
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
