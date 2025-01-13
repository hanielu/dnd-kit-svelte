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

	let items = $state<INestedItem[]>(defaultItems);
	let activeId = $state<string | null>(null);
	let activeItem = $state<IData | null>(null);
	let activeType = $state<'container' | 'item' | null>(null);

	const findContainer = (id: string): INestedItem | null => {
		const containerIndex = items.findIndex(
			(container) => container.data.id === id || container.nesteds.some((item) => item.id === id)
		);
		return containerIndex !== -1 ? items[containerIndex] : null;
	};

	function getTypeAndAccepts(active: Active, over: Over) {
		const activeType = active.data?.type as 'container' | 'item';
		const overType = over?.data?.type as 'container' | 'item' | undefined;
		const acceptsItem = over?.data?.accepts?.includes('item') ?? false;
		const acceptsContainer = over?.data?.accepts?.includes('container') ?? false;
		return {activeType, overType, acceptsItem, acceptsContainer};
	}

	const handleDragStart = ({active}: DragStartEvent) => {
		activeId = active.id as string;
		const container = findContainer(active.id as string);
		activeType = active.data?.type as 'container' | 'item';

		if (active.data?.type === 'container') {
			activeItem = container?.data ?? null;
		} else {
			activeItem = container?.nesteds.find((item) => item.id === active.id) ?? null;
		}
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
	};

	const handleDragOver = ({active, over}: DragOverEvent) => {
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
