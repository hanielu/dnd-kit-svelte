<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import CopyButton from "#lib/components/copy-button.svelte";

	let { children, ...rest }: HTMLAttributes<HTMLPreElement> = $props();

	let pre = $state<HTMLPreElement>();
</script>

<div class="code-block group relative mb-6">
	<pre class="twinkleplop" bind:this={pre} {...rest}>{@render children?.()}</pre>
	<CopyButton text={() => pre?.textContent ?? ""} />
</div>
