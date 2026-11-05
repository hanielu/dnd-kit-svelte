---
title: useDragDropMonitor
description: Listens to drag events from any component inside a provider.
---

```ts
import { useDragDropMonitor } from "@dnd-kit-svelte/svelte";
```

```ts
useDragDropMonitor({
	onDragStart: (event) => console.log("started", event.operation.source?.id),
	onDragEnd: (event) => console.log(event.canceled ? "cancelled" : "dropped"),
});
```

It takes the same handlers as `DragDropProvider`: `onBeforeDragStart`, `onDragStart`, `onDragMove`, `onDragOver`, `onCollision` and `onDragEnd`. Each one gets the event and the manager. It returns nothing.

The hook listens while the component or block that called it is mounted. It looks up each handler when the event fires, so a getter property can swap the handler later:

```ts
useDragDropMonitor({
	get onDragEnd() {
		return editing ? saveDraft : saveAndClose;
	},
});
```
