/**
 * Error logging strategy
 */
export interface ErrorLoggingStrategy {
    log(description: string, err: Error): Promise<any>;
}
