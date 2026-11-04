import type { Data } from "@dnd-kit/abstract";
import type { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";
import { getDragDropContext } from "../context/context.js";

/** The manager of the closest `DragDropProvider`. Call it during component setup. */
export function useDragDropManager<
	T extends Data = Data,
	U extends Draggable<T> = Draggable<T>,
	V extends Droppable<T> = Droppable<T>,
	W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
>(): W {
	return getDragDropContext() as unknown as W;
}
