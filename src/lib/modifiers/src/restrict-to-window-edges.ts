import type {Modifier} from '$core/index.js';

import {restrictToBoundingRect} from './utilities/index.js';

export const restrictToWindowEdges: Modifier = ({transform, draggingNodeRect, windowRect}) => {
	if (!draggingNodeRect || !windowRect) {
		return transform;
	}

	return restrictToBoundingRect(transform, draggingNodeRect, windowRect);
};
