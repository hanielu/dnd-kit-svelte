// `import demo from "./quickstart.svelte?demo"`, served by the `docs-demos` Vite plugin.
declare module "*?demo" {
	import type { Component } from "svelte";

	/** The example's main file first, then the components it imports. */
	const demo: { component: Component; files: { name: string; path: string; code: string }[] };
	export default demo;
}
