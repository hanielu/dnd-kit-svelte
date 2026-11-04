type AnyFunction = (...args: any[]) => any;

export type Getter<T> = () => T;

/**
 * A value, or a function that returns it. Function values (collision detectors, `accept` predicates,
 * `plugins: (defaults) => …`) must be wrapped in a getter, because a bare function is always read as a getter.
 */
export type MaybeGetter<T> = Exclude<T, AnyFunction> | Getter<T>;

/** Every property of `T` as a {@link MaybeGetter}. */
export type MaybeGetterObject<T> = { [K in keyof T]: MaybeGetter<T[K]> };

export function resolve<T>(value: MaybeGetter<T>): T {
	return typeof value === "function" ? (value as Getter<T>)() : value;
}

/** Reads every property of `input` once, calling getters. */
export function resolveObject<T extends object>(input: MaybeGetterObject<T>): T {
	const output: Record<string, unknown> = {};
	for (const key of Object.keys(input)) {
		output[key] = resolve((input as Record<string, MaybeGetter<unknown>>)[key]);
	}
	return output as T;
}
