import { Service } from '..';

/**
 * Class to represent a plugin.
 * @class ServicePlugin
 */
export default abstract class ServicePlugin {
    static NAME = '';
    static LABEL = '';

    /**
     * Return the services for the plugin.
     * @static
     * @returns {typeof Service[]} List of services.
     */
    static getServices(): typeof Service[] {
        return [];
    }
}
