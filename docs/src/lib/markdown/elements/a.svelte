<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAnchorAttributes = $props();
</script>

<a {...rest} class="text-ink fw-medium underline decoration-orange/60 underline-offset-3 hover:decoration-orange"
	>{@render children?.()}</a
>
