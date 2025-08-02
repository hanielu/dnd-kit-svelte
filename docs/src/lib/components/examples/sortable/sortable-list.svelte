<script lang="ts">
	import Droppable from '$lib/components/droppable.svelte';
	import SortableItem from './sortable-item.svelte';
	import {
		DndContext,
		DragOverlay,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
	} from '@dnd-kit-svelte/core';
	import {SortableContext, arrayMove} from '@dnd-kit-svelte/sortable';
	import {dropAnimation, sensors} from '$lib';
	import {crossfade} from 'svelte/transition';

	interface Todo {
		id: string;
		content: string;
		done: boolean;
	}

	const defaultTasks: Todo[] = [
		{id: 'task-1', content: 'Learn Svelte', done: false},
		{id: 'task-2', content: 'Build a Kanban board', done: false},
		{id: 'task-3', content: 'Review code', done: false},
		{id: 'task-4', content: 'Setup project', done: false},
	];

	let todos = $state<Todo[]>(defaultTasks);
	let activeId = $state<string | null>(null);

	const activeTodo = $derived(todos.find((todo) => todo.id === activeId));
	const done = $derived(todos.filter((task) => task.done));
	const inProgress = $derived(todos.filter((task) => !task.done));

	function handleDragStart(event: DragStartEvent) {
		activeId = event.active.id as string;
	}

	function handleDragEnd({active, over}: DragEndEvent) {
		if (!over) return;

		if (over.id === 'done' || over.id === 'in-progress') {
			todos.find((todo) => todo.id === active.id)!.done = over.id === 'done';
			return;
		}

		const overTodo = $state.snapshot(todos.find((todo) => todo.id === over?.id));
		if (!overTodo || activeId === overTodo.id) return;

		const oldIndex = todos.findIndex((todo) => todo.id === active.id);
		const newIndex = todos.findIndex((todo) => todo.id === over.id);
		todos = arrayMove(todos, oldIndex, newIndex);

		activeId = null;
	}

	function handleDragOver({active, over}: DragOverEvent) {
		if (!over) return;

		const activeTask = todos.find((todo) => todo.id === active.id);
		if (!activeTask) return;

		// Handle container drag-over
		if (over.id === 'done' || over.id === 'in-progress') {
			activeTask.done = over.id === 'done';
			return;
		}

		// Handle item drag-over
		const overTask = todos.find((todo) => todo.id === over.id);
		if (!overTask) return;

		// Update the active task's done status to match the container it's being dragged over
		activeTask.done = overTask.done;
	}

	const [send, recieve] = crossfade({duration: 100});
</script>

<DndContext {sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
	<div class="grid gap-4 md:grid-cols-2">
		{@render taskList('in-progress', 'In Progress', inProgress)}
		{@render taskList('done', 'Done', done)}
	</div>

	<DragOverlay {dropAnimation}>
		{#if activeTodo && activeId}
			<SortableItem task={activeTodo} />
		{/if}
	</DragOverlay>
</DndContext>

{#snippet taskList(id: string, title: string, tasks: Todo[])}
	<SortableContext items={tasks}>
		<Droppable class="bg-#F9F9F9 rd-3xl p-3 pt-6" {id}>
			<p class="text-lg fw-bold pb-3">{title}</p>

			<div class="grid gap-2">
				{#each tasks as task (task.id)}
					<div class="" in:recieve={{key: task.id}} out:send={{key: task.id}}>
						<SortableItem {task} />
					</div>
				{/each}
			</div>
		</Droppable>
	</SortableContext>
{/snippet}
