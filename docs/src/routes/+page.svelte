<script lang="ts">
	import Section from "#lib/components/section.svelte";
	import DraggableContainers from "#lib/components/examples/nested/draggable-containers.svelte";
	import SortableList from "#lib/components/examples/sortable/sortable-list.svelte";
	import BasicExample from "#lib/components/examples/basic/basic.svelte";
</script>

<div class="px-5 py-10 space-y-16">
	<section class="container-base flex|col gap-5 pt-4">
		<h1 class="text-(4xl ink) fw-bold tracking--3% leading-[1.15] max-w-xl">Drag and drop for Svelte 5</h1>
		<p class="text-(lg ink-soft) leading-[1.6] max-w-xl">
			Draggable, droppable and sortable primitives built on dnd kit, with runes and attachments. Try the examples below,
			then read the docs to build your own.
		</p>
		<div class="flex flex-wrap items-center gap-3">
			<a href="/docs/quickstart" class="bg-orange text-white fw-bold px-4 py-2.5 rd-xl">Get started</a>
			<code class="font-mono text-(sm ink) bg-surface px-4 py-2.5 rd-xl">npm i @dnd-kit-svelte/svelte</code>
		</div>
	</section>

	<Section id="example-1" title="Draggable Containers" link="/nested/draggable-containers.svelte">
		<DraggableContainers />
	</Section>

	<Section id="example-2" title="Task List" link="/sortable/sortable-list.svelte">
		<SortableList />
	</Section>

	<Section id="example-3" title="Basic" link="/basic/basic.svelte">
		<BasicExample />
	</Section>
</div>
