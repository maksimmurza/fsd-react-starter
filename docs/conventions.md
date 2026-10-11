# Conventions

## Import and export rules

- Declare UI components first, then export them with `export { Component }`. Do not use default exports in application code; tooling configuration files may use them when required by their tools.
- Each layer or slice has an `index.ts` responsible for its public API. Each exported segment or public component/library group also has its own index.
- `index.ts` files contain only re-exports. Do not put implementations, constants, environment reads, initialization, or other executable statements in them. Keep that code in named modules and re-export their public API.
- Build public API barrels with `export *` through directory indexes. A slice's index re-exports its public segments, for example `export * from './model';`, rather than enumerating symbols or referring directly to segment implementation files.
- Segment indexes re-export their public modules with `export *`, including type-only modules. A separate `export type { ... }` list is not needed in a barrel. Only expose modules intended to be public; do not export internal helpers merely to fill an index.
- Segment indexes only re-export modules inside their own segment. Cross-segment imports within a slice use the target segment's index, for example `import { useEditor } from '../model';`. Imports within a segment may refer directly to its files. Within the same slice, schema imports may reference the named model file directly to avoid loading hooks and creating barrel cycles. Implementation files keep named exports.
- Within a slice, `lib` must not import from `model`: library code is domain-agnostic, while model carries domain logic. Model may consume library helpers. Enforce this dependency direction with automated architecture checks.
- Imports from other layers go through the target slice's public API; deep imports into its internal modules are prohibited. Empty placeholder indexes do not expose an API until public modules are re-exported.
- Outside `shared`, import all shared values and types through `@/shared`, with at most one import declaration per file. Combine symbols from API, components, config, constants, and libraries; use inline `type` specifiers when mixing types and values. Do not import from internal groups such as `@/shared/api` or `@/shared/lib`.
- `shared/index.ts` uses `export *` to compose public group indexes. Inside `shared`, use relative imports to the required group or module instead of importing the root barrel to avoid cycles.
- Code-generation destinations still point to the folders where generated files belong. Adapt generated application imports to the public API rules above.

## Naming rules

- Name UI component files in `PascalCase`, matching the main component: `Button.tsx`, `SettingsDialog.tsx`, `SettingsPage.tsx`. Apply this in every layer, including internal components.
- Name other application JavaScript and TypeScript files in `camelCase`, for example `loadSettings.ts` and `apiClient.ts`. Conventional entrypoints such as `main.tsx` and public API barrels such as `index.ts` retain their names; JSX usage alone does not make an entrypoint a component module.
- Use lowercase acronym words in non-component filenames, for example `url.ts`, not `URL.ts`.
- Hook filenames match the hook's `camelCase` identifier, for example `useSettings.ts`; do not name hooks in kebab-case.
- Kebab-case filenames are reserved for utilities or names required by tooling. Folder names follow the separate rules below.
- A standalone utility belongs in a named file, not a directory with its implementation in `index.ts`. For example, URL helpers belong in `shared/lib/url.ts` and are re-exported by `shared/lib/index.ts`.
- Feature folder names normally start with the entity they operate on, for example `document-share` or `document-sharing`.
- A common functional prefix may group related features, for example `auth-login` and `auth-signup`.

## Configuration

- `app` owns initialization and providers. Do not create an `app/config` object or pass API connection settings through page or component props just to make requests.
- Keep static application configuration in `shared/config`, with a separate named file for each aspect, for example `endpoints.ts`, `timeouts.ts`, and `storage.ts`. Do not read environment variables or assemble a global configuration object in this folder. Its index only re-exports named modules.
- Read frontend environment values only in the single `shared/constants/environment.ts` module. Do not create an environment directory or scatter environment reads across API clients, features, components, or app.
- Configure connection URLs through environment variables rather than hardcoding them. For a backend connection, use an environment-backed base URL; keep API endpoint paths in `shared/config/endpoints.ts` and public website links in `shared/constants/links.ts`.
- `.env.example` files contain variable names with empty values, without real configuration values or secrets. Actual values belong in ignored local environment files. Fill in required values after copying a template.
- Keep route definitions, application paths, router initialization, and the routing provider together in a named module under `app/providers`. Supply navigation destinations to lower-layer components through props instead of importing app modules or duplicating route literals.

## API requests

- Send feature requests through the shared HTTP client in `shared/api/apiClient.ts`, exposed through `shared/api/index.ts` and `shared/index.ts`. Import it with other shared dependencies from `@/shared`; do not create competing clients or bypass the shared request infrastructure.
- A request used by one feature belongs in that feature's `api` segment. Keep feature-specific response parsing and error handling there; `shared/api` provides reusable client infrastructure.
- Place server-state queries in `api/queries` and transport-level request functions in `api/requests`, each with re-export-only indexes. Cache keys identify the requested data and relevant settings; do not introduce a new timestamp on every render. Access the cache through its provided API rather than importing from app.
- When server-state persistence is configured, explicitly opt in only for data that should survive reloads. Persistence and cache lifetimes follow the product's requirements.
- Use a shared API wrapper when its behavior fits the request. It is optional; do not force requests through it when they need to distinguish cancellation, timeouts, and HTTP statuses. Add authentication interceptors when authentication is implemented.
- Cancel obsolete requests when their input changes or their owning flow closes. Prevent stale responses from replacing newer results. Distinguish an empty successful result from a request failure.

## Types

All application source code must be strictly typed, without explicit or implicit `any`. Check typing errors through the project's static analysis and compiler settings.

Do not bypass slice isolation with type-only imports. When an entity needs fields owned by another entity slice, accept a constrained generic requiring only those fields and compose the concrete types in an upper layer.

## Validation and forms

- Validate request/response data, persisted data, URLs, and form input with schemas. Keep generic schemas in named files directly under `shared/model` and domain-specific schemas under the owning entity or feature's model segment. Re-export schema modules through `model/index.ts`; do not create nested schemas or validation directories.
- Derive validated data types from their schemas. Distinguish schema input and output types when transformations change the data shape. Do not duplicate schema shapes in handwritten interfaces or structural validators.
- Export inferred types from their defining schema module instead of forwarding them through `types.ts` or other implementation modules. Within a slice, import schema types directly from that file; imports from other slices still use the public API.
- Connect form state and error handling to the validation schema so field validation uses the same source of truth. Keep field-array keys separate from domain IDs, associate field errors with `aria-invalid` and `aria-describedby`, and persist only successfully validated data. Name the save callback `onSave`.
- Report a successful save only after persistence succeeds. Handle unavailable storage and invalid saved data without silently overwriting unreadable data.

## Code quality

- Use braces for every branch and loop, including single statements. Do not use nested ternary expressions, explicit `any`, or non-strict equality.
- Separate imports from module code, adjacent function declarations, and meaningful stages with blank lines. Keep related declarations and operations together. Use descriptive names and simple conditions; prefer early returns when they reduce nesting.
- Extract functions around a clear responsibility rather than merely to meet a line-count or complexity threshold.
- Keep a blank line after imports. Treat block nesting beyond three levels or cyclomatic complexity above ten as signals to review the code. Simplify where this improves readability; do not suppress warnings merely to pass checks.
- Use the project's formatter configuration for indentation, spacing, wrapping, and quotes. Before completing source changes, run `npm run lint`, `npm run fmt:check`, and `npm run build`. Validate changed dependency structure with `npm run deps:validate`.

## Styling

- Keep composite component styles in a reusable definition outside the component, with named parts for related elements. Apply those styles to the corresponding elements rather than scattering repeated styling across the markup. Use variants for state or appearance differences; simple components may keep direct static styles when no composition or variants are needed.
- Reuse shared card primitives for card-like surfaces when available. Compose its header, title, description, action, content, and footer instead of recreating their structure and styling with generic HTML. Preserve semantic headings, form labels, and accessible dialog behavior.
- Reuse a shared loading-placeholder component when available. Hide decorative skeletons from assistive technology, provide a readable loading status, respect reduced-motion preferences, and keep loaded content visible during refresh.
- Adapt generated or imported UI components to the project's export conventions, styling approach, aliases, and public APIs.
- Preserve keyboard operation, focus management, and accessible names in interactive UI. Sanitize untrusted HTML before rendering, including content restored from storage or a cache.

These rules describe responsibilities and behavior independently of the libraries used to implement them. Automated checks enforce their configured rules; review architectural and naming requirements that are not covered by those checks.
