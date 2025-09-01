import {DragDropManager} from '@dnd-kit/dom';
import {Sortable, type SortableInput} from '@dnd-kit/dom/sortable';

import {useDragDropManager} from '../context/use-drag-drop-manager.js';

import type {Data} from '@dnd-kit/abstract';
import {computed, ref} from 'runed';

export interface UseSortableInput<T extends Data = Data> extends Omit<SortableInput<T>, 'source'> {
	manager?: DragDropManager;
	source?: Element;
}

export function useSortable<T extends Data = Data>(input: UseSortableInput<T>) {
	const elementRef = ref<Element | undefined>(input.element);
	const handleRef = ref<Element | undefined>(input.handle);
	const targetRef = ref<Element | undefined>(input.target);
	const sourceRef = ref<Element | undefined>(input.source);

	const manager = input.manager ?? useDragDropManager() ?? new DragDropManager();
	const sortable = new Sortable(
		{
			...input,
			transition: input.transition ?? null,
		},
		manager
	);

	$effect(() => {
		if (handleRef.current) {
			sortable.handle = handleRef.current;
		}

		if (elementRef.current) {
			sortable.element = elementRef.current;
		}

		if (targetRef.current) {
			sortable.target = targetRef.current;
		}

		if (sourceRef.current) {
			sortable.source = sourceRef.current;
		}

		sortable.id = input.id;
		sortable.disabled = input.disabled ?? false;
		sortable.feedback = input.feedback ?? 'default';
		sortable.alignment = input.alignment;
		sortable.modifiers = input.modifiers;
		sortable.sensors = input.sensors;
		sortable.accept = input.accept;
		sortable.type = input.type;
		sortable.group = input.group;
		sortable.index = input.index;
		sortable.collisionPriority = input.collisionPriority;
		sortable.transition = input.transition ?? null;

		if (input.collisionDetector) {
			sortable.collisionDetector = input.collisionDetector;
		}

		if (input.data) {
			sortable.data = input.data;
		}
	});

	return {
		sortable,
		isDragging: computed(() => sortable.isDragging),
		isDropping: computed(() => sortable.isDropping),
		isDragSource: computed(() => sortable.isDragSource),
		isDropTarget: computed(() => sortable.isDropTarget),

		ref: elementRef,
		targetRef: targetRef,
		sourceRef: sourceRef,
		handleRef: handleRef,
	};
}
