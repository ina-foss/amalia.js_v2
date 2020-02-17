/**
 * Logger data for a logger message.
 */
export interface LoggerData {

    /**
     * Message to log.
     */
    msg: string;

    /**
     * Optional additional data, by default JSON.stringify(..) is used to log it in addition to the message.
     */
    data?: any;
}
