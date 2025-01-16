import type {UniqueIdentifier} from '@dnd-kit-svelte/core';

export type SortableData = {
	sortable: {
		containerId: UniqueIdentifier;
		items: UniqueIdentifier[];
		index: number;
	};
};
