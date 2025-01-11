import type {UniqueIdentifier} from '$core/index.js';

export type SortableData = {
	sortable: {
		containerId: UniqueIdentifier;
		items: UniqueIdentifier[];
		index: number;
	};
};
