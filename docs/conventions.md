# Conventions

## Import and export rules

- Code inside react components should be exported like `export { ReactComponent }`, default exports restricted with linter rule.
- Inside each layer or slice folders there should be an `index.ts` file responsible for the exporting code module's public API to other codebase.
- Within a slice, the `lib` segment must not import from the `model` segment. Library code is domain-agnostic; the `model` segment carries domain logic. The dependency direction is one-way: `model` may consume helpers from `lib`, never the other way around. Enforced by dependency-cruiser.
- Imports from other layers must go through the target slice's public API (`index.ts`); deep imports into its internal modules are prohibited. For `shared`, use the public API of the relevant library or component group. Within a slice, modules may use relative imports directly instead of importing through the slice's `index.ts`. Public API files must export the modules intended for external use; an empty `index.ts` does not provide a public API.

## Naming rules

- Features folders should be named relying on the entity this feature operates with (feature's name should start from antity name). Example: we have entity `document`, and we implement sharing feature, so the feature name is `document-share` or `document-sharing`.
- Sometimes feautures can be named without entity name prefix, just using something common. For example we have login and register functionality in different features, to see them close to each other we can name them like `auth-login` and `auth-signup` accordingly.

## Types

All src code should be strictly typed - no `any`.

## Styling

- Style React components with Tailwind CSS classes. Use `tailwind-variants` when a component has style variants, multiple related slots, or reusable combinations of classes. Keep simple, static styles directly in `className`; the number of elements or classes alone does not require a `tv` definition.
- Adapt each component added through shadcn to these conventions: use named exports, replace CVA with `tailwind-variants` when present, and update imports to the project's aliases and public APIs.
