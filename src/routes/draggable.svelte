<script lang="ts">
	import {useDraggable} from '$core/index.js';
	import type {Snippet} from 'svelte';
	import {CSS} from '$utilities';

	let {children}: {children?: Snippet} = $props();

	const draggable = useDraggable(() => ({
		id: 'draggable',
	}));

	const {attributes, listeners, node, transform} = $derived(draggable.current);
	const style = $derived(transform ? `transform: ${CSS.Translate.toString(transform)};` : '');
	// $inspect(style);
</script>

<div
	class="bg-pink inline-block p-2 text-white"
	{style}
	bind:this={node.current}
	{...listeners?.current}
	{...attributes}
>
	{@render children?.()}
</div>
