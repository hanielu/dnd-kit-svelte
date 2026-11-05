---
title: DragOverlay
description: Renders a custom element under the pointer during a drag.
---

```ts
import { DragOverlay } from "@dnd-kit-svelte/svelte";
```

```svelte
<DragOverlay>
	{#snippet children(source)}
		<div class="card">{source.id}</div>
	{/snippet}
</DragOverlay>
```

Render one `DragOverlay` inside a `DragDropProvider`. For as long as a drag lasts, it renders `children` with the drag source, and that element follows the pointer in place of the original.

Hooks called inside the overlay don't register with dnd kit. A copy of an item can call the same hooks as the original without taking part in the drag.

## Props

| Prop            | Type                                         | Description                                                                                                                                        |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`      | `Snippet<[source: Draggable]>`               | What to render while something is dragged. Receives the drag source.                                                                               |
| `dropAnimation` | `{ duration?, easing? } \| function \| null` | How the overlay animates to the item's final position. Default: 250 milliseconds, `ease`. `null` turns it off. A function runs your own animation. |
| `disabled`      | `boolean \| (source) => boolean`             | Turns the overlay off, always or for some drags. The original element then moves as usual.                                                         |
| `tag`           | `string`                                     | The element the overlay renders. Default: `"div"`.                                                                                                 |
| `class`         | `ClassValue`                                 | Classes for that element. Accepts the same values as Svelte's `class` attribute.                                                                   |
| `style`         | `string`                                     | Inline styles for that element.                                                                                                                    |

The element is always in the page, empty while nothing is dragged. It has a `data-dnd-overlay` attribute.

See [Drag overlay](/docs/drag-overlay) for a full example.
