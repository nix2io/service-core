import { auto as normalizeEOL } from 'eol';
import { EOL } from 'os';
import * as escapeStringRegexp from 'escape-string-regexp';

export const titleCase = (str: string): string =>
    str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

const breakPattern = /\n/g;
const breakReplacement = '\\n';
const flags = 'gm';
const groupPattern = /\$/g;
const groupReplacement = '$$$';
const h = '[^\\S\\r\\n]'; // simulate `\h`
const returnPattern = /\r/g;
const returnReplacement = '\\r';

/**
 * Edit a .env file.
 * This code was taken from https://github.com/stevenvachon/edit-dotenv
 * and converted to Typescript by myself.
 *
 * @param   {string}                 environmentContent Content of the .env file.
 * @param   {Record<string, string>} changes            An object of changes to the file.
 * @returns {string}                                    New .env file.
 */
export const editDotEnv = (
    environmentContent: string,
    changes: Record<string, string>,
): string => {
    let hasAppended = false;

    return Object.keys(changes).reduce((result, varname) => {
        const value = changes[varname]
            .replace(breakPattern, breakReplacement)
            .replace(returnPattern, returnReplacement)
            .trim();

        const safeName = escapeStringRegexp(varname);

        const varPattern = new RegExp(
            `^(${h}*${safeName}${h}*=${h}*)\\S*(${h}*)$`,
            flags,
        );

        if (varPattern.test(result)) {
            const safeValue = value.replace(groupPattern, groupReplacement);

            return result.replace(varPattern, `$1${safeValue}$2`);
        } else if (result === '') {
            hasAppended = true;

            return `${varname}=${value}${EOL}`;
        } else if (!result.endsWith(EOL) && !hasAppended) {
            hasAppended = true;

            // Add an extra break between previously defined and newly appended variable
            return `${result}${EOL}${EOL}${varname}=${value}`;
        } else if (!result.endsWith(EOL)) {
            // Add break for appended variable
            return `${result}${EOL}${varname}=${value}`;
        } else if (result.endsWith(EOL) && !hasAppended) {
            hasAppended = true;

            // Add an extra break between previously defined and newly appended variable
            return `${result}${EOL}${varname}=${value}${EOL}`;
        } /*if (result.endsWith(EOL))*/ else {
            // Add break for appended variable
            return `${result}${varname}=${value}${EOL}`;
        }
    }, normalizeEOL(environmentContent));
};
