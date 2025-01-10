import type {ClientRect} from '../../types/index.js';
import {getClientRect} from '../rect/get-rect.js';
import {getFirstScrollableAncestor} from './get-scrollable-ancestors.js';

export function scrollIntoViewIfNeeded(
	element: HTMLElement | null | undefined,
	measure: (node: HTMLElement) => ClientRect = getClientRect
) {
	if (!element) {
		return;
	}

	const {top, left, bottom, right} = measure(element);
	const firstScrollableAncestor = getFirstScrollableAncestor(element);

	if (!firstScrollableAncestor) {
		return;
	}

	if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
		element.scrollIntoView({
			block: 'center',
			inline: 'center',
		});
	}
}
