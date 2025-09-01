import {Droppable, type DroppableInput, type DragDropManager} from '@dnd-kit/dom';

import {useDragDropManager} from '../context/use-drag-drop-manager.js';

import type {Data} from '@dnd-kit/abstract';
import {computed, ref} from 'runed';

export interface UseDroppableInput<T extends Data = Data> extends DroppableInput<T> {
	manager?: DragDropManager;
}

export function useDroppable<T extends Data = Data>(input: UseDroppableInput<T>) {
	const elementRef = ref<Element | undefined>(input.element);

	const manager = input.manager ?? useDragDropManager() ?? undefined;
	const droppable = new Droppable(
		{
			...input,
		},
		manager
	);

	$effect(() => {
		if (elementRef.current) {
			droppable.element = elementRef.current;
		}

		droppable.id = input.id;
		droppable.disabled = input.disabled ?? false;
		droppable.accept = input.accept;
		droppable.type = input.type;

		droppable.collisionPriority = input.collisionPriority;

		if (input.collisionDetector) {
			droppable.collisionDetector = input.collisionDetector;
		}

		if (input.data) {
			droppable.data = input.data;
		}
	});

	return {
		droppable,
		isDropTarget: computed(() => droppable.isDropTarget),
		ref: elementRef,
	};
}
