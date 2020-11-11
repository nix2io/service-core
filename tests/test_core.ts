/*
 * File: test_core.ts
 * ----
 * Copyright: 2020 Nix² Technologies
 */
import { describe } from 'mocha';
import { strict } from 'assert';
import { step } from 'mocha-steps';

import { ServiceCore } from '../src';
import { WORKING_CONFIG } from './const_config';

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
});
