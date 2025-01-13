<script lang="ts">
	import {useDroppable, type UseDroppableArguments} from 'svelte-dnd-kit';
	import type {Snippet} from 'svelte';

	interface DroppableProps extends UseDroppableArguments {
		children?: Snippet;
		class?: string;
	}

	let {children, class: className, ...rest}: DroppableProps = $props();

	const {isOver, node} = useDroppable(rest);
</script>

<div class={['b-2', isOver.current ? 'b-green' : 'b-gray', className]} bind:this={node.current}>
	{@render children?.()}
</div>
