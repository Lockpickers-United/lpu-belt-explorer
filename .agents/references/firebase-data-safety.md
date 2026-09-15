# Firebase, External-Service, and Data Safety

Read this reference before changing or running Firebase, Functions, external-service, import/export, migration, administrative, or generated-data workflows.

## Environment selection

Client Firebase initialization lives in `src/auth/firebase.js`. `VITE_DEV_FIRESTORE=true` selects the `lpubelts-dev` Firestore database; `import.meta.env.DEV` alone does not change databases.

Firebase CLI aliases are:

- `default`: `lputest`
- `prod`: `lpu-belt-explorer`

No Firestore rules file is currently declared in `firebase.json`. Do not imply that client-side checks enforce security; deployed Firestore rules and trusted server code must enforce access.

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

Common generated or ignored outputs include `dist/`, `public/data/`, version/sitemap files, Playwright/Allure output, coverage, and local caches. Do not commit them unless explicitly required, and do not broadly clean these directories when they may contain unrelated user work.

## Sibling server repository

`../explore-lpubelts-com-node` owns server exports and API services. Cross-repository edits are authorized when required by the current task, but executing its exporters remains live-data approval-gated. Read its `AGENTS.md`, inspect its status, and validate it independently before handoff.
