<script lang="ts" module>
	import type { Data } from "@dnd-kit/abstract";
	import type { Draggable, DropAnimation } from "@dnd-kit/dom";
	import type { Snippet } from "svelte";
	import type { ClassValue, SvelteHTMLElements } from "svelte/elements";

	export interface Props<T extends Data = Data, U extends Draggable<T> = Draggable<T>> {
		/** Rendered while something is dragged, with the drag source. */
		children: Snippet<[source: U]>;
		class?: ClassValue;
		style?: string;
		/** @default "div" */
		tag?: keyof SvelteHTMLElements;
		disabled?: boolean | ((source: U | null) => boolean);
		/**
		 * The animation played when the drag ends: `undefined` for the default (250ms ease), `null` for none,
		 * `{ duration, easing }` to change its timing, or a function for a custom animation.
		 */
		dropAnimation?: DropAnimation | null;
	}
</script>

<script lang="ts" generics="T extends Data = Data, U extends Draggable<T> = Draggable<T>">
	import { Feedback, type DragDropManager } from "@dnd-kit/dom";
	import { useComputed, useDeepSignal } from "#lib/reactivity/index.js";
	import { setDragDropContext } from "../context/context.js";
	import { useDragDropManager } from "../hooks/use-drag-drop-manager.js";

	let { children, class: className, style, tag = "div", disabled, dropAnimation }: Props<T, U> = $props();

	const manager = useDragDropManager<T, U>();
	const dragSource = useComputed(() => manager.dragOperation.source);
	const feedback = useComputed(() => manager.plugins.find((plugin) => plugin instanceof Feedback));
	const source = $derived(dragSource.current ?? null);
	const tracked = $derived(source && useDeepSignal(source));
	const isDisabled = $derived(typeof disabled === "function" ? disabled(source) : disabled === true);

	let overlay = $state<HTMLElement>();

	$effect(() => {
		const plugin = feedback.current;
		if (!plugin || !overlay || isDisabled) return;
		plugin.overlay = overlay;
		return () => (plugin.overlay = undefined);
	});

	$effect(() => {
		const plugin = feedback.current;
		if (!plugin) return;
		plugin.dropAnimation = dropAnimation;
		return () => (plugin.dropAnimation = undefined);
	});

	// Children of the overlay are copies of registered entities: keep them out of the registry.
	const noop = () => () => {};
	const registry = new Proxy(manager.registry, {
		get: (target, key) => (key === "register" || key === "unregister" ? noop : target[key as keyof typeof target]),
	});
	const overlayManager = new Proxy(manager, {
		get: (target, key) => (key === "registry" ? registry : target[key as keyof typeof target]),
	});
	setDragDropContext(overlayManager as unknown as DragDropManager);
</script>

<svelte:element this={tag} bind:this={overlay} class={className} {style} data-dnd-overlay>
	{#if tracked && !isDisabled}
		{@render children(tracked)}
	{/if}
</svelte:element>
