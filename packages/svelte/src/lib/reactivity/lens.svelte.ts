/**
 * A read-only view of a value, cached in a `$derived`: readers only rerun when the value itself changes. The
 * accessor lives on the prototype and each instance owns its signal.
 */
export class Lens<T> {
	#current: T;

	constructor(read: () => T) {
		this.#current = $derived.by(read);
	}

	get current(): T {
		return this.#current;
	}
}

export function lens<T>(read: () => T): Lens<T> {
	return new Lens(read);
}
