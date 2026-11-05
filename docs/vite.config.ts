import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { mdsx } from "mdsx";
import { readFile } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig, type Plugin } from "vite";
import { mdsxConfig } from "./mdsx.config.js";
import { highlight } from "./src/lib/markdown/highlight.js";

/** `import Draggable from "./draggable.svelte"`: a component of the same example. */
const localImport = /^\s*import \w+ from "(\.\.?\/[^"]+\.svelte)";$/gm;

/**
 * `import demo from "./quickstart.svelte?demo"` gives `{ component, files }`: the live component, and the source of
 * that file and of the `.svelte` files it imports with a relative path, highlighted, each with its path in the
 * repository. The code shown is the code that runs.
 */
function demos(): Plugin {
	// The `.js` suffix keeps vite-plugin-svelte from compiling the generated module as a component.
	const prefix = "\0demo:";
	const suffix = ".js";
	return {
		name: "docs-demos",
		enforce: "pre",
		async resolveId(id, importer) {
			if (!id.endsWith("?demo")) return;
			const resolved = await this.resolve(id.slice(0, -"?demo".length), importer, { skipSelf: true });
			return resolved && prefix + resolved.id + suffix;
		},
		async load(id) {
			if (!id.startsWith(prefix)) return;
			const main = id.slice(prefix.length, -suffix.length);
			const root = fileURLToPath(new URL(".", import.meta.url));
			const files: { name: string; path: string; code: string }[] = [];
			const queue = [main];
			for (const file of queue) {
				this.addWatchFile(file);
				const source = await readFile(file, "utf8");
				const path = `docs/${relative(root, file).replaceAll("\\", "/")}`;
				files.push({ name: basename(file), path, code: highlight(source, "svelte") });
				for (const [, specifier] of source.matchAll(localImport)) {
					const imported = resolve(dirname(file), specifier);
					if (!queue.includes(imported)) queue.push(imported);
				}
			}
			return `import component from ${JSON.stringify(main)};\nexport default { component, files: ${JSON.stringify(files)} };`;
		},
	};
}

export default defineConfig({
	plugins: [
		UnoCSS(),
		Icons({ compiler: "svelte" }),
		demos(),
		sveltekit({
			adapter: adapter(),
			extensions: [".svelte", ".md"],
			preprocess: [mdsx(mdsxConfig)],
			// mdsx puts highlighted code in a page's own template, inside the blueprint's <pre> component rather than a
			// <pre> element, so Svelte would collapse its line breaks and indentation.
			dynamicCompileOptions: ({ filename }) => (filename.endsWith(".md") ? { preserveWhitespace: true } : undefined),
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
			},
		}),
	],
});
