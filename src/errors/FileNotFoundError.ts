import { basename } from 'path';

import { NixServiceError } from '.';

/**
 * Class for representing a file not found error.
 * @class FileNotFoundError
 */
export default class FileNotFoundError extends NixServiceError {
    public file: string;

    /**
     * Constructor for a file not found error.
     * @param {string} filePath The file path it was looking for.
     */
    constructor(public filePath: string) {
        super('FileNotFound', filePath);
        this.file = basename(filePath);
    }
}
