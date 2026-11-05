---
title: useDragDropManager
description: The manager of the closest DragDropProvider.
---

```ts
import { useDragDropManager } from "@dnd-kit-svelte/svelte";

const manager = useDragDropManager();
```

It returns the `DragDropManager` that the closest provider created, or the one you gave it. Call it inside the provider, where you'd call any hook.

Use the manager for things the hooks don't cover, such as `manager.actions` to start or cancel a drag from code, or `manager.registry` to look up entities. Its properties are dnd kit signals, which Svelte doesn't track. For values that update the markup, use [useDragOperation](/docs/api/use-drag-operation) or the hooks' lenses.
