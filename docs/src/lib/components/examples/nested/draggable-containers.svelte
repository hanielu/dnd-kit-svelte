<script lang="ts">
	import {DragDropProvider, DragOverlay} from '@dnd-kit-svelte/svelte';
	import {move} from '@dnd-kit/helpers';
	import {sensors} from '$lib';
	import TaskColumn from './task-column.svelte';
	import TaskItem from './task-item.svelte';

	let items = $state({
		'dev-tasks': [
			{id: 'setup-project', title: 'Setup Project', description: 'Initialize repository and configure tools'},
			{id: 'create-components', title: 'Create Components', description: 'Build reusable UI components'},
		],
		'design-tasks': [
			{id: 'color-palette', title: 'Color Palette', description: 'Define brand colors and variants'},
			{id: 'typography', title: 'Typography', description: 'Select and implement fonts'},
		],
	});

	const meta: Record<string, {title: string; description: string}> = {
		'dev-tasks': {title: 'Development Tasks', description: 'Technical implmentation tasks'},
		'design-tasks': {title: 'Design Tasks', description: 'UI/UX design related tasks'},
	};
</script>

<DragDropProvider
	{sensors}
	onDragOver={(event) => {
		const {source} = event.operation;
		if (source?.type === 'column') return;
		items = move(items, event);
	}}
>
	<div class="grid gap-3 md:grid-cols-2">
		{#each Object.entries(items) as [columnId, nesteds], colIdx (columnId)}
			<TaskColumn id={columnId} data={meta[columnId]} index={colIdx}>
				{#each nesteds as nested, nestedIdx (nested.id)}
					<TaskItem task={nested} index={nestedIdx} group={columnId} data={{group: columnId}} />
				{/each}
			</TaskColumn>
		{/each}
	</div>

	<p class="text-(sm center #9E9E9E) fw-medium pt-3">Drag and drop to reorder</p>

	<DragOverlay>
		{#snippet children(source)}
			<!-- if it has group, it's an item -->
			{#if source.data.group}
				{@const task = items[source.data.group as keyof typeof items]?.find((task) => task.id === source.id)!}
				<TaskItem {task} index={0} isOverlay />
			{:else}
				<!-- if it doesn't have group, it's a column -->
				<TaskColumn id={source.id} data={meta[source.id]} index={0} isOverlay>
					{#each items[source.id as keyof typeof items] as item, itemIdx (item.id)}
						<TaskItem task={item} index={itemIdx} group={source.id} data={{group: source.id}} />
					{/each}
				</TaskColumn>
			{/if}
		{/snippet}
	</DragOverlay>
</DragDropProvider>
