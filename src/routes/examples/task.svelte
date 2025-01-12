<script lang="ts">
	import type {UniqueIdentifier} from '$core/index.js';
	import {CSS, styleObjectToString} from '$utilities';
	import {useSortable} from '$sortable';

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
	<div class="p-4 bg-white rounded-lg shadow cursor-pointer" class:hidden={isDragging.current}>
		{task.content}
	</div>

	<!-- Drag placeholder - absolutely positioned to match original dimensions -->
	{#if isDragging.current}
		<div class="flex items-center justify-center h-56px">
			<!-- You can put any content here for the dragging state -->
			<div
				class="w-full h-full bg-blue-100 rounded-lg border-2 border-blue-400 border-dashed flex items-center justify-center"
			>
				<span class="text-blue-600">Moving: {task.content}</span>
			</div>
		</div>
	{/if}
</div>
