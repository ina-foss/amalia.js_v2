/**
 * Loader interface
 */
export interface Loader<T> {
    load(params: any): Promise<T>;
}
