---
title: Modifiers
description: Restrict or snap how a dragged element moves.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import modifiers from "#lib/examples/modifiers/modifiers.svelte?demo";
</script>

<Demo demo={modifiers} />

A modifier changes where the dragged element goes, such as keeping it on one axis or inside a box. Modifiers come from `@dnd-kit-svelte/svelte/modifiers`.

## For one draggable

Pass a list to the `modifiers` input:

```ts
import { RestrictToVerticalAxis } from "@dnd-kit-svelte/svelte/modifiers";

useDraggable({ id: "box", modifiers: [RestrictToVerticalAxis] });
```

## For every draggable

Pass them to `DragDropProvider` instead. They apply to each draggable that has no modifiers of its own.

```svelte
<DragDropProvider modifiers={[RestrictToWindow]}>
```

## Available modifiers

| Modifier                   | What it does                                                |
| -------------------------- | ----------------------------------------------------------- |
| `RestrictToVerticalAxis`   | Moves only up and down                                      |
| `RestrictToHorizontalAxis` | Moves only left and right                                   |
| `RestrictToWindow`         | Keeps the element inside the window                         |
| `RestrictToElement`        | Keeps the element inside another element                    |
| `SnapModifier`             | Moves in steps of a grid                                    |
| `SnapCenterToCursor`       | Centers the element on the pointer                          |
| `AlignTopLeftToCursor`     | Puts the element's top-left corner at the pointer           |
| `OffsetBottomRight`        | Puts the element just below and to the right of the pointer |

The last three come from this package. The rest are dnd kit's.

## Modifiers with options

Some modifiers take options through `configure`:

```ts
SnapModifier.configure({ size: 40 }); // or { x: 40, y: 20 }
RestrictToElement.configure({ element: container });
```

`RestrictToElement` needs the element, which you often get through `bind:this` after the component mounts. Pass the modifiers as a function. The hook then picks up the element once it's there:

```svelte
<!-- box.svelte -->
<script lang="ts">
	import { useDraggable } from "@dnd-kit-svelte/svelte";
	import { RestrictToElement } from "@dnd-kit-svelte/svelte/modifiers";

	let { container }: { container?: HTMLElement } = $props();

	const { ref } = useDraggable({
		id: "box",
		modifiers: () => [RestrictToElement.configure({ element: container })],
	});
</script>

<button {@attach ref}>Drag</button>
```

```svelte
<script lang="ts">
	let container = $state<HTMLElement>();
</script>

<div bind:this={container}>
	<Box {container} />
</div>
```
