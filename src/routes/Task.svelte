<script lang="ts">
	import {useSortable} from '$sortable';
	import type {UniqueIdentifier} from '$core/index.js';
	import {CSS} from '$utilities';
	import {styleObjectToString} from '$helpers';

	interface Task {
		id: UniqueIdentifier;
		content: string;
	}

	let {task}: {task: Task} = $props();

	const {attributes, listeners, nodeRef, transform, transition, isDragging, isSorting} = useSortable(() => ({
		id: task?.id,
	}));

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined,
		})
	);
</script>

<!-- {#if isDragging.current}
	<div class="p-3 b-2 b-dashed b-black" {style} bind:this={nodeRef.current}></div>
{:else} -->
<div class="p-2 bg-white" {style} bind:this={nodeRef.current} {...listeners.current} {...attributes.current}>
	{task.content}
</div>
<!-- {/if} -->
