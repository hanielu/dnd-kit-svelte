---
name: release
description: Publish a new version of @dnd-kit-svelte/svelte to npm and GitHub. Use when the user asks to make, cut, ship or publish a release or a new version. Versions the pending changesets, pushes main, runs the publish workflow and checks npm, provenance and the GitHub release.
---

# Release @dnd-kit-svelte/svelte

Changesets decide the version. This skill turns them into a version commit on `main`, and
`.github/workflows/publish.yml` publishes it to npm through trusted publishing and creates the GitHub release. No npm
login is needed on this machine.

A request to make a release covers every step below, including the commits, the pushes to `main` and running the
publish workflow. Stop and report when a gate fails. Never skip, weaken or work around a gate to get a release out,
and never publish from this machine with `npm publish`.

Run long commands (`bun run check`, the docs build, `gh run watch`) in the background.

## 1. Preflight

All of these must hold. Fix what you can and say so; ask the user about the rest.

```bash
git branch --show-current                      # main
git status --short                             # empty
gh auth status                                 # logged in, with the repo and workflow scopes
gh repo view --json defaultBranchRef --jq .defaultBranchRef.name   # main: workflow_dispatch needs the workflow there
git fetch origin && git rev-list --left-right --count origin/main...main
```

- **Uncommitted changes:** stop and ask whether they belong in the release.
- **Behind `origin/main`:** `git merge --ff-only origin/main`. If the branches diverged, `git merge origin/main`, and
  stop on a conflict.
- **Default branch isn't `main`:** ask the user before changing it (`gh repo edit --default-branch main`).

Then find what will be released:

```bash
bunx changeset status --verbose                # the package and its next version
npm view @dnd-kit-svelte/svelte dist-tags --json
git describe --tags --abbrev=0 --match '@dnd-kit-svelte/svelte@*'   # the last release tag
```

The next version must not be on npm yet. If there are no changesets, read the commits since the last release tag:

- **Only `docs`, `chore`, `ci`, `test` or `refactor` commits:** there is nothing to release. Say so and stop.
- **Otherwise:** write one changeset per user-facing change in `.changeset/` and commit it as
  `chore: add changesets for the next release`. Use `feat` for minor and `fix` or `perf` for patch. While the version
  is `0.x`, a breaking change (`!`) is a minor bump, not a major one.

## 2. Verify

Each command must pass:

```bash
bun install --frozen-lockfile
bun run check                # builds the package, then svelte-check every workspace
bun run lint                 # prettier --check
bun run prose                # Vale on the docs pages; treat hits as hints, as AGENTS.md says
bun run --filter docs build  # the docs site prerenders every page
```

Pack the package without publishing it, and check what npm would receive:

```bash
cd packages/svelte && bun run prepack >/dev/null && npm pack --dry-run --json --ignore-scripts > "$TMPDIR/pack.json" && cd ../..
bun -e '
const [pack] = await Bun.file(process.env.TMPDIR + "/pack.json").json();
const paths = pack.files.map((file) => file.path);
const root = paths.filter((path) => !path.includes("/")).sort();
const unexpected = paths.filter((path) => /__tests__|\.(test|spec)\.|\.npmrc|\.env|node_modules|\.DS_Store/.test(path));
const missing = ["LICENSE", "NOTICE.txt", "README.md", "package.json"].filter((name) => !root.includes(name));
console.log({ files: paths.length, size: pack.size, root, unexpected, missing });
if (unexpected.length || missing.length) process.exit(1);'
```

Keep `$TMPDIR/pack.json` for step 5.

Read every pending changeset. Each one becomes a changelog entry and part of the GitHub release notes, so it must be
accurate, user-facing and plain. Fix the wording now and commit the fix.

## 3. Push, then version

```bash
git push origin main
GITHUB_TOKEN=$(gh auth token) bun run version-packages
bunx prettier --write packages/svelte/CHANGELOG.md
```

Push first. `@changesets/changelog-github` looks up the commit that added each changeset on GitHub, and versioning
fails with `Cannot read properties of null (reading 'author')` while that commit is only local.

`version-packages` bumps `packages/svelte/package.json`, adds the version's section to `packages/svelte/CHANGELOG.md`,
deletes the changesets it used and updates `bun.lock`. Then:

- Read the new changelog section.
- Update docs that name the previous version or call something unreleased:
  `rg -n "<previous version>|unreleased" README.md AGENTS.md docs/src/routes/docs`.
- Run `bun run lint` again.
- Commit as `chore(release): @dnd-kit-svelte/svelte@<version>`, with a body that lists the headline changes, and push.

## 4. Publish

```bash
gh workflow run publish.yml --ref main
gh run list --workflow publish.yml --branch main --limit 1 --json databaseId,headSha,status
gh run watch <databaseId> --exit-status
```

The run can take a few seconds to appear. Check that its `headSha` is `git rev-parse HEAD` before you watch it.

If the run fails, read `gh run view <databaseId> --log-failed`:

- **`E404`, `ENEEDAUTH`, `401`, or a publish rejected as stage-only, in "Publish to npm":** npm doesn't trust the
  workflow to publish. Ask the user to check the package's settings on npmjs.com. Under @dnd-kit-svelte/svelte →
  Settings → Trusted publishing, it needs:
  - publisher: GitHub Actions
  - user: `hanielu`
  - repository: `dnd-kit-svelte`
  - workflow: `publish.yml`
  - environment: blank
  - allowed actions: "Allow npm publish" ticked. "Allow npm dist-tag" isn't needed.

  Only the user can change this. Run the workflow again once they have.
- **A failure before "Publish to npm":** nothing was published. Fix it on `main`, push and run the workflow again.

The workflow is safe to run again: `changeset publish` skips a version that is already on npm, and the release step
skips a GitHub release that already exists.

## 5. Check the release

```bash
npm view @dnd-kit-svelte/svelte@<version> version dist.integrity dist.attestations --json
npm view @dnd-kit-svelte/svelte dist-tags.latest
npm pack @dnd-kit-svelte/svelte@<version> --dry-run --json > "$TMPDIR/published.json"
gh release view "@dnd-kit-svelte/svelte@<version>" --json url,tagName,targetCommitish,body
gh api repos/hanielu/dnd-kit-svelte/releases/latest --jq .tag_name
git fetch origin tag "@dnd-kit-svelte/svelte@<version>"
```

Fetch only the new tag: an old `0.0.1` tag differs between local clones and GitHub, so `git fetch --tags` fails.

- `latest` is the new version, and `dist.attestations` shows provenance.
- The published file list matches the local pack from step 2: compare the `path` lists of the two JSON files.
- The release tag points at the version commit and is the latest release. Its notes start with the changelog section.

## 6. Report

Tell the user:
- the version and what changed in it
- the npm page, `https://www.npmjs.com/package/@dnd-kit-svelte/svelte/v/<version>`
- the GitHub release URL
- whether the package has provenance
- anything that failed, was skipped or still needs them

Prereleases (`next` dist-tag) aren't set up. Ask before adding them.
