<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { move } from "@dnd-kit/helpers";
	import Column from "./column.svelte";

	const initial = {
		todo: ["Write the outline", "Pick a date"],
		doing: ["Draft the invite", "Book a room"],
		done: ["Make a guest list"],
	};
	type ColumnId = keyof typeof initial;
	const titles: Record<ColumnId, string> = { todo: "To do", doing: "Doing", done: "Done" };

	let items = $state(initial);
	let columns = $state(Object.keys(initial) as ColumnId[]);
</script>

<DragDropProvider
	onDragOver={(event) => {
		// Columns and cards each sort through their own state.
		if (event.operation.source?.type === "column") columns = move(columns, event);
		else items = move(items, event);
	}}
>
	<div class="grid gap-3 md:grid-cols-3">
		{#each columns as column, index (column)}
			<Column id={column} {index} title={titles[column]} cards={items[column]} />
		{/each}
	</div>
</DragDropProvider>
