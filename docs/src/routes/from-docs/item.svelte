<script lang="ts">
	import {useSortable} from '@dnd-kit-svelte/svelte/sortable';

	let {id, index, column} = $props();

	const {ref, isDragging} = useSortable({
		id,
		index: () => index,
		type: 'item',
		accept: 'item',
		group: column,
	});
</script>

<div class="Item" {@attach ref} data-dragging={isDragging.current}>
	{id}
</div>
