<script lang="ts" module>
	export type TaskItem = {
		id: string;
		title: string;
		description: string;
	};

	interface ItemProps {
		task: TaskItem;
		index: number;
		group?: string | number;
		isOverlay?: boolean;
		data?: {group: string | number};
	}
</script>

<script lang="ts">
	import {useSortable} from '@dnd-kit-svelte/svelte/sortable';

	let {task, index, group, isOverlay = false, data}: ItemProps = $props();

	const {ref, handleRef, isDragging, isDropTarget} = useSortable({
		id: task.id,
		index: () => index,
		type: 'item',
		accept: 'item',
		group: group,
		data: data,
	});
</script>

<div class="relative select-none" {@attach ref}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div
		class={[
			'p-3 bg-white rd-2xl flex-s-between',
			{invisible: isDragging.current && !isOverlay, 'bg-orange/5!': isDropTarget.current},
		]}
	>
		<div class="">
			<p class="text-lg font-bold">{task.title}</p>
			<p class="text-sm text-gray-500">{task.description}</p>
		</div>

		<div class="i-lucide-grip-vertical text-gray-500 cursor-pointer" {@attach handleRef}></div>
	</div>

	<!-- Drag placeholder -->
	{#if !isOverlay && isDragging.current}
		<div class="flex items-center justify-center abs inset-0">
			<!-- You can put any content here for the dragging state -->
			<div class="w-full h-full bg-orange/10 rd-2xl b-2 b-orange b-dashed flex items-center justify-center">
				<span class="text-orange">Moving: {task.title}</span>
			</div>
		</div>
	{/if}
</div>
