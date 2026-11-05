<script lang="ts">
	import type { HTMLThAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLThAttributes = $props();
</script>

<th {...rest} class="text-(left ink) fw-semibold px-4 py-3 b-b-(1 line) whitespace-nowrap">{@render children?.()}</th>
