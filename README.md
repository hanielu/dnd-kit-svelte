# dnd-kit-svelte

A Svelte port of the powerful [@dnd-kit][dnd-kit] library - the modern, lightweight, performant, accessible and extensible drag & drop toolkit.

## Quick start

Install it:

```bash
npm i @dnd-kit-svelte/core
# or
yarn add @dnd-kit-svelte/core
# or
pnpm add @dnd-kit-svelte/core
```

## Overview

This library provides a complete port of dnd-kit to Svelte, maintaining feature parity with the original React implementation while adapting to Svelte's reactivity system. All documentation and APIs from the [original dnd-kit][dnd-kit-docs] library apply here, with some Svelte-specific adaptations.

## Examples

- [Sortable Tasks List](docs/src/lib/components/examples/sortable/sortable-list.svelte)
- [Nested Sortable List](docs/src/lib/components/examples/nested/draggable-containers.svelte)
- [Basic Drag & Drop](docs/src/lib/components/examples/basic/basic.svelte)

## Key Differences from React Implementation

The main difference lies in how reactive values are handled. Since Svelte components don't rerender the same way React components do, we've adapted the API to work with Svelte's reactivity system.

### Using Functions for Reactive Values

In hooks like `useSortable`, `useDraggable`, etc., you can pass a function to any field that needs to be reactive. The function will be called whenever the value needs to be accessed, ensuring you always get the latest value from Svelte's reactive scope.

Example:

```ts
// React dnd-kit
import {useSortable} from '@dnd-kit/sortable';

useSortable({
	id: item.id,
	data: item,
});

// Svelte dnd-kit
import {useSortable} from '@dnd-kit-svelte/sortable';

useSortable({
	// Static value
	id: item.id,
	// Reactive value using a function
	data: () => item, // Access reactive state value
});
```

### Data returned from hooks

In React, components re-render when their state changes, so hooks can return values directly. However, since Svelte components don't re-render, all non-function properties returned from hooks use a `.current` getter to ensure you always access the latest value.

Example:

```ts
// React dnd-kit
const { attributes, listeners, isDragging } = useSortable({ id });

<div {...attributes} {...listeners}>
  {isDragging ? 'Dragging' : 'Not dragging'}
</div>

// Svelte dnd-kit
const { attributes, listeners, isDragging } = useSortable({ id });

<div {...attributes.current} {...listeners.current}>
  {isDragging.current ? 'Dragging' : 'Not dragging'}
</div>
```

This pattern is used consistently across all hooks:

- `useDraggable`
- `useDroppable`
- `useSortable`

Properties that use `.current` include:

- State values (`isDragging`, `isOver`, etc.)
- DOM attributes (`attributes`, `listeners`)
- Transform and transition values
- Node references

## Core Concepts

All core concepts from dnd-kit remain the same:

- Draggable elements
- Droppable areas
- DndContext provider
- Sensors
- Modifiers
- Collision detection

For detailed documentation on these concepts, please refer to the [original dnd-kit documentation][dnd-kit-docs].

## License

MIT © [Haniel Ubogu](https://github.com/HanielU)

[dnd-kit]: https://github.com/clauderic/dnd-kit
[dnd-kit-docs]: https://docs.dndkit.com/
