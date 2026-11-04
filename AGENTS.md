# dnd-kit-svelte repository guide

dnd-kit-svelte is a Svelte 5 adapter for [dnd kit](https://github.com/clauderic/dnd-kit), published as
`@dnd-kit-svelte/svelte`. The framework-agnostic packages (`@dnd-kit/dom`, `@dnd-kit/abstract`, `@dnd-kit/state`,
`@dnd-kit/collision`) do the drag and drop work; this package only binds them to Svelte: components, `use*` hooks,
`{@attach}` refs and the bridge between dnd kit's signals and runes.

## Upstream

- The reference is dnd kit's `main` branch, not the retired `experimental` one. Keep a local clone up to date and
  read it before porting anything.
- Parity target: `packages/react` (`@dnd-kit/react`). Hook names, inputs, outputs and exports match it; this package
  differs only where Svelte needs it, and those differences are listed in the README under "Differences from React".
- `packages/svelte` (the official `@dnd-kit/svelte`, `create*` API) is a sibling, not a source: compare against it,
  don't copy its API. This package is measured against it, bundle size included.
- When bumping dnd kit, move every `@dnd-kit/*` dependency to the same version, read the `CHANGELOG.md` of `dom`,
  `abstract` and `react` for the whole range, and port what changed in the React adapter.

## Skills

Skills live in `.agents/skills/` (Codex, Cursor); `.claude/skills/` holds relative symlinks to them for Claude Code.

- `svelte-code-writer` and `svelte-core-bestpractices`: any `.svelte` or `.svelte.ts` work. Validate with
  `npx @sveltejs/mcp svelte-autofixer <file> --svelte-version 5`.

## Invariants

- **One entity per hook call.** A hook creates its `Draggable`/`Droppable`/`Sortable` once, with `register: false`,
  and `useInstance` registers it while the component is mounted. Input changes are synced onto that entity with
  `useOnValueChange`; never recreate it.
- **Inputs are values or getters.** Every input field is a `MaybeGetter`: a value, or a function returning it
  (`index: () => index`). A function-valued field (`accept`, `collisionDetector`, `plugins: (defaults) => …`) must be
  wrapped in a getter, because a bare function is always read as one. Hooks read `input.x` lazily inside effects
  (`resolve(input.x)`), so getter properties and a component's rest props stay reactive too. Never destructure the
  input during setup.
- **Outputs are lenses and attachments.** Entity state (`isDragging`, `isDropTarget`…) is a `lens`, read through
  `.current`; element refs (`ref`, `handleRef`, `sourceRef`, `targetRef`) are attachments from `attachTo`.
- **Reactive values are class instances.** Anything read through a getter (`Lens`, `SignalLens`,
  `DragOperationState`, `SvelteRenderer`) is a class whose constructor assigns `$derived`/`$state` to a private
  field, so the accessor lives on the prototype and each instance only owns its signal. Never return an object
  literal with getters.
- **Signals reach Svelte through `src/lib/reactivity`.** Read `@dnd-kit/state` signals with `SignalLens`,
  `useComputed` or `useDeepSignal`, never directly in a template, `$derived` or `$effect`.
- **Handlers that change state go through the renderer.** `DragDropProvider` runs them in `renderer.track`, so dnd
  kit measures (sortable animations, optimistic sorting) only after Svelte has updated the DOM.
- **Small and side-effect free.** No module-level side effects (`"sideEffects": false`), no vendored utility
  libraries, no new runtime dependencies beyond `@dnd-kit/*`. Remove code that nothing uses.
- **No absolute local paths** in committed files.

## Layout

| Path                                          | Owns                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `packages/svelte/`                            | The published package (`@dnd-kit-svelte/svelte`), a `sv` library project      |
| `packages/svelte/src/lib/core/context/`       | `DragDropProvider`, the manager context, the renderer                         |
| `packages/svelte/src/lib/core/draggable/`     | `useDraggable`, `DragOverlay`                                                 |
| `packages/svelte/src/lib/core/droppable/`     | `useDroppable`                                                                |
| `packages/svelte/src/lib/core/hooks/`         | `useDragDropManager`, `useDragDropMonitor`, `useDragOperation`, `useInstance` |
| `packages/svelte/src/lib/core/attachments.ts` | `attachTo`, the attachment behind every element ref                           |
| `packages/svelte/src/lib/reactivity/`         | `lens`, getters (`MaybeGetter`), signal subscriptions, `useOnValueChange`     |
| `packages/svelte/src/lib/sortable/`           | `useSortable` (`/sortable` export)                                            |
| `packages/svelte/src/lib/modifiers/`          | dnd kit's modifiers plus the cursor modifiers (`/modifiers` export)           |
| `docs/`                                       | The examples site (SvelteKit, static, UnoCSS), deployed to Vercel             |
| `.changeset/`, `.github/workflows/`           | Versioning and publishing                                                     |

`archive/` (git-ignored) holds the repository as it was before the rewrite, for reference while porting; the same
code is on the `experimental` branch. Name folders after the domain they own: no `utils`, `helpers`, `common` or
`shared`.

## Svelte conventions

- Svelte 5 runes only. `$derived` for pure calculation, `$effect` only to sync with something outside Svelte (dnd
  kit entities, listeners), always with cleanup. Files that use runes end in `.svelte.ts`.
- `{@attach}` for DOM behaviour, never actions. `class={[…]}` arrays, never `class:` directives. Declaration tags
  (`{const …}`), never `{@const}`. Keyed `{#each}` blocks.
- `untrack` only inside an active effect or derived, around a read that must not become a dependency. It does nothing
  in component setup, effect cleanups, event handlers or code after an `await`.
- Reading a prop once during setup is a decision, not an accident: mark it with
  `// svelte-ignore state_referenced_locally` and say why (see `DragDropProvider`'s manager).
- Inside a package, import across folders with `#lib/…` (package.json `imports`; `svelte-package` rewrites them),
  and within a folder relatively. Filenames are kebab-case.
- Formatting is Prettier (`.prettierrc`): tabs, double quotes, 120 columns. There is no linter.

## Docs app

- Each example is a folder under `docs/src/lib/components/examples/<name>/` and a `Section` on the home page, which
  links to its source on GitHub. Examples use the package exactly as users would: `@dnd-kit-svelte/svelte`, never
  `#lib` paths into `packages/`.
- Styling is UnoCSS with the presets in `docs/presets/`.
- `.claude/launch.json` starts it on port 5191 (`docs`). dnd kit runs collision detection on `requestAnimationFrame`,
  which a hidden browser tab pauses: test drags in a visible page.

## Commands

```sh
bun install
bun run dev        # the package in watch mode and the docs site
bun run docs       # the docs site only, against the last build of the package
bun run build      # svelte-package + publint for @dnd-kit-svelte/svelte
bun run check      # build, then svelte-check every workspace
bun run format     # prettier --write .
bunx changeset     # describe a user-facing package change for the next release
```

`release.yml` opens the "version packages" pull request on `main`; `publish.yml` is run by hand after it is merged and
publishes through npm trusted publishing.

Do not stage or commit unless asked.
