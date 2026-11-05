<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import Draggable from "./draggable.svelte";
	import Droppable from "./droppable.svelte";

	const zones = ["A", "B", "C"];
	let parent = $state<string | undefined>();
</script>

<DragDropProvider
	onDragEnd={(event) => {
		if (event.canceled) return;
		parent = event.operation.target?.id as string | undefined;
	}}
>
	<div class="grid gap-3">
		<div class="h-20 flex-s-center">
			{#if !parent}<Draggable />{/if}
		</div>

		<div class="grid gap-3 sm:grid-cols-3">
			{#each zones as id (id)}
				<Droppable {id}>
					{#if parent === id}
						<Draggable />
					{:else}
						<span class="text-ink-faint fw-semibold">Zone {id}</span>
					{/if}
				</Droppable>
			{/each}
		</div>
	</div>
</DragDropProvider>
