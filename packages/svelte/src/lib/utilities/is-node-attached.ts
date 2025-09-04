export function isNodeAttached(node: Element) {
	return 'isConnected' in node && node.isConnected;
}
