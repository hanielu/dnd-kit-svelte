<script lang="ts">
	import {useDroppable} from '@dnd-kit-svelte/svelte';
	import type {Snippet} from 'svelte';

	let {children}: {children: Snippet} = $props();

	const {ref} = useDroppable({id: 'droppable'});
</script>

<div bind:this={ref.current} class="s-300px bg-red-500">
	{@render children()}
</div>
