/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ─── FSD Layer Direction Rules ───────────────────────────────────────────
    // Import direction: shared → entities → features → widgets → pages → app
    // Any import going "upward" (toward app) is a violation.

    {
      name: 'fsd-shared-no-upper',
      severity: 'error',
      comment:
        'shared cannot import from entities, features, widgets, pages or app',
      from: { path: '^src/shared/' },
      to: { path: '^src/(entities|features|widgets|pages|app)/' },
    },
    {
      name: 'fsd-entities-no-upper',
      severity: 'error',
      comment: 'entities cannot import from features, widgets, pages or app',
      from: { path: '^src/entities/' },
      to: { path: '^src/(features|widgets|pages|app)/' },
    },
    {
      name: 'fsd-features-no-upper',
      severity: 'error',
      comment: 'features cannot import from widgets, pages or app',
      from: { path: '^src/features/' },
      to: { path: '^src/(widgets|pages|app)/' },
    },
    {
      name: 'fsd-widgets-no-upper',
      severity: 'error',
      comment: 'widgets cannot import from pages or app',
      from: { path: '^src/widgets/' },
      to: { path: '^src/(pages|app)/' },
    },
    {
      name: 'fsd-no-sibling-slice-imports',
      severity: 'error',
      comment:
        'FSD slices must not import sibling slices from the same layer directly; compose them from upper layers or extract shared/entity APIs',
      from: { path: '^src/(entities|features|widgets|pages)/([^/]+)/' },
      to: { path: '^src/$1/(?!$2/)[^/]+/' },
    },
    {
      name: 'fsd-pages-no-app',
      severity: 'error',
      comment: 'pages cannot import from app',
      from: { path: '^src/pages/' },
      to: { path: '^src/app/' },
    },

    // ─── Public API Rules ─────────────────────────────────────────────────────
    // Cross-layer imports must go through a slice's public index.ts, not its
    // internal files (model/, ui/, lib/, etc.).

    {
      name: 'fsd-entities-public-api',
      severity: 'warn',
      comment:
        'Import from entities via its slice index.ts public API, not internal files',
      from: { path: '^src/(features|widgets|pages|app)/' },
      to: {
        path: '^src/entities/[^/]+/.+',
        pathNot: '^src/entities/[^/]+/index\\.ts$',
      },
    },
    {
      name: 'fsd-features-public-api',
      severity: 'warn',
      comment:
        'Import from features via its slice index.ts public API, not internal files',
      from: { path: '^src/(widgets|pages|app)/' },
      to: {
        path: '^src/features/[^/]+/.+',
        pathNot: '^src/features/[^/]+/index\\.ts$',
      },
    },
    {
      name: 'fsd-widgets-public-api',
      severity: 'warn',
      comment:
        'Import from widgets via its slice index.ts public API, not internal files',
      from: { path: '^src/(pages|app)/' },
      to: {
        path: '^src/widgets/[^/]+/.+',
        pathNot: '^src/widgets/[^/]+/index\\.ts$',
      },
    },

    // ─── Segment Index Isolation ──────────────────────────────────────────────
    // A segment-level index.ts (model | ui | lib | api) is the public API of
    // ONE segment only. Cross-segment composition (ui pulling from model, etc.)
    // belongs in the slice-level index.ts. This keeps barrels predictable and
    // prevents accidental cycles.
    {
      name: 'fsd-segment-index-no-cross-segment',
      severity: 'error',
      comment:
        'Segment index.ts must not re-export from sibling segments of the same slice — ' +
        'cross-segment composition belongs in the slice-level index.ts',
      from: {
        // $1 = layer, $2 = slice, $3 = segment
        path: '^src/(entities|features|widgets|pages|app)/([^/]+)/(model|ui|lib|api)/index\\.ts$',
      },
      to: {
        path: '^src/$1/$2/',
        pathNot: '^src/$1/$2/$3(/|$)',
      },
    },

    // ─── Segment Dependency Direction ─────────────────────────────────────────
    // lib segment is domain-agnostic utility code. It must not depend on model,
    // which carries domain logic. Direction is one-way: model may use lib,
    // never the other way around.
    {
      name: 'fsd-lib-no-model-import',
      severity: 'error',
      comment:
        'lib segment must not import from model — library code is domain-agnostic',
      from: { path: '^src/(entities|features|widgets|pages|app)/([^/]+)/lib/' },
      to: { path: '^src/$1/$2/model/' },
    },

    // ─── Circular Dependencies ────────────────────────────────────────────────
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'Circular dependencies make the module graph hard to reason about',
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg',
      ],
    },

    // Resolve @/* path alias from tsconfig.app.json
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },

    reporterOptions: {
      dot: {
        filters: {
          exclude: {
            path: '^node_modules',
          },
        },

        // Collapse node_modules packages and shared internals into single nodes
        // so the graph stays readable at the FSD layer level.
        collapsePattern: '^(node_modules|src/shared)/[^/]+',

        theme: {
          graph: {
            rankdir: 'TD',
            splines: 'ortho',
          },
          modules: [
            {
              criteria: { source: '^src/app/' },
              attributes: { fillcolor: '#dce8f3' },
            },
            {
              criteria: { source: '^src/pages/' },
              attributes: { fillcolor: '#d5e8d4' },
            },
            {
              criteria: { source: '^src/widgets/' },
              attributes: { fillcolor: '#fff2cc' },
            },
            {
              criteria: { source: '^src/features/' },
              attributes: { fillcolor: '#ffe6cc' },
            },
            {
              criteria: { source: '^src/entities/' },
              attributes: { fillcolor: '#f8cecc' },
            },
            {
              criteria: { source: '^src/shared/' },
              attributes: { fillcolor: '#e1d5e7' },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: false },
              attributes: { color: '#ff0000', style: 'bold' },
            },
            {
              criteria: { circular: true },
              attributes: { color: '#ff6600', style: 'bold' },
            },
          ],
        },
      },
    },
  },
};
