<script lang="ts">
	import GithubLink from '$components/GithubLink.svelte';
	import Basic from './examples/basic/basic.svelte';
	import Nested from './examples/nested/nested.svelte';
	import TasksList from './examples/tasks-list/tasks-list.svelte';
</script>

<div class="p-8 space-y-8">
	<div class="flex-col flex gap-2 max-w-xl mx-a mb">
		<Nested />
	</div>

	<hr />

	<div class="flex-col flex gap-2 max-w-xl mx-a">
		<div class="flex-s-between bg-gray w-full px-4 py-2">
			<h1 class="text-(2xl black) font-bold">Tasks List (Sortable)</h1>
			<GithubLink
				href="https://github.com/HanielU/svelte-dnd-kit/blob/main/src/routes/examples/tasks-list/tasks-list.svelte"
			/>
		</div>
		<TasksList />
	</div>

	<hr />

	<div class="flex-s-center|col gap-2 max-w-xl mx-a">
		<div class="flex-s-between bg-gray w-full px-4 py-2">
			<h1 class="text-2xl font-bold">Basic (Draggable)</h1>
			<GithubLink href="https://github.com/HanielU/svelte-dnd-kit/blob/main/src/routes/examples/basic/basic.svelte" />
		</div>
		<Basic />
	</div>
</div>
