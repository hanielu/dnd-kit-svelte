import { language as bash } from "@twinkleplop/bash";
import { escape_html } from "@twinkleplop/core";
import { language as svelte } from "@twinkleplop/svelte";
import { language as typescript } from "@twinkleplop/typescript";

const shell = bash();
const ts = typescript();

/** Highlighters by the language name a code block gives, including the usual aliases. */
const languages: Record<string, (code: string) => string> = {
	svelte: svelte(),
	typescript: ts,
	ts,
	javascript: ts,
	js: ts,
	shellscript: shell,
	bash: shell,
	sh: shell,
};

/**
 * Highlights code at build time, as a `<pre class="twinkleplop">` with a class per token. Their colors come from the
 * theme imported in the root layout, which follows `.dark`.
 */
export function highlight(code: string, lang = "svelte") {
	const source = code.trimEnd();
	return languages[lang]?.(source) ?? `<pre class="twinkleplop"><code>${escape_html(source)}</code></pre>`;
}

/** Just the highlighted `<code>`, for a Markdown code block, whose `<pre>` is the blueprint's own. */
export function highlightCode(code: string, lang = "svelte") {
	return highlight(code, lang).replace(/^<pre[^>]*>|<\/pre>$/g, "");
}
