import type { Renderer } from "@dnd-kit/abstract";

/**
 * dnd-kit awaits `rendering` before measuring after an event handler changed state (sortable animations, optimistic
 * sorting). `track` runs a handler and makes `rendering` settle once Svelte has flushed the changes it made to the
 * DOM. Create it during component setup: it owns an effect.
 */
export class SvelteRenderer implements Renderer {
	#version = $state(0);
	#rendering: Promise<void> | null = null;
	#resolve: (() => void) | null = null;

	constructor() {
		$effect(() => {
			void this.#version;
			this.#resolve?.();
			this.#rendering = this.#resolve = null;
		});
	}

	get rendering(): Promise<void> {
		return this.#rendering ?? Promise.resolve();
	}

	track(callback: () => void): void {
		this.#rendering ??= new Promise<void>((resolve) => (this.#resolve = resolve));
		callback();
		this.#version++;
	}
}
