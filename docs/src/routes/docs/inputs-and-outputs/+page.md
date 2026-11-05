---
title: Inputs and outputs
description: How values get into a hook, and how you read what it returns.
---

## Inputs are values or functions

Every field of a hook's input takes a value or a function that returns one. The hook reads a value once, when it creates its entity. It calls a function inside an effect, which runs again whenever the state that the function reads changes.

```svelte
<!-- sortable-item.svelte -->
<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";

	let { id, index, column }: { id: string; index: number; column: string } = $props();

	const sortable = useSortable({
		id: () => id,
		index: () => index, // follows the item's position
		data: () => ({ column }), // follows `column`
		type: "item", // read once
	});
</script>

<li {@attach sortable.ref}>{id}</li>
```

Pass props as functions. The hook then sees their new values. Use a function for anything else that can change while the element is on the page, such as `disabled` or `group`. Anything fixed, like `type` here, can be a plain value. Inside a keyed `{#each}`, where a [declaration tag](/docs/hooks-without-components) can call the hook, the item's `id` never changes. It can be a plain value there too.

A hook only writes a field to dnd kit when its value changed. Arrays are compared by content, so a function that returns a new but equal array of modifiers or plugins doesn't count as a change.

## Function values need a function around them

Some inputs are functions themselves. `accept` can be one, `collisionDetector` is one, and `plugins` can be a `(defaults) => …` callback. The hook treats any function it gets as a getter and calls it. So give it a function that returns your function:

```ts
useDroppable({
	id: "trash",
	accept: () => (source) => source.type === "file",
});
```

State that the inner function reads stays reactive too. In this example, changing `mode` reconfigures the plugins of the items that read it:

```ts
useSortable({
	id,
	index: () => index,
	plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: mode })],
});
```

## Getter properties and rest props

The hooks read each field of the input object when they need it, and never copy the object. Getter properties work, and so does the rest of a component's props. A component can pass its props on to a hook unchanged:

```svelte
<script lang="ts">
	import type { Snippet } from "svelte";
	import { useSortable, type UseSortableInput } from "@dnd-kit-svelte/svelte/sortable";

	let { children, ...input }: UseSortableInput & { children: Snippet } = $props();

	// The hook reads `input.index` and the rest when they change, so the props stay reactive.
	// svelte-ignore state_referenced_locally
	const { ref } = useSortable(input);
</script>

<li {@attach ref}>{@render children()}</li>
```

The parent then passes plain values, as with any other component: `<SortableItem id={item.id} {index}>`.

## State is read through .current

`isDragging`, `isDropping`, `isDragSource` and `isDropTarget` are lenses, small objects with a `current` property. Read `.current` in markup, in `$derived` or in `$effect`, and Svelte updates them when dnd kit's state changes.

```svelte
<script lang="ts">
	const { ref, isDragging } = useDraggable({ id: "card" });
</script>

<div {@attach ref} class={[isDragging.current && "opacity-50"]}>Card</div>
```

Destructuring keeps them reactive. The value is behind `.current`, so you can take `isDragging` out of the result and read it later.

## Refs are attachments

`ref`, `handleRef`, `sourceRef` and `targetRef` are attachments. Put them on an element with `{@attach}`, and the hook gives that element to dnd kit. When the element is removed, the hook takes it back. The one exception is an element that's being dragged into another list: it stays with the drag until the drop.

```svelte
<script lang="ts">
	const { ref, handleRef } = useSortable({ id: () => id, index: () => index });
</script>

<li {@attach ref}>
	<button {@attach handleRef}>Move</button>
	{label}
</li>
```

## The entity

Each hook also returns its dnd kit entity: `draggable`, `droppable` or `sortable`. Reading its properties in markup is reactive, so you can use anything the lenses don't cover:

```svelte
<script lang="ts">
	const { sortable } = useSortable({ id: () => id, index: () => index, group: () => column });
</script>

<p>{sortable.id} is item {sortable.index} in {sortable.group}</p>
```
