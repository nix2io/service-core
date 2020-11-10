/**
 * Base class for a Nix Service Error.
 * @class NixServiceError
 * @abstract
 */
export default abstract class NixServiceError extends Error {
    /**
     * Constructor for a Nix Service Error.
     * @param {string} name    Name of the Error.
     * @param {string} message Error message.
     */
    constructor(name: string, message: string) {
        super(`${name}: ${message}`);
    }
}
