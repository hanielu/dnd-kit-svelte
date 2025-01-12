# svelte-dnd-kit

A Svelte port of the powerful [@dnd-kit][dnd-kit] library - the modern, lightweight, performant, accessible and extensible drag & drop toolkit.

## Overview

This library provides a complete port of dnd-kit to Svelte, maintaining feature parity with the original React implementation while adapting to Svelte's reactivity system. All documentation and APIs from the [original dnd-kit][dnd-kit-docs] library apply here, with some Svelte-specific adaptations.

## Key Differences from React Implementation

The main difference lies in how reactive values are handled. Since Svelte components don't rerender the same way React components do, we've adapted the API to work with Svelte's reactivity system.

### Using Functions for Reactive Values

In hooks like `useSortable`, `useDraggable`, etc., you can pass a function to any field that needs to be reactive. The function will be called whenever the value needs to be accessed, ensuring you always get the latest value from Svelte's reactive scope.

Example:

```ts
// React dnd-kit
useSortable({
	id: item.id,
	data: item,
});

// Svelte dnd-kit
useSortable({
	// Static value
	id: item.id,
	// Reactive value using a function
	data: () => item, // Access reactive state value
});
```

## Practical Example: List Board

Here's an [example](../routes/examples/tasks-list.svelte)

## Core Concepts

All core concepts from dnd-kit remain the same:

- Draggable elements
- Droppable areas
- DndContext provider
- Sensors
- Modifiers
- Collision detection

For detailed documentation on these concepts, please refer to the [original dnd-kit documentation][dnd-kit-docs].

## Installation

```bash
npm install svelte-dnd-kit
# or
yarn add svelte-dnd-kit
```

## License

MIT © [Adroyt](https://github.com/adroyt)

[dnd-kit]: https://github.com/clauderic/dnd-kit
[dnd-kit-docs]: https://docs.dndkit.com/
