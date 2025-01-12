import type {ClientRect} from '$core/types/rect.js';
import type {DroppableContainer, RectMap} from '$core/store/types.js';
import type {UniqueIdentifier} from '$core/types/other.js';
import {box} from 'svelte-toolbelt';
import {Rect} from '$core/utilities/rect/index.js';
import {untrack} from 'svelte';
import {useLazyMemo} from '$utilities';

interface Arguments {
	dragging: boolean;
	dependencies: any[];
	config: DroppableMeasuring;
}

export enum MeasuringStrategy {
	Always,
	BeforeDragging,
	WhileDragging,
}

export enum MeasuringFrequency {
	Optimized = 'optimized',
}

type MeasuringFunction = (element: HTMLElement) => ClientRect;

export interface DroppableMeasuring {
	measure: MeasuringFunction;
	strategy: MeasuringStrategy;
	frequency: MeasuringFrequency | number;
}

const defaultValue: RectMap = new Map();

type DroppableMeasuringOptions = () => {
	containers: DroppableContainer[];
	dragging: boolean;
	dependencies: () => any[];
	config: DroppableMeasuring;
};

export function useDroppableMeasuring(options: DroppableMeasuringOptions) {
	const {
		containers,
		dragging,
		dependencies,
		config: {measure, strategy, frequency},
	} = $derived(options());
	let queue = $state<UniqueIdentifier[] | null>(null);
	let containersRef = containers;
	const disabled = $derived(isDisabled());

	const measureDroppableContainers = (ids: UniqueIdentifier[] = []) => {
		if (disabled) return;
		queue = queue === null ? ids : queue.concat(ids.filter((id) => !queue!.includes(id)));
	};
	let timeoutId: NodeJS.Timeout | null = null;
	const droppableRects = useLazyMemo<RectMap>((previousValue) => {
		if (disabled && !dragging) {
			return defaultValue;
		}

		if (!previousValue || previousValue === defaultValue || containersRef !== containers || queue != null) {
			const map: RectMap = new Map();

			for (const container of containers) {
				if (!container) {
					continue;
				}

				if (queue && queue.length > 0 && !queue.includes(container.id) && container.rect) {
					// This container does not need to be re-measured
					map.set(container.id, container.rect);
					continue;
				}

				const node = container.node;
				const rect = node ? new Rect(measure(node), node) : null;

				container.rect = rect;

				if (rect) {
					map.set(container.id, rect);
				}
			}

			return map;
		}

		return previousValue;
	});

	$effect(() => {
		containersRef = containers;
	});

	$effect(() => {
		void dragging; // trigger re-run
		if (disabled) return;
		untrack(measureDroppableContainers);
	});

	$effect(() => {
		if (queue && queue.length > 0) {
			queue = null;
		}
	});

	$effect(() => {
		dependencies(); // trigger re-run
		if (disabled || typeof frequency !== 'number' || timeoutId !== null) {
			return;
		}

		timeoutId = setTimeout(() => {
			measureDroppableContainers();
			timeoutId = null;
		}, frequency);
	});

	return {
		droppableRects: box.with(() => droppableRects.current),
		measureDroppableContainers,
		measuringScheduled: box.with(() => queue !== null),
	};

	function isDisabled() {
		switch (strategy) {
			case MeasuringStrategy.Always:
				return false;
			case MeasuringStrategy.BeforeDragging:
				return dragging;
			default:
				return !dragging;
		}
	}
}
