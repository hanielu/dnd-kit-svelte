// import {createSignal, batch, createEffect, on} from 'solid-js';

import type {DragDropManager} from '@dnd-kit/dom';
import {watch} from 'runed';

type Renderer = DragDropManager['renderer'];

export function useRenderer(): {renderer: Renderer; trackRendering: (callback: () => void) => void} {
	let transitionCount = $state(0);
	let rendering = $state<Promise<void>>(Promise.resolve());
	let resolver: (() => void) | null = null;

	// Resolve rendering promise when transitionCount changes
	watch(
		() => transitionCount,
		() => {
			resolver?.();
			void (rendering = Promise.resolve());
		}
	);

	const renderer = {
		get rendering() {
			return rendering;
		},
	};

	function trackRendering(callback: () => void) {
		if (rendering === Promise.resolve()) {
			const newRendering = new Promise<void>((resolve) => {
				resolver = resolve;
			});
			void (rendering = newRendering);
		}

		// batch(() => {
		callback();
		transitionCount = transitionCount + 1;
		// });
	}

	return {
		renderer,
		trackRendering,
	};
}
