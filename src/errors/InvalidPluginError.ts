import { NixValueError } from '.';

/**
 * Class for representing an invalid plugin.
 * @class NixValueError
 */
export default class InvalidPluginError extends NixValueError {
    /**
     * Constructor for an invalid plugin.
     * @param {string} packageName The invalid plugin package.
     */
    constructor(public packageName: string) {
        super(
            'plugin',
            packageName,
            'Please export a function called `getPlugin` that returns a `ServicePlugin`',
        );
    }
}
