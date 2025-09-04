<script lang="ts" module>
	import {useSortable} from '@dnd-kit-svelte/svelte/sortable';
	import {CollisionPriority} from '@dnd-kit/abstract';
	import type {Snippet} from 'svelte';

	interface ColumnItemProps {
		children: Snippet<[isDragging: boolean]>;
		data: {title: string; description: string};
		class?: string;
		index: number;
		id: string | number;
		isOverlay?: boolean;
	}
</script>

<script lang="ts">
	let {data, index, class: className, children, id, isOverlay = false}: ColumnItemProps = $props();

	const {ref, handleRef, isDragging} = useSortable({
		id: id,
		index: () => index,
		type: 'column',
		accept: ['item', 'column'],
		collisionPriority: CollisionPriority.Low,
	});
</script>

<div class="relative" {@attach ref}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['p-5 pt-6 bg-#F9F9F9 rd-3xl', className, {invisible: isDragging.current && !isOverlay}]}>
		<div class="flex-s-between text-#9E9E9E">
			<div class="pl-5.5">
				<p class="text-(lg dark) fw-bold relative flex-s-start">
					<span class="s-10px bg-orange rd-full abs left--20px"></span>
					{data.title}
				</p>
				<p class="text-sm fw-medium">{data.description}</p>
			</div>

			<div class="i-lucide-grip-vertical cursor-pointer" {@attach handleRef}></div>
		</div>

		<div class="grid gap-2 mt-3">
			{@render children(isDragging.current)}
		</div>
	</div>

	{#if !isOverlay && isDragging.current}
		<div class="max-md:hidden absolute inset-0 bg-orange/10 b b-dashed b-orange rd-3xl"></div>
	{/if}
</div>
