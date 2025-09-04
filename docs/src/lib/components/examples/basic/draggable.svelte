<script lang="ts">
	import {useDraggable} from '@dnd-kit-svelte/svelte';

	const {ref} = useDraggable({id: 'draggable'});
</script>

<div class="fw-bold bg-orange text-#F7F7F7 p-3.5 inline-flex rd-lg" {@attach ref}>Drag me</div>
