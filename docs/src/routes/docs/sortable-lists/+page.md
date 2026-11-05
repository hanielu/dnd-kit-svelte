---
title: Sortable lists
description: Reorder a list by dragging its items.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import sortableList from "#lib/examples/sortable-list.svelte?demo";
</script>

<Demo demo={sortableList} />

## Make each item sortable

`useSortable` comes from `@dnd-kit-svelte/svelte/sortable`. It makes an element both draggable and a drop target, so items can trade places. It needs an `id` and the item's `index`. Pass the index as a function, because it changes as the list reorders.

```svelte
{#each items as item, index (item)}
	{const { ref } = useSortable({ id: item, index: () => index })}
	<li {@attach ref}>{item}</li>
{/each}
```

Each item is one `<li>`. The hook runs in a `{const …}` tag inside `{#each}`, with no component for the item. Items with more markup are clearer as a component that takes `id` and `index` as props, as in [Drag handles](/docs/drag-handles). [Hooks without components](/docs/hooks-without-components) compares the two.

## Update the list as you drag

dnd kit tells you where the item is being dragged, and you update your list. The `move` helper from `@dnd-kit/helpers` takes your items and a drag event, and returns a new array with the dragged item in its new place.

```svelte
<script lang="ts">
	import { move } from "@dnd-kit/helpers";

	let items = $state(["Pack the tent", "Buy snacks", "Charge the camera"]);
</script>

<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
```

`move` works with an array of ids, or of objects that have an `id` field. It returns the array unchanged when the drag was cancelled.

## onDragOver or onDragEnd

- **`onDragOver`** reorders the list during the drag, and the other items move out of the way.
- **`onDragEnd`** leaves the list alone until you drop. Then the item jumps to its new place.

With `onDragOver`, the list has already changed by the time a drag is cancelled with Escape. To put it back, keep a copy when the drag starts:

```svelte
<script lang="ts">
	let items = $state(["a", "b", "c"]);
	let snapshot: string[] = [];
</script>

<DragDropProvider
	onDragStart={() => (snapshot = items)}
	onDragOver={(event) => (items = move(items, event))}
	onDragEnd={(event) => {
		if (event.canceled) items = snapshot;
	}}
>
```

## Your state decides the order

dnd kit has a plugin, `OptimisticSortingPlugin`, that reorders DOM nodes during a drag. Svelte's keyed `{#each}` keeps track of its own nodes, and nodes moved behind its back end up in the wrong place. So `useSortable` leaves that plugin out, and the list only changes when your state does. You can still add the plugin through `plugins` if you render the list without a keyed `{#each}`.

## Animate the reorder

When an item's index changes, it slides to its new place. The `transition` input changes how:

```ts
useSortable({
	id,
	index: () => index,
	transition: { duration: 200, easing: "ease-out" },
});
```

The default is 300 milliseconds with `cubic-bezier(0.25, 1, 0.5, 1)`. Set `transition: null` to turn the animation off, or `idle: true` to animate index changes that happen outside a drag too, such as sorting by a button.
