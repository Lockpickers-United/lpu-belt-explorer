# Firebase, External-Service, and Data Safety

Read this reference before changing or running Firebase, Functions, external-service, import/export, migration, administrative, or generated-data workflows.

## Environment selection

Client Firebase initialization lives in `src/auth/firebase.js`. `VITE_DEV_FIRESTORE=true` selects the `lpubelts-dev` Firestore database; `import.meta.env.DEV` alone does not change databases.

Firebase CLI configuration and aliases live under `firebase/`. From the repository root, pass `--config firebase/firebase.json` for the main configuration (or another explicit `firebase/*.json` config). Paths within each config resolve from `firebase/`. CLI aliases are:

- `default`: `lputest`
- `prod`: `lpu-belt-explorer`

`firebase/firebase.json` declares `firebase/firestore.rules` for both the `(default)` and `lpubelts-dev` Firestore databases. This configuration does not establish which rules are deployed. Do not imply that client-side checks enforce security; deployed Firestore rules and trusted server code must enforce access.

`firebase/firestore.indexes.json` is attached only to the `lpubelts-dev` entry in `firebase/firebase.json`. It retains the existing `awards-discord` composite index alongside Classification indexes and the `classificationOperations.expiresAt` TTL override. A full named-database deploy with `--only firestore:lpubelts-dev` also reconciles those indexes. For a development **rules-only** release, use `firebase deploy --config firebase/firebase.rules-dev.json --only firestore:lpubelts-dev --project lpu-belt-explorer`; the dedicated config names only the development database and omits indexes. The [production rules-only config](../../firebase/firebase.rules-prod.json) names only `(default)` and omits indexes. The 2026-10-16 transition rules and config were temporary release artifacts and have been removed; the final rules now deny legacy `query-cache` writes in `(default)`. `--only firestore:rules` with the main config would select rules for both databases. Verify the default and named rules release IDs after deployment.

## Approval boundary

Production deployments and live-data scripts are always approval-gated. This includes read-only exports. Editing deployment, migration, export, or administrative code never authorizes running it.

Obtain explicit approval before each:

- switch or deployment to the production alias
- live import, export, migration, or administrative script
- production write or other difficult-to-reverse external action
- publish, push, or pull-request action when not already requested

Do not treat prior approval for a different operation as continuing authorization.

## Script inspection

Files under `scripts/` may initialize `firebase-admin`, call external APIs, read credentials, or rewrite large datasets. Before running one:

1. Read it and identify data sources, credentials, external calls, and outputs.
2. Determine whether it performs external writes or accesses live data.
3. Obtain explicit approval whenever it crosses the approval boundary above.
4. Report every generated or modified file afterward.

Import/export/migration npm scripts are not validation commands. In particular, `npm run import`, migration scripts, claim-setting scripts, Firebase-admin utilities, and `npm run ci-build` may have broad or external effects.

## Secrets

Never print, commit, or modify secrets from `.env*`, `keys/`, service-account files, OAuth credentials, or CI variables. Naming a required environment variable without exposing its value is safe.

Do not add credentials to agent settings, reports, fixtures, command output, or prompts. Keep test configuration synthetic and loopback-only.

## Generated artifacts

Many `src/data/*.json` files are maintained by import/generation scripts. Build workflows also copy data into `public/` or `dist/`. Before editing an artifact, identify its owning script and decide whether the source or generated output should change.

The deployed `Build-N-Deploy` workflow offers `read` or `publish` for manual dispatches. Automatic push and Import builds use the `github-pages` environment value of `VITE_CLASSIFICATION_WRITE_STAGE`, falling back to `read` if it is unset. The owner reports configuring that value as `publish`, and the automatic build for PR #316 was verified publicly with `publish` compiled into its Classification chunk. Every workflow run publishes the site and uploads seven snapshot files to both production and development APIs, including files outside Classification. Review their source hashes and obtain approval for those external effects before merging or dispatching the workflow. GitHub `Import` reads multiple Sheet tabs, rewrites generated files, and commits them automatically, so preview its full diff before a Classification-only Sheet change is imported. If a future automatic build compiles `read`, verify the environment setting and use a separately approved manual `publish` dispatch from the imported commit after catalog verification.

Common generated or ignored outputs include `dist/`, `public/data/`, version/sitemap files, Playwright/Allure output, coverage, and local caches. Do not commit them unless explicitly required, and do not broadly clean these directories when they may contain unrelated user work.

## Sibling server repository

`apps/api` contains the imported server exports and API services; read its `AGENTS.md` and operational references. `../explore-lpubelts-com-node` remains frozen and owns production releases until Phase 5. Do not edit that source during the freeze. Cross-repository edits are authorized when required by the current task, but executing its exporters remains live-data approval-gated. Read its `AGENTS.md`, inspect its status, and validate it independently before handoff.
