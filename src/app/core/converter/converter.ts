/**
 * Data converter
 */
export interface Converter<T> {
    convert(data: any): T;
}
