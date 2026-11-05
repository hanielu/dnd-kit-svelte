---
title: DragDropProvider
description: Creates the drag and drop manager and reports drag events.
---

```ts
import { DragDropProvider } from "@dnd-kit-svelte/svelte";
```

Everything that can be dragged or dropped on goes inside a `DragDropProvider`. The hooks find its manager through context. Providers can sit side by side, and each one runs its own drags.

```svelte
<DragDropProvider onDragEnd={(event) => console.log(event.operation.target?.id)}>
	<!-- draggables and droppables -->
</DragDropProvider>
```

## Props

These are ordinary props. Unlike hook inputs, a function-valued prop such as a `(defaults) => …` callback goes in as it is.

| Prop                | Type                                   | Description                                                                                                                                                               |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugins`           | `Plugins \| (defaults) => Plugins`     | Plugins for the manager. An array replaces the defaults, a function receives them. Default: `Accessibility`, `AutoScroller`, `Cursor`, `Feedback` and `PreventSelection`. |
| `sensors`           | `Sensors \| (defaults) => Sensors`     | Sensors for every draggable that doesn't set its own. Default: `PointerSensor` and `KeyboardSensor`.                                                                      |
| `modifiers`         | `Modifiers \| (defaults) => Modifiers` | Modifiers for every draggable that doesn't set its own. Default: none.                                                                                                    |
| `manager`           | `DragDropManager`                      | A manager to use instead of creating one. Read once. The provider doesn't destroy a manager you pass in.                                                                  |
| `onBeforeDragStart` | `(event, manager) => void`             | A sensor is about to start a drag. Call `event.preventDefault()` to stop it.                                                                                              |
| `onDragStart`       | `(event, manager) => void`             | The drag starts.                                                                                                                                                          |
| `onDragMove`        | `(event, manager) => void`             | The dragged element moves.                                                                                                                                                |
| `onDragOver`        | `(event, manager) => void`             | The dragged element enters or leaves a drop target.                                                                                                                       |
| `onCollision`       | `(event, manager) => void`             | dnd kit has worked out which targets the element is over.                                                                                                                 |
| `onDragEnd`         | `(event, manager) => void`             | The drag ends. `event.canceled` tells a cancel from a drop.                                                                                                               |
| `children`          | `Snippet`                              | The content.                                                                                                                                                              |

`plugins`, `sensors` and `modifiers` can change after the provider mounts. The provider applies the new lists to its manager.

## Event objects

Every event has `operation`, with `source` (the dragged entity), `target` (the drop target, or `null`), `position`, `transform` and `status`. The event types are exported: `BeforeDragStartEvent`, `DragStartEvent`, `DragMoveEvent`, `DragOverEvent`, `CollisionEvent` and `DragEndEvent`.

```ts
import type { DragEndEvent } from "@dnd-kit-svelte/svelte";
```

See [Events](/docs/events) for examples.
