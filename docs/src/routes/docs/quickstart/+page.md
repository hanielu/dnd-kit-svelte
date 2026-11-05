---
title: Quickstart
description: Build a button that you can drag into one of three zones.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import quickstart from "#lib/examples/quickstart/quickstart.svelte?demo";
</script>

<Demo demo={quickstart} />

Try the demo, then read how it works. The code is in three files, for the page, the draggable button and the drop zone.

## Install

```bash
npm i @dnd-kit-svelte/svelte
```

## Add a provider

`DragDropProvider` creates the drag and drop manager. The hooks find that manager through Svelte context, so call them in components that you render inside the provider. A hook called in the same `<script>` that renders the provider runs before the provider exists, and throws.

```svelte
<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
</script>

<DragDropProvider>
	<!-- Everything that drags or accepts a drop goes in here. -->
</DragDropProvider>
```

## Make something draggable

`useDraggable` takes an `id` that is unique among the draggables in this provider. It returns `ref`, an attachment that you put on the element with `{@attach}`.

```svelte
<!-- draggable.svelte -->
<script lang="ts">
	import { useDraggable } from "@dnd-kit-svelte/svelte";

	const { ref } = useDraggable({ id: "draggable" });
</script>

<button {@attach ref}>Drag me</button>
```

## Add drop zones

`useDroppable` works the same way. Its `isDropTarget` output is `true` while a draggable is over the zone. Read it through `.current`, which updates the markup on its own.

```svelte
<!-- droppable.svelte -->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { useDroppable } from "@dnd-kit-svelte/svelte";

	let { id, children }: { id: string; children: Snippet } = $props();

	const { ref, isDropTarget } = useDroppable({ id: () => id });
</script>

<div {@attach ref} class={[isDropTarget.current && "over"]}>
	{@render children()}
</div>
```

The zone passes its `id` prop as a function, `() => id`. The hook then reads the prop's current value instead of the one it had when the component was created. [Inputs and outputs](/docs/inputs-and-outputs) explains this.

## Move it on drop

dnd kit doesn't move elements in the DOM. When a drag ends, you update your state, and Svelte renders the result. `onDragEnd` tells you what the draggable was dropped on.

```svelte
<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import Draggable from "./draggable.svelte";
	import Droppable from "./droppable.svelte";

	const zones = ["A", "B", "C"];
	let parent = $state<string | undefined>();
</script>

<DragDropProvider
	onDragEnd={(event) => {
		if (event.canceled) return;
		parent = event.operation.target?.id as string | undefined;
	}}
>
	{#if !parent}<Draggable />{/if}

	{#each zones as id (id)}
		<Droppable {id}>
			{#if parent === id}<Draggable />{:else}Zone {id}{/if}
		</Droppable>
	{/each}
</DragDropProvider>
```

`event.canceled` is `true` when the drag was cancelled, such as by pressing Escape. `event.operation.target` is the droppable under the draggable, or `null` if there was none.

After a drop, `<Draggable />` renders in the zone instead of at the top. The new copy calls `useDraggable` with the same `id`.

## Without a component

When each item of an `{#each}` is one element, a component for it only passes values through. You can call the hook in a `{const …}` tag instead, right inside the block:

```svelte
{#each zones as id (id)}
	{const { ref, isDropTarget } = useDroppable({ id })}
	<div {@attach ref} class={[isDropTarget.current && "over"]}>Zone {id}</div>
{/each}
```

This needs Svelte 5.56 or later. [Hooks without components](/docs/hooks-without-components) explains when it helps.

## Next steps

- [Inputs and outputs](/docs/inputs-and-outputs) shows how to pass values that change.
- [Sortable lists](/docs/sortable-lists) reorders items with `useSortable`.
