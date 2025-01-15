<script lang="ts">
	import '../app.css';
	import '@unocss/reset/tailwind.css';
	import 'uno.css';

	let {children} = $props();
</script>

<svelte:head>
	<title>Svelte DnD Kit</title>
</svelte:head>

{@render children()}
