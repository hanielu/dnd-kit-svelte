<script lang="ts">
	import type { Snippet } from "svelte";
	import { useDroppable } from "@dnd-kit-svelte/svelte";

	let { id, children }: { id: string; children: Snippet } = $props();

	const { ref, isDropTarget } = useDroppable({ id: () => id });
</script>

<div
	{@attach ref}
	class={["h-28 flex-s-center rd-3xl bg-zone b-(2 dashed transparent)", isDropTarget.current && "b-orange"]}
>
	{@render children()}
</div>
