import {effect, type Signal} from '@dnd-kit/state';
import {createSubscriber} from 'svelte/reactivity';

/** Trigger a re-run of Svelte effects/derivations when reading a @dnd-kit/state Signal. */
export function useSignal<T = any>(signal: Signal<T>, _sync = false) {
	let previous = signal.peek();

	const subscribe = createSubscriber((update) => {
		return effect(() => {
			const current = signal.value;

			if (previous !== current) {
				previous = current;
				update();
			}
		});
	});

	return {
		get value() {
			// Make this getter reactive if read in a Svelte effect/derived
			subscribe();
			return signal.peek();
		},
	};
}
