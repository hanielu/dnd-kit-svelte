<script lang="ts">
	import {
		defaultDropAnimationSideEffects,
		DndContext,
		DragOverlay,
		type DropAnimation,
		type UniqueIdentifier,
	} from 'svelte-dnd-kit';
	import {Portal} from 'svelte-dnd-kit';
	import Droppable from './droppable.svelte';
	import Draggable from './draggable.svelte';

	const containers = ['A', 'B', 'C'];
	let parent = $state<UniqueIdentifier | null>(null);

	const dropAnimation: DropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: '0.5',
				},
			},
		}),
	};
</script>

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
			<Droppable id={container} class="flex-s-center s-150px">
				{#if parent === container}
					{@render draggableMarkup()}
				{:else}
					Drop here
				{/if}
			</Droppable>
		{/each}
	</div>

	<!-- <Portal>
		<DragOverlay {dropAnimation}>
			{#if parent === null}
				{@render draggableMarkup()}
			{/if}
		</DragOverlay>
	</Portal> -->
</DndContext>

{#snippet draggableMarkup()}
	<Draggable>Drag me</Draggable>
{/snippet}
