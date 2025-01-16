<script lang="ts">
	import {useDraggable, CSS} from 'svelte-dnd-kit';

	const {transform, listeners, attributes, node} = useDraggable({id: 'draggable'});

	const style = $derived(transform.current ? `transform: ${CSS.Translate.toString(transform.current)};` : '');
</script>

<div
	class="bg-blue-100 border-2 border-blue-300 rounded p-4 w-32 h-32 flex items-center justify-center cursor-move"
	{style}
	bind:this={node.current}
	{...listeners.current}
	{...attributes.current}
>
	Drag me
</div>
