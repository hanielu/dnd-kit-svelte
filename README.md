# @adroyt/svelte-dnd-kit

A Svelte port of the powerful [@dnd-kit]([dnd-kit]) library - the modern, lightweight, performant, accessible and extensible drag & drop toolkit.

## Overview

This library provides a complete port of dnd-kit to Svelte, maintaining feature parity with the original React implementation while adapting to Svelte's reactivity system. All documentation and APIs from the [original dnd-kit]([dnd-kit]) library apply here, with some Svelte-specific adaptations.

## Key Differences from React Implementation

The main difference lies in how reactive values are handled. Since Svelte components don't rerender the same way React components do, we've adapted the API to work with Svelte's reactivity system.

### Using Functions for Reactive Values

In hooks like `useSortable`, `useDraggable`, etc., you can pass a function to any field that needs to be reactive. The function will be called whenever the value needs to be accessed, ensuring you always get the latest value from Svelte's reactive scope.

Example:

```ts
// React dnd-kit
useSortable({
	id: item.id,
	data: item,
});

// Svelte dnd-kit
useSortable({
	// Static value
	id: item.id,
	// Reactive value using a function
	data: () => item, // Access reactive state value
});
```

## Practical Example: List Board

Here's a real-world example of implementing a List board with drag and drop functionality:

```html
<!-- Task.svelte -->
<script lang="ts">
	import {useSortable} from '@adroyt/svelte-dnd-kit';
	import {CSS, styleObjectToString} from '@adroyt/svelte-dnd-kit/utilities';

	let {task} = $props();

	// Initialize sortable functionality
	const {attributes, listeners, node, transform, transition, isDragging} = useSortable({
		id: task.id,
	});

	// Compute dynamic styles based on drag state
	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: transition.current,
			zIndex: isDragging.current ? 1 : undefined,
		})
	);
</script>

<div bind:this="{node.current}" {style} {...listeners.current} {...attributes.current}>
	<div class="task-content" class:dragging="{isDragging.current}">{task.content}</div>
</div>
```

```html
<!-- List.svelte -->
<script lang="ts">
	import {DndContext, DragOverlay} from '@adroyt/svelte-dnd-kit';
	import {SortableContext, arrayMove} from '@adroyt/svelte-dnd-kit/sortable';

	// State management
	let todos = $state([
		{id: 'task-1', content: 'Learn Svelte', done: false},
		{id: 'task-2', content: 'Build Kanban', done: false},
	]);
	let activeId = $state(null);

	// Computed values
	const done = $derived(todos.filter((task) => task.done));
	const inProgress = $derived(todos.filter((task) => !task.done));

	function handleDragEnd({active, over}) {
		if (!over) return;

		if (over.id === 'done' || over.id === 'in-progress') {
			// Handle dropping into different lists
			todos.find((todo) => todo.id === active.id).done = over.id === 'done';
			return;
		}

		// Handle reordering
		const oldIndex = todos.findIndex((todo) => todo.id === active.id);
		const newIndex = todos.findIndex((todo) => todo.id === over.id);
		todos = arrayMove(todos, oldIndex, newIndex);
	}
</script>

<DndContext onDragEnd={handleDragEnd}>
	<!-- In Progress Column -->
	<SortableContext items={inProgress}>
		<div class="column">
			{#each inProgress as task (task.id)}
				<Task {task} />
			{/each}
		</div>
	</SortableContext>

	<!-- Done Column -->
	<SortableContext items={done}>
		<div class="column">
			{#each done as task (task.id)}
				<Task {task} />
			{/each}
		</div>
	</SortableContext>

	<!-- Drag Overlay -->
	<DragOverlay>
		{#if activeId}
			<Task task={todos.find((t) => t.id === activeId)} />
		{/if}
	</DragOverlay>
</DndContext>
```

## Core Concepts

All core concepts from dnd-kit remain the same:

- Draggable elements
- Droppable areas
- DndContext provider
- Sensors
- Modifiers
- Collision detection

For detailed documentation on these concepts, please refer to the [original dnd-kit documentation]([dnd-kit-docs]).

## Installation

```bash
npm install @adroyt/svelte-dnd-kit
# or
yarn add @adroyt/svelte-dnd-kit
```

## License

MIT © [Adroyt](https://github.com/adroyt)

[dnd-kit]: (https://github.com/clauderic/dnd-kit)
[dnd-kit-docs]: (https://docs.dndkit.com/)
