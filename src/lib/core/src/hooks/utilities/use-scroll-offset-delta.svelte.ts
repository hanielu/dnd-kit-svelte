import {defaultCoordinates} from '$core/utilities/index.js';
import {subtract, type Coordinates} from '$utilities';
import {untrack} from 'svelte';

export function useScrollOffsetsDelta(args: () => [scrollOffsets: Coordinates, dependencies?: any[]]) {
	const [scrollOffsets, dependencies] = $derived.by(args);
	let initialScrollOffsets = $state<Coordinates | null>(null);
	$effect(() => {
		void dependencies; // trigger re-run
		initialScrollOffsets = null;
	});

	$effect(() => {
		const hasScrollOffsets = scrollOffsets !== defaultCoordinates;

		if (hasScrollOffsets && !untrack(() => initialScrollOffsets)) {
			initialScrollOffsets = scrollOffsets;
		}

		if (!hasScrollOffsets && untrack(() => initialScrollOffsets)) {
			initialScrollOffsets = null;
		}
	});

	return {
		get current() {
			return initialScrollOffsets ? subtract(scrollOffsets, initialScrollOffsets) : defaultCoordinates;
		},
	};
}
