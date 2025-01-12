/**
 * Represents a value that can either be of type T or a function that returns type T
 * @template T The type of the value or return value
 */
export type Resolvable<T> = T | (() => T);

/**
 * Makes all properties of an object type resolvable (either the value or a function returning the value)
 * @template T The object type whose properties should be made resolvable
 */
export type ResolvableObject<T> = {
	[K in keyof T]: Resolvable<T[K]>;
};

export type UnwrapResolvable<T> = T extends Resolvable<infer U> ? U : T;

export type UnwrapResolvableObject<T> = {
	[K in keyof T]: UnwrapResolvable<T[K]>;
};
