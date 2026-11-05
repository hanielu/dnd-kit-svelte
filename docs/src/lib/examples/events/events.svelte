<script lang="ts">
	import { DragDropProvider, useDroppable } from "@dnd-kit-svelte/svelte";
	import Card from "./card.svelte";
	import Status from "./status.svelte";

	let log = $state<string[]>([]);
	const write = (line: string) => (log = [line, ...log].slice(0, 6));
</script>

<DragDropProvider
	onDragStart={(event) => write(`dragstart: ${event.operation.source?.id}`)}
	onDragOver={(event) => write(`dragover: ${event.operation.target?.id ?? "nothing"}`)}
	onDragEnd={(event) => write(`dragend: ${event.canceled ? "canceled" : (event.operation.target?.id ?? "no target")}`)}
>
	<div class="grid gap-3 sm:grid-cols-[1fr_1fr_1.2fr]">
		<div class="h-32 flex-s-center rd-3xl bg-zone">
			<Card />
		</div>

		<div class="grid gap-3">
			{#each ["inbox", "archive"] as id (id)}
				<!-- Each zone is one element, so a declaration tag saves a component. -->
				{const { ref, isDropTarget } = useDroppable({ id })}
				<div
					{@attach ref}
					class={[
						"flex-s-center rd-2xl fw-semibold",
						isDropTarget.current ? "bg-orange/10 text-orange" : "bg-zone text-ink-faint",
					]}
				>
					{id}
				</div>
			{/each}
		</div>

		<Status {log} />
	</div>
</DragDropProvider>
