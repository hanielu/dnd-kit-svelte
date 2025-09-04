<script lang="ts">
	import './styles.css';
	import Column from './column.svelte';
	import Item from './item.svelte';
	import {DragDropProvider} from '@dnd-kit-svelte/svelte';
	import {move} from '@dnd-kit/helpers';

	let items = $state({
		A: ['A0', 'A1', 'A2'],
		B: ['B0', 'B1'],
		C: [],
	});
</script>

<DragDropProvider
	onDragOver={(event) => {
		const {source} = event.operation;
		if (source?.type === 'column') return;
		items = move(items, event);
	}}
>
	<div class="Root">
		{#each Object.entries(items) as [column, _items], colIdx (column)}
			<Column id={column} index={colIdx}>
				{#each _items as id, itemIdx (id)}
					<Item {id} {column} index={itemIdx} />
				{/each}
			</Column>
		{/each}
	</div>
</DragDropProvider>
