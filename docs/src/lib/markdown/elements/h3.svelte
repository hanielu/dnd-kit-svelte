<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 {...rest} class="font-manrope text-(ink 1.3rem) fw-bold leading-[1.35] mt-12 mb-4 scroll-mt-6">
	{@render children?.()}
</h3>
