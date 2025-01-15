<script lang="ts">
	import type {Transform} from '$utilities';
	import {ActiveDraggableContextKey} from '$core/components/index.js';
	import {InternalContextKey, defaultInternalContext} from '$core/store/index.js';
	import {setContext, type Snippet} from 'svelte';

	let {children}: {children: Snippet} = $props();

	const defaultTransform: Transform = {
		x: 0,
		y: 0,
		scaleX: 1,
		scaleY: 1,
	};

	setContext(InternalContextKey, () => defaultInternalContext);
	setContext(ActiveDraggableContextKey, () => defaultTransform);
</script>

{@render children()}
