import { isFunction, isObject } from "./is.js";
import type { Expand, Getter } from "./types.js";

export type MaybeBoxOrGetter<T> = T | Getter<T> | ReadableBox<T>;

const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");

export type ReadableBox<T> = {
	readonly [BoxSymbol]: true;
	readonly current: T;
};

export type WritableBox<T> = ReadableBox<T> & {
	readonly [isWritableSymbol]: true;
	current: T;
};

/**
 * @returns Whether the value is a Box
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function isBox(value: unknown): value is ReadableBox<unknown> {
	return isObject(value) && BoxSymbol in value;
}
/**
 * @returns Whether the value is a WritableBox
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function isWritableBox(value: unknown): value is WritableBox<unknown> {
	return box.isBox(value) && isWritableSymbol in value;
}

/**
 * Creates a writable box.
 *
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
export function box<T>(): WritableBox<T | undefined>;
/**
 * Creates a writable box with an initial value.
 *
 * @param initialValue The initial value of the box.
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
export function box<T>(initialValue: T): WritableBox<T>;
export function box(initialValue?: unknown) {
	let current = $state(initialValue);

	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current as unknown;
		},
		set current(v: unknown) {
			current = v;
		},
	};
}

/**
 * Creates a readonly box
 *
 * @param getter Function to get the value of the box
 * @returns A box with a `current` property whose value is the result of the getter.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxWith<T>(getter: () => T): ReadableBox<T>;
/**
 * Creates a writable box
 *
 * @param getter Function to get the value of the box
 * @param setter Function to set the value of the box
 * @returns A box with a `current` property which can be set to a new value.
 * Useful to pass state to other functions.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
function boxWith<T>(getter: () => T, setter?: (v: T) => void) {
	const derived = $derived.by(getter);

	if (setter) {
		return {
			[BoxSymbol]: true,
			[isWritableSymbol]: true,
			get current() {
				return derived;
			},
			set current(v: T) {
				setter(v);
			},
		};
	}

	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		},
	};
}

/**
 * Creates a box from either a static value, a box, or a getter function.
 * Useful when you want to receive any of these types of values and generate a boxed version of it.
 *
 * @returns A box with a `current` property whose value.
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxFrom<T>(value: T | WritableBox<T>): WritableBox<T>;
function boxFrom<T>(value: ReadableBox<T>): ReadableBox<T>;
function boxFrom<T>(value: Getter<T>): ReadableBox<T>;
function boxFrom<T>(value: MaybeBoxOrGetter<T>): ReadableBox<T>;
function boxFrom<T>(value: T): WritableBox<T>;
function boxFrom<T>(value: MaybeBoxOrGetter<T>) {
	if (box.isBox(value)) return value;
	if (isFunction(value)) return box.with(value);
	return box(value);
}

type GetKeys<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
type RemoveValues<T, U> = Omit<T, GetKeys<T, U>>;

type BoxFlatten<R extends Record<string, unknown>> = Expand<
	RemoveValues<
		{
			[K in keyof R]: R[K] extends WritableBox<infer T> ? T : never;
		},
		never
	> &
		RemoveValues<
			{
				readonly [K in keyof R]: R[K] extends WritableBox<infer _>
					? never
					: R[K] extends ReadableBox<infer T>
						? T
						: never;
			},
			never
		>
> &
	RemoveValues<
		{
			[K in keyof R]: R[K] extends ReadableBox<infer _> ? never : R[K];
		},
		never
	>;

/**
 * Function that gets an object of boxes, and returns an object of reactive values
 *
 * @example
 * const count = box(0)
 * const flat = box.flatten({ count, double: box.with(() => count.current) })
 * // type of flat is { count: number, readonly double: number }
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function boxFlatten<R extends Record<string, unknown>>(boxes: R): BoxFlatten<R> {
	return Object.entries(boxes).reduce<BoxFlatten<R>>((acc, [key, b]) => {
		if (!box.isBox(b)) {
			return Object.assign(acc, { [key]: b });
		}

		if (box.isWritableBox(b)) {
			Object.defineProperty(acc, key, {
				get() {
					return b.current;
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				set(v: any) {
					b.current = v;
				},
			});
		} else {
			Object.defineProperty(acc, key, {
				get() {
					return b.current;
				},
			});
		}

		return acc;
	}, {} as BoxFlatten<R>);
}

/**
 * Function that converts a box to a readonly box.
 *
 * @example
 * const count = box(0) // WritableBox<number>
 * const countReadonly = box.readonly(count) // ReadableBox<number>
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function toReadonlyBox<T>(b: ReadableBox<T>): ReadableBox<T> {
	if (!box.isWritableBox(b)) return b;

	return {
		[BoxSymbol]: true,
		get current() {
			return b.current;
		},
	};
}

box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;

export const read = boxWith;
