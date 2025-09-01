<script lang="ts" module>
	import {DragDropContext} from '$lib/context/context.js';
	import {useDragDropManager} from '$lib/context/use-drag-drop-manager.js';
	import {useDragOperation} from '$lib/hooks/use-drag-operation.svelte.js';
	import {type Draggable, type DragDropManager, Feedback} from '@dnd-kit/dom';
	import {computed} from 'runed';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	function noop() {
		return () => {};
	}

	export interface DragOverlayProps {
		class?: string;
		children: Snippet<[source: Draggable]>;
		style?: string;
		tag?: keyof SvelteHTMLElements;
	}

	/**
	 * Creates a patched version of the drag-drop manager that prevents
	 * draggable/droppable registration within the overlay.
	 * This ensures that elements inside the overlay don't interfere with
	 * the main drag-drop context.
	 */
	function usePatchedManager(manager: DragDropManager | null) {
		// TODO: (haniel) this might not even need to be computed
		const patchedManager = computed(() => {
			if (!manager) return null;

			// Create a proxy for the registry that prevents registration/unregistration
			const patchedRegistry = new Proxy(manager.registry, {
				get(target, property) {
					if (property === 'register' || property === 'unregister') {
						return noop;
					}
					return target[property as keyof typeof target];
				},
			});

			// Create a proxy for the manager that uses our patched registry
			return new Proxy(manager, {
				get(target, property) {
					if (property === 'registry') {
						return patchedRegistry;
					}
					return target[property as keyof typeof target];
				},
			});
		});

		return patchedManager;
	}
</script>

<script lang="ts">
	let {class: className, children, style, tag = 'div'}: DragOverlayProps = $props();

	let element: HTMLDivElement | undefined = $state();

	const manager = useDragDropManager();
	const patchedManager = usePatchedManager(manager);
	const dragOperation = useDragOperation();

	$effect(() => {
		if (!dragOperation.source) element = undefined;
	});

	$effect(() => {
		const feedback = manager?.plugins.find((plugin): plugin is Feedback => plugin instanceof Feedback);

		if (!feedback) return;

		feedback.overlay = element!;

		return () => {
			feedback.overlay = undefined;
		};
	});

	DragDropContext.set(patchedManager.current);
</script>

{#if dragOperation.source}
	<svelte:element this={tag} class={className} {style} data-dnd-overlay bind:this={element}>
		{@render children?.(dragOperation.source)}
	</svelte:element>
{/if}
