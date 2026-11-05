---
title: Drag overlay
description: Show a custom element under the pointer while the original stays in place.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import dragOverlay from "#lib/examples/drag-overlay.svelte?demo";
</script>

<Demo demo={dragOverlay} />

By default, dnd kit moves the dragged element itself. `DragOverlay` renders something else under the pointer instead, and the original stays where it was.

## Render the overlay

Put one `DragOverlay` inside the provider. Its `children` snippet receives the drag source, the entity being dragged, and renders while a drag is in progress:

```svelte
<DragOverlay>
	{#snippet children(source)}
		<div class="card">{source.id}</div>
	{/snippet}
</DragOverlay>
```

Look up the rest of the item through `source.id`, or put what you need in the item's `data` and read `source.data`.

## Style the original as a placeholder

The original element stays in the list during the drag. Its `isDragging` is `true`, so you can show it as a placeholder:

```svelte
{#each photos as photo, index (photo)}
	{const { ref, isDragging } = useSortable({ id: photo, index: () => index })}
	<div {@attach ref} class={[isDragging.current && "placeholder"]}>{photo}</div>
{/each}
```

## Reuse the item's markup

If the overlay shows the same markup as the item, render the item's component inside the snippet. Hooks called inside a `DragOverlay` don't register anything with dnd kit, so the copy doesn't take part in the drag.

## Drop animation

When a drag ends, the overlay animates to the item's final position. `dropAnimation` changes this:

```svelte
<DragOverlay dropAnimation={{ duration: 150, easing: "ease-out" }}>
```

Pass `null` to turn the animation off. The default is 250 milliseconds with `ease`.

## Other props

- `disabled` turns the overlay off, either always or for some drags: `disabled={(source) => source?.type === "column"}`.
- `tag`, `class` and `style` set the element the overlay renders. `tag` defaults to `"div"`.
