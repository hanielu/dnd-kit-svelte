import { isFunction } from "./is.js";
import { type MaybeBoxOrGetter, box } from "./box.svelte.js";
import type { Getter } from "./types.js";

export function unbox<T>(value: MaybeBoxOrGetter<T>): T {
	if (box.isBox(value)) {
		return value.current;
	}

	if (isFunction(value)) {
		const getter = value as Getter<T>;
		return getter();
	}

	return value;
}
