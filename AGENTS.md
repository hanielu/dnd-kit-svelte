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
  `abstract` and `react` for the whole range, and port what changed in the React adapter. `useSortable` keeps its
  own copy of dnd kit's default sortable plugins, which aren't exported: check it against `dom/src/sortable`.

## Skills

Skills live in `.agents/skills/` (Codex, Cursor); `.claude/skills/` holds relative symlinks to them for Claude Code.

- `svelte-code-writer` and `svelte-core-bestpractices`: any `.svelte` or `.svelte.ts` work. Validate with
  `npx @sveltejs/mcp svelte-autofixer <file> --svelte-version 5`.
- `release`: publishing a new version. Asked to make a release, follow it from preflight to the report.

## Invariants

- **One entity per hook call.** A hook creates its `Draggable`/`Droppable`/`Sortable` once, with `register: false`,
  and `useInstance` registers it in a microtask from an `$effect.pre`, after `{@attach}` has set the element. Input
  changes are synced onto that entity with `useSync`, which writes only the fields that changed (arrays by content);
  never recreate it. Each hook has one `pre` sync for refs and list position (`element`, `handle`, `group`, `index`)
  and one for the rest, and annotates each read with the entity's fields (`(): Fields =>`) so a misspelled field is a
  type error.
- **Hooks work without a component.** A hook can be called in a `{const …}` declaration tag (Svelte 5.56+), inside
  `{#each}` or a snippet in the provider's markup, and its entity must then belong to that block. Svelte defers an
  `$effect` created during a component's first render and gives it to the component, so a hook never calls `$effect`
  directly: use `$effect.pre` or `useBlockEffect`. Test with an item removed after mount and with one added after it.
- **Inputs are values or getters.** Every input field is a `MaybeGetter`: a value, or a function returning it
  (`index: () => index`). A function-valued field (`accept`, `collisionDetector`, `plugins: (defaults) => …`) must be
  wrapped in a getter, because a bare function is always read as one. Hooks read `input.x` lazily inside effects
  (`resolve(input.x)`), so getter properties and a component's rest props stay reactive too. Never destructure the
  input during setup. Call a `(defaults) => …` callback in the tracked read and compare what it returns, so state it
  reads stays reactive; `useSync` runs its write untracked.
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
- **dnd kit never moves DOM nodes that Svelte renders.** A keyed `{#each}` walks its own node ranges, so DOM moved
  behind its back makes it misplace or hang. `useSortable` strips `OptimisticSortingPlugin` from its defaults, lists
  and columns sort through state in `onDragOver`/`onDragEnd`, and `keepFeedbackOnTop` reopens the dragged element's
  popover when Svelte moves it together with the Feedback placeholder. Test reorders in both directions, with and
  without a `DragOverlay`.
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
| `packages/svelte/src/lib/reactivity/`         | `lens`, getters (`MaybeGetter`), signal subscriptions, `useSync`              |
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
- Destructure `$props()` at declaration: each prop compiles to a direct `$$props.x` read. Keep a rest element
  (`...rest`) only when the rest object is passed on, since it compiles to a `rest_props` proxy, and never bind the
  whole object (`const props = $props()`), which allocates one for nothing.
- Reading a prop once during setup is a decision, not an accident: mark it with
  `// svelte-ignore state_referenced_locally` and say why (see `DragDropProvider`'s manager).
- Inside a package, import across folders with `#lib/…` (package.json `imports`; `svelte-package` rewrites them),
  and within a folder relatively. Filenames are kebab-case.
- Formatting is Prettier (`.prettierrc`): tabs, double quotes, 120 columns. There is no linter.

## Docs app

- The home page shows the examples under `docs/src/lib/components/examples/<name>/`, each in a `Section` that links to
  its source on GitHub. Examples use the package exactly as users would: `@dnd-kit-svelte/svelte`, never `#lib` paths
  into `packages/`.
- Docs pages are Markdown, `docs/src/routes/docs/**/+page.md`, compiled by mdsx (`docs/mdsx.config.ts`). Frontmatter
  gives the `title` and `description`. Elements render through `docs/src/lib/markdown/blueprint.svelte`, so their
  styles stay off the demos. Add each page to `docs/src/lib/docs/nav.ts`.
- Live demos live in `docs/src/lib/examples/`. `import demo from "#lib/examples/name.svelte?demo"` gives the
  component and its source, highlighted at build time with twinkleplop, for `<Demo {demo} />`: the code shown is the
  code that runs. A demo split over several files gets a folder (`examples/name/name.svelte` and its components);
  `?demo` follows its relative `.svelte` imports and `Demo` shows a tab for each file.
- Examples and snippets call hooks in components by default. Use a `{const …}` tag only for an item of a line or two
  of markup inside `{#each}`, where a component would only pass `id` and `index` through.
- Prose follows the ai-tells Vale style: short sentences, plain verbs, no figurative ones ("lands", "lives in"). Run
  `bun run prose` and treat its hits as hints. Don't delete facts to quiet it, and keep braces in code spans, since
  mdsx reads a bare `{` as a Svelte expression.
- Styling is UnoCSS with the presets in `docs/presets/`. Colors are tokens in `docs/src/app.css` (`bg-surface`,
  `text-ink-soft`…) with a light and a dark value; `.dark` on `<html>` switches them, set before paint in `app.html`.
  Headings and demos use Manrope, docs prose Inter, and code Geist Mono.
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
bun run prose      # vale sync, then lint the docs pages with the ai-tells style
bunx changeset     # describe a user-facing package change for the next release
```

Every user-facing package change gets a changeset. Releases follow the `release` skill: it versions the changesets
locally, pushes `main`, and runs `publish.yml`, which publishes through npm trusted publishing (with provenance) and
creates the GitHub release. `ci.yml` checks every push to `main` and every pull request. Never publish from a local
machine.

Do not stage or commit unless asked.
