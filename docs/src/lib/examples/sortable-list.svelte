<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { move } from "@dnd-kit/helpers";

	let items = $state(["Pack the tent", "Buy snacks", "Charge the camera", "Check the weather", "Book the campsite"]);
</script>

<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
	<ul class="grid gap-2">
		{#each items as item, index (item)}
			{const { ref, isDragging } = useSortable({ id: item, index: () => index })}
			<li
				{@attach ref}
				class={[
					"p-4 bg-item rd-2xl text-ink fw-medium cursor-grab select-none",
					isDragging.current && "shadow-[0_12px_32px_rgb(0_0_0/0.18)]",
				]}
			>
				{item}
			</li>
		{/each}
	</ul>
</DragDropProvider>
