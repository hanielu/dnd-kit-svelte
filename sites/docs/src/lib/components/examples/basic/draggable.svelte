<script lang="ts">
	import {useDraggable} from '@dnd-kit-svelte/core';
	import {CSS} from '@dnd-kit-svelte/utilities';

	const {transform, listeners, attributes, node} = useDraggable({id: 'draggable'});

	const style = $derived(transform.current ? `transform: ${CSS.Translate.toString(transform.current)};` : '');
</script>

<div
	class="fw-bold bg-orange text-#F7F7F7 p-3.5 inline-flex rd-lg"
	{style}
	bind:this={node.current}
	{...listeners.current}
	{...attributes.current}
>
	Drag me
</div>
