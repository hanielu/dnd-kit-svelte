<script lang="ts">
	import Droppable from '$lib/components/droppable.svelte';
	import SortableItem from './sortable-item.svelte';
	import {CollisionPriority} from '@dnd-kit/abstract';
	import {DragDropProvider, DragOverlay} from '@dnd-kit-svelte/svelte';
	import {move} from '@dnd-kit/helpers';
	import {sensors} from '$lib';
	import {RestrictToWindowEdges} from '@dnd-kit-svelte/svelte/modifiers';

	interface Todo {
		id: string;
		content: string;
	}

	const items = {
		'in-progress': [
			{id: 'task-1', content: 'Learn Svelte'},
			{id: 'task-2', content: 'Build a Kanban board'},
			{id: 'task-3', content: 'Review code'},
			{id: 'task-4', content: 'Setup project'},
		],
		done: [],
	};

	type Todos = Record<string, Todo[]>;
	let todos = $state<Todos>(items);
</script>

<DragDropProvider
	{sensors}
	modifiers={[RestrictToWindowEdges]}
	onDragOver={(event) => {
		todos = move(todos, event);
	}}
>
	<div class="grid gap-4 md:grid-cols-2">
		{@render taskList('in-progress', 'In Progress', todos['in-progress'])}
		{@render taskList('done', 'Done', todos['done'])}
	</div>

	<DragOverlay>
		{#snippet children(source)}
			{@const task = todos[source.data.group].find((todo) => todo.id === source.id)!}
			<SortableItem id={task.id} {task} index={0} isOverlay />
		{/snippet}
	</DragOverlay>
</DragDropProvider>

{#snippet taskList(id: string, title: string, tasks: Todo[])}
	<Droppable
		class="bg-#F9F9F9 rd-3xl p-3 pt-6"
		{id}
		type="column"
		accept="item"
		collisionPriority={CollisionPriority.Low}
	>
		<p class="text-lg fw-bold pb-3">{title}</p>

		<div class="grid gap-2">
			{#each tasks as task, index (task.id)}
				<SortableItem {task} id={task.id} index={() => index} group={id} data={{group: id}} type="item" />
			{/each}
		</div>
	</Droppable>
{/snippet}
