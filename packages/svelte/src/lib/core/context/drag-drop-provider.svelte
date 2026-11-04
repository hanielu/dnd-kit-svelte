<script lang="ts" module>
	import type { Data, DragDropEventHandlers } from "@dnd-kit/abstract";
	import { DragDropManager, type DragDropManagerInput, type Draggable, type Droppable } from "@dnd-kit/dom";
	import type { Snippet } from "svelte";

	export type Events<
		T extends Data = Data,
		U extends Draggable<T> = Draggable<T>,
		V extends Droppable<T> = Droppable<T>,
		W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
	> = DragDropEventHandlers<U, V, W>;

	export interface Props<
		T extends Data = Data,
		U extends Draggable<T> = Draggable<T>,
		V extends Droppable<T> = Droppable<T>,
		W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
	> extends DragDropManagerInput {
		/** A manager to use instead of creating one. The provider leaves its lifetime to you. */
		manager?: W;
		children?: Snippet;
		onBeforeDragStart?: Events<T, U, V, W>["beforedragstart"];
		onCollision?: Events<T, U, V, W>["collision"];
		onDragStart?: Events<T, U, V, W>["dragstart"];
		onDragMove?: Events<T, U, V, W>["dragmove"];
		onDragOver?: Events<T, U, V, W>["dragover"];
		onDragEnd?: Events<T, U, V, W>["dragend"];
	}
</script>

<script
	lang="ts"
	generics="T extends Data = Data, U extends Draggable<T> = Draggable<T>, V extends Droppable<T> = Droppable<T>, W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>"
>
	import { defaultPreset, resolveCustomizable } from "@dnd-kit/dom";
	import { deepEqual } from "@dnd-kit/state";
	import { useOnValueChange } from "#lib/reactivity/index.js";
	import { setDragDropContext } from "./context.js";
	import { SvelteRenderer } from "./renderer.svelte.js";

	let {
		manager: managerProp,
		plugins,
		sensors,
		modifiers,
		children,
		onBeforeDragStart,
		onCollision,
		onDragStart,
		onDragMove,
		onDragOver,
		onDragEnd,
	}: Props<T, U, V, W> = $props();

	// The manager lives as long as the provider, so it comes from the initial props: swapping `manager` is not
	// supported, and later `plugins`, `sensors` and `modifiers` are applied to it below.
	// svelte-ignore state_referenced_locally
	const [manager, owned] = managerProp
		? [managerProp, false]
		: [new DragDropManager<T, U, V>({ plugins, sensors, modifiers }) as W, true];
	const renderer = new SvelteRenderer();
	manager.renderer = renderer;
	setDragDropContext(manager as unknown as DragDropManager);

	const deep = { equals: deepEqual };
	useOnValueChange(
		() => resolveCustomizable(plugins, defaultPreset.plugins),
		(resolved) => (manager.plugins = resolved),
		deep
	);
	useOnValueChange(
		() => resolveCustomizable(sensors, defaultPreset.sensors),
		(resolved) => (manager.sensors = resolved),
		deep
	);
	useOnValueChange(
		() => resolveCustomizable(modifiers, defaultPreset.modifiers),
		(resolved) => (manager.modifiers = resolved),
		deep
	);

	$effect(() => {
		const { monitor } = manager;
		// Handlers are read when an event fires, so they can change without re-registering. Handlers that change
		// state tell the renderer, so dnd-kit measures after Svelte has updated the DOM.
		const listeners = [
			monitor.addEventListener("beforedragstart", (event) => {
				const handler = onBeforeDragStart;
				if (handler) renderer.track(() => handler(event, manager));
			}),
			monitor.addEventListener("dragstart", (event) => onDragStart?.(event, manager)),
			monitor.addEventListener("dragmove", (event) => {
				const handler = onDragMove;
				if (handler) renderer.track(() => handler(event, manager));
			}),
			monitor.addEventListener("dragover", (event) => {
				const handler = onDragOver;
				if (handler) renderer.track(() => handler(event, manager));
			}),
			monitor.addEventListener("dragend", (event) => {
				const handler = onDragEnd;
				if (handler) renderer.track(() => handler(event, manager));
			}),
			monitor.addEventListener("collision", (event) => onCollision?.(event, manager)),
		];

		return () => {
			listeners.forEach((dispose) => dispose());
			if (owned) manager.destroy();
		};
	});
</script>

{@render children?.()}
