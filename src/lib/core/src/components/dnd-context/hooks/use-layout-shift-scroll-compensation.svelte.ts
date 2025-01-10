import type {DraggableNode} from '$core/store/types.js';
import {getRectDelta, getFirstScrollableAncestor} from '$core/utilities/index.js';
import type {MeasuringFunction} from '../types.js';
import type {ClientRect} from '../../../types/index.js';

interface Options {
	activeNode: DraggableNode | null | undefined;
	config: boolean | {x: boolean; y: boolean} | undefined;
	initialRect: ClientRect | null;
	measure: MeasuringFunction;
}

export function useLayoutShiftScrollCompensation(optionsFn: () => Options) {
	let initialized = false;
	const {activeNode, measure, initialRect, config = true} = $derived.by(optionsFn);
	const {x, y} = $derived(typeof config === 'boolean' ? {x: config, y: config} : config);

	$effect(() => {
		const disabled = !x && !y;

		if (disabled || !activeNode) {
			initialized = false;
			return;
		}

		if (initialized || !initialRect) {
			// Return early if layout shift scroll compensation was already attempted
			// or if there is no initialRect to compare to.
			return;
		}

		// Get the most up to date node ref for the active draggable
		const node = activeNode?.node;

		if (!node || node.isConnected === false) {
			// Return early if there is no attached node ref or if the node is
			// disconnected from the document.
			return;
		}

		const rect = measure(node);
		const rectDelta = getRectDelta(rect, initialRect);

		if (!x) {
			rectDelta.x = 0;
		}

		if (!y) {
			rectDelta.y = 0;
		}

		// Only perform layout shift scroll compensation once
		initialized = true;

		if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
			const firstScrollableAncestor = getFirstScrollableAncestor(node);

			if (firstScrollableAncestor) {
				firstScrollableAncestor.scrollBy({
					top: rectDelta.y,
					left: rectDelta.x,
				});
			}
		}
	});
}
