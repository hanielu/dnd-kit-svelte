import {type Box, BoxSymbol} from './box.svelte.js';

const WritableLensSymbol = Symbol('is-writable-lens');

// Types
export type LensGetter<T> = (oldValue?: T) => T;
export type LensSetter<T> = (newValue: T) => void;

export interface WritableLensOptions<T, S = T> {
	get: LensGetter<T>;
	set: LensSetter<S>;
}

export type Lens<T> = Box<T> & {
	readonly current: T;
};

export type WritableLens<T> = Lens<T> & {
	[WritableLensSymbol]: true;
};

export function lens<T>(getter: LensGetter<T>): Lens<T>;
export function lens<T, S = T>(options: WritableLensOptions<T, S>): WritableLens<T>;
export function lens<T, S = T>(arg: LensGetter<T> | WritableLensOptions<T, S>): Lens<T> | WritableLens<T> {
	let prev: T | undefined;

	const get: LensGetter<T> = typeof arg === 'function' ? arg : arg.get;
	const set: LensSetter<S> | undefined = typeof arg === 'function' ? undefined : arg.set;

	const derived = $derived.by(() => {
		const next = get(prev);
		prev = next;
		return next;
	});

	if (set) {
		return {
			[BoxSymbol]: true,
			[WritableLensSymbol]: true,
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
		[BoxSymbol]: true,
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
