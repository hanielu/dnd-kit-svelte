import {getScrollDirectionAndSpeed} from '$core/utilities/index.js';
import {useInterval, useLazyMemo, usePrevious} from '$utilities';
import type {Coordinates, ClientRect} from '../../types/index.js';
import {Direction} from '../../types/index.js';

export type ScrollAncestorSortingFn = (ancestors: Element[]) => Element[];

export enum AutoScrollActivator {
	Pointer,
	DraggableRect,
}

export interface Options {
	acceleration?: number;
	activator?: AutoScrollActivator;
	canScroll?: CanScroll;
	enabled?: boolean;
	interval?: number;
	layoutShiftCompensation?:
		| boolean
		| {
				x: boolean;
				y: boolean;
		  };
	order?: TraversalOrder;
	threshold?: {
		x: number;
		y: number;
	};
}

interface Arguments extends Options {
	draggingRect: ClientRect | null;
	enabled: boolean;
	pointerCoordinates: Coordinates | null;
	scrollableAncestors: Element[];
	scrollableAncestorRects: ClientRect[];
	delta: Coordinates;
}

export type CanScroll = (element: Element) => boolean;

export enum TraversalOrder {
	TreeOrder,
	ReversedTreeOrder,
}

interface ScrollDirection {
	x: 0 | Direction;
	y: 0 | Direction;
}

export function useAutoScroller(argsFn: () => Arguments) {
	const {
		acceleration,
		activator = AutoScrollActivator.Pointer,
		canScroll,
		draggingRect,
		enabled,
		interval = 5,
		order = TraversalOrder.TreeOrder,
		pointerCoordinates,
		scrollableAncestors = [],
		scrollableAncestorRects = [],
		delta,
		threshold,
	} = $derived.by(argsFn);

	const scrollIntent = useScrollIntent(() => [delta, !enabled]);
	const [setAutoScrollInterval, clearAutoScrollInterval] = useInterval();
	let scrollSpeed: Coordinates = {x: 0, y: 0};
	let scrollDirection: ScrollDirection = {x: 0, y: 0};
	const rect = $derived.by(() => {
		switch (activator) {
			case AutoScrollActivator.Pointer:
				return pointerCoordinates
					? {
							top: pointerCoordinates.y,
							bottom: pointerCoordinates.y,
							left: pointerCoordinates.x,
							right: pointerCoordinates.x,
						}
					: null;
			case AutoScrollActivator.DraggableRect:
				return draggingRect;
		}
	});
	let scrollContainerRef: Element | null = null;
	const autoScroll = () => {
		const scrollContainer = scrollContainerRef;

		if (!scrollContainer) {
			return;
		}

		const scrollLeft = scrollSpeed.x * scrollDirection.x;
		const scrollTop = scrollSpeed.y * scrollDirection.y;

		scrollContainer.scrollBy(scrollLeft, scrollTop);
	};
	const sortedScrollableAncestors = $derived.by(() =>
		order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors
	);

	// TODO: MIGHT NEED TO USE `watch` instead of `effect` here but we'll see
	$effect(() => {
		if (!enabled || !scrollableAncestors.length || !rect) {
			clearAutoScrollInterval();
			return;
		}

		for (const scrollContainer of sortedScrollableAncestors) {
			if (canScroll?.(scrollContainer) === false) {
				continue;
			}

			const index = scrollableAncestors.indexOf(scrollContainer);
			const scrollContainerRect = scrollableAncestorRects[index];

			if (!scrollContainerRect) {
				continue;
			}

			const {direction, speed} = getScrollDirectionAndSpeed(
				scrollContainer,
				scrollContainerRect,
				rect,
				acceleration,
				threshold
			);

			for (const axis of ['x', 'y'] as const) {
				if (!scrollIntent.current[axis][direction[axis] as Direction]) {
					speed[axis] = 0;
					direction[axis] = 0;
				}
			}

			if (speed.x > 0 || speed.y > 0) {
				clearAutoScrollInterval();

				scrollContainerRef = scrollContainer;
				setAutoScrollInterval(autoScroll, interval);

				scrollSpeed = speed;
				scrollDirection = direction;

				return;
			}
		}

		scrollSpeed = {x: 0, y: 0};
		scrollDirection = {x: 0, y: 0};
		clearAutoScrollInterval();
	});
}

interface ScrollIntent {
	x: Record<Direction, boolean>;
	y: Record<Direction, boolean>;
}

const defaultScrollIntent: ScrollIntent = {
	x: {[Direction.Backward]: false, [Direction.Forward]: false},
	y: {[Direction.Backward]: false, [Direction.Forward]: false},
};

function useScrollIntent(argsFn: () => [delta: Coordinates, disabled: boolean]) {
	const [delta, disabled] = $derived.by(argsFn);
	let previousDelta = $state.snapshot(delta);

	const intent = useLazyMemo<ScrollIntent>((previousIntent) => {
		if (disabled || !previousDelta || !previousIntent) {
			// Reset scroll intent tracking when auto-scrolling is disabled
			return defaultScrollIntent;
		}

		const direction = {
			x: Math.sign(delta.x - previousDelta.x),
			y: Math.sign(delta.y - previousDelta.y),
		};

		// Keep track of the user intent to scroll in each direction for both axis
		return {
			x: {
				[Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
				[Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1,
			},
			y: {
				[Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
				[Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1,
			},
		};
	});

	$effect(() => {
		previousDelta = delta;
	});

	return intent;
}
