import { NixServiceError } from '.';

/**
 * Class for representing an invalid value.
 * @class NixValueError
 */
export default class NixValueError extends NixServiceError {
    /**
     * Constructor for a value error.
     * @param {string} valueName Name of the invalid value.
     * @param {string} value     The given value.
     * @param {string} details   Details about the invalid error.
     */
    constructor(
        public valueName: string,
        public value: string,
        public details = '',
    ) {
        super(
            'ValueError',
            `'${value}' is an invalid ${valueName}${
                details != '' ? `, ${details}` : ''
            }`,
        );
    }
}
