# dnd-kit-svelte

> 📚 **Original Documentation**: [dnd-kit](https://next.dndkit.com/react/quickstart)

A Svelte port of the powerful [@dnd-kit][dnd-kit] library - the modern, lightweight, performant, accessible and extensible drag & drop toolkit.

## Quick start

Install it:

```bash
npm i @dnd-kit-svelte/svelte
# or
yarn add @dnd-kit-svelte/svelte
# or
pnpm add @dnd-kit-svelte/svelte
```

## Overview

This library provides a complete port of dnd-kit to Svelte, maintaining feature parity with the original React implementation while adapting to Svelte's reactivity system. All documentation and APIs from the [original dnd-kit][dnd-kit-docs] library apply here, with some Svelte-specific adaptations.

## Examples

- [Sortable Tasks List](docs/src/lib/components/examples/sortable/sortable-list.svelte)
- [Nested Sortable List](docs/src/lib/components/examples/nested/draggable-containers.svelte)
- [Basic Drag & Drop](docs/src/lib/components/examples/basic/basic.svelte)

## Key Differences from React Implementation

The main difference lies in how reactive values are handled. Since Svelte components don't rerender the same way React components do, we've adapted the API to work with Svelte's reactivity system.

### Using Functions for Reactive Inputs

In hooks like `useSortable`, `useDraggable`, etc., you can pass a function to any field that needs to be reactive. The function will be called whenever the value needs to be accessed, ensuring you always get the latest value from Svelte's reactive scope.

Example:

React:

```ts
import {useSortable} from '@dnd-kit/sortable';

useSortable({
	id: item.id,
	data: item,
});
```

Svelte:

```ts
import {useSortable} from '@dnd-kit-svelte/svelte/sortable';

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

React:

```ts
// React dnd-kit
const { ref, isDragging } = useSortable({ id });

<div ref={ref}>
  {isDragging ? 'Dragging' : 'Not dragging'}
</div>
```

Svelte:

```svelte
<script>
	import {useSortable} from '@dnd-kit-svelte/svelte/sortable';

	const {ref, isDragging} = useSortable({id});
</script>

<div {@attach ref}>
	{isDragging.current ? 'Dragging' : 'Not dragging'}
</div>
```

This pattern is used consistently across all hooks:

- [`useDraggable`](https://next.dndkit.com/react/hooks/use-draggable#output)
- [`useDroppable`](https://next.dndkit.com/react/hooks/use-droppable#output)
- [`useSortable`](https://next.dndkit.com/react/hooks/use-sortable#output)

All state values (e.g `isDragging`, `isDropping`, `isDragSource`, `isDropTarget`) have a `.current` getter to ensure you always access the latest value.

All refs (`ref`, `handleRef`, `sourceRef`, `targetRef`) are `Attachments`

## Core Concepts

All core concepts from dnd-kit remain the same:

- Draggable elements
- Droppable areas
- DragDropProvider provider
- Sensors
- Modifiers
- Collision detection

For detailed documentation on these concepts, please refer to the [original dnd-kit documentation][dnd-kit-docs].

## License

MIT © [Haniel Ubogu](https://github.com/HanielU)

[dnd-kit]: https://github.com/clauderic/dnd-kit/tree/experimental
[dnd-kit-docs]: https://next.dndkit.com/react/quickstart
