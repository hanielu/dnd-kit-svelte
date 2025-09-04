import {effect, untracked} from '@dnd-kit/state';
import {createSubscriber} from 'svelte/reactivity';

/** Trigger a re-render when reading signal properties of an object. */
export function useDeepSignal<T extends object | null | undefined>(target: T): T {
	if (!target) return target;

	const tracked = new Map<string | symbol, any>();

	const subscribe = createSubscriber((update) =>
		effect(() => {
			for (const entry of tracked) {
				const [key] = entry;
				const prev = untracked(() => entry[1]);
				const latest = (target as any)[key];
				if (prev !== latest) {
					update();
					tracked.set(key, latest);
				}
			}
		})
	);

	return new Proxy(target, {
		get(target, key) {
			const value = (target as any)[key];

			tracked.set(key, value);

			// Make this getter reactive if read in a Svelte effect/derived
			subscribe();

			return value;
		},
	});
}
