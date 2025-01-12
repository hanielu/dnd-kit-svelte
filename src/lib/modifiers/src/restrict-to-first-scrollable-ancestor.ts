import type {Modifier} from '$core/index.js';
import {restrictToBoundingRect} from './utilities/index.js';

export const restrictToFirstScrollableAncestor: Modifier = ({draggingNodeRect, transform, scrollableAncestorRects}) => {
	const firstScrollableAncestorRect = scrollableAncestorRects[0];

	if (!draggingNodeRect || !firstScrollableAncestorRect) {
		return transform;
	}

	return restrictToBoundingRect(transform, draggingNodeRect, firstScrollableAncestorRect);
};
