import {getWindow} from '../execution-context/get-window';

import {isWindow} from './is-window';

export function isHTMLElement(node: Node | Window): node is HTMLElement {
	if (isWindow(node)) {
		return false;
	}

	return node instanceof getWindow(node).HTMLElement;
}
