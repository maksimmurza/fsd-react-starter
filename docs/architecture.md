# Architecture principles and rules

The frontend follows Feature-Sliced Design with the project conventions below. Application source belongs to these layers under `src`:

```text
src/
  app/       # Entrypoint, layouts, providers, and global styles
  pages/     # Page composition
  widgets/   # Independent composite UI blocks
  features/  # User operations
  entities/  # Domain models and their base operations
  shared/    # Reusable infrastructure, UI, and utilities
```

Tooling configuration files may use the locations required by their tools.

## Dependency boundaries

The dependency direction is `app → pages → widgets → features → entities → shared`. A layer may import from layers below it, never above it. Slices within one layer must not import one another, including type-only imports. `app` and `shared` are organized into segments rather than slices.

Compose entity types in upper layers. If a reusable entity needs another entity's fields, accept a constrained generic requiring only the fields it needs instead of importing the sibling slice.

Use each slice's public `index.ts`. Root slice indexes re-export public segment indexes with `export *`; segment indexes re-export only their own modules. Cross-segment imports within a slice go through the target segment's index. Schema imports may reference the named model file directly to avoid barrel cycles. Index files contain only re-exports.

See [conventions](conventions.md) for naming, imports, styling, and code-quality rules. Enforce dependency boundaries and public APIs with automated checks where supported; review rules that are not covered by those checks.

## Layer responsibilities

### Shared

`shared/api` owns the shared HTTP client and reusable request infrastructure. Static application configuration is centralized in named modules under `shared/config`. Other layers consume this configuration instead of defining their own `config` segments.

Environment-backed values belong in the single `shared/constants/environment.ts` module. Public website links belong in `shared/constants/links.ts`. These modules are introduced when needed; environment reads are kept separate from static configuration.

`shared/components` exposes reusable UI primitives. `shared/lib` holds generic utilities in named files. When runtime validation is used, `shared/model` contains reusable schemas in named files without imports from domain slices.

`shared/index.ts` composes public group indexes. Other layers combine shared dependencies in one import from `@/shared`. Modules inside `shared` use relative imports to avoid root-barrel cycles.

### Entities

Entity slices own domain types, base operations, and entity state. Put runtime schemas directly in named files under `model` and infer validated data types from those schemas. Entity slices do not own feature requests or import sibling slices.

### Features

Feature slices implement user operations. Presentation, feature state and orchestration, and feature-specific requests belong in the corresponding FSD segments.

Separate server-state queries from transport-level request functions: queries belong in `api/queries` and request functions in `api/requests`, with public indexes for both groups. Model indexes re-export named schema modules. Within a slice, API modules may import a schema directly from its model file to avoid hooks and API dependencies exported by `model/index.ts`.

Do not create nested `schemas` or `validation` directories under a model segment. A feature's `lib` segment is domain-agnostic and must not import its `model` segment. Model code may consume library helpers.

### Widgets and pages

Widgets compose lower layers into independent UI blocks. Keep helpers and state specific to the widget inside its slice; reuse entity models and operations instead of duplicating them.

Pages compose widgets and lower-layer slices into screens. UI used only on one page may stay in that page's `ui` segment; extract it into a widget when reused or independently meaningful. Pages may coordinate independent features without making those features import one another.

### App

`app/main.tsx` composes application providers. Application layouts belong in `app/layouts`, global styles in `app/styles`. Create providers and other application infrastructure when needed.

Keep route definitions, navigation paths, router initialization, and the routing provider together in a named module under `app/providers`, without separate routing or path modules. Supply navigation destinations to lower layers through props.

Initialize the server-state cache and any configured persistence infrastructure in an application provider. Keep the cache client stable for the application lifetime. Queries access it through the provided cache API rather than importing app modules.

## Documentation boundaries

This document describes project structure and dependencies. Code conventions belong in [conventions.md](conventions.md), user behavior and feature flows in [features/](features/), and product decisions in [product.md](product.md).

Introduce request, routing, validation, and persistence modules when the project needs those capabilities. Do not create empty implementation modules merely to reproduce the structure described here.
