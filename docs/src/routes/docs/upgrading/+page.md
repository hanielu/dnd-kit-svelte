---
title: Upgrading from 0.1
description: What changed when the package moved to dnd kit 0.5, and how to update your code.
---

Version 0.2 rebuilds the package on dnd kit 0.5 and follows `@dnd-kit/react` from dnd kit's current release. Most code keeps working. These changes need a look.

## Svelte 5.40 or later

The package now needs Svelte 5.40. Calling hooks in `{const …}` tags needs 5.56.

## feedback moved to plugins

`feedback` is no longer an input of `useDraggable` and `useSortable`. Configure the `Feedback` plugin for the item instead:

```ts
import { Feedback } from "@dnd-kit/dom";

// Before
useSortable({ id, index: () => index, feedback: "clone" });

// After
useSortable({
	id,
	index: () => index,
	plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: "clone" })],
});
```

## Function values need a function around them

Every input can now be a function that returns its value, so a function passed on its own is read that way. Wrap `accept`, `collisionDetector` and `plugins` callbacks in another function: `accept: () => (source) => …`.

## Lists sort through state

`useSortable` no longer includes `OptimisticSortingPlugin`, which reordered the DOM during a drag. Lists that only updated their state in `onDragEnd` now don't change until the drop. Move the update to `onDragOver` to sort during the drag. Columns or groups that you sort need their order in state too. See [Sortable lists](/docs/sortable-lists) and [Multiple lists](/docs/multiple-lists).

## Smaller renames

- `useDragDropManager()` returns the manager itself. Replace `manager.current` with `manager`.
- `DragOverlay` takes `class` instead of `className`.
- `RestrictToWindowEdges` is gone. Use `RestrictToWindow` from `@dnd-kit-svelte/svelte/modifiers`.
- The `DragDropEvents` type is gone. Use `DragDropEventHandlers` for a set of handlers, or the event types such as `DragEndEvent`.

## New in 0.2

- Hooks can run in markup inside `{#each}`, with no component for each item.
- `useDragDropMonitor` listens to drag events from any component inside a provider.
- `useInstance` registers entities of your own.
- `DragOverlay` takes `dropAnimation`.
- `DragDropProvider` accepts `(defaults) => …` for `plugins`, `sensors` and `modifiers`, and no longer destroys a `manager` you pass in.
- Hooks read their input lazily, so getter properties and a component's rest props stay reactive.
