import { NixServiceError } from '.';

/**
 * Class for representing an implementation error.
 * @class ImplementationError
 */
export default class ImplementationError extends NixServiceError {
    /**
     * Constructor for a value error.
     * @param {string} method Method not implemented.
     */
    constructor(public method: string) {
        super('ImplementationError', `'${method}' is not implemented`);
    }
}
