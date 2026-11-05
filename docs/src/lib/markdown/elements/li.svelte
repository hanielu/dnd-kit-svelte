<script lang="ts">
	import type { HTMLLiAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLLiAttributes = $props();
</script>

<li {...rest} class="leading-[1.75] pl-1 marker:text-ink-faint">{@render children?.()}</li>
