<script lang="ts">
	import {useDroppable} from '$core/index.js';
	import type {Snippet} from 'svelte';

	interface DroppableProps {
		children?: Snippet;
		id: string;
		class?: string;
	}

	let {children, id, class: className}: DroppableProps = $props();

	const {isOver, node} = useDroppable(() => ({id}));
</script>

<div class={['b', isOver.current ? 'b-green' : 'b-gray', className]} bind:this={node.current}>
	{@render children?.()}
</div>
