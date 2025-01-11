import type {ClientRect} from '$core/index.js';
import type {Transform} from '$utilities';

export type SortingStrategy = (args: {
	activeNodeRect: ClientRect | null;
	activeIndex: number;
	index: number;
	rects: ClientRect[];
	overIndex: number;
}) => Transform | null;
