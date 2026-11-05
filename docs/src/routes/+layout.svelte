<script lang="ts">
	import "@unocss/reset/tailwind.css";
	import "uno.css";
	import "@twinkleplop/theme-github";
	import "../app.css";

	import { page } from "$app/state";
	import Header from "./header.svelte";
	import Footer from "./footer.svelte";
	import Metadata from "#lib/components/metadata.svelte";

	let { children } = $props();

	// Docs pages put the footer under their content column, next to the fixed sidebar.
	const docs = $derived(page.url.pathname.startsWith("/docs"));
</script>

<Metadata />

<div class="min-h-screen flex|col">
	<Header />

	<main class="flex-1">
		{@render children()}
	</main>

	{#if !docs}
		<Footer class="max-w-6xl mx-a px-5" />
	{/if}
</div>
