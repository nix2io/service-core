/*
 * File: Service.ts
 * Created: 10/11/2020 13:03:39
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import fs = require('fs');
import { dirname, join } from 'path';

import Axios from 'axios';
import * as yaml from 'js-yaml';

import {
    Info,
    Schema,
    ServiceType,
    MakeObjectType,
    User,
    ExecutionContext,
    ImplementationError,
} from '..';
import { EDITOR_TYPES, GIT_IGNORE_SERVICE_BASE_URL } from '../constants';

/**
 * Abstract class to represent a service.
 * @class Service
 * @abstract
 */
export default abstract class Service {
    static NAME: string;
    static DIRNAME: string = __dirname;
    public selectedEnvironmentName: string;

    /**
     * Constructor for the `Service`.
     * @param {ExecutionContext} context Context of the code execution.
     * @param {Info}             info    Info of the service.
     * @param {string}           type    Type of service.
     * @param {Array<Schema>}    schemas List of service schemas.
     */
    constructor(
        protected context: ExecutionContext,
        public info: Info,
        public type: string,
        public schemas: Schema[],
    ) {
        this.info.service = this;
    }

    /**
     * Returns the service directory.
     * @memberof Service
     * @protected
     * @returns {string} Path to the directory.
     */
    get serviceDirectory(): string {
        return dirname(this.context.serviceFilePath);
    }

    /**
     * Make a `Service` object.
     * @static
     * @param {MakeObjectType} data Data for the `Service` object.
     * @param {User}           user User instance.
     * @returns {ServiceType} New `Service` object.
     */
    static makeObject(data: MakeObjectType, user: User | null): ServiceType {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        const serviceObject: ServiceType = {
            info: {
                identifier: data.identifier,
                label: data.label,
                description: data.description,
                version: '1.0.0',
                authors: [],
                created: currentTimestamp,
                modified: currentTimestamp,
                license: 'CC-BY-1.0',
                termsOfServiceURL: 'nix2.io/tos',
            },
            schemas: [],
            type: 'app',
        };
        if (data.userLeadDev && user != null) {
            serviceObject.info.authors.push({
                email: user.email,
                name: user.name,
                publicEmail: null,
                url: null,
                alert: '*',
                flags: ['leadDev'],
            });
        }
        return serviceObject;
    }

    /**
     * Deserialize an object into an `Service` instance.
     * @function deserialize
     * @static
     * @abstract
     * @memberof Service
     * @param   {string} _  Use: `executionContext`: Path to the service.yaml.
     * @param   {object} __ Use: `data`: Javascript object of the `Info`.
     * @returns {Service}   Service context object.
     */
    static deserialize(_: ExecutionContext, __: ServiceType): Service {
        throw new ImplementationError('deserialize');
    }

    /**
     * Serialize a Service instance into an object.
     * @function serialize
     * @memberof Service
     * @returns  {ServiceType} Javascript object.
     */
    serialize(): ServiceType {
        return {
            info: this.info.serialize(),
            type: this.type,
            schemas: this.schemas.map((s) => s.serialize()),
        };
    }

    /**
     * Writes the current Service from memory to disk.
     * @function write
     * @memberof Service
     * @returns  {boolean} `true` if successfull.
     */
    write(): boolean {
        fs.writeFileSync(
            this.context.serviceFilePath,
            yaml.safeDump(this.serialize()),
        );
        return true;
    }

    /**
     * Get a schema based on the `identifier`.
     * @function getSchema
     * @memberof Service
     * @param   {string} identifier Identifier of the `Schema` to get.
     * @returns {Schema}            `Schema` to return.
     */
    getSchema(identifier: string): Schema | null {
        const match = this.schemas.filter((s) => s.identifier == identifier);
        if (match.length == 0) return null;
        return match[0];
    }

    /**
     * Adds a `Schema` based off a `Schema` object.
     * @function addSchema
     * @memberof Service
     * @param   {Schema} schema `Schema` to add.
     * @returns {Schema}        The given `Schema`.
     */
    addSchema(schema: Schema): Schema {
        if (this.getSchema(schema.identifier) != null)
            throw new Error('Schema with the same identifier already exists');
        this.schemas.push(schema);
        return schema;
    }

    /**
     * Removes a `Schema` from it's `identifier`.
     * @function removeSchema
     * @memberof Service
     * @param    {string} identifier `identifier` of the `Schema` to remove.
     * @returns  {boolean}           `true` if the `Schema` was removed.
     */
    removeSchema(identifier: string): boolean {
        const schema = this.getSchema(identifier);
        if (schema == null) return false;
        this.schemas.splice(this.schemas.indexOf(schema), 1);
        return true;
    }

    /**
     * Read the contents of the template file.
     * @function readTemplate
     * @memberof Service
     * @example
     * // Returns the file content for main.py
     * serviceContext.getTemplate('ServiceType', 'main.py') // app.run('0.0.0.0', port=80)
     * @param   {string} scope    Scope of the service.
     * @param   {string} fileName Template name.
     * @returns {string}          Template contents.
     */
    readTemplate(scope: string, fileName: string): string {
        const templatePath = join(
            __dirname,
            `services/${scope}/templates/`,
            `${fileName}.template`,
        );
        return fs.readFileSync(templatePath, 'utf-8');
    }

    /**
     * Make the lines for the README file.
     * @function getREADMELines
     * @memberof Service
     * @returns {string[]} Array of lines for the README.
     */
    makeREADMELines(): string[] {
        return [
            '<p align="center"><img height="220px" src="https://i.imgur.com/48BeKfE.png" alt="Logo" /><p>\n',
            `<p align="center">\n\t<strong>${this.info.label}</strong><br />\n\t<sub>${this.info.description}</sub>\n</p>`,
        ];
    }

    /**
     * Create the README.md file.
     * @function createREADME
     * @memberof Service
     * @returns {void}
     */
    createREADME(): void {
        const READMEContent = this.makeREADMELines().join('\n');
        fs.writeFileSync(
            join(this.serviceDirectory, 'README.md'),
            READMEContent,
        );
    }

    /**
     * Makes the lines for file headers.
     * @function getFileHeaderLines
     * @memberof Service
     * @example
     * // Example: returns file header for main.py
     * serviceContext.getFileHeaderLines('main.py') // ['File: main.py', ...]
     * @param   {string}   fileName Name of the file.
     * @returns {string[]}          Lines for file headers.
     */
    makeFileHeaderLines(fileName: string): string[] {
        const lines = [
            `File: ${fileName}`,
            `Created: ${new Date().toISOString()}`,
            '----',
            'Copyright: 2020 Nix² Technologies',
        ];
        if (this.context.user != null) {
            lines.push(
                `Author: ${this.context.user.name} (${this.context.user.email})`,
            );
        }
        return lines;
    }

    /**
     * Make the ingore components to get sent to the ignore generation service.
     * @function makeIgnoreComponents
     * @memberof Service
     * @returns {string[]} Ignore components.
     */
    makeIgnoreComponents(): string[] {
        return ['git'].concat(EDITOR_TYPES);
    }

    /**
     * Create the .gitignore file.
     * @function createGitIgnore
     * @memberof Service
     * @returns {void}
     */
    async createGitIgnore(): Promise<void> {
        const ignoreComponents = this.makeIgnoreComponents();
        const url = GIT_IGNORE_SERVICE_BASE_URL + ignoreComponents.join(',');
        await Axios.get(url)
            .then((response) => {
                const ignoreContent = response.data;
                fs.writeFileSync(
                    join(this.serviceDirectory, '.gitignore'),
                    ignoreContent,
                );
            })
            .catch((err) => {
                console.error('could not create .gitignore');
                throw err;
            });
    }

    /**
     * Creates ignore files.
     * @function createIgnoreFiles
     * @memberof Service
     * @returns {void}
     */
    createIgnoreFiles(): void {
        this.createGitIgnore();
    }

    /**
     * Event listener for after an initialization.
     * @function postInit
     * @memberof Service
     * @returns {void}
     */
    postInit(): void {
        this.createREADME();
        this.createIgnoreFiles();
    }

    /**
     * Event listener for after a version bump.
     * @function postVersionBump
     * @memberof Service
     * @returns {void}
     */
    postVersionBump(): void {
        return;
    }
}
