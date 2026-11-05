---
title: useDraggable
description: Makes an element draggable.
---

```ts
import { useDraggable } from "@dnd-kit-svelte/svelte";
```

```svelte
<script lang="ts">
	const { ref, isDragging } = useDraggable({ id: "card" });
</script>

<div {@attach ref} class={[isDragging.current && "dragging"]}>Card</div>
```

Call it in a component that renders inside a `DragDropProvider`. Inside `{#each}`, a `{const …}` tag works too: see [Hooks without components](/docs/hooks-without-components).

## Input

Each field takes a value, or a function that returns it. Wrap a function value in another function. See [Inputs and outputs](/docs/inputs-and-outputs).

| Field       | Type                         | Description                                                                                                                                  |
| ----------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string \| number`           | Required. Unique among the draggables in the provider.                                                                                       |
| `data`      | `object`                     | Whatever you want to read back later, as `source.data` in events. Replaced when it changes, never cleared.                                   |
| `disabled`  | `boolean`                    | Stops the element from being dragged. Default: `false`.                                                                                      |
| `type`      | `string \| number \| symbol` | What kind of draggable this is. Droppables check it against their `accept`.                                                                  |
| `sensors`   | `Sensors`                    | Sensors for this draggable, read when its element is attached. Default: the provider's.                                                      |
| `modifiers` | `Modifiers`                  | Modifiers for this draggable. Default: the provider's.                                                                                       |
| `plugins`   | `Plugins`                    | Options for plugins, for this draggable only, such as `Feedback.configure({ feedback: "clone" })`.                                           |
| `alignment` | `{ x, y }`                   | How the drop animation lines the element up with its final position, when their sizes differ. Each axis is `"start"`, `"center"` or `"end"`. |
| `element`   | `Element`                    | The element, if you don't use `ref`.                                                                                                         |
| `handle`    | `Element`                    | The handle, if you don't use `handleRef`.                                                                                                    |

## Returns

| Field          | Type            | Description                                                                           |
| -------------- | --------------- | ------------------------------------------------------------------------------------- |
| `ref`          | `Attachment`    | Put it on the element that moves.                                                     |
| `handleRef`    | `Attachment`    | Put it on a drag handle. Then only the handle starts a drag.                          |
| `isDragging`   | `Lens<boolean>` | `true` while the element is being dragged.                                            |
| `isDropping`   | `Lens<boolean>` | `true` after a drop, while the element animates into place.                           |
| `isDragSource` | `Lens<boolean>` | `true` while the element is the source of a drag, from pickup to the end of the drop. |
| `draggable`    | `Draggable`     | The dnd kit entity. Reading its properties in markup is reactive.                     |
