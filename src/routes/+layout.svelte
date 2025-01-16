<script lang="ts">
	import '../app.css';
	import '@unocss/reset/tailwind.css';
	import 'uno.css';
	import Header from './header.svelte';

	let {children} = $props();
</script>

<svelte:head>
	<title>svelte-dnd-kit - a modern drag and drop toolkit for svelte</title>
	<meta
		name="description"
		content="svelte-dnd-kit is a modern drag and drop toolkit for svelte based on dnd-kit for react"
	/>
	<meta name="keywords" content="svelte, dnd, dnd-kit, drag and drop, toolkit" />
	<meta name="author" content="HanielU" />
</svelte:head>

{@render children()}
<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
	<Header />
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
