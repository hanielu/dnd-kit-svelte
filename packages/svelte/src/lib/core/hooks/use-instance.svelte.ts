import type { DragDropManager } from "@dnd-kit/abstract";
import type { CleanupFunction } from "@dnd-kit/state";
import { useDragDropManager } from "./use-drag-drop-manager.js";

export interface Instance<T extends DragDropManager<any, any> = DragDropManager<any, any>> {
	manager: T | undefined;
	register(): CleanupFunction | void;
}

/**
 * Creates an entity for the closest manager and keeps it registered while the block that calls the hook is mounted:
 * a component, or an `{#each}` item when the hook is called in a `{const …}` tag.
 *
 * Registration waits for a microtask, so it runs after the current flush, once `{@attach}` has set the element, like
 * React's layout effect. Plugins that react to every registration (Accessibility walks all draggables) then run once
 * per entity instead of again for its element. `$effect.pre` is created at once inside the calling block, so the
 * entity is unregistered when that block is destroyed.
 */
export function useInstance<T extends Instance>(initializer: (manager: DragDropManager<any, any>) => T): T {
	const instance = initializer(useDragDropManager());
	$effect.pre(() => {
		let mounted = true;
		let unregister: CleanupFunction | void;
		queueMicrotask(() => {
			if (mounted) unregister = instance.register();
		});
		return () => {
			mounted = false;
			unregister?.();
		};
	});
	return instance;
}
