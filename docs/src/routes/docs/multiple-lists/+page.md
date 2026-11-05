---
title: Multiple lists
description: Move items between lists, and sort the lists themselves.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import multipleLists from "#lib/examples/multiple-lists/multiple-lists.svelte?demo";
</script>

<Demo demo={multipleLists} />

## Keep each list under a key

Store the lists in one object, keyed by list. `move` from `@dnd-kit/helpers` takes the whole object and moves the dragged card within its list or into another one.

```ts
let items = $state({
	todo: ["Write the outline", "Pick a date"],
	doing: ["Draft the invite"],
	done: [],
});
```

## Tell each card which list it's in

Each list is a `column.svelte` component, which gets its key as `id` and its cards as `cards`. Give each card the key of its list as `group`. dnd kit uses it to tell the lists apart, and `move` uses it to find where the card came from.

```svelte
<!-- column.svelte -->
{#each cards as card, cardIndex (card)}
	{const { ref } = useSortable({ id: card, index: () => cardIndex, group: id, type: "card", accept: "card" })}
	<div {@attach ref}>{card}</div>
{/each}
```

Each card is one element. The demo calls its hook in a [declaration tag](/docs/hooks-without-components) and gives it no component.

When a card moves to another list, Svelte renders it in that list's `{#each}`. The hook runs again there with the new `group`, and the drag carries on with the same element.

## Let lists accept cards

An empty list has no cards to drop between. Make the list itself a drop target that accepts cards, so a card can be dropped into it:

```ts
// column.svelte
const column = useSortable({
	id: () => id,
	index: () => index,
	type: "column",
	accept: ["column", "card"],
	collisionPriority: CollisionPriority.Low,
});
```

`collisionPriority: CollisionPriority.Low` makes cards inside a list win over the list itself. Without it, a card dragged over a full list could target the list instead of the cards in it. `CollisionPriority` comes from `@dnd-kit/abstract`.

## Keep cards and lists apart

`type` says what something is, and `accept` says what it takes. Cards have `type: "card"` and accept only cards, so a dragged list never lands between two cards.

## Sort the lists too

The order of the lists is state of its own. In `onDragOver`, check what's being dragged and move the right thing:

```svelte
<DragDropProvider
	onDragOver={(event) => {
		if (event.operation.source?.type === "column") columns = move(columns, event);
		else items = move(items, event);
	}}
>
```

The demo drags lists by the grip in their header. [Drag handles](/docs/drag-handles) explains how that works.
