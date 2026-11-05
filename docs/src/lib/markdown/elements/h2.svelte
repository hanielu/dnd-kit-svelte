<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2 {...rest} class="font-manrope text-(ink 1.75rem) fw-bold tracking--2% leading-[1.2] mt-16 mb-5 scroll-mt-6">
	{@render children?.()}
</h2>
