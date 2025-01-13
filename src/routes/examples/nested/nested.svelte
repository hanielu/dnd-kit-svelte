<script lang="ts">
	import Droppable from '$components/droppable.svelte';
	import {dropAnimation, sensors} from '$components/index.js';
	import {
		DndContext,
		DragOverlay,
		SortableContext,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
		arrayMove,
		type Over,
		type Active,
	} from 'svelte-dnd-kit';

	import NestedItem, {type INestedItem, type IData} from './nested-item.svelte';

	const defaultItems: INestedItem[] = [
		{
			data: {
				id: 'development-tasks',
				title: 'Development Tasks',
				description: 'Technical implementation tasks',
			},
			nesteds: [
				{
					id: 'setup-project',
					title: 'Setup Project',
					description: 'Initialize repository and configure tools',
				},
				{
					id: 'create-components',
					title: 'Create Components',
					description: 'Build reusable UI components',
				},
			],
		},
		{
			data: {id: 'design-tasks', title: 'Design Tasks', description: 'UI/UX design related tasks'},
			nesteds: [
				{
					id: 'color-palette',
					title: 'Color Palette',
					description: 'Define brand colors and variants',
				},
				{
					id: 'typography',
					title: 'Typography',
					description: 'Select and implement fonts',
				},
			],
		},
	];

	let items = $state<INestedItem[]>(defaultItems);
	let activeId = $state<string | null>(null);
	let activeItem = $state<IData | null>(null);
	let activeType = $state<'container' | 'item' | null>(null);

	const findContainer = (id: string) => {
		for (const container of items) {
			if (container.data.id === id) return container;
			if (container.nesteds.find((item) => item.id === id)) return container;
		}
		return null;
	};

	function getTypeAndAccepts(active: Active, over: Over) {
		const activeType = active.data?.type;
		const overType = over?.data?.type;
		const acceptsItem = over?.data?.accepts?.includes('item');
		const acceptsContainer = over?.data?.accepts?.includes('container');
		return {activeType, overType, acceptsItem, acceptsContainer};
	}

	const handleDragStart = ({active}: DragStartEvent) => {
		activeId = active.id as string;
	};

	const handleDragEnd = ({active, over}: DragEndEvent) => {
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

			const isSameContainer = activeContainer?.data.id === overContainer?.data.id;

			if (activeContainer && overContainer) {
				if (isSameContainer) {
					const oldIndex = activeContainer.nesteds.findIndex((item) => item.id === active.id);
					const newIndex = overContainer.nesteds.findIndex((item) => item.id === over.id);
					activeContainer.nesteds = arrayMove(activeContainer.nesteds, oldIndex, newIndex);
				} else {
					const oldIndex = activeContainer.nesteds.findIndex((item) => item.id === active.id);
					const newIndex = activeContainer.nesteds.findIndex((item) => item.id === over.id);
					activeContainer.nesteds = arrayMove(activeContainer.nesteds, oldIndex, newIndex);
				}
			}
		}
	};

	const handleDragOver = ({active, over}: DragOverEvent) => {
		if (!over) return;

		const {activeType: _activeType, overType, acceptsItem} = getTypeAndAccepts(active, over);
		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over.id as string);

		activeType = _activeType;

		if (activeType === 'item') {
			activeItem = activeContainer?.nesteds.find((item) => item.id === active.id)!;
		} else if (activeType === 'container') {
			activeItem = activeContainer?.data!;
		}

		if (activeType === 'item' && (overType === 'item' || acceptsItem)) {
			const isSameContainer = activeContainer?.data.id === overContainer?.data.id;

			if (activeContainer && overContainer) {
				if (!isSameContainer) {
					activeContainer.nesteds = activeContainer.nesteds.filter((item) => item.id !== active.id);
					overContainer.nesteds.push(activeItem!);
				}
			}
		}
	};
</script>

<DndContext {sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
	<Droppable class="p-4 bg-blue-200 grid gap-4" id="container" data={{accepts: ['container']}}>
		<h2 class="text-2xl font-bold">Draggable Containers</h2>
		<SortableContext items={items.map((item) => item.data.id)}>
			{#each items as { data, nesteds } (data.id)}
				<NestedItem {data} type="container" accepts={['item']}>
					<SortableContext items={nesteds.map((item) => item.id)}>
						{#each nesteds as nested (nested.id)}
							<NestedItem data={nested} type="item" />
						{/each}
					</SortableContext>
				</NestedItem>
			{/each}
		</SortableContext>
	</Droppable>

	<DragOverlay {dropAnimation}>
		{#if activeItem && activeId}
			<NestedItem data={activeItem} type={activeType ?? 'item'} />
		{/if}
	</DragOverlay>
</DndContext>
