# @dnd-kit-svelte/svelte

## 0.2.0

### Minor Changes

- [`6471b95`](https://github.com/hanielu/dnd-kit-svelte/commit/6471b950e151470bcb9d03a42c041f5d9bc64045) Thanks [@hanielu](https://github.com/hanielu)! - Rebuild on dnd kit 0.5 (`@dnd-kit/dom`, `abstract`, `state` and `collision` 0.5.3), following `@dnd-kit/react` on dnd kit's `main` branch.

  Breaking changes:

  - `feedback` is no longer a `useDraggable`/`useSortable` input. Configure it per entity through `plugins`, as in dnd kit 0.4: `plugins: () => (defaults) => [...defaults, Feedback.configure({ feedback: "move" })]`.
  - A function-valued input (`accept`, `collisionDetector`, `plugins: (defaults) => …`) must be wrapped in a getter; a bare function is always read as a getter.
  - `useDragDropManager()` returns the manager itself instead of `{ current }`.
  - `DragOverlay` takes `class` instead of `className`.
  - `RestrictToWindowEdges` is removed from `/modifiers`; use dnd kit's `RestrictToWindow` (also exported there, with `RestrictToElement`).
  - `DragDropEvents` is replaced by `DragDropEventHandlers` (the handler map of `useDragDropMonitor`) and the event types `DragStartEvent`, `DragOverEvent`, `DragEndEvent`…
  - `useSortable` leaves dnd kit's `OptimisticSortingPlugin` out of its default plugins, including the defaults a `(defaults) => …` callback receives. It reorders DOM nodes behind Svelte's back, and dropping then hung the page when the list was updated in `onDragEnd`. Sort lists through state in `onDragOver` (during the drag) or `onDragEnd` (on drop); listing the plugin explicitly still opts in.
  - Requires Svelte 5.40 or later.

  New:

  - Hooks can be called in a `{const …}` declaration tag (Svelte 5.56 or later), inside `{#each}` or a snippet in the provider's markup, so a list's items need no component of their own. Each item's entity is unregistered when its block is removed.
  - `useDragDropMonitor`, to listen to drag and drop events below a `DragDropProvider`, and `useInstance`, for custom entities.
  - `DragOverlay` takes `dropAnimation` (`null` to disable it).
  - `DragDropProvider`'s `plugins`, `sensors` and `modifiers` accept `(defaults) => …` to extend the defaults.
  - Hooks read their input lazily, so getter properties and a component's rest props stay reactive, and properties first read after a drag started still update.
  - `DragDropProvider` no longer destroys a `manager` it was given.

  Fixed:

  - The package includes `LICENSE` and `NOTICE.txt`, which earlier versions left out.
  - Long lists mount faster: entities register once their element is attached, so dnd kit's accessibility pass runs once per item instead of twice (5,000 sortables: 13.4 s → 10.5 s).
  - Without a `DragOverlay`, the dragged element no longer drops out of the top layer when Svelte moves it to a higher index in a keyed `{#each}`; this replaces the `checkPopover` workaround, which only fixed it on the next pointer move.
