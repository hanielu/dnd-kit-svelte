import type {Modifier} from '$core/index.js';
import {restrictToBoundingRect} from './utilities/index.js';

export const restrictToParentElement: Modifier = ({containerNodeRect, draggingNodeRect, transform}) => {
	if (!draggingNodeRect || !containerNodeRect) {
		return transform;
	}

	return restrictToBoundingRect(transform, draggingNodeRect, containerNodeRect);
};
