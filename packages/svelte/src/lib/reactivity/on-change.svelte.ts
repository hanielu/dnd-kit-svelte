import { untrack } from "svelte";

export interface OnChangeOptions<T> {
	/** Run before the DOM updates (`$effect.pre`) instead of after it. */
	pre?: boolean;
	/** @default Object.is */
	equals?: (a: T, b: T) => boolean;
}

/**
 * Calls `onChange` whenever `read` returns a different value. The value `read` returns during setup is the baseline,
 * so `onChange` never runs on mount: entities are created with the initial input already.
 */
export function useOnValueChange<T>(
	read: () => T,
	onChange: (value: T) => void,
	{ pre = false, equals = Object.is }: OnChangeOptions<T> = {}
): void {
	let previous = read();
	const run = () => {
		const value = read();
		if (equals(value, previous)) return;
		previous = value;
		untrack(() => onChange(value));
	};

	if (pre) $effect.pre(run);
	else $effect(run);
}
