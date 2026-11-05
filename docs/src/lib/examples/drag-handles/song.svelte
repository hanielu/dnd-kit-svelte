<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";

	let { title, index }: { title: string; index: number } = $props();

	const { ref, handleRef } = useSortable({ id: () => title, index: () => index });
</script>

<li {@attach ref} class="flex-s-start gap-3 p-3 pr-4 bg-item rd-2xl text-ink">
	<button
		{@attach handleRef}
		class="s-8 flex-s-center rd-lg text-ink-faint hover:bg-zone cursor-grab"
		aria-label="Move {title}"
	>
		<span class="i-lucide-grip-vertical"></span>
	</button>
	<span class="fw-medium">{title}</span>
	<!-- The rest of the row stays clickable and selectable. -->
	<input class="ml-auto w-20 px-2 py-1 rd-lg bg-zone text-sm" aria-label="Note for {title}" placeholder="Note" />
</li>
