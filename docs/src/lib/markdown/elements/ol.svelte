<script lang="ts">
	import type { HTMLOlAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLOlAttributes = $props();
</script>

<ol {...rest} class="list-decimal pl-6 mb-5 max-w-[44rem] flex|col gap-1.5">{@render children?.()}</ol>
