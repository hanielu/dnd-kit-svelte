<script lang="ts">
	import Droppable from '$lib/components/droppable.svelte';
	import {sensors} from '$lib';
	import {
		DndContext,
		DragOverlay,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
		type Over,
		type Active,
	} from '@dnd-kit-svelte/core';
	import {SortableContext, arrayMove} from '@dnd-kit-svelte/sortable';
	import TasksContainer, {type NestedItem, type ContainerItem} from './tasks-container.svelte';
	import TaskItem from './task-item.svelte';

	const defaultItems: ContainerItem[] = [
		{
			data: {id: 'development-tasks', title: 'Development Tasks', description: 'Technical implementation tasks'},
			nesteds: [
				{id: 'setup-project', title: 'Setup Project', description: 'Initialize repository and configure tools'},
				{id: 'create-components', title: 'Create Components', description: 'Build reusable UI components'},
			],
		},
		{
			data: {id: 'design-tasks', title: 'Design Tasks', description: 'UI/UX design related tasks'},
			nesteds: [
				{id: 'color-palette', title: 'Color Palette', description: 'Define brand colors and variants'},
				{id: 'typography', title: 'Typography', description: 'Select and implement fonts'},
			],
		},
	];

	let items = $state<ContainerItem[]>(defaultItems);
	let activeItem = $state<NestedItem | ContainerItem | null>(null);
	let activeType = $state<'container' | 'item' | null>(null);

	function isContainerItem(item: NestedItem | ContainerItem | null): item is ContainerItem {
		return item !== null && 'nesteds' in item;
	}

	function isNestedItem(item: NestedItem | ContainerItem | null): item is NestedItem {
		return item !== null && !('nesteds' in item);
	}

	function findContainer(id: string): ContainerItem | null {
		const containerIndex = items.findIndex(
			(container) => container.data.id === id || container.nesteds.some((item) => item.id === id)
		);
		return containerIndex !== -1 ? items[containerIndex] : null;
	}

	function getTypeAndAccepts(active: Active, over: Over) {
		const activeType = active.data?.type as 'container' | 'item';
		const overType = over?.data?.type as 'container' | 'item' | undefined;
		const acceptsItem = over?.data?.accepts?.includes('item') ?? false;
		const acceptsContainer = over?.data?.accepts?.includes('container') ?? false;
		return {activeType, overType, acceptsItem, acceptsContainer};
	}

	function handleDragStart({active}: DragStartEvent) {
		const container = findContainer(active.id as string);
		activeType = active.data?.type as 'container' | 'item';

		if (active.data?.type === 'container') {
			activeItem = container ?? null;
		} else {
			activeItem = container?.nesteds.find((item) => item.id === active.id) ?? null;
		}
	}

	function handleDragEnd({active, over}: DragEndEvent) {
		if (!over) return;

		const {activeType, overType, acceptsItem, acceptsContainer} = getTypeAndAccepts(active, over);

		if (activeType === 'container' && (overType === 'container' || acceptsContainer)) {
			const oldIndex = items.findIndex((item) => item.data.id === active.id);
			const newIndex = items.findIndex((item) => item.data.id === over.id);
			items = arrayMove(items, oldIndex, newIndex);
			return;
		}

		if (activeType === 'item' && (overType === 'item' || acceptsItem)) {
			const activeContainer = findContainer(active.id as string);
			const overContainer = findContainer(over.id as string);

			if (!activeContainer || !overContainer) return;

			if (activeContainer === overContainer) {
				// Same container reorder
				const oldIndex = activeContainer.nesteds.findIndex((item) => item.id === active.id);
				const newIndex = activeContainer.nesteds.findIndex((item) => item.id === over.id);
				activeContainer.nesteds = arrayMove(activeContainer.nesteds, oldIndex, newIndex);
			} else {
				// Move between containers
				const item = activeContainer.nesteds.find((item) => item.id === active.id)!;
				activeContainer.nesteds = activeContainer.nesteds.filter((nested) => nested.id !== active.id);

				const insertIndex = overContainer.nesteds.findIndex((nested) => nested.id === over.id);
				overContainer.nesteds.splice(insertIndex, 0, item);
			}
		}
	}

	function handleDragOver({active, over}: DragOverEvent) {
		if (!over) return;

		const {activeType: _activeType, overType, acceptsItem} = getTypeAndAccepts(active, over);
		activeType = _activeType;

		if (activeType !== 'item' || (!overType && !acceptsItem)) return;

		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over.id as string);

		if (!activeContainer || !overContainer || activeContainer === overContainer) return;

		const item = activeContainer.nesteds.find((item) => item.id === active.id);
		if (!item) return;

		activeContainer.nesteds = activeContainer.nesteds.filter((nested) => nested.id !== active.id);
		overContainer.nesteds.push(item);
	}
</script>

<DndContext {sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
	<SortableContext items={items.map((item) => item.data.id)}>
		<Droppable id="container" data={{accepts: ['container']}}>
			<div class="grid gap-3 md:grid-cols-2">
				{#each items as { data, nesteds } (data.id)}
					{@render tasksContainer(data, nesteds)}
				{/each}
			</div>

			<p class="text-(sm center #9E9E9E) fw-medium pt-3">Drag and drop to reorder</p>
		</Droppable>
	</SortableContext>

	<DragOverlay>
		{#if isNestedItem(activeItem)}
			<TaskItem data={activeItem} type="item" />
		{:else if isContainerItem(activeItem)}
			{@render tasksContainer(activeItem.data, activeItem.nesteds, 'shadow-(gray-2 xl)')}
		{/if}
	</DragOverlay>
</DndContext>

{#snippet tasksContainer(data: NestedItem, nesteds: ContainerItem['nesteds'], className?: string)}
	<TasksContainer {data} type="container" accepts={['item']} class={className}>
		<SortableContext items={nesteds.map((item) => item.id)}>
			{#each nesteds as nested (nested.id)}
				<TaskItem data={nested} type="item" />
			{:else}
				<p class="text-(sm center #9E9E9E) fw-medium pt">No tasks</p>
			{/each}
		</SortableContext>
	</TasksContainer>
{/snippet}
