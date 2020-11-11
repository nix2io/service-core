/*
 * File: VersionManager.ts
 * Created: 11/07/2020 14:36:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */
import * as semver from 'semver';
import { Info, InvalidVersionError } from '..';
/**
 * Class for managing the service version.
 * @class VersionManager
 */
export default class VersionManager {
    /**
     * Constructor for the `VersionManager` class.
     * @param {Info} info Info object for the service.
     */
    constructor(private info: Info) {}

    /**
     * Get the version from the info.
     * @function version
     * @memberof VersionManager
     * @private
     * @returns {string} Version.
     */
    private get version(): string {
        return this.info.version;
    }

    /**
     * Increment the version of the service by a release type.
     * @function inc
     * @memberof VersionManager
     * @private
     * @example
     * // 'minor' upgrade
     * this.inc('minor'); // '1.0.2'
     * // 'major' upgrade
     * this.inc('major'); // '2.0.0'
     * @param   {string} release Semver upgrade type.
     * @returns {string}         The new version set.
     */
    private inc = (release: 'patch' | 'minor' | 'major'): string => {
        const version = semver.inc(this.version, release);
        if (version == null) throw new InvalidVersionError(release);
        return this.set(version);
    };

    /**
     * Patch upgrade.
     * @function patch
     * @memberof VersionManager
     * @returns {string} New version.
     */
    patch = (): string => this.inc('patch');

    /**
     * Minor upgrade.
     * @function patch
     * @memberof VersionManager
     * @returns {string} New version.
     */
    minor = (): string => this.inc('minor');

    /**
     * Major upgrade.
     * @function patch
     * @memberof VersionManager
     * @returns {string} New version.
     */
    major = (): string => this.inc('major');

    /**
     * Set the version to a specific version.
     * @function set
     * @memberof VersionManager
     * @param   {string} version New version.
     * @returns {string}         New version.
     */
    set(version: string): string {
        if (!semver.valid(version)) throw new InvalidVersionError(version);
        this.info.version = version;
        this.info.service?.postVersionBump();
        return version;
    }
}
