<script lang="ts">
	import type { ClassValue } from "svelte/elements";

	/** Classes for the row inside the top border, such as a max width. */
	let { class: className }: { class?: ClassValue } = $props();
</script>

<footer class="b-t b-line">
	<div class={["py-8 flex|col md:flex-row justify-between items-center gap-4 text-(sm ink-soft)", className]}>
		<p>© {new Date().getFullYear()} Haniel Ubogu. MIT licensed.</p>
		<nav class="flex gap-6">
			<a href="/docs" class="hover:text-ink transition-colors">Docs</a>
			<a href="https://github.com/hanielu/dnd-kit-svelte" class="hover:text-ink transition-colors">GitHub</a>
			<a href="https://www.npmjs.com/package/@dnd-kit-svelte/svelte" class="hover:text-ink transition-colors">npm</a>
		</nav>
	</div>
</footer>
