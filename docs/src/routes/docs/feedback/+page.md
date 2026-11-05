---
title: Feedback
description: Choose what follows the pointer during a drag.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import feedback from "#lib/examples/feedback.svelte?demo";
</script>

<Demo demo={feedback} />

dnd kit's `Feedback` plugin decides what moves under the pointer and what remains in the element's place. There are four modes.

| Mode      | What follows the pointer | In the original place                                   |
| --------- | ------------------------ | ------------------------------------------------------- |
| `default` | The element              | An invisible placeholder that keeps the element's space |
| `clone`   | The element              | A copy of the element                                   |
| `move`    | The element              | Nothing. The space closes up.                           |
| `none`    | Nothing                  | The element                                             |

A `DragOverlay`, when you render one, replaces the element under the pointer. [Drag overlay](/docs/drag-overlay) covers it.

## Set the mode for one item

`Feedback` comes from `@dnd-kit/dom`. Configure it through the item's `plugins`. The `(defaults) => …` form keeps the default plugins and adds yours. It goes inside a function, like any input whose value is a function:

```ts
import { Feedback } from "@dnd-kit/dom";

useSortable({
	id,
	index: () => index,
	plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: "clone" })],
});
```

The demo reads its `feedback` state inside that callback, so switching modes updates every item at once.

## Choose the mode per drag

`feedback` can also be a function. It receives the drag source and the manager, and returns a mode. This one uses a copy for keyboard drags only:

```ts
Feedback.configure({
	feedback: (source, manager) => (manager.dragOperation.activatorEvent instanceof KeyboardEvent ? "clone" : "default"),
});
```

## Other options

`Feedback.configure` also takes `dropAnimation`, the same option that `DragOverlay` has, and `keyboardTransition`, which sets how the element moves between keyboard steps.
