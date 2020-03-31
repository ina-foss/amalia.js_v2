/**
 * Default Error logging strategy
 * log error to console
 */
export class DefaultErrorLoggingStrategy {
    static LOGGER_NAME = 'AMALIA';

    log(description: string, err: Error): Promise<any> {
        return new Promise((resolve) => {
            resolve(err);
        });
    }
}
