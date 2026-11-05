<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { CollisionPriority } from "@dnd-kit/abstract";

	interface Props {
		id: string;
		index: number;
		title: string;
		cards: string[];
	}

	let { id, index, title, cards }: Props = $props();

	const column = useSortable({
		id: () => id,
		index: () => index,
		type: "column",
		accept: ["column", "card"],
		collisionPriority: CollisionPriority.Low,
	});
</script>

<section {@attach column.ref} class="bg-zone rd-3xl p-3 flex|col gap-2 min-h-44">
	<header class="flex-s-between px-2 py-1.5">
		<h3 class="fw-bold text-ink">{title}</h3>
		<button
			{@attach column.handleRef}
			class="i-lucide-grip-vertical text-ink-faint cursor-grab"
			aria-label="Move the {title} column"
		></button>
	</header>

	{#each cards as card, cardIndex (card)}
		<!-- Each card is one element, so a declaration tag saves a component. -->
		{const { ref } = useSortable({ id: card, index: () => cardIndex, group: id, type: "card", accept: "card" })}
		<div {@attach ref} class="p-3.5 bg-item rd-2xl text-ink fw-medium cursor-grab select-none">{card}</div>
	{/each}
</section>
