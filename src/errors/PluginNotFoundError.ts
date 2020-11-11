import { NixServiceError } from '.';

/**
 * Class for representing a plugin not found error.
 * @class PluginNotFoundError
 */
export default class PluginNotFoundError extends NixServiceError {
    /**
     * Constructor for a file not found error.
     * @param {string} plugin The plugin that was not found.
     */
    constructor(public plugin: string) {
        super('PluginNotFound', plugin);
    }
}
