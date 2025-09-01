<script lang="ts">
	import {DragDropProvider} from '@dnd-kit-svelte/svelte';
	import Draggable from './draggable.svelte';
	import Droppable from './droppable.svelte';

	let isDropped = $state(false);
</script>

<DragDropProvider
	onDragEnd={(event) => {
		if (event.canceled) return;

		const {target} = event.operation;
		isDropped = target?.id === 'droppable';
	}}
>
	<div class="p-4 h-100px bg-yellow">
		{#if !isDropped}
			<Draggable />
		{/if}
	</div>

	<Droppable>
		{#if isDropped}
			<Draggable />
		{/if}
	</Droppable>
</DragDropProvider>
