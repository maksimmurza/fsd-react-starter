# Architecture principles and rules

General application structure/architecture is FSD, but with some enhancements listed below. Terms 'layer', 'slice', etc. have meaning according to the FSD methodogy. The `src` folder can contain only folders: app, entities, features, pages, shared, widgets. All code should be placed inside of listed folders except tooling configuration files that require a specific location to work correctly.

Import scheme: shared -> entities -> features -> widgets -> pages -> app. 

All layers from the right part of the scheme can import layers from the left, import in opposite direction is a violation and should be restricted by linter rules.

Slices shouldn't have imports between themselves (for example one feature can not import another).

### shared folder

Mostly (but not strictly) code detached from the project / business specifics. Most common frontend application functionality.

Application configuration must be centralized in `shared/config`. Other layers and slices, including widgets, must consume it through this module's public API instead of defining their own `config` segments. This is a project-specific convention. Tooling configuration files follow the locations required by their tools.

### entities folder

The main goal of this layer is to define the model of the entity and provide API for mutating entities state. Set of primitive operations with them - the "base" for building more complicated functionality in the next layers (features, etc.)

### features folder

Feature by itself - is an operation under the specific entity(-ies).

Features are not strictly based on the existed entities. They can introduce the new ones. Because not all entities are related to domain specific, some of them can be related just to UI layer.

### widgets folder

Widgets are self-contained UI blocks that compose lower-layer modules into a cohesive user flow or a reusable part of a page.

Keep helpers and state specific to the widget inside its slice; reuse entity models and operations from `entities` instead of duplicating them.

UI used only on one page may stay in that page's slice. Extract it into a widget when it forms an independent block or is reused across pages.

### pages folder

This folder should contain pages - big building blocks of our application.

### app folder

This folder is responsible for application initialization and providers. It contains the entrypoint - main.tsx file. Folders: layouts, styles, routing, store (it depends of the project specific state management mechanism). They can be created if needed.

