<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'uno.css';
	import '../app.css';
	import Header from './header.svelte';
	import Metadata from '$lib/components/metadata.svelte';

	let {children} = $props();
</script>

<Metadata />

<Header />

<main class="px-5 py-10 space-y-16">
	{@render children()}
</main>
