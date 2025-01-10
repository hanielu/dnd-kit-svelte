<script lang="ts">
	import {browser} from '$app/environment';
	import {DndContext, type UniqueIdentifier} from '$core/index.js';
	import Draggable from './draggable.svelte';
	import Droppable from './droppable.svelte';

	const containers = ['A', 'B', 'C'];
	let parent = $state<UniqueIdentifier | null>(null);
</script>

<!-- {#if browser} -->
<DndContext
	onDragEnd={(event) => {
		parent = event.over?.id ?? null;
	}}
>
	{#if parent === null}
		{@render draggableMarkup()}
	{/if}

	<div class="flex-s-center s-400px gap-8 b b-black">
		{#each containers as container}
			<Droppable id={container}>
				{#if parent === container}
					{@render draggableMarkup()}
				{:else}
					Drop here
				{/if}
			</Droppable>
		{/each}
	</div>
</DndContext>
<!-- {/if} -->

{#snippet draggableMarkup()}
	<Draggable>Drag me</Draggable>
{/snippet}
