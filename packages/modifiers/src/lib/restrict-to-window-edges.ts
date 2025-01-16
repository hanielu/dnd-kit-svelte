import type {Modifier} from '@dnd-kit-svelte/core';

import {restrictToBoundingRect} from './utilities/index.js';

export const restrictToWindowEdges: Modifier = ({transform, draggingNodeRect, windowRect}) => {
	if (!draggingNodeRect || !windowRect) {
		return transform;
	}

	return restrictToBoundingRect(transform, draggingNodeRect, windowRect);
};
