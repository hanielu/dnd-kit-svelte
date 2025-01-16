<script lang="ts">
	import {useDroppable} from 'svelte-dnd-kit';

	let props = $props();
	const {isOver, node} = useDroppable({id: 'droppable'});
</script>

<div
	class="bg-green-100 border-2 border-green-300 rounded p-4 w-64 h-64 flex items-center justify-center"
	bind:this={node.current}
>
	{@render props.children()}
</div>
