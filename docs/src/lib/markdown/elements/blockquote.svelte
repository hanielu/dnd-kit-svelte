<script lang="ts">
	import type { HTMLBlockquoteAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLBlockquoteAttributes = $props();
</script>

<blockquote {...rest} class="mb-5 max-w-[44rem] bg-surface rd-3xl px-5 py-4 b-l-(4 orange) leading-[1.75]">
	{@render children?.()}
</blockquote>

<style>
	blockquote > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
