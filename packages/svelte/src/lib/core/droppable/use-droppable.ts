import type {Data} from '@dnd-kit/abstract';
import type {DroppableInput} from '@dnd-kit/dom';
import {Droppable} from '@dnd-kit/dom';
import {deepEqual} from '@dnd-kit/state';
import {defaultCollisionDetection} from '@dnd-kit/collision';
import {resolveObj, lens, type MaybeGetterObject} from 'runed';
import {makeRef} from '$lib/utilities/index.js';
import {useDeepSignal, useOnElementChange, useOnValueChange} from '$hooks';
import {useInstance} from '../hooks/use-instance.svelte.js';

export type UseDroppableInput<T extends Data = Data> = MaybeGetterObject<DroppableInput<T>>;

export function useDroppable<T extends Data = Data>(input: UseDroppableInput<T>) {
	const {collisionDetector, data, disabled, element, id, accept, type} = input;
	const droppable = useInstance(
		(manager) =>
			new Droppable(
				{
					...resolveObj(input),
					register: false,
				},
				manager
			)
	);
	const trackedDroppable = useDeepSignal(droppable);

	useOnValueChange(id, (id) => {
		droppable.id = id;
	});
	useOnElementChange(element, (element) => {
		droppable.element = element;
	});
	useOnValueChange(accept, (accept) => (droppable.accept = accept), undefined, deepEqual);
	useOnValueChange(collisionDetector, (collisionDetector) => {
		droppable.collisionDetector = collisionDetector ?? defaultCollisionDetection;
	});
	useOnValueChange(data, (data) => {
		if (data) droppable.data = data;
	});
	useOnValueChange(disabled, (disabled) => {
		droppable.disabled = disabled === true;
	});
	useOnValueChange(type, (type) => {
		droppable.type = type;
	});

	return {
		droppable: trackedDroppable,
		isDropTarget: lens(() => trackedDroppable.isDropTarget),
		ref: makeRef(droppable, 'element'),
	};
}
