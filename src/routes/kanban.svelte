<script lang="ts">
	import {
		defaultDropAnimationSideEffects,
		DndContext,
		DragOverlay,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
		type DropAnimation,
	} from '$core/index.js';
	import {SortableContext, arrayMove} from '$sortable';
	import {Portal} from 'bits-ui';
	import Droppable from './droppable.svelte';
	import Task from './Task.svelte';

	class Todo {
		id = $state<string>('');
		content = $state<string>('');
		done = $state<boolean>(false);

		constructor(id: string, content: string, done: boolean) {
			this.id = id;
			this.content = content;
			this.done = done;
		}
	}

	const defaultTasks: Todo[] = [
		// new Todo('task-1', 'Learn Svelte', false),
		// new Todo('task-2', 'Build a Kanban board', false),
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
		// console.log('over', over);
		if (!over) return;

		if (over.id === 'done' || over.id === 'in-progress') {
			todos.find((todo) => todo.id === active.id)!.done = over.id === 'done';
			return;
		}
	}

	const dropAnimation: DropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: '0.5',
				},
			},
		}),
	};
</script>

<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
	<div class="p-8">
		<h1 class="text-2xl font-bold mb-4">In Progress</h1>

		<Droppable id="in-progress">
			<SortableContext items={inProgress}>
				<div class="p-4 bg-blue-200 grid gap-4 grid-cols-2">
					{#each inProgress as task (task.id)}
						<Task {task} />
					{/each}
				</div>
			</SortableContext>
		</Droppable>

		<div class="my-8"></div>

		<h1 class="text-2xl font-bold mb-4">Done</h1>

		<Droppable id="done">
			<SortableContext items={done}>
				<div class="p-4 bg-green-200 grid gap-4 grid-cols-2">
					{#each done as task (task.id)}
						<Task {task} />
					{/each}
				</div>
			</SortableContext>
		</Droppable>

		<Portal>
			<DragOverlay {dropAnimation}>
				<!-- Hello hguys -->
				{#if activeTodo && activeId}
					<Task task={activeTodo} />
				{/if}
			</DragOverlay>
		</Portal>
	</div>
</DndContext>
