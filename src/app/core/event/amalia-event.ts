/**
 * In charge to handle Amalia event base class
 */
export class AmaliaEvent<T> extends Event {
    private data: T;

    constructor(type: string, eventInitDict: EventInit, data: T) {
        super(type, eventInitDict);
        this.data = data;
    }
}
