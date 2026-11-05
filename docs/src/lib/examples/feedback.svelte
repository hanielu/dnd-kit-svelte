<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { Feedback, type FeedbackType } from "@dnd-kit/dom";
	import { move } from "@dnd-kit/helpers";

	const modes: FeedbackType[] = ["default", "clone", "move", "none"];
	let feedback = $state<FeedbackType>("default");
	let items = $state(["One", "Two", "Three", "Four"]);
</script>

<div class="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Feedback">
	{#each modes as mode (mode)}
		<button
			role="radio"
			aria-checked={feedback === mode}
			class={[
				"px-3 py-1.5 rd-xl text-sm fw-semibold",
				feedback === mode ? "bg-ink text-page" : "bg-zone text-ink-soft",
			]}
			onclick={() => (feedback = mode)}
		>
			{mode}
		</button>
	{/each}
</div>

<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
	<div class="grid gap-2 grid-cols-2 sm:grid-cols-4">
		{#each items as item, index (item)}
			{const { ref } = useSortable({
				id: item,
				index: () => index,
				// Function values go in a getter. This one reads `feedback`, so switching modes updates every item.
				plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback })],
			})}
			<div {@attach ref} class="h-20 flex-s-center rd-2xl bg-item text-ink fw-bold select-none cursor-grab">
				{item}
			</div>
		{/each}
	</div>
</DragDropProvider>
