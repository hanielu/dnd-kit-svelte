import { computed, effect, signal as createSignal, type ReadonlySignal } from "@dnd-kit/state";
import { createSubscriber } from "svelte/reactivity";

/**
 * Notifies Svelte when a dnd-kit effect's dependencies change. The first run only collects them: whoever subscribes
 * reads the latest values right after, so calling `update` there would be a write during their own read.
 */
function subscriber(track: () => boolean | void) {
	return createSubscriber((update) => {
		let first = true;
		return effect(() => {
			const changed = track();
			if (first) first = false;
			else if (changed !== false) update();
		});
	});
}

/** A `@dnd-kit/state` signal as `{ current }`, reactive in Svelte effects, deriveds and templates. */
export class SignalLens<T> {
	readonly #signal: ReadonlySignal<T>;
	readonly #subscribe: () => void;

	constructor(signal: ReadonlySignal<T>) {
		this.#signal = signal;
		this.#subscribe = subscriber(() => void signal.value);
	}

	get current(): T {
		this.#subscribe();
		return this.#signal.peek();
	}
}

/** A {@link SignalLens} over `computed(compute)`. */
export function useComputed<T>(compute: () => T): SignalLens<T> {
	return new SignalLens(computed(compute));
}

/**
 * Proxies `target` so that reading one of its signal-backed properties in Svelte subscribes to it. Properties read
 * for the first time after the subscription started join it on the next microtask: that write must not happen while
 * Svelte is reading.
 */
export function useDeepSignal<T extends object>(target: T): T {
	const tracked = new Map<PropertyKey, unknown>();
	const keys = createSignal(0);
	let queued = false;

	const subscribe = subscriber(() => {
		void keys.value;
		let changed = false;
		for (const [key, value] of tracked) {
			const latest = target[key as keyof T];
			if (!Object.is(value, latest)) {
				tracked.set(key, latest);
				changed = true;
			}
		}
		return changed;
	});

	return new Proxy(target, {
		get(target, key) {
			const value = target[key as keyof T];
			// Later reads must not move the baseline the effect compares against.
			if (!tracked.has(key)) {
				tracked.set(key, value);
				if (!queued) {
					queued = true;
					queueMicrotask(() => {
						queued = false;
						keys.value = tracked.size;
					});
				}
			}
			subscribe();
			return value;
		},
	});
}
