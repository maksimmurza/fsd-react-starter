# FSD template

A starter for React applications built with Vite and TypeScript. Copy it with tiged to start an independent project, then adapt its documentation and code to your product.

## Getting started

Use a Node.js version supported by the installed Vite release (currently `^20.19.0 || >=22.12.0`) and npm.

```sh
npm ci
npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check code with Oxlint |
| `npm run fmt:check` | Check formatting with Oxfmt |
| `npm run fmt` | Format files with Oxfmt |
| `npm run build` | Check TypeScript and build into `dist` |
| `npm run preview` | Preview the production build locally |

## Documentation

- [Product](docs/product.md): description of the project built from this starter. Intentionally empty in the template.
- [Architecture](docs/architecture.md): FSD layers and dependency rules.
- [Conventions](docs/conventions.md): imports, naming, types, and styling.
- [Features](docs/features/): descriptions of individual product features.
- [Agent instructions](AGENTS.md): instructions and verification commands for coding agents.

Architecture and conventions describe the intended rules. Check the tool configurations before assuming a rule is automatically enforced.
