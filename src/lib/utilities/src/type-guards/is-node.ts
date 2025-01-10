export function isNode(node: object): node is Node {
	return 'nodeType' in node;
}
