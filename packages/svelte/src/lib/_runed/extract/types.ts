/**
 * Represents a value that can either be of type T or a function that returns type T
 * @template T The type of the value or return value
 */
export type MaybeGetter<T> = T | Getter<T>;
export type Getter<T> = () => T;

/**
 * Makes all properties of an object type resolvable (either the value or a function returning the value)
 * @template T The object type whose properties should be made resolvable
 */
export type MaybeGetterObject<T> = {
	[K in keyof T]: MaybeGetter<T[K]>;
};

export type UnwrapMaybeGetter<T> = T extends MaybeGetter<infer U> ? U : T;

export type UnwrapMaybeGetterObject<T> = {
	[K in keyof T]: UnwrapMaybeGetter<T[K]>;
};

export type FnObject<T extends object> = {
	[K in keyof T]: Getter<Exclude<T[K], undefined>>;
};
