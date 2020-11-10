import { NixValueError } from '.';

/**
 * Class for representing an invalid value.
 * @class NixValueError
 */
export default class InvalidVersionError extends NixValueError {
    /**
     * Constructor for a value error.
     * @param {string} version The version given.
     */
    constructor(public version: string) {
        super('version', version, 'Please follow semantic versioning.');
    }
}
