/**
 * In charge to handle amalia exception
 */
export class AmaliaException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
