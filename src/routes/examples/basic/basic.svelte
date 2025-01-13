<script lang="ts">
	import {
		defaultDropAnimationSideEffects,
		DndContext,
		DragOverlay,
		type DropAnimation,
		type UniqueIdentifier,
		TouchSensor,
		KeyboardSensor,
		useSensor,
		useSensors,
		MouseSensor,
	} from 'svelte-dnd-kit';
	import {Portal} from 'svelte-dnd-kit';
	import Droppable from '$components/droppable.svelte';
	import Draggable from './draggable.svelte';
	import {sensors} from '$components/index.js';

	const containers = ['A', 'B', 'C'];
	let parent = $state<UniqueIdentifier | null>(null);
</script>

<DndContext
	{sensors}
	onDragEnd={(event) => {
		parent = event.over?.id ?? null;
	}}
>
	{#if parent === null}
		{@render draggableMarkup()}
	{:else}
		<div class="text-gray-4 txt-sm">Drop here</div>
	{/if}

	<div class="flex-s-center w-full gap-8 py-8 b">
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
