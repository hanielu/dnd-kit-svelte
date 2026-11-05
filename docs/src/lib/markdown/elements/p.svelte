<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p {...rest} class="mb-6 leading-[1.75] max-w-[44rem]">{@render children?.()}</p>
