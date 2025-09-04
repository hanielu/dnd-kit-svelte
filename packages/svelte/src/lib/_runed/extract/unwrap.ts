import type {FnObject, Getter, MaybeGetter, MaybeGetterObject} from './types.js';

/**
 * Resolves a value that may be a getter function or a direct value.
 *
 * If the input is a function, it will be invoked to retrieve the actual value.
 *
 * @template T - The expected return type.
 * @param value - A value or a function that returns a value.
 * @returns The resolved value or the default.
 */
export function resolve<T>(value: MaybeGetter<T>): T {
	return typeof value === 'function' ? (value as Function)() : value;
}

/**
 * Resolves an object whose properties may be getter functions or direct values.
 *
 * For each property in the input object, if the value is a function, it will be
 * invoked to retrieve the actual value.
 *
 * @template T - The expected object type.
 * @param obj - An object whose property values may be values or functions that return values.
 * @returns A new object with all properties resolved to their actual values.
 */
export function resolveObj<T extends object>(obj: MaybeGetterObject<T>): T {
	const out: Partial<T> = {};
	// const keys = Reflect.ownKeys(obj) as (keyof T)[];
	const keys = Object.keys(obj) as (keyof T)[];
	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		const v = (obj as any)[k];
		// inline extract to avoid extra call and Function cast
		(out as any)[k] = typeof v === 'function' ? (v as () => unknown)() : v;
	}
	return out as T;
}

export function toFn<T>(value: MaybeGetter<T>): Getter<T> {
	return typeof value === 'function' ? (value as Getter<T>) : () => value;
}

/**
 * Ensures all properties are functions.
 * If a property is already a function, keep it. Otherwise wrap it in a no-arg function.
 */
export function toFnObject<T extends object>(obj: MaybeGetterObject<T>): FnObject<T> {
	const out: Partial<FnObject<T>> = {};
	const keys = Object.keys(obj) as (keyof T)[];
	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		const v = obj[k];
		(out as any)[k] = typeof v === 'function' ? v : () => v;
	}
	return out as FnObject<T>;
}
