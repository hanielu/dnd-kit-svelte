<script lang="ts">
	import {useDroppable} from 'svelte-dnd-kit';
	import type {Snippet} from 'svelte';

	interface DroppableProps {
		children?: Snippet;
		id: string;
		class?: string;
	}

	let {children, id, class: className}: DroppableProps = $props();

	const {isOver, node} = useDroppable({id});
</script>

<div class={['b-2', isOver.current ? 'b-green' : 'b-gray', className]} bind:this={node.current}>
	{@render children?.()}
</div>
