<script lang="ts">
	import type { HTMLTableAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLTableAttributes = $props();
</script>

<div class="table-scroll mb-6 overflow-x-auto bg-surface rd-3xl">
	<table {...rest} class="w-full text-15px">{@render children?.()}</table>
</div>

<style>
	table {
		border-collapse: collapse;
	}

	table :global(tr:last-child td) {
		border-bottom: none;
	}
</style>
