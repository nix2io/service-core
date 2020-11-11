import { User } from '..';

/**
 * Class for representing an execution context.
 *
 * This means where the service file is located, and which user is executing the code.
 * @class ExecutionContext
 */
export default class ExecutionContext {
    /**
     * Constructor for the execution context.
     * @param {string} serviceFilePath Path to the service file.
     * @param {User}   user            The user executing the code, can be a bot.
     */
    constructor(public serviceFilePath: string, public user: User) {}
}
