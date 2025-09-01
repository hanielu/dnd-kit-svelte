<script lang="ts">
	import {useDraggable} from '@dnd-kit-svelte/svelte';

	const {ref, isDragging} = useDraggable({id: 'draggable'});

	$effect(() => {
		console.log(isDragging.current);
	});
</script>

<button class="bg-blue-500" bind:this={ref.current}>draggable</button>
