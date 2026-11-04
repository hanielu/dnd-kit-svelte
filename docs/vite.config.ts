import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		UnoCSS(),
		Icons({ compiler: "svelte" }),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
			},
			adapter: adapter(),
		}),
	],
});
