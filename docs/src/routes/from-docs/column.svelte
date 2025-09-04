<script lang="ts">
	import {useSortable} from '@dnd-kit-svelte/svelte/sortable';
	import {CollisionPriority} from '@dnd-kit/abstract';

	let {children, id, index} = $props();

	const {ref, isDropTarget} = useSortable({
		id,
		index: () => index,
		type: 'column',
		collisionPriority: CollisionPriority.Low,
		accept: ['item', 'column'],
	});
</script>

<div class={['Column', isDropTarget.current && 'bg-pink!']} {@attach ref}>
	{@render children()}
</div>
