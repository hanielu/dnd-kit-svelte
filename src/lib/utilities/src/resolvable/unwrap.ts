import type {Resolvable, ResolvableObject} from './types.js';

/**
 * Unwraps a resolvable value by executing it if it's a function, or returning it directly if it's a value
 * @template T The type of the value to unwrap
 * @param value The resolvable value to unwrap
 * @returns The unwrapped value of type T
 */
export function unwrapResolvable<T>(value: Resolvable<T>): T {
	return typeof value === 'function' ? (value as Function)() : value;
}

/**
 * Unwraps all resolvable properties in an object by executing them if they're functions,
 * or returning them directly if they're values
 * @template T The type of the object whose properties should be unwrapped
 * @param obj The object with resolvable properties
 * @returns A new object with all properties unwrapped
 */
export function unwrapResolvableObject<T extends Record<string, any>>(obj: ResolvableObject<T>): T {
	return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, unwrapResolvable(value)])) as T;
}
