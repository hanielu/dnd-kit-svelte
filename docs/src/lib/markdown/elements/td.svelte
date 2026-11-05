<script lang="ts">
	import type { HTMLTdAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLTdAttributes = $props();
</script>

<td {...rest} class="px-4 py-2.5 align-top b-b-(1 line) leading-[1.6]">{@render children?.()}</td>
