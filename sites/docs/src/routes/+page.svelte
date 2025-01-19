<script lang="ts">
	import Section from '$lib/components/section.svelte';
	import DraggableContainers from '$lib/components/examples/nested/draggable-containers.svelte';
	import SortableList from '$lib/components/examples/sortable/sortable-list.svelte';
	import BasicExample from '$lib/components/examples/basic/basic.svelte';
</script>

<Section id="example-1" title="Draggable Containers" link="/nested/draggable-containers.svelte">
	<DraggableContainers />
</Section>

<Section id="example-2" title="Task List" link="/sortable/sortable-list.svelte">
	<SortableList />
</Section>

<Section id="example-3" title="Basic" link="/basic/basic.svelte">
	<BasicExample />
</Section>
