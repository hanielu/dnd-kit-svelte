---
title: Modifiers
description: Everything exported from @dnd-kit-svelte/svelte/modifiers.
---

```ts
import { RestrictToVerticalAxis, SnapModifier } from "@dnd-kit-svelte/svelte/modifiers";
```

Pass modifiers to a draggable's `modifiers` input, or to `DragDropProvider` for every draggable. See [Modifiers](/docs/modifiers) for examples.

## From dnd kit

| Export                     | Options                                             | What it does                              |
| -------------------------- | --------------------------------------------------- | ----------------------------------------- |
| `RestrictToVerticalAxis`   |                                                     | Moves only up and down.                   |
| `RestrictToHorizontalAxis` |                                                     | Moves only left and right.                |
| `AxisModifier`             | `{ axis, value }`                                   | Fixes one axis at a value.                |
| `SnapModifier`             | `{ size }`, a number or `{ x, y }`                  | Moves in steps of a grid.                 |
| `RestrictToWindow`         |                                                     | Keeps the element inside the window.      |
| `RestrictToElement`        | `{ element }`, an element or a function of the drag | Keeps the element inside another element. |

`restrictShapeToBoundingRectangle` is exported too, for writing modifiers of your own.

## From this package

| Export                 | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `SnapCenterToCursor`   | Centers the element on the pointer.                          |
| `AlignTopLeftToCursor` | Puts the element's top-left corner at the pointer.           |
| `OffsetBottomRight`    | Puts the element just below and to the right of the pointer. |

These three measure the element when the drag starts and then follow the pointer. They suit a `DragOverlay` that's smaller than the item, or a badge that trails the cursor.

## Options

Pass options with `configure`:

```ts
SnapModifier.configure({ size: { x: 40, y: 20 } });
RestrictToElement.configure({ element: (operation) => operation.source?.element?.parentElement ?? null });
```
