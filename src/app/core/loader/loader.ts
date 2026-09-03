/**
 * Loader interface
 */
export interface Loader<T> {
    load(params: any, headers?: Array<string>): Promise<T>;
}
