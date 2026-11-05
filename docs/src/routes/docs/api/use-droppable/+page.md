---
title: useDroppable
description: Makes an element a drop target.
---

```ts
import { useDroppable } from "@dnd-kit-svelte/svelte";
```

```svelte
<script lang="ts">
	const { ref, isDropTarget } = useDroppable({ id: "trash", accept: "file" });
</script>

<div {@attach ref} class={[isDropTarget.current && "over"]}>Trash</div>
```

Call it in a component that renders inside a `DragDropProvider`. Inside `{#each}`, a `{const …}` tag works too: see [Hooks without components](/docs/hooks-without-components).

## Input

Each field takes a value, or a function that returns it. Wrap a function value in another function, as `accept` can be.

| Field               | Type                                    | Description                                                                                                |
| ------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `id`                | `string \| number`                      | Required. Unique among the droppables in the provider.                                                     |
| `data`              | `object`                                | Whatever you want to read back later, as `target.data` in events. Replaced when it changes, never cleared. |
| `disabled`          | `boolean`                               | Stops drops on this element. Default: `false`.                                                             |
| `accept`            | `type \| type[] \| (source) => boolean` | Which draggables it takes, by their `type`, or a function that decides. Default: all of them.              |
| `type`              | `string \| number \| symbol`            | What kind of target this is.                                                                               |
| `collisionDetector` | `CollisionDetector`                     | How dnd kit decides that a draggable is over this target. Default: `defaultCollisionDetection`.            |
| `collisionPriority` | `CollisionPriority \| number`           | When a draggable is over several targets, the one with the higher priority is chosen.                      |
| `element`           | `Element`                               | The element, if you don't use `ref`.                                                                       |

`CollisionPriority` comes from `@dnd-kit/abstract`. Collision detectors such as `closestCenter`, `pointerIntersection` and `shapeIntersection` come from `@dnd-kit/collision`.

## Returns

| Field          | Type            | Description                                                       |
| -------------- | --------------- | ----------------------------------------------------------------- |
| `ref`          | `Attachment`    | Put it on the element that receives drops.                        |
| `isDropTarget` | `Lens<boolean>` | `true` while an accepted draggable is over it.                    |
| `droppable`    | `Droppable`     | The dnd kit entity. Reading its properties in markup is reactive. |
