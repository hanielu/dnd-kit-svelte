---
title: Drag handles
description: Start a drag from one part of an element, and keep the rest of it clickable.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import dragHandles from "#lib/examples/drag-handles/drag-handles.svelte?demo";
</script>

<Demo demo={dragHandles} />

## Attach the handle

`useDraggable` and `useSortable` return `handleRef` next to `ref`. Put `ref` on the element that moves and `handleRef` on the part that starts a drag:

```svelte
<!-- song.svelte -->
<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";

	let { title, index }: { title: string; index: number } = $props();

	const { ref, handleRef } = useSortable({ id: () => title, index: () => index });
</script>

<li {@attach ref}>
	<button {@attach handleRef} aria-label="Move {title}">⠿</button>
	{title}
	<input placeholder="Note" />
</li>
```

Once an element has a handle, only the handle starts a drag. The rest of the element works as usual, so the input in the demo still takes clicks and text selection.

## Make the handle a button

A `<button>` can take keyboard focus, so keyboard users can tab to it and press Space or Enter to pick the item up. Give it an `aria-label`, since it usually shows only an icon.

## Handles start a drag at once

With a mouse, pressing a handle starts the drag straight away. Without a handle, dnd kit waits for the pointer to move 5 pixels or for 200 milliseconds to pass, so that a click doesn't start a drag by accident. [Sensors](/docs/sensors) shows how to change this.
