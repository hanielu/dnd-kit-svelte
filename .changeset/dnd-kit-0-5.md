---
"@dnd-kit-svelte/svelte": minor
---

Rebuild on dnd kit 0.5 (`@dnd-kit/dom`, `abstract`, `state` and `collision` 0.5.3), following `@dnd-kit/react` on dnd kit's `main` branch.

Breaking changes:

- `feedback` is no longer a `useDraggable`/`useSortable` input. Configure it per entity through `plugins`, as in dnd kit 0.4: `plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: "move" })]`.
- A function-valued input (`accept`, `collisionDetector`, `plugins: (defaults) => …`) must be wrapped in a getter; a bare function is always read as a getter.
- `useDragDropManager()` returns the manager itself instead of `{ current }`.
- `DragOverlay` takes `class` instead of `className`.
- `RestrictToWindowEdges` is removed from `/modifiers`; use dnd kit's `RestrictToWindow` (also exported there, with `RestrictToElement`).
- `DragDropEvents` is replaced by `DragDropEventHandlers` (the handler map of `useDragDropMonitor`) and the event types `DragStartEvent`, `DragOverEvent`, `DragEndEvent`…
- Requires Svelte 5.40 or later.

New:

- `useDragDropMonitor`, to listen to drag and drop events below a `DragDropProvider`, and `useInstance`, for custom entities.
- `DragOverlay` takes `dropAnimation` (`null` to disable it).
- `DragDropProvider`'s `plugins`, `sensors` and `modifiers` accept `(defaults) => …` to extend the defaults.
- Hooks read their input lazily, so getter properties and a component's rest props stay reactive, and properties first read after a drag started still update.
- `DragDropProvider` no longer destroys a `manager` it was given.
