import { Service, MakeFileType } from '..';

/**
 * Class to represent a plugin.
 * @class ServicePlugin
 */
export default abstract class ServicePlugin {
    static NAME = '';
    static LABEL = '';

    /**
     * Return the services for the plugin.
     * @function getServices
     * @memberof ServicePlugin
     * @static
     * @returns {typeof Service[]} List of services.
     */
    static getServices(): typeof Service[] {
        return [];
    }

    /**
     * Return the files that can be created with the `make` command in the CLI.
     * @function getMakeFiles
     * @memberof ServicePlugin
     * @static
     * @returns {MakeFileType[]} List of make files.
     */
    static getMakeFiles(): MakeFileType[] {
        return [
            {
                name: 'readme',
                file: 'README.md',
                method: Service.prototype.createREADME,
            },
            {
                name: 'gitignore',
                file: '.gitignore',
                method: Service.prototype.createGitIgnore,
            },
        ];
    }
}
