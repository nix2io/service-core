/*
 * File: test_core.ts
 * ----
 * Copyright: 2020 Nix² Technologies
 */
import { ServiceCore } from '../src';
import { WORKING_CONFIG } from './const_config';
import { describe } from 'mocha';
import { step } from 'mocha-steps';
import { strict } from 'assert';

describe('Core', () => {
    let core: ServiceCore;
    step('Create a core', () => {
        core = new ServiceCore(WORKING_CONFIG);
    });
    step('Check plugin directory', () => {
        strict.strictEqual(
            core.config.pluginsDirectory,
            WORKING_CONFIG.pluginsDirectory,
        );
    });
    step('Check for typescript plugin', () => {
        strict.ok(
            core.plugins.map((plugin) => plugin.NAME).indexOf('typescript') !=
                -1,
        );
    });
    step('Get the typescript service', () => {
        const tsService = core.getServiceClassFromType('typescript');
        strict.ok(!!tsService);
    });
});
