import {DragDropManager, Draggable, type DraggableInput} from '@dnd-kit/dom';

import {useDragDropManager} from '../context/use-drag-drop-manager.js';

import type {Data} from '@dnd-kit/abstract';
import {computed, ref} from 'runed';

export interface UseDraggableInput<T extends Data = Data> extends DraggableInput<T> {
	manager?: DragDropManager;
}

export function useDraggable<T extends Data = Data>(input: UseDraggableInput<T>) {
	const elementRef = ref<Element | undefined>(input.element);
	const handleRef = ref<Element | undefined>(input.handle);

	const manager = input.manager ?? useDragDropManager() ?? undefined;
	const draggable = new Draggable(input, manager);

	$effect(() => {
		if (handleRef.current) {
			draggable.handle = handleRef.current;
		}

		if (elementRef.current) {
			draggable.element = elementRef.current;
		}

		draggable.id = input.id;
		draggable.disabled = input.disabled ?? false;
		draggable.feedback = input.feedback ?? 'default';
		draggable.alignment = input.alignment;
		draggable.modifiers = input.modifiers;
		draggable.sensors = input.sensors;

		if (input.data) {
			draggable.data = input.data;
		}
	});

	return {
		draggable,

		isDragging: computed(() => draggable.isDragging),
		isDropping: computed(() => draggable.isDropping),
		isDragSource: computed(() => draggable.isDragSource),

		handleRef: handleRef,
		ref: elementRef,
	};
}
