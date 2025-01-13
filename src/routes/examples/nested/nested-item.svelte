<script lang="ts" module>
	export type IData = {
		id: string;
		title: string;
		description: string;
	};

	export type INestedItem = {
		data: IData;
		nesteds: IData[];
	};

	interface ItemProps {
		children?: Snippet<[isDragging: boolean]>;
		data: IData;
		type: 'item' | 'container';
		accepts?: string[];
	}
</script>

<script lang="ts">
	import type {Snippet} from 'svelte';
	import {CSS, styleObjectToString} from 'svelte-dnd-kit';
	import {useSortable} from '$sortable';

	let {data, children, type, accepts = []}: ItemProps = $props();

	const {attributes, listeners, node, transform, transition, isDragging, isSorting} = useSortable({
		id: data.id,
		data: {type, accepts},
	});

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined,
		})
	);
</script>

<div class="relative select-none" bind:this={node.current} {style}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['p-4 bg-white rounded-lg shadow', {invisible: isDragging.current, 'h-280px': type === 'container'}]}>
		<div class="flex-s-between">
			<p class="text-lg font-bold">{data.title}</p>
			<div
				class="i-lucide-grip-vertical text-gray-500 cursor-pointer"
				{...listeners.current}
				{...attributes.current}
			></div>
		</div>
		<p class="text-sm text-gray-500">{data.description}</p>

		{#if children}
			<div class="p-2 bg-green-200 overflow-y-auto h-200px">
				<div class="flex flex-col gap-2">
					{@render children(isDragging.current)}
				</div>
			</div>
		{/if}
	</div>

	<!-- Drag placeholder -->
	{#if isDragging.current}
		<div class="flex items-center justify-center abs inset-0">
			<!-- You can put any content here for the dragging state -->
			<div
				class="w-full h-full bg-blue-100 rounded-lg border-2 border-blue-400 border-dashed flex items-center justify-center"
			>
				<span class="text-blue-600">Moving: {data.title}</span>
			</div>
		</div>
	{/if}
</div>
