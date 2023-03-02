/**
 * Logger interface
 */
export interface LoggerInterface {
    status():boolean;
    /**
     * Set log level
     */
    logLevel(level: string): void;

    /**
     * Set log state
     */
    state(state: boolean);

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    trace(msg: string, data?: any): void;

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    debug(msg: string, data?: any): void;

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    info(msg: string, data?: any): void;

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    warn(msg: string, data?: any): void;

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    error(msg: string, data?: any): void;

    /**
     * In charge to call Log with log type
     * @param msg message
     * @param data log data
     */
    fatal(msg: string, data?: any): void;

}
