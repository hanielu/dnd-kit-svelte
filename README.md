# dnd-kit-svelte

[![npm](https://img.shields.io/npm/v/@dnd-kit-svelte/svelte.svg)](https://www.npmjs.com/package/@dnd-kit-svelte/svelte)

[dnd kit](https://github.com/clauderic/dnd-kit) for Svelte 5: draggable, droppable and sortable primitives, a drag
overlay and modifiers, built on `@dnd-kit/dom` with runes and attachments. The API follows
[`@dnd-kit/react`](https://dndkit.com/react/quickstart), so its documentation applies here, with the Svelte
differences below.

**[Examples](https://svelte-dnd-kit.vercel.app)**

## Install

```sh
npm i @dnd-kit-svelte/svelte
```

Requires Svelte 5.40 or later. Helpers such as `move` come from `@dnd-kit/helpers`; plugins such as `Feedback` from
`@dnd-kit/dom`.

## Quick start

Hooks find their manager through context, so call them in components rendered inside `DragDropProvider`.

```svelte
<!-- draggable.svelte -->
<script lang="ts">
	import { useDraggable } from "@dnd-kit-svelte/svelte";

	const { ref } = useDraggable({ id: "draggable" });
</script>

<button {@attach ref}>Drag me</button>
```

```svelte
<!-- droppable.svelte -->
<script lang="ts">
	import { useDroppable } from "@dnd-kit-svelte/svelte";
	import type { Snippet } from "svelte";

	let { id, children }: { id: string; children?: Snippet } = $props();

	const { ref, isDropTarget } = useDroppable({ id: () => id });
</script>

<div {@attach ref} data-over={isDropTarget.current}>
	{@render children?.()}
</div>
```

```svelte
<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import Draggable from "./draggable.svelte";
	import Droppable from "./droppable.svelte";

	let dropped = $state(false);
</script>

<DragDropProvider onDragEnd={(event) => !event.canceled && (dropped = event.operation.target?.id === "droppable")}>
	{#if !dropped}
		<Draggable />
	{/if}

	<Droppable id="droppable">
		{#if dropped}
			<Draggable />
		{/if}
	</Droppable>
</DragDropProvider>
```

A sortable list:

```svelte
<!-- sortable-item.svelte -->
<script lang="ts">
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";

	let { id, index }: { id: string; index: number } = $props();

	const { ref, isDragging } = useSortable({ id: () => id, index: () => index });
</script>

<li {@attach ref} data-dragging={isDragging.current}>{id}</li>
```

```svelte
<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { move } from "@dnd-kit/helpers";
	import SortableItem from "./sortable-item.svelte";

	let items = $state(["a", "b", "c"]);
</script>

<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
	<ul>
		{#each items as id, index (id)}
			<SortableItem {id} {index} />
		{/each}
	</ul>
</DragDropProvider>
```

When each item is one element, you can skip its component and call the hook in a `{const …}` tag inside `{#each}`
(Svelte 5.56 or later):

```svelte
<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { move } from "@dnd-kit/helpers";

	let items = $state(["a", "b", "c"]);
</script>

<DragDropProvider onDragOver={(event) => (items = move(items, event))}>
	<ul>
		{#each items as id, index (id)}
			{const { ref } = useSortable({ id, index: () => index })}
			<li {@attach ref}>{id}</li>
		{/each}
	</ul>
</DragDropProvider>
```

## Differences from React

Svelte components don't re-render, so values that change reach the hooks as functions, and values that the hooks
produce are read through `.current`.

**Inputs are values or getters.** Any input field can be a value, read once, or a function returning it, read
whenever it changes:

```ts
useSortable({
	id: item.id, // fixed
	index: () => index, // follows `index`
	data: () => item,
});
```

Getter properties (`get index() { return index; }`) and a component's rest props work the same way. A field whose
value is itself a function (`accept`, `collisionDetector`, `plugins: (defaults) => …`) must be wrapped in a getter:

```ts
import { Feedback } from "@dnd-kit/dom";

useSortable({
	id,
	index: () => index,
	plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: "clone" })],
});
```

**State is read through `.current`.** `isDragging`, `isDropping`, `isDragSource` and `isDropTarget` are
lenses (`Lens<boolean>`): their `current` updates the template on its own.

```svelte
<div {@attach ref}>{isDragging.current ? "Dragging" : "Idle"}</div>
```

**Refs are attachments.** `ref`, `handleRef`, `sourceRef` and `targetRef` go on elements with `{@attach}`.

**Lists sort through state.** dnd kit's `OptimisticSortingPlugin` reorders DOM nodes during a drag, which a keyed
`{#each}` can't recover from, so `useSortable` leaves it out of its default plugins (and out of the defaults a
`plugins: () => (defaults) => …` callback receives). Move items in `onDragOver` to sort while dragging, as above, or
in `onDragEnd` to sort on drop. Sort columns or groups the same way, with their own array in state.

**`DragOverlay` renders a snippet.** It receives the drag source:

```svelte
<DragOverlay>
	{#snippet children(source)}
		<Item id={source.id} />
	{/snippet}
</DragOverlay>
```

## API

| Export                                                                                 | From                               |
| -------------------------------------------------------------------------------------- | ---------------------------------- |
| `DragDropProvider`, `DragOverlay`                                                      | `@dnd-kit-svelte/svelte`           |
| `useDraggable`, `useDroppable`                                                         | `@dnd-kit-svelte/svelte`           |
| `useDragDropManager`, `useDragDropMonitor`, `useDragOperation`, `useInstance`          | `@dnd-kit-svelte/svelte`           |
| `KeyboardSensor`, `PointerSensor`, event types (`DragEndEvent`…)                       | `@dnd-kit-svelte/svelte`           |
| `useSortable`, `isSortable`, `isSortableOperation`                                     | `@dnd-kit-svelte/svelte/sortable`  |
| dnd kit's modifiers, `SnapCenterToCursor`, `AlignTopLeftToCursor`, `OffsetBottomRight` | `@dnd-kit-svelte/svelte/modifiers` |

For what each one does, see the [dnd kit documentation](https://dndkit.com/react/quickstart).

## Development

This is a Bun workspace: the package lives in `packages/svelte`, the examples site in `docs`.

```sh
bun install
bun run dev    # the package in watch mode and the examples site
bun run check  # build and type-check everything
```

## License

MIT © [Haniel Ubogu](https://github.com/HanielU). Contains code adapted from dnd kit, see [NOTICE.txt](NOTICE.txt).
