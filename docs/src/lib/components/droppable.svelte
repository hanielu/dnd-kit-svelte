<script lang="ts">
	import {useDroppable, type UseDroppableInput} from '@dnd-kit-svelte/svelte';
	import type {ClassValue} from 'svelte/elements';
	import type {Snippet} from 'svelte';

	interface DroppableProps extends UseDroppableInput {
		children: Snippet;
		class?: ClassValue;
	}

	let {children, class: className, ...rest}: DroppableProps = $props();

	const {ref} = useDroppable(rest);
</script>

<div class={className} {@attach ref}>
	{@render children()}
</div>
