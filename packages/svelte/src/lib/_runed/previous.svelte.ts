import type { Getter } from "runed";
import { watch } from "runed";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/previous}
 */
export class Previous<T> {
	#previous: T | undefined = $state(undefined);

	constructor(getter: Getter<T>, initialValue?: T) {
		if (initialValue !== undefined) this.#previous = initialValue;

		// using pre instead because ideally previous values are updated before the DOM updates
		// well at least that's the case for the current uses of this class, for now
		// I suppose we could also create a new class that does this, but I'm not sure if it's worth it
		watch(
			() => getter(),
			(_, v) => {
				this.#previous = v;
			}
		);
	}

	get current(): T | undefined {
		return this.#previous;
	}
}
