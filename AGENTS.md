# Agents instructions

Before making source code changes, read and follow:

- `docs/architecture.md`
- `docs/conventions.md`

Read `docs/product.md` and the relevant documents in `docs/features/` when a task depends on product requirements or feature behavior.

## Working agreements

- Discuss architectural choices before introducing or changing backend technologies, infrastructure, hosting, persistent storage, or external services. Present the relevant alternatives and wait for the user's choice. An explicit choice already made by the user authorizes work within that choice; routine implementation details do not need repeated approval.
- Do not add automated tests, testing dependencies, or test commands unless the user explicitly requests them.
- Do not add deployment configuration or adapters, deploy, or publish anything unless the user explicitly requests it.
- Review depth and complexity warnings and simplify code where this improves readability. Do not suppress warnings merely to pass checks.

## Operations with files

Use `git mv` when moving or renaming files tracked by Git. Move or rename untracked files with regular filesystem operations because `git mv` cannot operate on them. Update affected imports and documentation after a move.

## Verification

After source code changes, run `npm run lint`, `npm run fmt:check`, and `npm run build`. Validate changed dependency structure with `npm run deps:validate`.

For documentation-only changes, verify Markdown structure, links, and consistency with the repository. Markdown files are excluded from the current formatting check, so validate their structure and links separately. Report any checks that fail or cannot be run.
