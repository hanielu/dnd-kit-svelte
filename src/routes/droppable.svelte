<script lang="ts">
	import {useDroppable} from '$core/index.js';
	import type {Snippet} from 'svelte';

	interface DroppableProps {
		children?: Snippet;
		id: string;
	}

	let {children, id}: DroppableProps = $props();

	const droppable = useDroppable(() => ({id}));

	const {isOver, node} = $derived(droppable.current);
</script>

<div class={['flex-s-center s-150px b', isOver ? 'b-green' : 'b-gray']} bind:this={node.current}>
	{@render children?.()}
</div>
