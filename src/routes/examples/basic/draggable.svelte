<script lang="ts">
	import {useDraggable} from '$core/index.js';
	import type {Snippet} from 'svelte';
	import {CSS} from '$utilities';

	let {children}: {children?: Snippet} = $props();

	const {attributes, listeners, node, transform} = useDraggable({
		id: 'draggable',
	});

	const style = $derived(transform ? `transform: ${CSS.Translate.toString(transform.current)};` : '');
</script>

<div
	class="bg-pink inline-block p-2 text-white"
	{style}
	bind:this={node.current}
	{...listeners.current}
	{...attributes.current}
>
	{@render children?.()}
</div>
