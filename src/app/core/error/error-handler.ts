import {ErrorLoggingStrategy} from './error-logging-strategy';

export class ErrorHandler {
  public static AMALIA_ERROR = 'AMALIA_ERROR';
  private loggingStrategy: ErrorLoggingStrategy;

  constructor(loggingStrategy: ErrorLoggingStrategy) {
    this.loggingStrategy = loggingStrategy;
  }

  handle(description: string, err: Error): Promise<any> {
    return this.loggingStrategy.log(description, err);
  }
}
