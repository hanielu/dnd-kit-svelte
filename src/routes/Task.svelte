<script lang="ts">
	import type {UniqueIdentifier} from '$core/index.js';
	import {CSS} from '$utilities';
	import {styleObjectToString} from '$helpers';
	import {untrack} from 'svelte';
	import {useSortable} from '$sortable';

	interface Task {
		id: UniqueIdentifier;
		content: string;
	}

	let {task}: {task: Task} = $props();

	const {attributes, listeners, nodeRef, transform, transition, isDragging, isSorting} = useSortable(() => ({
		// this is so that task is not tracked when the component is unmounted
		// and we don't get an error telling use task is not defined
		id: untrack(() => task.id),
	}));

	const baseStyle = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: transition.current,
		})
	);

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: transition.current,
			// transition: isSorting.current ? transition.current : undefined,
			// zIndex: isDragging.current ? 1 : undefined,
		})
	);

	// $inspect(baseStyle);
</script>

<!-- {#if isDragging.current}
	<div class="p-3 b-2 b-dashed b-black" {style} bind:this={nodeRef.current}></div>
{:else} -->
<div
	class="p-4 bg-white rounded-lg shadow cursor-pointer"
	bind:this={nodeRef.current}
	{style}
	{...listeners.current}
	{...attributes.current}
>
	{task.content}
</div>
<!-- {/if} -->
