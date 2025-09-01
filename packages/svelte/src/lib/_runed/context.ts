import { getContext, hasContext, setContext } from "svelte";

export class Context<TContext> {
	readonly #name: string;
	readonly #key: symbol;
	readonly #fallback?: TContext;

	/**
	 * @param name The name of the context.
	 * This is used for generating the context key and error messages.
	 * @param fallback Optional fallback value to return when context doesn't exist.
	 */
	constructor(name: string, fallback?: TContext) {
		this.#name = name;
		this.#key = Symbol(name);
		this.#fallback = fallback;
	}

	/**
	 * The key used to get and set the context.
	 *
	 * It is not recommended to use this value directly.
	 * Instead, use the methods provided by this class.
	 */
	get key(): symbol {
		return this.#key;
	}

	/**
	 * Checks whether this has been set in the context of a parent component.
	 *
	 * Must be called during component initialisation.
	 */
	exists(): boolean {
		return hasContext(this.#key);
	}

	/**
	 * Retrieves the context that belongs to the closest parent component.
	 *
	 * Must be called during component initialisation.
	 *
	 * @throws An error if the context does not exist.
	 */
	get(): TContext {
		const context: TContext | undefined = getContext(this.#key);
		if (context === undefined) {
			throw new Error(`Context "${this.#name}" not found`);
		}
		return context;
	}

	/**
	 * Retrieves the context that belongs to the closest parent component,
	 * or the given fallback value if the context does not exist.
	 *
	 * Must be called during component initialisation.
	 */
	getOr<TFallback extends TContext | null | undefined = TContext>(fallback?: TFallback) {
		const context = getContext<TContext | undefined>(this.#key);

		if (context === undefined) {
			return (fallback ?? this.#fallback) as TFallback extends null ? TContext | null : TContext;
		}
		return context;
	}

	/**
	 * Associates the given value with the current component and returns it.
	 *
	 * Must be called during component initialisation.
	 */
	set(context: TContext): TContext {
		return setContext(this.#key, context);
	}
}
