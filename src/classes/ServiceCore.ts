/*
 * File: ServiceCore.ts
 * Created: 11/11/2020 10:51:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

// import { existsSync, readFileSync } from 'fs';
import { lstatSync, readdirSync } from 'fs';
import { basename, join } from 'path';
import { Service, ConfigType, ServicePlugin } from '..';
import { InvalidPluginError } from '../errors';

/**
 * Class for represent a service core.
 * @class ServiceCore
 */
export default class ServiceCore {
    public plugins: ServicePlugin[];

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
        if (this.config.pluginsDirectory == undefined) return;
        readdirSync(this.config.pluginsDirectory).forEach(
            (file: string, _: unknown) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const directoryPath = join(this.config.pluginsDirectory!, file);
                if (lstatSync(directoryPath).isDirectory()) {
                    const pkg = require.main?.require(
                        join(directoryPath, '/src/'),
                    );
                    if (typeof pkg.getPlugin != 'function')
                        throw new InvalidPluginError(basename(directoryPath));
                    const plugin = pkg.getplugin();
                    if (!(plugin instanceof ServicePlugin))
                        throw new InvalidPluginError(basename(directoryPath));
                    this.plugins.push(plugin);
                }
            },
        );
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
