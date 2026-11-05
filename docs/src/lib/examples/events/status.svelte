<script lang="ts">
	import { useDragOperation } from "@dnd-kit-svelte/svelte";

	let { log }: { log: string[] } = $props();

	const operation = useDragOperation();
</script>

<div class="rd-3xl bg-zone p-4 font-mono text-(xs ink-soft) grid content-start gap-2">
	<p class="text-ink">
		{operation.source ? `${operation.source.id} over ${operation.target?.id ?? "nothing"}` : "Idle"}
	</p>
	{#each log as line, i (i)}
		<p>{line}</p>
	{/each}
</div>
