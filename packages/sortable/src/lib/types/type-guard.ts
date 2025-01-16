import type {Active, Data, DroppableContainer, DraggableNode, Over} from '@dnd-kit-svelte/core';

import type {SortableData} from './data.js';

export function hasSortableData<T extends Active | Over | DraggableNode | DroppableContainer>(
	entry: T | null | undefined
): entry is T & {data: {current: Data<SortableData>}} {
	if (!entry) {
		return false;
	}

	const data = entry.data;

	if (
		data &&
		'sortable' in data &&
		typeof data.sortable === 'object' &&
		'containerId' in data.sortable &&
		'items' in data.sortable &&
		'index' in data.sortable
	) {
		return true;
	}

	return false;
}
