/*
 * File: ServiceCore.ts
 * Created: 11/11/2020 10:51:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { existsSync, readFileSync, lstatSync, readdirSync } from 'fs';
import { basename, join } from 'path';

import { safeLoad } from 'js-yaml';

import {
    ExecutionContext,
    Service,
    ConfigType,
    ServicePlugin,
    InvalidPluginError,
    ServiceType,
} from '..';
import { DeserializationError } from '../errors';

/**
 * Class for represent a service core.
 * @class ServiceCore
 */
export default class ServiceCore {
    public plugins: typeof ServicePlugin[] = [];
    public serviceTypes: typeof Service[] = [];

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
                    const plugin = pkg.getPlugin();
                    this.plugins.push(plugin);
                }
            },
        );
        this.refreshServiceTypes();
    }

    /**
     * Refresh the service types.
     * @function refreshServiceTypes
     * @memberof ServiceCore
     * @private
     * @returns {void}
     */
    private refreshServiceTypes(): void {
        for (const plugin of this.plugins) {
            const services = plugin.getServices();
            this.serviceTypes = this.serviceTypes.concat(services);
        }
    }

    /**
     * Returns the service class from its type.
     * @param   {string} type Service type name.
     * @returns {Service}     The service class, or null if it doesn't exist.
     */
    getServiceClassFromType(type: string): typeof Service | null {
        for (const serviceType of this.serviceTypes) {
            if (serviceType.NAME == type) return serviceType;
        }
        return null;
    }

    /**
     * Parse a Javascript object to return a `Service` instance.
     * @param   {string} executionContext Execution context.
     * @param   {Obj}    serviceObject    Javascript object of the service object.
     * @returns {Service}                 New `Service` instance.
     */
    deserializeServiceObject(
        executionContext: ExecutionContext,
        serviceObject: ServiceType,
    ): Service {
        const serviceClass = this.getServiceClassFromType(serviceObject.type);
        if (serviceClass == null)
            throw new DeserializationError(
                `'${serviceObject.type}' is not a valid service type`,
            );
        return serviceClass.deserialize(executionContext, serviceObject);
    }

    /**
     * Return the service object in the users current directory.
     * @param   {ExecutionContext} executionContext Execution context.
     * @returns {ServiceContext}                    New `Service` instance.
     */
    getService(executionContext: ExecutionContext): Service | null {
        if (!existsSync(executionContext.serviceFilePath)) return null;
        const content = readFileSync(executionContext.serviceFilePath, 'utf8');
        const data = safeLoad(content);
        return this.deserializeServiceObject(
            executionContext,
            <ServiceType>data,
        );
    }
}
