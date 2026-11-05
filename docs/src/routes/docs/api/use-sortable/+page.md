---
title: useSortable
description: Makes an element sortable, both draggable and a drop target.
---

```ts
import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
```

```svelte
<!-- sortable-item.svelte -->
<script lang="ts">
	let { id, index }: { id: string; index: number } = $props();

	const { ref } = useSortable({ id: () => id, index: () => index });
</script>

<li {@attach ref}>{id}</li>
```

```svelte
{#each items as item, index (item)}
	<SortableItem id={item} {index} />
{/each}
```

When an item is one element like this, you can skip the component and call the hook in a `{const …}` tag inside `{#each}`. See [Hooks without components](/docs/hooks-without-components).

Sorting changes your state, not the DOM. Update the list in `onDragOver` or `onDragEnd`, usually with `move` from `@dnd-kit/helpers`. See [Sortable lists](/docs/sortable-lists).

## Input

Each field takes a value, or a function that returns it. Pass `index` as a function, since it changes as the list reorders.

| Field                         | Type                                    | Description                                                                                                                                                                    |
| ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                          | `string \| number`                      | Required. Unique in the provider.                                                                                                                                              |
| `index`                       | `number`                                | Required. The item's position in its list.                                                                                                                                     |
| `group`                       | `string \| number`                      | Which list the item is in, when there are several.                                                                                                                             |
| `data`                        | `object`                                | Whatever you want to read back later in events. Replaced when it changes, never cleared.                                                                                       |
| `disabled`                    | `boolean \| { draggable, droppable }`   | `true` turns off dragging and dropping. The object form turns them off separately.                                                                                             |
| `type`                        | `string \| number \| symbol`            | What kind of item this is.                                                                                                                                                     |
| `accept`                      | `type \| type[] \| (source) => boolean` | Which items can be dropped on it. Default: all of them.                                                                                                                        |
| `transition`                  | `{ duration?, easing?, idle? } \| null` | How the item moves when its index changes. Default: 300 milliseconds, `cubic-bezier(0.25, 1, 0.5, 1)`. `null` turns it off. `idle: true` also animates changes outside a drag. |
| `plugins`                     | `Plugins \| (defaults) => Plugins`      | Plugins for this item. Default: `SortableKeyboardPlugin`. dnd kit's `OptimisticSortingPlugin` is left out, and out of the defaults a callback receives.                        |
| `sensors`                     | `Sensors`                               | Sensors for this item. Default: the provider's.                                                                                                                                |
| `modifiers`                   | `Modifiers`                             | Modifiers for this item. Default: the provider's.                                                                                                                              |
| `collisionDetector`           | `CollisionDetector`                     | How dnd kit decides that an item is over this one.                                                                                                                             |
| `collisionPriority`           | `CollisionPriority \| number`           | When an item is over several targets, the one with the higher priority is chosen.                                                                                              |
| `alignment`                   | `{ x, y }`                              | How the drop animation lines the item up with its final position, when their sizes differ.                                                                                     |
| `element`, `handle`, `target` | `Element`                               | The elements, if you don't use the attachments.                                                                                                                                |

## Returns

| Field          | Type            | Description                                                                          |
| -------------- | --------------- | ------------------------------------------------------------------------------------ |
| `ref`          | `Attachment`    | Put it on the item. It moves, and it receives drops.                                 |
| `handleRef`    | `Attachment`    | Put it on a drag handle. Then only the handle starts a drag.                         |
| `sourceRef`    | `Attachment`    | The part that moves, when it isn't the same element as the part that receives drops. |
| `targetRef`    | `Attachment`    | The part that receives drops, when it isn't the same element as the part that moves. |
| `isDragging`   | `Lens<boolean>` | `true` while the item is being dragged.                                              |
| `isDropping`   | `Lens<boolean>` | `true` after a drop, while the item animates into place.                             |
| `isDragSource` | `Lens<boolean>` | `true` while the item is the source of a drag, from pickup to the end of the drop.   |
| `isDropTarget` | `Lens<boolean>` | `true` while another item is over it.                                                |
| `sortable`     | `Sortable`      | The dnd kit entity. Reading its properties in markup is reactive.                    |

`isSortable(entity)` and `isSortableOperation(operation)`, also exported from `@dnd-kit-svelte/svelte/sortable`, tell sortable items apart from other draggables in event handlers.
