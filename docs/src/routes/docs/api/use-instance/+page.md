---
title: useInstance
description: Registers your own dnd kit entity while a component or block is mounted.
---

```ts
import { useInstance } from "@dnd-kit-svelte/svelte";
```

`useDraggable`, `useDroppable` and `useSortable` are built on `useInstance`. Use it for an entity they don't cover, such as a subclass of `Draggable` with behavior of your own.

```ts
import { Droppable } from "@dnd-kit/dom";

const droppable = useInstance((manager) => new Droppable({ id: "zone", register: false }, manager));
```

It calls the function once with the provider's manager, and keeps the entity registered while the component or block that called it is mounted. Create the entity with `register: false`, so that it registers only then.

Registration waits until the current update has finished, so that an element attached in the same render is already set. Setting the entity's element, and keeping its other fields in sync, is up to you:

```svelte
<div {@attach (node) => ((droppable.element = node), () => (droppable.element = undefined))}>Zone</div>
```
