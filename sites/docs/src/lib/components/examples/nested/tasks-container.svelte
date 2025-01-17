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
		children: Snippet<[isDragging: boolean]>;
		data: IData;
		type: 'item' | 'container';
		class?: string;
		accepts: string[];
	}
</script>

<script lang="ts">
	import type {Snippet} from 'svelte';
	import {CSS, styleObjectToString} from '@dnd-kit-svelte/utilities';
	import {useSortable} from '@dnd-kit-svelte/sortable';

	let {data, children, type, accepts = [], class: className}: ItemProps = $props();

	const {attributes, listeners, node, activatorNode, transform, transition, isDragging, isSorting} = useSortable({
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

<div class="relative" bind:this={node.current} {style}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['p-5 pt-6 bg-#F9F9F9 rd-3xl overflow-hidden', className, {invisible: isDragging.current}]}>
		<div class="flex-s-between text-#9E9E9E">
			<div class="pl-5.5">
				<p class="text-(lg dark) fw-bold relative flex-s-start">
					<span class="s-10px bg-orange rd-full abs left--20px"></span>
					{data.title}
				</p>
				<p class="text-sm fw-medium">{data.description}</p>
			</div>

			<div
				class="i-lucide-grip-vertical cursor-pointer"
				bind:this={activatorNode.current}
				{...attributes.current}
				{...listeners.current}
			></div>
		</div>

		<div class="grid gap-2 mt-3">
			{@render children(isDragging.current)}
		</div>
	</div>

	{#if isDragging.current}
		<div class="max-md:hidden absolute inset-0 bg-orange/10 b b-dashed b-orange rd-3xl"></div>
	{/if}
</div>
