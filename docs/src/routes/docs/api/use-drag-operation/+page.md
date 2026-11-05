---
title: useDragOperation
description: The current drag's source and target, kept up to date.
---

```ts
import { useDragOperation } from "@dnd-kit-svelte/svelte";
```

```svelte
<script lang="ts">
	const operation = useDragOperation();
</script>

<p>
	{operation.source ? `${operation.source.id} over ${operation.target?.id ?? "nothing"}` : "Idle"}
</p>
```

## Returns

An object with two properties. Reading them in markup, `$derived` or `$effect` is reactive.

| Property | Type                | Description                                      |
| -------- | ------------------- | ------------------------------------------------ |
| `source` | `Draggable \| null` | What's being dragged, or `null` when nothing is. |
| `target` | `Droppable \| null` | The drop target it's over, or `null`.            |
