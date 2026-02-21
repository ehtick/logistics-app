---
paths:
  - "src/Client/Logistics.Angular/**/*.ts"
  - "src/Client/Logistics.Angular/**/*.html"
---

# Angular Code Conventions

## Components
- Standalone components (don't add `standalone: true` — it's the default in Angular 20+)
- Separate template files (`templateUrl`), no inline templates/styles
- Files: `{name}.ts`, `{name}.html` (not `{name}.component.ts`)
- Prefixes: tms=`app-`, customer=`cp-`, website=`web-`, shared=`ui-`

## Signals & Reactivity
- `signal()` for local state, `computed()` for derived state
- `input()` / `output()` functions — NOT `@Input`/`@Output` decorators
- `@ngrx/signals` stores for complex state

## DI & Access Modifiers
- `inject()` function, not constructor injection
- `private readonly` for services, `protected readonly` for template-used stores
- `protected` for template-bound properties/methods, `private` for internal

## Templates
- Native control flow: `@if`, `@for`, `@switch` — NOT `*ngIf`, `*ngFor`
- Use `@empty` block in `@for` for empty states

## Imports
- Shared: `import { X } from "@logistics/shared";`
- API models: `import type { XDto } from "@logistics/shared/api/models";`
- App-internal: `import { X } from "@/core/services";`

## Styling
- Tailwind CSS utilities preferred, avoid custom CSS unless necessary
