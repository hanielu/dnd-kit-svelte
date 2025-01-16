import {canUseDOM} from '@dnd-kit-svelte/utilities';

export function isDocumentScrollingElement(element: Element | null) {
	if (!canUseDOM || !element) {
		return false;
	}

	return element === document.scrollingElement;
}
