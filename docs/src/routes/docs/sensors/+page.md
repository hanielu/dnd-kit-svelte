---
title: Sensors
description: Control how a drag starts, with the pointer or the keyboard.
---

<script>
	import Demo from "#lib/components/demo.svelte";
	import sensors from "#lib/examples/sensors.svelte?demo";
</script>

<Demo demo={sensors} />

A sensor listens for input and starts a drag. dnd kit has two, `PointerSensor` and `KeyboardSensor`, and uses both by default.

## Pointer activation

`PointerSensor` waits a moment before it starts, so that clicks and scrolling still work:

- **Mouse on a drag handle:** the drag starts at once.
- **Touch:** the finger has to stay down for 250 milliseconds, moving less than 5 pixels.
- **Text inputs:** the pointer has to stay down for 200 milliseconds.
- **Anything else:** the pointer has to move 5 pixels, or stay down for 200 milliseconds while moving less than 10.

## Change the rule

Configure `PointerSensor` with your own activation constraints. `Distance` waits for the pointer to move a number of pixels. `Delay` waits a number of milliseconds and gives up if the pointer moves more than its `tolerance`.

```ts
import { KeyboardSensor, PointerSensor } from "@dnd-kit-svelte/svelte";
import { PointerActivationConstraints } from "@dnd-kit/dom";

const sensors = [
	PointerSensor.configure({
		activationConstraints: [new PointerActivationConstraints.Delay({ value: 500, tolerance: 5 })],
	}),
	KeyboardSensor,
];
```

Pass the list to one draggable through its `sensors` input, or to every draggable through `DragDropProvider`:

```svelte
<DragDropProvider {sensors}>
```

Keep `KeyboardSensor` in the list unless you mean to turn keyboard dragging off.

## Keyboard dragging

With `KeyboardSensor`, focus a draggable and press Space or Enter to pick it up. The arrow keys move it 10 pixels at a time. Space, Enter or Tab drops it, and Escape cancels the drag.

Change the step with `offset`:

```ts
KeyboardSensor.configure({ offset: 20 }); // or { x: 20, y: 40 }
```

`keyboardCodes` changes which keys do what, and `preventActivation` lets you refuse a drag, such as when the focus is in a text field.
