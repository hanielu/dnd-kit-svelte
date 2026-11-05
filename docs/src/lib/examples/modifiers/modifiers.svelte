<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import {
		RestrictToElement,
		RestrictToHorizontalAxis,
		RestrictToVerticalAxis,
		SnapModifier,
	} from "@dnd-kit-svelte/svelte/modifiers";
	import type { Modifiers } from "@dnd-kit/abstract";
	import Box from "./box.svelte";

	let area = $state<HTMLElement>();
	let choice = $state("Restrict to the box");

	const choices: Record<string, () => Modifiers> = {
		None: () => [],
		"Vertical axis": () => [RestrictToVerticalAxis],
		"Horizontal axis": () => [RestrictToHorizontalAxis],
		"Restrict to the box": () => [RestrictToElement.configure({ element: area })],
		"Snap to a 40px grid": () => [SnapModifier.configure({ size: 40 })],
	};
</script>

<div class="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Modifier">
	{#each Object.keys(choices) as name (name)}
		<button
			role="radio"
			aria-checked={choice === name}
			class={["px-3 py-1.5 rd-xl text-sm fw-semibold", choice === name ? "bg-ink text-page" : "bg-zone text-ink-soft"]}
			onclick={() => (choice = name)}
		>
			{name}
		</button>
	{/each}
</div>

<DragDropProvider>
	<div bind:this={area} class="h-56 flex-s-center rd-3xl bg-zone">
		<Box modifiers={choices[choice]()} />
	</div>
</DragDropProvider>
