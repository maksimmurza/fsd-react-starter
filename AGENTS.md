# Agents instructions

Before making source code changes, read and follow:

- `docs/architecture.md`
- `docs/conventions.md`

## Operations with files

Use `git mv` when moving or renaming files tracked by Git. Move or rename untracked files with regular filesystem operations because `git mv` cannot operate on them. Update affected imports and documentation after a move.

After source code changes, run `npm run lint`, `npm run fmt:check`, and `npm run build`. For documentation-only changes, verify Markdown structure, links, and consistency with the repository. Markdown files are excluded from Oxfmt, so `fmt:check` does not validate them. Report any checks that fail or cannot be run.
