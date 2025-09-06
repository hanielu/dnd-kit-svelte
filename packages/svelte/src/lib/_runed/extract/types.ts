type AnyFn = (...args: any[]) => any;

// util: detect any
type IsAny<T> = 0 extends 1 & T ? true : false;
// strip/keep nil
type StripNil<T> = Exclude<T, undefined | null>;
type KeepNil<T, U> = (undefined extends T ? U | undefined : U) extends infer V
	? null extends T
		? V | null
		: V
	: never;

/**
 * Represents a value that can either be of type T or a function that returns type T
 * @template T The type of the value or return value
 * If T is a function type, require Getter<T>. Else allow T | Getter<T>.
 */
export type MaybeGetter<T> =
	IsAny<T> extends true
		? T | Getter<T>
		: [StripNil<T>] extends [AnyFn]
			? KeepNil<T, Getter<StripNil<T>>>
			: T | Getter<T>;

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
