import type {Renderer as AbstractRenderer} from '@dnd-kit/abstract';

export type Renderer = {
	renderer: AbstractRenderer;
	trackRendering: (callback: () => void) => void;
};

// Does this work? Idk, best to keep it though.
export function useRenderer(): Renderer {
	let version = $state(0);
	let rendering: Promise<void> | null = null;
	let resolve: (() => void) | null = null;

	$effect.pre(() => {
		void version;

		resolve?.();
		rendering = null;
	});

	return {
		renderer: {
			get rendering() {
				return rendering ?? Promise.resolve();
			},
		},
		trackRendering(callback: () => void) {
			if (!rendering) {
				rendering = new Promise<void>((res) => {
					resolve = res;
				});
			}

			callback();
			version++;
		},
	};
}
