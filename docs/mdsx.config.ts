import { rehypeCustomHighlight, type HighlightOptions } from "@mdsx/rehype-custom-highlighter";
import { defineConfig } from "mdsx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { fileURLToPath } from "node:url";
import { highlightCode } from "./src/lib/markdown/highlight.js";

const highlightOptions: HighlightOptions = {
	highlight: ({ value, lang }) => value && highlightCode(value, lang ?? "text"),
};

export const mdsxConfig = defineConfig({
	extensions: [".md"],
	// SvelteKit 3 is configured in vite.config.ts; there's no svelte.config.js to read
	svelteConfigPath: false,
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeSlug, [rehypeCustomHighlight, highlightOptions]],
	blueprints: {
		default: { path: fileURLToPath(new URL("./src/lib/markdown/blueprint.svelte", import.meta.url)) },
	},
});
