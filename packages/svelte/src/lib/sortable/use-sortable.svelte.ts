import type { Data, Plugins } from "@dnd-kit/abstract";
import { resolveCustomizable } from "@dnd-kit/dom";
import { resolveSortableTransition, Sortable, SortableKeyboardPlugin, type SortableInput } from "@dnd-kit/dom/sortable";
import { batch, deepEqual } from "@dnd-kit/state";
import { attachTo } from "#lib/core/attachments.js";
import { useInstance } from "#lib/core/hooks/use-instance.svelte.js";
import {
	lens,
	resolve,
	resolveObject,
	useDeepSignal,
	useOnValueChange,
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
	const deep = { equals: deepEqual };

	useOnValueChange(
		() => resolve(input.id),
		(id) => (sortable.id = id)
	);
	// The group and index of an item can change together when it moves to another list.
	useOnValueChange(
		() => [resolve(input.group), resolve(input.index)] as const,
		([group, index]) =>
			batch(() => {
				sortable.group = group;
				sortable.index = index;
			}),
		{ pre: true, equals: (a, b) => a[0] === b[0] && a[1] === b[1] }
	);
	useOnValueChange(
		() => resolve(input.index),
		() => {
			if (sortable.manager?.dragOperation.status.idle && transition?.idle) sortable.refreshShape();
		},
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.type),
		(type) => (sortable.type = type)
	);
	useOnValueChange(
		() => resolve(input.accept),
		(accept) => (sortable.accept = accept),
		deep
	);
	useOnValueChange(
		() => resolve(input.data),
		(data) => data && (sortable.data = data)
	);
	useOnValueChange(
		() => resolve(input.handle),
		(handle) => (sortable.handle = handle),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.element),
		(element) => (sortable.element = element),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.target),
		(target) => (sortable.target = target),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.disabled),
		(disabled) => (sortable.disabled = disabled ?? false),
		deep
	);
	useOnValueChange(
		() => resolve(input.sensors),
		(sensors) => (sortable.sensors = sensors),
		deep
	);
	useOnValueChange(
		() => resolve(input.collisionDetector),
		(detector) => (sortable.collisionDetector = detector)
	);
	useOnValueChange(
		() => resolve(input.collisionPriority),
		(priority) => (sortable.collisionPriority = priority)
	);
	useOnValueChange(plugins, (plugins) => (sortable.plugins = plugins), deep);
	useOnValueChange(
		() => transition,
		(transition) => (sortable.transition = transition),
		deep
	);
	useOnValueChange(
		() => resolve(input.modifiers),
		(modifiers) => (sortable.modifiers = modifiers),
		deep
	);
	useOnValueChange(
		() => resolve(input.alignment),
		(alignment) => (sortable.alignment = alignment)
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
