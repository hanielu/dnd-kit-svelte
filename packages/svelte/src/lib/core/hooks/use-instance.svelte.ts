import type { DragDropManager } from "@dnd-kit/abstract";
import type { CleanupFunction } from "@dnd-kit/state";
import { untrack } from "svelte";
import { useDragDropManager } from "./use-drag-drop-manager.js";

export interface Instance<T extends DragDropManager<any, any> = DragDropManager<any, any>> {
	manager: T | undefined;
	register(): CleanupFunction | void;
}

/** Creates an entity for the closest manager and keeps it registered while the component is mounted. */
export function useInstance<T extends Instance>(initializer: (manager: DragDropManager<any, any>) => T): T {
	const instance = initializer(useDragDropManager());
	$effect.pre(() => untrack(() => instance.register()));
	return instance;
}
