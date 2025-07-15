<script lang="ts" module>
	import type {Disabled} from '../types/disabled.js';
	import type {SortingStrategy} from '../types/strategies.js';
	import {getContext, hasContext, setContext, type Snippet} from 'svelte';
	import {useDndContext, type UniqueIdentifier, type ClientRect} from '@dnd-kit-svelte/core';
	import {getSortedRects, itemsEqual, normalizeDisabled} from '../utilities/index.js';
	import {rectSortingStrategy} from '../strategies/index.js';
	import {useUniqueId} from '@dnd-kit-svelte/utilities';
	import {watch} from 'runed';

	export interface Props {
		children: Snippet;
		items: (UniqueIdentifier | {id: UniqueIdentifier})[];
		strategy?: SortingStrategy;
		id?: string;
		disabled?: boolean | Disabled;
	}

	const ID_PREFIX = 'Sortable';

	interface ContextDescriptor {
		activeIndex: number;
		containerId: string;
		disabled: Disabled;
		disableTransforms: boolean;
		items: UniqueIdentifier[];
		overIndex: number;
		useDragOverlay: boolean;
		sortedRects: ClientRect[];
		strategy: SortingStrategy;
	}

	export const SortableContextKey = Symbol('SortableContext');

	// TODO: remove ?
	export const defaultSortableContextValue: ContextDescriptor = {
		activeIndex: -1,
		containerId: ID_PREFIX,
		disableTransforms: false,
		items: [],
		overIndex: -1,
		useDragOverlay: false,
		sortedRects: [],
		strategy: rectSortingStrategy,
		disabled: {
			draggable: false,
			droppable: false,
		},
	};

	export function getSortableContext() {
		if (!hasContext(SortableContextKey)) return defaultSortableContextValue;
		return getContext<() => ContextDescriptor>(SortableContextKey)();
	}
</script>

<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
	let {
		children,
		id,
		items: userDefinedItems = [], // is required
		strategy = rectSortingStrategy,
		disabled: disabledProp = false,
	}: Props = $props();

	const {active, dragOverlay, droppableRects, over, measureDroppableContainers} = $derived(useDndContext());
	const containerId = $derived(useUniqueId(ID_PREFIX, id));
	const useDragOverlay = $derived(Boolean(dragOverlay.rect !== null));
	const items = $derived(userDefinedItems.map((item) => (typeof item === 'object' && 'id' in item ? item.id : item)));
	const isDragging = $derived(active != null);
	const activeIndex = $derived(active ? items.indexOf(active.id) : -1);
	const overIndex = $derived(over ? items.indexOf(over.id) : -1);

	let previousItemsRef = $state(items);

	const itemsHaveChanged = $derived(!itemsEqual(items, previousItemsRef));
	const disableTransforms = $derived((overIndex !== -1 && activeIndex === -1) || itemsHaveChanged);
	const disabled = normalizeDisabled(disabledProp);

	watch(
		() => [itemsHaveChanged, items, isDragging] as const,
		([itemsHaveChanged, items, isDragging]) => {
			if (itemsHaveChanged && isDragging) {
				measureDroppableContainers(items);
			}
		}
	);

	$effect(() => {
		previousItemsRef = items;
	});

	const contextValue = $derived({
		activeIndex,
		containerId,
		disabled,
		disableTransforms,
		items,
		overIndex,
		useDragOverlay,
		sortedRects: getSortedRects(items, droppableRects),
		strategy,
	});

	setContext(SortableContextKey, () => contextValue);
</script>

{@render children()}
