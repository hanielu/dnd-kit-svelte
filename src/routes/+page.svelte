<script lang="ts">
	import Basic from './examples/basic/basic.svelte';
	import Nested from './examples/nested/nested.svelte';
	import TasksList from './examples/tasks-list/tasks-list.svelte';
</script>

<div class="p-8">
	<div class="flex-col flex gap-2 max-w-xl mx-a mb">
		<Nested />
	</div>

	<div class="flex-col flex gap-2 max-w-sm mx-a">
		<h1 class="text-2xl font-bold bg-black text-(white center) w-full p-4">Tasks List (Sortable)</h1>
		<TasksList />
	</div>

	<div class="flex-s-center|col gap-2">
		<h1 class="text-2xl font-bold bg-black text-(white center) w-full p-4">Basic (Draggable)</h1>
		<Basic />
	</div>
</div>
