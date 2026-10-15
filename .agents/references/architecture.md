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
2. `AccessProvider`
3. `DBProvider`
4. `APIProvider`
5. `AppProvider`
6. `SystemMessageProvider`
7. `ScoringProvider`
8. `ClassificationProvider`

`ProfileProvider` is route-scoped where profile data is needed. The app-level `ClassificationProvider` depends on `AccessProvider` and subscribes to the eligible signed-in member's own votes and matching entry states. `ClassificationParentRoute` mounts `ClassificationSummaryProvider` for modern Classification paths; `/classification/past` uses the historical archive without a modern summary listener. The parent route renders authorization, loading, and read-error messages from context state. Preserve provider ordering when adding dependencies, and update test render helpers/mocks when a context contract changes.

Routes use `createHashRouter` and are declared from `src/app/routes`. Keep route-specific providers in parent routes when several children share state.

Before adding a fetch, subscription, or context, identify the existing owner. Shared state should have one source rather than parallel subscriptions in multiple route components.

## Authentication and UI modes

Authorization and optional UI modes are separate:

- `AuthContext.userClaims` is the source for authenticated roles such as `admin`, `lpuAdmin`, `qaUser`, and `blackBelt`.
- `AccessContext` derives claimed and user-enabled UI roles from the authenticated user. Consumers use `useAccess()` and distinguish `level` from `enabledLevel`. `highestRole` is the highest effective claimed or preview role used for navigation colors; it does not depend on an enabled UI mode.
- Main menu entries with `allowedRoles` are shown when any role in `AccessContext.accessInfo.roles` matches. Menu visibility is a display choice; each route still needs its own access check. Reports and the `/admin` route require `admin`; Admin Tools and Server Status are also shown only to admins.
- In the classification project, a `blackBelt` claim grants the `classificationTeam` access role. The Classification readers, route, and menu use these derived roles; the profile's `blackBeltAwardedAt` does not grant classification access. Other profile-based black-belt features still use profile data. The classification parent route waits for authentication, prompts anonymous visitors to sign in, and shows an access dialog with a link back to Locks for signed-in users without a qualifying role.
- `DBContext.adminRole` and `DBContext.qaUserRole` derive role status from authentication and claims.
- `AccessContext.accessInfo.enabledRoles` contains user-controlled UI/development modes. These modes must never grant data access or permit writes.
- In development, the account menu can preview a subset of the signed-in account's roles, or a member view. This preview only restricts `AccessContext` roles and features; it does not change Firebase claims, `DBContext` authorization, profile subscriptions, or server/rules access. It resets on reload and cannot test backend permissions.

Security must also be enforced by deployed rules or trusted server code; client checks are not authorization boundaries.

## Profile data contract

Profile reads are centralized in `ProfileContext`:

- The signed-in user's full profile comes from the existing `DBContext` `lockCollection` subscription.
- `DBContext.profileUserId` identifies the account whose profile snapshot is loaded; profile-based UI access must match it to the current authenticated UID.
- An administrator requesting another user may receive the full profile through the authorized Firestore path.
- Anonymous and non-admin requests for another user use the public API summary.
- Consumers use `data`, `loading`, `error`, and `isFullProfile` from `ProfileContext` rather than reading `lockcollections` directly.
- Do not add arbitrary-user `getDoc()` calls or collection queries against `lockcollections` in components. Extend `ProfileContext`, `DBContext`, or the API contract.
- Render private fields only when `isFullProfile` and the relevant role/ownership condition permit it.

When changing a context value, search every `useContext(...)` consumer and update `src/test/setupTests.js` plus feature-specific provider mocks.
