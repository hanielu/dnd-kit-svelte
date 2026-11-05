<script lang="ts">
	import type { Component } from "svelte";
	import IconCode from "~icons/lucide/code-xml";
	import IconGithub from "~icons/lucide/github";
	import IconReset from "~icons/lucide/rotate-ccw";
	import CopyButton from "./copy-button.svelte";

	interface Props {
		/** From `import demo from "#lib/examples/name.svelte?demo"`. */
		demo: { component: Component; files: { name: string; path: string; code: string }[] };
	}

	let { demo }: Props = $props();

	let run = $state(0);
	let showCode = $state(false);
	let selected = $state(0);
	const file = $derived(demo.files[selected] ?? demo.files[0]);
	let code = $state<HTMLDivElement>();
</script>

<figure class="demo my-8 font-manrope">
	<div class="droppable-container">
		{#key run}
			<demo.component />
		{/key}
	</div>
	<div class="flex flex-wrap items-center gap-1 mt-2 text-(15px ink-soft) fw-medium">
		<button
			type="button"
			class="inline-flex-s-start gap-1.5 px-2.5 py-1.5 rd-lg hover:(bg-surface text-ink)"
			aria-expanded={showCode}
			onclick={() => (showCode = !showCode)}
		>
			<IconCode />
			{showCode ? "Hide code" : "Show code"}
		</button>
		<button
			type="button"
			class="inline-flex-s-start gap-1.5 px-2.5 py-1.5 rd-lg hover:(bg-surface text-ink)"
			onclick={() => run++}
		>
			<IconReset />
			Reset
		</button>
		<a
			class="ml-auto inline-flex-s-start gap-1.5 px-2.5 py-1.5 rd-lg hover:(bg-surface text-ink)"
			href="https://github.com/hanielu/dnd-kit-svelte/blob/main/{file.path}"
			target="_blank"
			rel="noopener noreferrer"
		>
			<IconGithub />
			{file.name}
		</a>
	</div>
	{#if showCode}
		<div class="mt-2 rd-3xl bg-surface overflow-hidden">
			{#if demo.files.length > 1}
				<div class="flex flex-wrap gap-1 px-4 pt-2 b-b-(1 line)" role="group" aria-label="Files">
					{#each demo.files as item, index (item.path)}
						<button
							type="button"
							aria-pressed={index === selected}
							class={[
								"px-2 pt-2 pb-2.5 -mb-px b-b-2 font-mono text-14px transition-colors",
								index === selected ? "b-orange text-ink" : "b-transparent text-ink-soft hover:text-ink",
							]}
							onclick={() => (selected = index)}
						>
							{item.name}
						</button>
					{/each}
				</div>
			{/if}
			<div class="code group relative max-h-[32rem] overflow-auto" bind:this={code}>
				{@html file.code}
				<CopyButton text={() => code?.querySelector("pre")?.textContent ?? ""} />
			</div>
		</div>
	{/if}
</figure>
