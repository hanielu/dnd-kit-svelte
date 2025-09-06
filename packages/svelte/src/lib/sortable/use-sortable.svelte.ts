import type {Data} from '@dnd-kit/abstract';
import {batch, deepEqual} from '@dnd-kit/state';
import {defaultSortableTransition, Sortable, type SortableInput} from '@dnd-kit/dom/sortable';
import {resolveObj, resolve, lens, watch, asGetter, type MaybeGetterObject} from 'runed';
import {makeRef} from '$lib/utilities/index.js';
import {useDeepSignal, useOnElementChange, useOnValueChange} from '$hooks';
import {useInstance} from '../core/hooks/use-instance.svelte.js';

export type UseSortableInput<T extends Data = Data> = MaybeGetterObject<SortableInput<T>>;

export function useSortable<T extends Data = Data>(input: UseSortableInput<T>) {
	const {
		accept,
		collisionDetector,
		collisionPriority,
		id,
		data,
		element,
		handle,
		index,
		group,
		disabled,
		feedback,
		modifiers,
		sensors,
		target,
		type,
	} = input;

	const transition = $derived({
		...defaultSortableTransition,
		...resolve(input.transition),
	});

	const sortable = useInstance((manager) => {
		return new Sortable(
			{
				...resolveObj(input),
				transition,
				register: false,
			},
			manager
		);
	});

	const trackedSortable = useDeepSignal(sortable);

	useOnValueChange(id, (id) => (sortable.id = id));

	// group could be undefined when dragging
	watch.pre([asGetter(group), asGetter(index)], ([group, index]) => {
		batch(() => {
			sortable.group = group;
			sortable.index = index;
		});
	});

	useOnValueChange(type, (type) => (sortable.type = type));
	useOnValueChange(accept, (accept) => (sortable.accept = accept), undefined, deepEqual);
	useOnValueChange(data, (data) => {
		if (data) sortable.data = data;
	});
	useOnValueChange(
		index,
		() => {
			if (sortable.manager?.dragOperation.status.idle && transition?.idle) {
				sortable.refreshShape();
			}
		},
		watch.pre
	);
	useOnElementChange(handle, (handle) => {
		sortable.handle = handle;
	});
	useOnElementChange(element, (element) => {
		sortable.element = element;
	});
	useOnElementChange(target, (target) => {
		sortable.target = target;
	});
	useOnValueChange(disabled, (disabled) => {
		sortable.disabled = disabled === true;
	});
	useOnValueChange(sensors, (sensors) => {
		sortable.sensors = sensors;
	});
	useOnValueChange(collisionDetector, (collisionDetector) => {
		sortable.collisionDetector = collisionDetector;
	});
	useOnValueChange(collisionPriority, (collisionPriority) => {
		sortable.collisionPriority = collisionPriority;
	});
	useOnValueChange(feedback, (feedback) => {
		sortable.feedback = feedback ?? 'default';
	});
	useOnValueChange(
		() => transition,
		() => {
			sortable.transition = transition;
		},
		undefined,
		deepEqual
	);
	useOnValueChange(
		modifiers,
		(modifiers) => {
			sortable.modifiers = modifiers;
		},
		undefined,
		deepEqual
	);
	useOnValueChange(input.alignment, (alignment) => {
		sortable.alignment = alignment;
	});

	return {
		sortable: trackedSortable,
		isDragging: lens(() => trackedSortable.isDragging),
		isDropping: lens(() => trackedSortable.isDropping),
		isDragSource: lens(() => trackedSortable.isDragSource),
		isDropTarget: lens(() => trackedSortable.isDropTarget),
		handleRef: makeRef(sortable, 'handle'),
		ref: makeRef(sortable, 'element'),
		sourceRef: makeRef(sortable, 'source'),
		targetRef: makeRef(sortable, 'target'),
	};
}
