---
title: Hooks without components
description: Call a hook in a declaration tag inside an each block, when a component for each item would only pass values through.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import sortableList from "#lib/examples/sortable-list.svelte?demo";
</script>

A hook usually goes in a component's `<script>`. Svelte 5.56 added declaration tags: `{const …}` and `{let …}` in markup. A declaration tag runs once, at its place in the markup, the same way a component's `<script>` does. So a hook can also run right inside `{#each}`.

When each item is one element, this saves a file whose only job is to pass `id` and `index` to the hook:

<Demo demo={sortableList} />

```svelte
<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
	<ul>
		{#each items as item, index (item)}
			{const { ref } = useSortable({ id: item, index: () => index })}
			<li {@attach ref}>{item}</li>
		{/each}
	</ul>
</DragDropProvider>
```

## How it works

A declaration tag runs when its block is created. Inside `{#each}`, that's once for each item. When the list reorders, Svelte moves the existing blocks instead of creating them again. Each item keeps the entity its hook created.

The hooks find the manager through context. Markup between `<DragDropProvider>` and `</DragDropProvider>` renders inside the provider, and so do snippets that you render there. A hook in either place finds the manager.

When a block is removed, because an item left the list or an `{#if}` became false, Svelte destroys the hook's effects and dnd kit unregisters the entity.

## Use `{const}`, not `{@const}`

`{@const}` is the older syntax, and it's a derived value. Svelte runs it again whenever something it reads changes. A hook called there creates a new entity every time its index changes. Always use `{const …}`.

## Calls that don't work

- **In the `<script>` of the component that renders `<DragDropProvider>`.** That script runs before the provider exists, and the hook throws a `missing_context` error there. Call it in the provider's markup or in a child component instead.
- **In an event handler, or after an `await`.** Hooks must run while a component or block is being created.

## When to use a component

A component is still the default. Use one when the hook isn't inside `{#each}`, as with one draggable or one drop zone. Use one when an item has more than a line or two of markup or needs its own props and state, or when a `DragOverlay` renders it too. Apps on Svelte versions older than 5.56 need components everywhere.

The same list with a component for each item:

```svelte
<!-- sortable-item.svelte -->
<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";

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

The [multiple lists](/docs/multiple-lists) demo uses both: a component for each list, and a declaration tag for the cards in it.
