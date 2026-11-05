<script lang="ts">
	import { DragDropProvider, DragOverlay } from "@dnd-kit-svelte/svelte";
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { move } from "@dnd-kit/helpers";

	let photos = $state(["Beach", "Forest", "Desert", "Glacier", "Canyon", "Lake"]);
</script>

<DragDropProvider onDragOver={(event) => (photos = move(photos, event))}>
	<div class="grid gap-2 grid-cols-2 sm:grid-cols-3">
		{#each photos as photo, index (photo)}
			{const { ref, isDragging } = useSortable({ id: photo, index: () => index })}
			<div
				{@attach ref}
				class={[
					"h-24 flex-s-center rd-2xl fw-bold select-none cursor-grab",
					isDragging.current ? "b-(2 dashed orange) text-orange bg-orange/5" : "bg-item text-ink",
				]}
			>
				{photo}
			</div>
		{/each}
	</div>

	<!-- Renders a copy that follows the pointer. The original stays in the grid as a placeholder. -->
	<DragOverlay>
		{#snippet children(source)}
			<div class="h-24 flex-s-center rd-2xl fw-bold bg-orange text-white rotate-3 shadow-xl">{source.id}</div>
		{/snippet}
	</DragOverlay>
</DragDropProvider>
