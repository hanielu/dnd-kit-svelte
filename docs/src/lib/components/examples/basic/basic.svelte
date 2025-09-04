<script lang="ts">
	import {DragDropProvider} from '@dnd-kit-svelte/svelte';
	import {sensors} from '$lib';
	import Droppable from '../../droppable.svelte';
	import Draggable from './draggable.svelte';

	const targets = ['A', 'B', 'C'];
	let target = $state<string | number>();
</script>

<DragDropProvider
	{sensors}
	onDragEnd={(event) => {
		if (event.canceled) return;
		target = event.operation.target?.id;
	}}
>
	<div class="flex-s-center h-20">
		{#if !target}
			{@render draggable()}
		{:else}
			<div class="text-neutral-4 fw-semibold">Drop here</div>
		{/if}
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		{#each targets as id}
			<Droppable {id} class="flex-s-center h-100px bg-#F9F9F9 rd-3xl">
				{#if target === id}
					{@render draggable()}
				{:else}
					<div class="text-neutral-4 fw-semibold">Drop here</div>
				{/if}
			</Droppable>
		{/each}
	</div>
</DragDropProvider>

<!-- Whatever draggable markup u want -->
{#snippet draggable()}
	<Draggable />
{/snippet}
