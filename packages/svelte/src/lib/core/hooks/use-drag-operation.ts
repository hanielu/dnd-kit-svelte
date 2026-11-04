import type { Data } from "@dnd-kit/abstract";
import type { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";
import { useComputed, type SignalLens } from "#lib/reactivity/index.js";
import { useDragDropManager } from "./use-drag-drop-manager.js";

type Operation<W extends DragDropManager<any, any, any>> = W["dragOperation"];

/** The source and target of a manager's drag operation, reactive in Svelte. */
export class DragOperationState<W extends DragDropManager<any, any, any>> {
	readonly #source: SignalLens<Operation<W>["source"]>;
	readonly #target: SignalLens<Operation<W>["target"]>;

	constructor(manager: W) {
		this.#source = useComputed(() => manager.dragOperation.source);
		this.#target = useComputed(() => manager.dragOperation.target);
	}

	get source(): Operation<W>["source"] {
		return this.#source.current;
	}

	get target(): Operation<W>["target"] {
		return this.#target.current;
	}
}

/** The source and target of the current drag operation, reactive in Svelte. */
export function useDragOperation<
	T extends Data = Data,
	U extends Draggable<T> = Draggable<T>,
	V extends Droppable<T> = Droppable<T>,
	W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
>(): DragOperationState<W> {
	return new DragOperationState(useDragDropManager<T, U, V, W>());
}
