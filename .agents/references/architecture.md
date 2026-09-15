# Application Architecture and Data Access

Read this reference for provider, route, context, authentication, role, or profile changes.

## Repository structure

- `src/`: React application built with Vite.
- `src/app/`: top-level providers, routing, authentication, API access, and Firestore access.
- Feature directories under `src/`: domain-specific routes and supporting UI.
- `src/data/`: application data, schemas, mappings, and generated/imported JSON.
- `scripts/`: imports, exports, migrations, generators, and administrative utilities.
- `functions/`: separately packaged Firebase Cloud Functions project.
- `tests/vitest/`: Vitest, Testing Library, and MSW component/route tests.
- `tests/e2e/`: Playwright browser journeys.
- `public/`: static assets and generated public data.

## Providers and routes

`src/app/App.jsx` establishes this provider dependency order:

1. `AuthProvider`
2. `DBProvider`
3. `APIProvider`
4. `AppProvider`
5. `SystemMessageProvider`
6. `ScoringProvider`

`ProfileProvider` is route-scoped where profile data is needed. Preserve provider ordering when adding dependencies, and update test render helpers/mocks when a context contract changes.

Routes use `createHashRouter` and are declared from `src/app/routes`. Keep route-specific providers in parent routes when several children share state.

Before adding a fetch, subscription, or context, identify the existing owner. Shared state should have one source rather than parallel subscriptions in multiple route components.

## Authentication and UI modes

Authorization and optional UI modes are separate:

- `AuthContext.userClaims` is the source for authenticated roles such as `admin`, `lpuAdmin`, and `qaUser`.
- `DBContext.adminRole` and `DBContext.qaUserRole` derive role status from authentication and claims.
- `AppContext.adminEnabled` and `AppContext.qaUserEnabled` are user-controlled UI/development flags. They must never grant data access or permit writes.

Security must also be enforced by deployed rules or trusted server code; client checks are not authorization boundaries.

## Profile data contract

Profile reads are centralized in `ProfileContext`:

- The signed-in user's full profile comes from the existing `DBContext` `lockCollection` subscription.
- An administrator requesting another user may receive the full profile through the authorized Firestore path.
- Anonymous and non-admin requests for another user use the public API summary.
- Consumers use `data`, `loading`, `error`, and `isFullProfile` from `ProfileContext` rather than reading `lockcollections` directly.
- Do not add arbitrary-user `getDoc()` calls or collection queries against `lockcollections` in components. Extend `ProfileContext`, `DBContext`, or the API contract.
- Render private fields only when `isFullProfile` and the relevant role/ownership condition permit it.

When changing a context value, search every `useContext(...)` consumer and update `src/test/setupTests.js` plus feature-specific provider mocks.
