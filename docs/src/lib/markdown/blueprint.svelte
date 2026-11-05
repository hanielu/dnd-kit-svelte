<script lang="ts" module>
	// Markdown elements render through these components, whose styles stay off the demos inside pages.
	export { a, blockquote, h2, h3, hr, li, ol, p, pre, table, td, th, ul } from "./elements/index.js";
</script>

<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		metadata: { title: string; description?: string };
		children: Snippet;
	}

	let { metadata, children }: Props = $props();
</script>

<svelte:head>
	{#if metadata.description}
		<meta name="description" content={metadata.description} />
	{/if}
</svelte:head>

<article class="font-inter text-(ink-soft 17px)">
	<h1 class="font-manrope text-(2.5rem ink) fw-bold tracking--3% leading-[1.1] mb-4">{metadata.title}</h1>
	{#if metadata.description}
		<p class="text-(1.2rem ink) leading-[1.5] mb-10 max-w-[44rem]">{metadata.description}</p>
	{/if}
	{@render children()}
</article>

<style>
	/* Inline code. mdsx renders it as escaped text rather than through an element component, so it's styled here,
	   leaving code blocks and the demos inside the page alone. */
	article :global(code:not(pre code, .demo *)) {
		padding: 0.15em 0.4em;
		border-radius: 0.4em;
		background: rgb(var(--ink) / var(--code-fill));
		color: rgb(var(--ink));
		font-family: "Geist Mono", ui-monospace, monospace;
		font-size: 0.875em;
		/* A span that wraps gets rounded ends on each line. */
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
	}

	/* Tables are dense, so their code drops the fill: names in the brand color, everything else as plain mono. */
	article :global(td code:not(.demo *)) {
		padding: 0;
		background: none;
		font-size: 0.9em;
	}

	/* Names and types stay on one line, so a signature never breaks in the middle; the description column wraps. */
	article :global(td:nth-child(-n + 2) code:not(.demo *)) {
		white-space: nowrap;
	}

	article :global(td:first-child code:not(.demo *)) {
		color: rgb(var(--brand));
		font-weight: 500;
	}

	article :global(strong) {
		color: rgb(var(--ink));
		font-weight: 600;
	}
</style>
