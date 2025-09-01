import {type Ref, RefSymbol} from './ref.svelte.js';

const WritableComputedSymbol = Symbol('is-writable-computed');

// Types
export type ComputedGetter<T> = (oldValue?: T) => T;
export type ComputedSetter<T> = (newValue: T) => void;

export interface WritableComputedOptions<T, S = T> {
	get: ComputedGetter<T>;
	set: ComputedSetter<S>;
}

export type ComputedRef<T> = Ref<T> & {
	readonly current: T;
};

export type WritableComputedRef<T> = ComputedRef<T> & {
	[WritableComputedSymbol]: true;
};

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export function computed<T, S = T>(options: WritableComputedOptions<T, S>): WritableComputedRef<T>;
export function computed<T, S = T>(
	arg: ComputedGetter<T> | WritableComputedOptions<T, S>
): ComputedRef<T> | WritableComputedRef<T> {
	let prev: T | undefined;

	const get: ComputedGetter<T> = typeof arg === 'function' ? arg : arg.get;
	const set: ComputedSetter<S> | undefined = typeof arg === 'function' ? undefined : arg.set;

	const derived = $derived.by(() => {
		const next = get(prev);
		prev = next;
		return next;
	});

	if (set) {
		return {
			[RefSymbol]: true,
			[WritableComputedSymbol]: true,
			get current() {
				return derived;
			},
			set current(newValue: T) {
				set(newValue as unknown as S);
				prev = newValue;
			},
		};
	}

	return {
		[RefSymbol]: true,
		get current() {
			return derived;
		},

		// TBD If this is something desirable
		// get current() {
		// 	const next = get(prev);
		// 	prev = next;
		// 	return next;
		// },
	};
}
