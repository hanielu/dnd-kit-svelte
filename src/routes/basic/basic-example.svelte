<script lang="ts">
	import Draggable from './draggable.svelte';
	import Droppable from './droppable.svelte';
	import ViewProject from '$components/view-project.svelte';
	import {DndContext, type UniqueIdentifier} from 'svelte-dnd-kit';
	import {sensors} from '$components/index.js';

	let parent = $state<UniqueIdentifier | null>(null);
</script>

<section id="basic" class="bg-white rounded-lg shadow-lg p-6">
	<h2 class="text-2xl font-semibold mb-4">Basic Drag and Drop</h2>
	<div class="flex flex-wrap gap-4">
		<DndContext
			{sensors}
			onDragMove={({over}) => {
				console.log(over);
			}}
			onDragEnd={(event) => {
				parent = event.over?.id ?? null;
			}}
		>
			{#if parent === null}
				{@render draggableMarkup()}
			{:else}
				<div class="text-gray-4 txt-sm w-32">Drop here</div>
			{/if}

			<Droppable>
				{#if parent === 'droppable'}
					{@render draggableMarkup()}
				{:else}
					Drop here
				{/if}
			</Droppable>
		</DndContext>
	</div>
	<ViewProject href="https://github.com/dnd-kit/svelte-dnd-kit/tree/main/examples/basic" />
</section>

{#snippet draggableMarkup()}
	<Draggable />
{/snippet}
