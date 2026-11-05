---
title: Differences from React
description: What works differently from @dnd-kit/react, and why.
---

This package follows `@dnd-kit/react`. The hooks have the same names, take the same inputs and return the same things, and most of [dnd kit's React documentation](https://dndkit.com/react/quickstart) applies here too. The differences below all come from how Svelte updates components. In React, a hook sees new values because the component runs again. A Svelte hook runs only once. Values that change are passed to it as functions, and values it produces are read through `.current`.

## Inputs that change are functions

```ts
// React: the component re-renders with a new index
useSortable({ id, index });

// Svelte: the hook calls the function when index changes
useSortable({ id, index: () => index });
```

A function that is itself the value, such as `accept` or a `(defaults) => …` plugins callback, goes inside another function. [Inputs and outputs](/docs/inputs-and-outputs) covers this.

## State is read through .current

`isDragging`, `isDropping`, `isDragSource` and `isDropTarget` are lenses. Read `isDragging.current` where React code reads `isDragging`.

## Refs are attachments

React's `ref` and `handleRef` are callback refs. Here they're attachments: `<div {@attach ref}>`. `sourceRef` and `targetRef` from `useSortable` work the same way.

## Hooks can run without a component

React needs a component for each sortable item. Here a hook can run in a `{const …}` tag inside `{#each}`. See [Hooks without components](/docs/hooks-without-components).

## Lists sort through state

dnd kit's `OptimisticSortingPlugin` moves DOM nodes during a drag. React re-renders the list from state afterwards, but a keyed `{#each}` in Svelte can't recover from nodes moved behind its back. `useSortable` leaves the plugin out, so update your list in `onDragOver` to sort during the drag, or in `onDragEnd` to sort on drop. See [Sortable lists](/docs/sortable-lists).

## DragOverlay takes a snippet

```svelte
<DragOverlay>
	{#snippet children(source)}
		<Item id={source.id} />
	{/snippet}
</DragOverlay>
```

React's overlay takes children or a function of the source. Here `children` is a snippet that receives the source. The overlay's `className` prop is `class`, and it accepts any value Svelte's `class` attribute does.

## The manager comes back directly

`useDragDropManager()` returns the manager itself, not an object with `current`.
