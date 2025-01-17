<script lang="ts">
	import {useDroppable, type UseDroppableArguments} from '@dnd-kit-svelte/core';
	import type {ClassValue} from 'clsx';
	import type {Snippet} from 'svelte';

	interface DroppableProps extends UseDroppableArguments {
		children: Snippet;
		class?: ClassValue;
	}

	let {children, class: className, ...rest}: DroppableProps = $props();

	const droppable = useDroppable(rest);
</script>

<div class={[className]} bind:this={droppable.node.current}>
	{@render children()}
</div>
