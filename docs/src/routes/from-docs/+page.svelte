<script lang="ts">
	import "./styles.css";
	import Column from "./column.svelte";
	import Item from "./item.svelte";
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { move } from "@dnd-kit/helpers";

	const initial = {
		A: ["A0", "A1", "A2"],
		B: ["B0", "B1"],
		C: [] as string[],
	};

	let items = $state(initial);
	let columns = $state(Object.keys(initial) as (keyof typeof initial)[]);
</script>

<DragDropProvider
	onDragOver={(event) => {
		const { source } = event.operation;
		if (source?.type === "column") columns = move(columns, event);
		else items = move(items, event);
	}}
>
	<div class="Root">
		{#each columns as column, colIdx (column)}
			<Column id={column} index={colIdx}>
				{#each items[column] as id, itemIdx (id)}
					<Item {id} {column} index={itemIdx} />
				{/each}
			</Column>
		{/each}
	</div>
</DragDropProvider>
