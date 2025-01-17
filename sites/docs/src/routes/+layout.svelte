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

<footer class="mt-auto border-t border-border">
	<div class="container mx-auto px-5 py-8">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="text-sm text-muted-foreground">
				© {new Date().getFullYear()} Haniel Ubogu.
			</div>
			<nav class="flex gap-6">
				<a
					href="https://github.com/HanielU/dnd-kit-svelte"
					class="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					GitHub
				</a>
				<a
					href="https://www.npmjs.com/package/@dnd-kit-svelte/core"
					class="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					npm
				</a>
				<a
					href="https://github.com/HanielU/dnd-kit-svelte"
					class="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Documentation
				</a>
			</nav>
		</div>
	</div>
</footer>
