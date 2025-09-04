import type {Data} from '@dnd-kit/abstract';
import type {DraggableInput} from '@dnd-kit/dom';
import {Draggable} from '@dnd-kit/dom';
import {deepEqual} from '@dnd-kit/state';
import {resolveObj, type MaybeGetterObject, lens, toFnObject} from 'runed';
import {makeRef} from '$lib/utilities/index.js';
import {useDeepSignal, useOnElementChange, useOnValueChange} from '$hooks';
import {useInstance} from '../hooks/use-instance.svelte.js';

export type UseDraggableInput<T extends Data = Data> = MaybeGetterObject<DraggableInput<T>>;

export function useDraggable<T extends Data = Data>(input: UseDraggableInput<T>) {
	const {disabled, data, element, handle, id, modifiers, sensors} = toFnObject(input);
	const draggable = useInstance(
		(manager) =>
			new Draggable(
				{
					...resolveObj(input),
					register: false,
					handle: handle?.(),
					element: element?.(),
				},
				manager
			)
	);

	const trackedDraggable = useDeepSignal(draggable);

	useOnValueChange(id, (id) => {
		draggable.id = id;
	});
	useOnElementChange(handle, (handle) => {
		draggable.handle = handle;
	});
	useOnElementChange(element, (element) => {
		draggable.element = element;
	});
	useOnValueChange(data, (data) => {
		if (data) draggable.data = data;
	});
	useOnValueChange(disabled, (disabled) => {
		draggable.disabled = disabled === true;
	});
	useOnValueChange(sensors, (sensors) => {
		draggable.sensors = sensors;
	});
	useOnValueChange(
		modifiers,
		(modifiers) => {
			draggable.modifiers = modifiers;
		},
		undefined,
		deepEqual
	);
	useOnValueChange(input.feedback, (feedback) => {
		draggable.feedback = feedback ?? 'default';
	});
	useOnValueChange(input.alignment, (alignment) => {
		draggable.alignment = alignment;
	});

	return {
		draggable: trackedDraggable,
		isDragging: lens(() => trackedDraggable.isDragging),
		isDropping: lens(() => trackedDraggable.isDropping),
		isDragSource: lens(() => trackedDraggable.isDragSource),
		handleRef: makeRef(draggable, 'handle'),
		ref: makeRef(draggable, 'element'),
	};
}

// FROM CURSOR CHAT:
// our useDeepSignal doesn’t support a true “flushSync”;
// updates from the @dnd-kit/state effect already bump state synchronously enough,
// and the microtask is only for first-time key registration.
// Keeping the “synchronous” path in use-draggable.svelte.ts adds no value
// function shouldUpdateSynchronously(key: string, oldValue: any, newValue: any) {
// 	// Update synchronously after drop animation
// 	if (key === 'isDragSource' && !newValue && oldValue) return true;

// 	return false;
// }
