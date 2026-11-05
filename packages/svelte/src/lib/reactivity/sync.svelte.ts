import { batch, deepEqual } from "@dnd-kit/state";
import { untrack } from "svelte";
import { useBlockEffect } from "./effect.svelte.js";

/** Arrays (plugins, sensors, modifiers, `accept`) are compared by content, everything else by identity. */
function same(a: unknown, b: unknown): boolean {
	return Array.isArray(a) && Array.isArray(b) ? deepEqual(a, b) : Object.is(a, b);
}

/**
 * Calls `write` with the fields of `read()` that changed since its last run, untracked and in one dnd kit `batch`.
 * The values read during setup are the baseline, so `write` never runs on mount: entities are created with the
 * initial input already. The fields' type comes from `write`; annotate `read`'s return type too (`(): Fields =>`) so
 * a misspelled field is an error, since TypeScript doesn't check extra keys on an inferred return.
 */
export function useSync<T extends object>(
	read: () => NoInfer<T>,
	write: (changed: T) => void,
	{ pre = false }: { pre?: boolean } = {}
): void {
	let previous = read();
	const run = () => {
		const next = read();
		const changed: Partial<T> = {};
		let dirty = false;
		for (const key in next) {
			if (same(next[key], previous[key])) continue;
			changed[key] = next[key];
			dirty = true;
		}
		previous = next;
		if (dirty) untrack(() => batch(() => write(changed as T)));
	};

	if (pre) $effect.pre(run);
	else useBlockEffect(run);
}

/** A `write` for `useSync` that assigns the changed fields to `entity`. Like React, `data` is replaced, never cleared. */
export function assignTo<E extends object>(entity: E): (changed: Partial<E>) => void {
	return (changed) => {
		const { data, ...rest } = changed as Partial<E> & { data?: unknown };
		Object.assign(entity, rest);
		if (data) Object.assign(entity, { data });
	};
}
