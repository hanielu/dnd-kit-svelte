---
title: Introduction
description: Drag and drop for Svelte 5, built on dnd kit.
---

`@dnd-kit-svelte/svelte` brings [dnd kit](https://dndkit.com) to Svelte 5. dnd kit's own packages handle pointer and keyboard input, collision detection, scrolling and screen reader announcements. This package connects them to Svelte with hooks, two components and attachments.

## What's in the package

- `useDraggable` makes an element draggable and `useDroppable` makes it a drop target. `useSortable` does both, for lists.
- `DragDropProvider` creates the drag and drop manager and reports drag events.
- `DragOverlay` shows a custom element under the pointer while you drag.
- Modifiers restrict or snap movement, such as keeping it on one axis or inside an element.

## Install

```bash
npm i @dnd-kit-svelte/svelte
```

The package needs Svelte 5.40 or later. Some examples call a hook in a `{const …}` tag inside `{#each}` instead of a component, which needs Svelte 5.56 or later. [Hooks without components](/docs/hooks-without-components) explains when that helps.

Some examples import from dnd kit directly: `move` from `@dnd-kit/helpers`, and plugins such as `Feedback` from `@dnd-kit/dom`. Install those at the version this package uses (0.5) if you need them.

```bash
npm i @dnd-kit/helpers @dnd-kit/dom
```

## How it relates to dnd kit

The API follows `@dnd-kit/react`. The hooks have the same names and take the same inputs, and the provider reports the same events. A few things differ because Svelte doesn't re-render components. Inputs that change are passed as functions, state is read through `.current`, and element refs are attachments. [Differences from React](/docs/differences-from-react) lists them all.

dnd kit also publishes an official Svelte adapter, `@dnd-kit/svelte`. If you're coming from it, the names map like this.

| `@dnd-kit/svelte`                             | This package                                          |
| --------------------------------------------- | ----------------------------------------------------- |
| `createDraggable`                             | `useDraggable`                                        |
| `createDroppable`                             | `useDroppable`                                        |
| `createSortable`                              | `useSortable`, from `@dnd-kit-svelte/svelte/sortable` |
| `createDragDropMonitor`                       | `useDragDropMonitor`                                  |
| `createDragOperation`                         | `useDragOperation`                                    |
| `getDragDropManager`                          | `useDragDropManager`                                  |
| `{@attach draggable.attach}`                  | `{@attach draggable.ref}`                             |
| `{@attach draggable.attachHandle}`            | `{@attach draggable.handleRef}`                       |
| `draggable.isDragging`                        | `draggable.isDragging.current`                        |
| `createDraggable({ get id() { return id } })` | `useDraggable({ id: () => id })`                      |

## Next steps

- [Quickstart](/docs/quickstart) builds a first drag and drop example.
- [Inputs and outputs](/docs/inputs-and-outputs) explains how values get in and out of the hooks.
- [Sortable lists](/docs/sortable-lists) covers the most common use.
