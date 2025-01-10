import {canUseDOM} from '$utilities';

export function isDocumentScrollingElement(element: Element | null) {
	if (!canUseDOM || !element) {
		return false;
	}

	return element === document.scrollingElement;
}
