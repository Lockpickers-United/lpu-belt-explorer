# Web workspace guidance

This package is the React/Vite application; follow the repository root `AGENTS.md` and `.agents/references/` first. Paths in the existing web source and tests remain package-relative. Root npm scripts delegate here, and the root `package-lock.json` is authoritative; do not create an app-local lockfile or install with Yarn.

Use the root Node pin and root `npm ci`. Root `npm run ci-pr` validates this workspace. Focused root checks accept app-relative filters: `npm run test:run -- tests/vitest/SomeRoute.test.jsx` and `npm run e2e -- tests/e2e/viteBundle.spec.js`. Direct ESLint/Vitest/Playwright commands should run from this directory. Test-mode requests remain mocked or loopback-only.

Vite/Vitest explicitly load environment files from the monorepo root. Do not move, print or modify credentials or tracked environment files as part of path maintenance. `keys` paths in scripts preserve their prior root/sibling resolution. Root npm jobs run at this package root; standalone legacy routines may require their original relative subdirectory and must be inspected before execution. No generator, import, export, Firebase deploy, snapshot upload or live-data job is authorized by routine tests.

Build output and browser/coverage reports belong to this package. Firebase configs, rules and Functions stay at `../../firebase`; emulator scripts use explicit config paths there. No Functions source, schema or security-rule behavior changes in Phase 2. Candidate publishing/import/upload workflows have unconditional migration holds; keep them until approved release transfer.
