---
title: Events
description: Run code when a drag starts, moves, crosses a target or ends.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import events from "#lib/examples/events/events.svelte?demo";
</script>

<Demo demo={events} />

## On the provider

`DragDropProvider` takes a handler for each event:

| Prop                | Runs when                                                |
| ------------------- | -------------------------------------------------------- |
| `onBeforeDragStart` | A sensor is about to start a drag                        |
| `onDragStart`       | The drag starts                                          |
| `onDragMove`        | The dragged element moves                                |
| `onDragOver`        | The dragged element enters or leaves a drop target       |
| `onCollision`       | dnd kit has worked out which targets the element is over |
| `onDragEnd`         | The drag ends, with a drop or a cancel                   |

Each handler gets an event and the manager. `event.operation` holds the drag: `source` is what's being dragged and `target` is the drop target it's over, or `null`.

```svelte
<DragDropProvider
	onDragEnd={(event) => {
		if (event.canceled) return;
		console.log(`Dropped ${event.operation.source?.id} on ${event.operation.target?.id}`);
	}}
>
```

`event.canceled` is `true` when the drag was cancelled, such as by pressing Escape.

## Stop a drag

Call `event.preventDefault()` in `onBeforeDragStart` to stop a drag from starting, such as while a save is in progress.

## From any component inside the provider

`useDragDropMonitor` takes the same handlers, so a component deep inside the provider can listen without passing props down:

```ts
import { useDragDropMonitor } from "@dnd-kit-svelte/svelte";

useDragDropMonitor({
	onDragStart: (event) => console.log("started", event.operation.source?.id),
	onDragEnd: (event) => console.log("ended", event.canceled ? "cancelled" : "dropped"),
});
```

It listens while the component or block that called it is mounted.

## Show the drag in markup

`useDragOperation` returns the current `source` and `target`, and keeps them up to date. Use it to show what's happening:

```svelte
<script lang="ts">
	import { useDragOperation } from "@dnd-kit-svelte/svelte";

	const operation = useDragOperation();
</script>

<p>{operation.source ? `Dragging ${operation.source.id}` : "Idle"}</p>
```

## Handlers that change state

When `onBeforeDragStart`, `onDragMove`, `onDragOver` or `onDragEnd` changes your state, dnd kit waits for Svelte to update the DOM before it measures again. A sortable item relies on this to animate to its new place after you move it in `onDragOver`. `onDragStart` and `onCollision` run straight away.
