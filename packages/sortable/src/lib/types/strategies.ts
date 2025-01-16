import type {ClientRect} from '@dnd-kit-svelte/core';
import type {Transform} from '@dnd-kit-svelte/utilities';

export type SortingStrategy = (args: {
	activeNodeRect: ClientRect | null;
	activeIndex: number;
	index: number;
	rects: ClientRect[];
	overIndex: number;
}) => Transform | null;
