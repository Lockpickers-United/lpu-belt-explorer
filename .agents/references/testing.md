# Testing and Verification

Read this reference when adding tests, modifying test infrastructure, changing coverage, or using browser/emulator integration tests.

## Test design

- Add or update Vitest tests for meaningful component behavior, routing, filtering, context contracts, and pure business logic.
- Prefer accessible Testing Library queries such as roles and names.
- Use the existing MSW server for HTTP behavior; unhandled requests fail by design.
- Keep Firebase/Auth mocked in unit tests unless the test specifically targets an integration boundary.
- Add Playwright coverage for important journeys that require real browser routing or interaction.
- Assert behavior rather than MUI DOM implementation details, generated classes, or brittle snapshots.
- Do not weaken assertions, disable failing tests, or turn unhandled requests into warnings.

## Isolation guarantees

Frontend tests load committed `.env.test` synthetic values. The bootstrap rejects deployable Firebase project IDs, non-loopback emulator hosts, live API/data URLs, and Firebase API keys other than the test sentinel.

Vitest tests mock `DBContext`; use the dedicated Firebase emulator suite for change-tracker integration. MSW rejects unhandled frontend HTTP requests. Playwright builds in test mode, blocks non-loopback HTTP requests, and requires a clean browser console.

No automated test may access or mutate production data.

## Browser tests

Install the pinned browser once with `npx playwright install chromium`. Playwright creates a fresh test-mode build and starts its own preview server; do not substitute an existing development or production server.

Use `npm run e2e` for the suite or `npx playwright test path/to/spec.js` for a focused journey. Generated Playwright reports and test results are not source changes and should normally remain ignored.

## Firebase Functions integration

The change-tracker suite uses isolated Functions and Firestore emulators with project ID `demo-lpubelts`. Run `npm run test:functions:integration` only for tracker/schema work; it is not a substitute for Firestore security-rules tests.

## Reporting

Never claim lint, test, coverage, build, or runtime checks passed unless executed. Report exact commands and outcomes. If credentials, a live service, missing browser dependencies, or production mutation prevents a check, state that explicitly rather than substituting an unsafe command.
