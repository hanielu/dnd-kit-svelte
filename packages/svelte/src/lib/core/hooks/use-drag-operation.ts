import type {Data} from '@dnd-kit/abstract';
import type {Draggable, Droppable, DragDropManager} from '@dnd-kit/dom';
import {useComputed} from '$hooks';
import {useDragDropManager} from './use-drag-drop-manager.js';

export function useDragOperation<
	T extends Data = Data,
	U extends Draggable<T> = Draggable<T>,
	V extends Droppable<T> = Droppable<T>,
	W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
>() {
	const manager = useDragDropManager<T, U, V, W>();
	// TODO: (haniel) there might be an issue with this,
	// idk if it accounts for manager.current being reactive yet
	const source = useComputed(() => manager.current?.dragOperation.source);
	const target = useComputed(() => manager.current?.dragOperation.target);

	return {
		get source() {
			return source.value;
		},
		get target() {
			return target.value;
		},
	};
}
