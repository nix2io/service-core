import { ParseError } from '../shared/errors';
import lexer from './lexer';
import parser from './parser';
import { AlertRule } from './classes';

export const alertParser = (
    command: string,
): [AlertRule, null] | [null, ParseError] => {
    const [tokens, error] = lexer(command);
    if (error) {
        return [null, error];
    }
    const ast = parser(tokens);
    if (ast.error != null) return [null, ast.error];
    // console.log(JSON.stringify(ast, null, 2));
    const rule = new AlertRule('');
    ast.node?.run(rule);
    return [rule, null];
};
