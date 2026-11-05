import type { Data, DragDropEventHandlers } from "@dnd-kit/abstract";
import type { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";
import { useBlockEffect } from "#lib/reactivity/index.js";
import { useDragDropManager } from "./use-drag-drop-manager.js";

type EventName<T extends string> = T extends "beforedragstart"
	? "onBeforeDragStart"
	: T extends `drag${infer First}${infer Rest}`
		? `onDrag${Uppercase<First>}${Rest}`
		: `on${Capitalize<T>}`;

type Events<
	T extends Data,
	U extends Draggable<T>,
	V extends Droppable<T>,
	W extends DragDropManager<T, U, V>,
> = DragDropEventHandlers<U, V, W>;

/** `DragDropEventHandlers` keyed by prop name: `onDragStart`, `onDragOver`, `onCollision`… */
export type EventHandlers<
	T extends Data = Data,
	U extends Draggable<T> = Draggable<T>,
	V extends Droppable<T> = Droppable<T>,
	W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
> = {
	[K in keyof Events<T, U, V, W> as EventName<K>]: Events<T, U, V, W>[K];
};

/**
 * Listens to the drag and drop events of the closest `DragDropProvider` while the component is mounted. Handlers
 * are read when an event fires, so a getter (`get onDragEnd() { … }`) can swap them.
 */
export function useDragDropMonitor<
	T extends Data = Data,
	U extends Draggable<T> = Draggable<T>,
	V extends Droppable<T> = Droppable<T>,
	W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
>(handlers: Partial<EventHandlers<T, U, V, W>>): void {
	const manager = useDragDropManager<T, U, V, W>();

	useBlockEffect(() => {
		const listeners = Object.keys(handlers).map((name) => {
			const event = name.slice(2).toLowerCase() as keyof Events<T, U, V, W>;
			return manager.monitor.addEventListener(event, (...args: unknown[]) =>
				(handlers[name as keyof typeof handlers] as ((...args: unknown[]) => void) | undefined)?.(...args)
			);
		});
		return () => listeners.forEach((dispose) => dispose());
	});
}
