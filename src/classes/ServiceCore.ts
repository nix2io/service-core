/*
 * File: ServiceCore.ts
 * Created: 11/11/2020 10:51:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

// import { existsSync, readFileSync } from 'fs';
import { Service, ConfigType, ServicePlugin, PluginNotFoundError } from '..';

/**
 * Class for represent a service core.
 * @class ServiceCore
 */
export default class ServiceCore {
    private plugins: ServicePlugin[];

    /**
     * Constructor for the service core.
     * @param {ConfigType} config Service core configuration.
     */
    constructor(public config: ConfigType) {
        this.refreshPlugins();
    }

    /**
     * Refresh the plugins from the plugin names in the config.
     * @function refreshPlugins
     * @memberof ServiceCore
     * @private
     * @throws {PluginNotFoundError}
     * @returns {void}
     */
    private refreshPlugins(): void {
        if (!this.config.plugins) return;
        for (const pluginName of this.config.plugins) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const pkg = require(pluginName);

                console.log(pkg);
            } catch (err) {
                if (err.message.includes('Cannot find module')) {
                    throw new PluginNotFoundError(pluginName);
                }
                throw err;
            }
        }
    }

    /**
     * Returns the service class from its type.
     * @param   {string} type Service type name.
     * @returns {Service}     The servie class.
     */
    getServiceClassFromType(type: string): typeof Service {
        console.log(type);

        return Service;
    }
}
