# AGENTS.md

This file applies to the entire `lpu-belt-explorer` repository and is the canonical guidance for automated coding agents. Update it when universal project policy changes; keep task-specific detail in the routed references below.

## Project essentials

`lpu-belt-explorer` is the React/Vite application behind [lpubelts.com](https://lpubelts.com). It combines static belt-ranking data with authenticated Firebase features. Use JavaScript, npm, and the Node 24 LTS release pinned in `.nvmrc`.

The sibling `../explore-lpubelts-com-node` repository owns server-side exports and API services. Agents may edit it automatically when an in-scope change spans both repositories. Inspect its working tree and applicable `AGENTS.md` first, preserve unrelated work, and validate each repository by its own conventions.

## Task-specific references

Read every relevant reference before editing or executing commands for that area:

- Providers, routes, contexts, roles, or profile data: `.agents/references/architecture.md`
- Firebase, Functions, external services, scripts, credentials, or generated data: `.agents/references/firebase-data-safety.md`
- Firestore change trackers or incremental exporters: `.agents/references/firestore-change-index.md`
- Tests, test infrastructure, coverage, mocks, or browser automation: `.agents/references/testing.md`

## Commands

- Development: `npm run dev` (normally port 3000)
- Frontend lint: `npm run lint`; focused lint: `npx eslint path/to/file.jsx ...`
- Unit tests: `npm run test:run`; focused: `npx vitest run tests/vitest/SomeRoute.test.jsx`
- Coverage: `npm run test:coverage`
- Test/production builds: `npm run build:test` and `npm run build`
- PR-equivalent checks: `npm run ci-pr`
- Browser tests: `npm run e2e`; focused: `npx playwright test tests/e2e/example.spec.js`
- Functions lint: `npm --prefix functions run lint`
- Change-tracker integration: `npm run test:functions:integration`

Use focused checks while iterating and the smallest broader check justified before handoff. Do not use `npm run ci-build` as a validation shortcut; it invokes generators and exporters.

## Code conventions

Frontend and scripts follow `eslint.config.js` and nearby style:

- JavaScript only unless the user explicitly requests TypeScript.
- ES modules and functional React components.
- Four-space indentation, single quotes, and no semicolons.
- PascalCase components/routes; camelCase functions, hooks, and values.
- Keep imports relative and follow the extension convention enforced by ESLint.
- Prefer existing utilities, components, MUI patterns, and project structure.
- Keep changes focused; avoid unrelated refactors or formatting.
- Treat hook dependency warnings as correctness signals.
- Do not add dependencies without a meaningful, explained benefit.

There is no repository-wide autoformatter; preserve local formatting where it differs.

`functions/` is a separate CommonJS package using `functions/eslint.config.js` and Google style: `require()`/`exports`, two-space indentation, double quotes, semicolons, and Firebase Functions v2 APIs. Do not apply frontend formatting rules there.

## Implementation rules

- For change requests, implement and verify the behavior rather than returning only a proposal.
- Inspect relevant code and nearby tests first; search for an existing owner or pattern before adding an abstraction.
- Fix underlying causes and avoid duplicated state or workaround layers.
- Preserve compatibility unless the task explicitly changes a contract.
- Ask only when a missing choice materially changes behavior, security, scope, or external effects; otherwise state a reasonable assumption and proceed.
- Never weaken assertions, disable tests, or hide warnings to make checks pass.

## Safety invariants

- Production deployments and every live-data script run are approval-gated, including read-only exports. Editing such code does not authorize executing it.
- Do not deploy, switch to production, migrate/import live data, publish, push, or open a pull request unless explicitly requested and authorized.
- Never print, commit, or modify secrets in `.env*`, `keys/`, service-account files, OAuth credentials, or CI variables.
- Authorization must derive from authenticated claims and server/rules enforcement. UI mode flags such as `adminEnabled` and `qaUserEnabled` never grant access.
- Read `.agents/references/firebase-data-safety.md` before touching Firebase, external-service, script, or generated-data workflows.

## Agent efficiency

- Use targeted `rg` searches and relevant file ranges before reading large files wholesale.
- Run narrow lint/tests during implementation; run required broad checks once after the change stabilizes.
- Summarize successful command output; retain only actionable excerpts from failures.
- Do not use subagents for single-file, tightly coupled, or sequential work.
- For long tasks, record a concise checkpoint in the existing implementation report before compaction or handoff.
- Keep final responses to changed behavior, important decisions, exact verification results, limitations, and manual review.
- When multiple agents are active, use separate Git worktrees. Prefer one implementer and one targeted reviewer over duplicate implementations.

## Working-tree discipline

- Inspect `git status` before editing. Existing changes belong to the user; do not overwrite, revert, or reformat them.
- Keep diffs scoped and review them before handoff.
- Stage newly created source/configuration files unless they are generated, temporary, ignored local configuration, or secret-bearing; explain intentional unstaged files.
- Do not use destructive Git/filesystem commands without a clear request. Never commit, push, deploy, or open a PR unless asked.

## Verification minimums

- Small frontend edit: targeted ESLint and closest focused Vitest test.
- Shared context, routing, or data-flow edit: targeted tests plus `npm run test:run`; build when module behavior may change.
- Functions edit: Functions lint and relevant tests; use the emulator integration suite for change-tracker/schema changes.
- Broad or release-facing edit: `npm run ci-pr` plus relevant Playwright tests.

Never claim a check passed unless it ran. Report skipped checks and distinguish pre-existing failures. Do not run tests that require credentials or live services without the required approval.

## Definition of done

A task is complete when the requested behavior is implemented at the correct layer, security and context contracts remain valid, relevant checks pass in proportion to risk, generated/external effects are reported, and the final diff contains no unrelated agent changes.

The handoff must state what changed, important decisions, exact checks and results, and anything requiring manual review.
