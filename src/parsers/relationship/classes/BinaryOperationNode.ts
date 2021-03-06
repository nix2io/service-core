/*
 * File: BinaryOperationNode.ts
 * Created: 10/26/2020 20:05:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
import { TOKEN_LINK } from '../constants';
// Relationship specific
import { CommandContext } from '.';
import { RelationshipNode } from '.';

/**
 * Class for representing a binary operation node for the relationship parser.
 * @class BinaryOperationNode
 */
export default class BinaryOperationNode implements RelationshipNode {
    /**
     * Constructor for a binary operation node.
     * @param {RelationshipNode} leftNode   Left alert node.
     * @param {Token} operationToken Token of the operator.
     * @param {RelationshipNode} rightNode  Right alert node.
     */
    constructor(
        public leftNode: RelationshipNode,
        public operationToken: Token,
        public rightNode: RelationshipNode,
    ) {}

    /**
     * Runs the binary operation node.
     * @function run
     * @memberof BinaryOperationNode
     * @param   {CommandContext} context Root command context to be modified.
     * @returns {string[]}               The result of the binary operation.
     */
    run(context: CommandContext): string[] {
        const leftNodes = this.leftNode.run(context);
        const rightNodes = this.rightNode.run(context);
        if (this.operationToken.type == TOKEN_LINK) {
            // left nodes are the parents
            for (let i = 0; i < leftNodes.length; i++) {
                context.schemas.add(leftNodes[i]);
                for (let j = 0; j < rightNodes.length; j++) {
                    context.linked.add(rightNodes[j], leftNodes[i]);
                    context.schemas.add(rightNodes[j]);
                }
            }
        }
        return leftNodes.concat(rightNodes);
    }
}
