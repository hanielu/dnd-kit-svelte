<script lang="ts">
	import type {UniqueIdentifier} from '@dnd-kit-svelte/core';
	import {CSS, styleObjectToString} from '@dnd-kit-svelte/utilities';
	import {useSortable} from '@dnd-kit-svelte/sortable';

	interface Task {
		id: UniqueIdentifier;
		content: string;
	}

	let {task}: {task: Task} = $props();

	const {attributes, listeners, node, transform, transition, isDragging, isSorting} = useSortable({
		id: task.id,
	});

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined,
		})
	);
</script>

<div class="relative select-none" bind:this={node.current} {style} {...listeners.current} {...attributes.current}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['p-4 bg-white rd-18px', {invisible: isDragging.current}]}>
		{task.content}
	</div>

	<!-- Drag placeholder - set to match original dimensions -->
	{#if isDragging.current}
		<div class="flex items-center justify-center abs inset-0">
			<!-- You can put any content here for the dragging state -->
			<div class="w-full h-full bg-orange/10 rd-18px b-2 b-orange b-dashed flex items-center justify-center">
				<span class="text-orange">Moving: {task.content}</span>
			</div>
		</div>
	{/if}
</div>
