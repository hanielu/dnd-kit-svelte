<script lang="ts">
	import {useSortable, type UseSortableInput} from '@dnd-kit-svelte/svelte/sortable';

	interface Task {
		id: string | number;
		content: string;
	}

	interface Props extends UseSortableInput {
		task: Task;
		isOverlay?: boolean;
	}

	let {task, isOverlay = false, ...rest}: Props = $props();

	const {ref, isDragging} = useSortable({...rest, feedback: 'move'});
</script>

<div class="relative select-none" {@attach ref}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['p-4 bg-white rd-18px', {invisible: isDragging.current && !isOverlay}]}>
		{task.content}
	</div>

	<!-- Drag placeholder - set to match original dimensions -->
	{#if !isOverlay && isDragging.current}
		<div class="flex items-center justify-center abs inset-0">
			<!-- You can put any content here for the dragging state -->
			<div class="w-full h-full bg-orange/10 rd-18px b-2 b-orange b-dashed flex items-center justify-center">
				<span class="text-orange">Moving: {task.content}</span>
			</div>
		</div>
	{/if}
</div>
