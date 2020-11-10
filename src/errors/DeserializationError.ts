import { NixServiceError } from '.';

/**
 * Class for representing an deserialzation error.
 * @class DeserializationError
 */
export default class DeserializationError extends NixServiceError {
    /**
     * Constructor for a value error.
     * @param {string} message Reason for the error.
     */
    constructor(public message: string) {
        super('DeserializationError', message);
    }
}
