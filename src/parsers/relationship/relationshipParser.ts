import { CommandContext } from './classes';
import { ParseError } from '../shared/errors';
import lexer from './lexer';
import parser from './parser';

export const relationshipParser = (
    command: string,
): [CommandContext, null] | [null, ParseError] => {
    const [tokens, error] = lexer(command);
    if (error) {
        return [null, error];
    }
    const ast = parser(tokens);
    if (ast.error != null) return [null, ast.error];
    const ctx = new CommandContext();
    ast.node?.run(ctx);
    return [ctx, null];
};
