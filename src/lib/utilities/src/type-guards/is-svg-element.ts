import {getWindow} from '../execution-context/get-window';

export function isSVGElement(node: Node): node is SVGElement {
	return node instanceof getWindow(node).SVGElement;
}
