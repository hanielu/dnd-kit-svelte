import type { Data, Plugins } from "@dnd-kit/abstract";
import { resolveCustomizable } from "@dnd-kit/dom";
import { resolveSortableTransition, Sortable, SortableKeyboardPlugin, type SortableInput } from "@dnd-kit/dom/sortable";
import { attachTo } from "#lib/core/attachments.js";
import { useInstance } from "#lib/core/hooks/use-instance.svelte.js";
import {
	assignTo,
	lens,
	resolve,
	resolveObject,
	useDeepSignal,
	useSync,
	type MaybeGetterObject,
} from "#lib/reactivity/index.js";

/** `SortableInput`, where every property may also be a getter (`index: () => index`) to stay reactive. */
export type UseSortableInput<T extends Data = Data> = MaybeGetterObject<Omit<SortableInput<T>, "register">>;

/**
 * dnd kit's default sortable plugins (`@dnd-kit/dom/sortable` doesn't export them) without `OptimisticSortingPlugin`,
 * which is also left out of the defaults a `(defaults) => …` callback receives. It reorders DOM nodes during a drag
 * behind Svelte's back, and the keyed `{#each}` rendering the list then hangs when the drop updates its items. Lists
 * sort through state instead: update them in `onDragOver` to sort during the drag, or in `onDragEnd` to sort on drop.
 * Listing the plugin explicitly still opts in.
 */
const defaultPlugins: Plugins = [SortableKeyboardPlugin];

export function useSortable<T extends Data = Data>(input: UseSortableInput<T>) {
	const transition = $derived(resolveSortableTransition(resolve(input.transition)));
	// A `(defaults) => …` callback is called here, inside the tracked read, so state it reads stays reactive.
	const plugins = () => resolveCustomizable(resolve(input.plugins), defaultPlugins);
	const sortable = useInstance(
		(manager) =>
			new Sortable(
				{
					...resolveObject(input),
					plugins: plugins(),
					transition,
					register: false,
				},
				manager
			)
	);
	const tracked = useDeepSignal(sortable);
	const write = assignTo(sortable);
	type Fields = Partial<Sortable<T>>;

	// Before the DOM updates, in one batch, since an item that moves to another list changes group and index together.
	useSync(
		(): Fields => ({
			element: resolve(input.element),
			handle: resolve(input.handle),
			target: resolve(input.target),
			group: resolve(input.group),
			index: resolve(input.index),
		}),
		write,
		{ pre: true }
	);
	// After that batch, so dnd kit has captured the item's previous shape to animate from.
	useSync(
		() => ({ index: resolve(input.index) }),
		() => {
			if (sortable.manager?.dragOperation.status.idle && transition?.idle) sortable.refreshShape();
		},
		{ pre: true }
	);
	useSync(
		(): Fields => ({
			id: resolve(input.id),
			data: resolve(input.data),
			disabled: resolve(input.disabled) ?? false,
			type: resolve(input.type),
			accept: resolve(input.accept),
			sensors: resolve(input.sensors),
			modifiers: resolve(input.modifiers),
			plugins: plugins(),
			transition,
			collisionDetector: resolve(input.collisionDetector),
			collisionPriority: resolve(input.collisionPriority),
			alignment: resolve(input.alignment),
		}),
		write
	);

	return {
		sortable: tracked,
		isDragging: lens(() => tracked.isDragging),
		isDropping: lens(() => tracked.isDropping),
		isDragSource: lens(() => tracked.isDragSource),
		isDropTarget: lens(() => tracked.isDropTarget),
		ref: attachTo(sortable, "element", true),
		handleRef: attachTo(sortable, "handle"),
		sourceRef: attachTo(sortable, "source", true),
		targetRef: attachTo(sortable, "target", true),
	};
}
