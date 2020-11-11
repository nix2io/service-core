import { join } from 'path';

import { ConfigType } from '../src';

export const WORKING_CONFIG: ConfigType = {
    pluginsDirectory: join(__dirname, './plugins/'),
};
