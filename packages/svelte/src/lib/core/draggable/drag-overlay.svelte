<script lang="ts" module>
	import type {Data} from '@dnd-kit/abstract';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';
	import {DragDropContext} from '../context/context.js';
	import {Feedback, type DragDropManager, type Draggable} from '@dnd-kit/dom';
	import {lens, type Lens} from 'runed';
	import {useComputed, useDeepSignal} from '$hooks';
	import {useDragDropManager} from '../hooks/use-drag-drop-manager.js';

	function noop() {
		return () => {};
	}

	export interface Props<T extends Data, U extends Draggable<T>> {
		className?: string;
		children: Snippet<[source: U]>;
		style?: string;
		tag?: keyof SvelteHTMLElements;
		disabled?: boolean | ((source: U | null) => boolean);
	}
</script>

<script lang="ts" generics="T extends Data, U extends Draggable<T>">
	let {className, children, style, tag = 'div', disabled}: Props<T, U> = $props();

	let el: HTMLElement | undefined = $state();

	const manager = useDragDropManager<T, U>();
	const source = $derived(useComputed(() => manager.current?.dragOperation.source).value ?? null);
	const isDisabled = $derived(typeof disabled === 'function' ? disabled(source) : disabled);

	$effect(() => {
		const m = manager.current;
		const overlay = el;
		const disabled = isDisabled;

		if (!m || !overlay || disabled) return;

		const feedback = m.plugins.find((p) => p instanceof Feedback);
		if (!feedback) return;

		feedback.overlay = overlay;

		return () => {
			feedback.overlay = undefined;
		};
	});

	// Prevent overlay subtree from registering draggables/droppables
	const patchedManager = lens(() => {
		const m = manager.current;
		if (!m) return m;

		const patchedRegistry = new Proxy(m.registry, {
			get(target, prop) {
				if (prop === 'register' || prop === 'unregister') {
					return noop;
				}
				return (target as any)[prop];
			},
		});

		return new Proxy(m, {
			get(target, prop) {
				if (prop === 'registry') return patchedRegistry;
				return (target as any)[prop];
			},
		});
	});

	DragDropContext.set(patchedManager as Lens<DragDropManager | null>);
</script>

{#if source}
	<svelte:element this={tag} class={className} {style} data-dnd-overlay bind:this={el}>
		{@render children?.(useDeepSignal(source))}
	</svelte:element>
{/if}
