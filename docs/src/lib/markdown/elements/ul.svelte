<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul {...rest} class="list-disc pl-6 mb-5 max-w-[44rem] flex|col gap-1.5">{@render children?.()}</ul>
