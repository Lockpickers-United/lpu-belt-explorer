# LPU monorepo — developer implementation report

> Technical companion to the [implementation plan](monorepo-implementation-plan.md). The [overview](monorepo-plan.md) defines the target and tradeoffs. Phase tasks and exit criteria live in the implementation plan.

Last updated: 2026-10-25

## Checkpoint

- **Phase / task:** Phase 3 in progress: add API to root npm, align Node/npm, preserve locked dependency versions and rebuild the standalone API artifact contract. Phase 2 remains complete.
- **State:** Isolated `monorepo/phase3-npm` worktree `/private/tmp/lpu-monorepo-phase3.OS5o0i/worktree`; base commit `22ec5c9fef8871aefa678eefe9bbedb0d695285a` plus exact Phase 2 staged tree `1a144beadad25f36f76f5d25a0ce3b41f5094c5e`. No Phase 2/3 commit or push. Prior worktrees and main source are preserved. Owner question 8 is resolved: the API host reports v24.21.0; common Node pin is confirmed.
- **Resume with:** Owner question 9 is approved: create two implementation commits from the saved Phase 2 tree and staged Phase 3 candidate, publish only `monorepo/phase3-npm` to origin, then verify Linux CI/artifact. Local gates pass. Keep all candidate deployment/publish/import/upload holds and separate Functions packaging.
- **Watch out for:** An unchanged API history import would carry potential historical FTP credentials. The web release workflow can publish Pages and upload snapshots automatically. Do not merge runtime/path changes into `main` until the release controls below are in place.

## Evidence and source identity

[Baseline inventory](monorepo-baseline-inventory.json) records every tracked filename, NUL-delimited file-list SHA-256, local history-path candidates, API scan metadata, catalog hashes, and the test-build file hashes. It contains metadata, not matched credential values or user records. Capture date: 2026-10-25; no remote service was contacted. Counts cover all locally reachable refs and may include branches beyond `HEAD`; all three checkouts are non-shallow.

| Source | Checkout SHA | Local state at entry | Remotes / local history |
| --- | --- | --- | --- |
| Web / destination | `0e3dcba14fef65af722e4499272271639a6ddff5` | `main`; three existing untracked monorepo planning documents; no tracked changes | `origin`: `mgsecure/lpu-belt-explorer`; `upstream`: `Lockpickers-United/lpu-belt-explorer`; 867 tracked files; 6,154 reachable commits |
| Active API | `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` | `main`; clean | `origin`: `Lockpickers-United/explore-lpubelts-com-node`; 369 tracked files; 189 reachable commits |
| Future bot | `8d435c20c6a51fcad35f62ff85f0c6b6b25ffdbe` | `main`; clean; no repository `AGENTS.md` found | `origin`: `Lockpickers-United/lpu-discord-utils-bot`; 39 tracked files; 26 reachable commits |

These are inspected source snapshots, **not deployed release IDs**. The owner has now frozen API source at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover; web and bot snapshots are not freeze agreements. The canonical destination follows `upstream`; the local `origin` fork must not be mistaken for the owner of the organization's hosted release settings. No remote freshness, branch protection, Pages configuration, or active release was verified.

### Tracked-file and history review / import disposition

**Disposition: exclude the four password-bearing historical FTP blob versions; retain the owner-reviewed `.env.example` and inventoried JSON files. Hold an unchanged history-preserving API import.** Deleting a file from the imported tip or excluding it from an artifact would leave its historical blobs reachable. No credential is declared safe merely because it has been removed from current source.

The API scan visited 1,364 text blobs (45,263,487 bytes), excluding 29 binary blobs and 10 `.env.example` versions from pattern matching. Rules covered private-key headers, common GitHub/Google/AWS token forms, and quoted assignments to secret-related names. Seventeen blob/rule candidates were recorded. This is local regex triage, not exhaustive secret detection or a private-data audit; it does not cover unavailable remote refs, arbitrary token formats, or binary content.

Four historical blobs of `src/projects/logAnalysis/ftpFetchGodaddy.cjs` contain opaque quoted `password` assignments that the owner has instructed us to scrub:

| Blob | Line | Change commits bounding the versions |
| --- | --- | --- |
| `349326e37de709ac5a3c3a6a6fc71e91a4f4d7f8` | 55 | `d91be2833986ce143172ccc22951f3433adb5d00`, `17ae1c9d37785ed9e48270952c212df0a8f318be` |
| `05b08fb86699d297dc67167323d48806cb428dce` | 53 | `59385e991939dfede3047618fddda3db191250e3`, `d91be2833986ce143172ccc22951f3433adb5d00` |
| `86887fbaddf2b41c6a7f7fdb436e85cbf29e1741` | 52 | `a3abba75afef65986bffbc14f33e68fe4aceb419`, `59385e991939dfede3047618fddda3db191250e3` |
| `be6e08dd2e65db2e4bb0dd69a616fdba94526dde` | 52 | `92f825c5355ef1cecbd67c89040c49e4a7ae4e17`, `85dcaaef4379acf2fb2da680a5d1cb82a5198df5`, `a3abba75afef65986bffbc14f33e68fe4aceb419` |

Values were not printed or copied into documentation. The owner directed removal of the password-bearing versions from migration history. Credential validity/retirement was not established; no rotation or external credential operation was attempted or is claimed. This does not block the selected history scrub. Other matches have placeholder/test markers, including test fixtures and legacy Reddit examples; those heuristic labels are not final clearance.

Further review boundaries:

- Owner confirms API `.env.example` contains placeholder data; retain it. Its 10 historical versions were excluded from the original regex scan, so clearance is owner-provided provenance, not a newly executed content scan. Filename review found no other credential-path candidates in API local refs; that does not certify every file.
- API tracks 33 JSON data/sample paths, including `src/api/requirements/current-json-files/*`, collection fixtures, unclaimed evidence, and Reddit flair exports. A field-name-only triage identified user/profile fields in 13 files; field presence alone does not prove privacy exposure. Owner confirms the JSON files in the listed requirements/data/projects directories contain placeholder or non-sensitive information. Retain all 33 inventoried paths; no fixture replacement is required by this review. Preserve their frozen-source bytes while sanitizing unrelated history.
- Destination currently tracks `.env.dev`, `.env.local`, `.env.production`, and `.env.test`; its local history also includes `.env.keys`. Contents were not displayed. Existing web history is not being imported, but these paths need owner review before copying or changing environment-file ownership. Do not assume ignored filenames were never committed.
- Bot tracks `data/beltRequests.json`, `data/flairLog.json`, `data/syncLog.json`, and `.yarn/install-state.gz`. No bot record contents were opened. Hold its history import until Phase 6 privacy/history review and external mutable-state design.

### Migration decisions and alternatives

| Decision | Current disposition / rationale | Alternatives |
| --- | --- | --- |
| Destination and app boundaries | Adopt the requested overview: existing `lpu-belt-explorer`, `apps/api`, then `apps/web`; no new repository or deprecated API app name. | A new repository changes release/settings identity; API files at root blur ownership. |
| Dependency sequence | Retain API Yarn during import and web relocation; convert to npm in Phase 3. Functions remains an independent npm package under `firebase/`. | A combined move/tooling conversion obscures dependency versus path failures. |
| Source synchronization | Owner confirmed a source freeze at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover. Use this exact commit for sanitation and import preparation. | Continued API work plus a final sync was considered; the owner selected the freeze. |
| History mechanism | Owner selected sanitized-history planning in a disposable copy, leaving the source repository unchanged. Content disposition is now resolved: scrub the four flagged FTP blob versions and retain the owner-reviewed template/JSON files. Import still requires sanitized-copy verification. Planned mechanism: retain topology and an original-to-rewritten map, then import the reviewed ancestry with a non-squashed subtree under `apps/api`. | Unchanged subtree preserves original SHAs but would retain flagged blobs. A snapshot import loses ancestry and requires an explicit change to the plan. |
| History reachability | With the selected sanitation approach, verify **rewritten** source commits remain reachable; original SHAs remain metadata in the map, not reachable Git objects in the destination. Do not merge or fetch unsanitized source refs into the destination. | Requiring original SHA reachability is incompatible with removing sensitive history. A squash is not a history sanitation guarantee. |
| Freeze drift | Verify source HEAD and working-tree cleanliness before sanitation, import, and cutover. If either differs, stop dependent work and ask Neal whether to restore the agreed freeze or review a replacement source SHA. Do not silently sync or change the baseline. | A final sync is unnecessary under the agreed freeze; if the owner lifts it, reassess new commits and regenerate the cleared lineage before import. |
| Node alignment | Defer common Node patch and npm pin to Phase 3, after host support is verified. | Workstation availability does not prove host support. |

No filter, source rewrite, subtree command, or import has been executed. The owner selected the sanitation approach, including its rewritten-commit tradeoff, for planning. The subsequent owner disposition selects the four password-bearing FTP versions for exclusion and clears the reviewed template/JSON files for retention. The actual filter and import have not run; verification is still required.

#### Confirmed freeze and sanitation preparation

- Rechecked the API checkout after the owner answers: `git -C ../explore-lpubelts-com-node rev-parse HEAD` returned the frozen SHA; `git -C ../explore-lpubelts-com-node status --short` produced no changes. This verifies the local checkout only; it does not prove a hosted branch lock or remote freshness.
- Keep the original source repository and its refs unchanged. A future disposable sanitation copy must be independent, without a push remote to the original. Do not fetch unsanitized history into the destination to create that copy.
- Filter manifest: use the four blob IDs in the FTP findings table as the exclusion set. Remove every file entry referencing any excluded blob from the candidate history, wherever that blob occurs; retain non-flagged versions and commits/topology where possible. Record an original-to-rewritten commit map. Retain `.env.example` and all 33 inventoried JSON paths with no content changes. No secret replacement values or credential contents belong in the manifest/report. This is the selected Phase 1 sanitation rule, not an executed rewrite.
- Scan all reachable objects in the sanitized candidate, including any retained tags/refs, for the flagged blob IDs and sensitive content patterns. Confirm required API code, reviewed fixture contracts, commit topology and frozen-source mapping. Mapping an old SHA in text does not require retaining its Git object.
- Compare the sanitized tip to the frozen source using a metadata-only change summary; every removed/replaced path must correspond to the reviewed manifest. Only after content clearance should Phase 1 prepare the non-squashed subtree import and its artifact checks.
- All owner questions are answered. Their disposition authorizes the described scrub for the migration copy while preserving the original repository; it does not authorize remote history changes, credential rotation, uploads, or live-data operations. Source/history transformation and import remain Phase 1 work.

## Path, tooling, and contract inventory

| Area / current source | Assumption and required migration treatment |
| --- | --- |
| Web package scripts | `dev`, `dev:host`, `preview`, `build`, `build:test`, and `build-dev` run relative to package root. `ci-pr` combines lint, complete unit suite, and test build. Root coordinator must delegate to `apps/web`. |
| Web generators / external commands | `import`, `import-dan`, RAFL refresh/form commands, recorded/black-belt migrations and changelog processing are not baseline checks. `ci-build` combines version/sitemap/build/exports/copy operations. Preserve app-root execution and inspect each command before use. |
| Vite / HTML / public assets | `vite.config.js` uses default root/public/dist paths, port 3000, app-root `.env.keysNew` loading outside test mode, and the non-test visualizer. Move `index.html`, config, source and public assets together; keep secret paths out of source copies. |
| Vitest / test isolation | `vitest.config.js` resolves `src/test/setupTests.js`, `tests/vitest`, `src` tests and coverage from root; excludes Functions, e2e, `server`, dist and dependencies. Move config/tests with web; keep test environment guards and MSW failures. |
| Playwright | `playwright.config.js` builds test mode with Firestore subscriptions disabled, starts a fresh loopback preview on 5173, and resolves fixtures/snapshots/reports from app root. Preserve network restrictions; no browser baseline run under current testing constraint. |
| Hooks / lint / Dependabot | Web Husky hook runs the complete unit suite; API `.githooks/pre-commit` resolves Git root and runs `corepack yarn validate`. Both need coordinator-aware paths after import. Web/API ESLint globs are package-relative. Root Dependabot currently watches `/`; migrate API update ownership deliberately. |
| Local ignores | Web ignores build/report/data caches and selected key files; API ignores local/prod/dev env files, credentials, installs, logs and most scripts with explicit exceptions. Nested ignores do not govern paths outside their app. `.gitignore` does not untrack existing generated files. Retain app rules and add coordinator ignores intentionally. |
| Local web data generation | `import.js` writes `src/data/*` from Sheets and other services. `copyData.js` downloads remote data into `public/data`. Version/sitemap scripts write `public/`; CSV/Markdown/HTML exports write `dist/`. Maintain sources, owners and app CWD; do not run remote generators to repair paths. |
| Catalog publication | `copyFiles.js` copies source snapshots to `dist`; safelocks becomes `dist/dials.json`, while the upload uses `src/data/safelocks.json`. Upload set is exactly awards, data, safelocks, glossary, projects, rafl, classification-catalog. Catalog v1 must match the exact data bytes; all seven source hashes are in the inventory. |
| Web/API URLs and auth | `src/data/dataUrls.js` distinguishes `VITE_API_SERVER_URL`, `VITE_NODE_SERVER_URL`, data URLs and `VITE_DEV_FIRESTORE`. API URL fallback is currently development; preserve selection rather than infer production from mode. `APIContext` uses `/api/v1`, bearer auth and idempotency keys. Public summary versus owner/admin full-profile access stays unchanged. |
| API routing and fixtures | Keep `src/lpubeltsApiServer.js`, `src/routes.js`, `/api/v1`, legacy mount normalization, OpenAPI, checked-in samples, validation and cache contracts together. File relocation does not change public hostnames or routes. |
| Firebase CLI / Functions | Keep configs and aliases at `firebase/`; paths in `firebase.json` resolve there, including `functions`, rules and indexes. Functions is CommonJS, Node 24, with its own lockfile and lint. Web emulator callers use explicit config paths and `demo-lpubelts`; after web relocation, update callers to root Firebase configs. No deploy or emulator execution for this documentation-only task. |
| Change-index contract | `firebase/functions/index.js` writes lockcollections/awards/evidence change indexes in both databases; API collection exporters consume `docId`, `changedAt`, `deleted`, `sourceCollection`. Preserve lookback, atomic outputs/backups and state advancement after successful processing. The API AGENTS reference to sibling `functions/index.js` is stale; canonical path is `firebase/functions/index.js`. Repair that guidance during import. |
| API environment / release identity | Runtime environment and `.release.json` loaders can depend on CWD; collection environment resolves package root from module location. Keep API runtime CWD at the extracted app root, not monorepo root. Service-account paths remain absolute and external. |
| PM2 / release artifact | `ecosystem.dev.json` uses `current-dev`; `ecosystem.prod.json` uses `current` and `src/lpubeltsApiServer.js`. Production process stays `lpubelts-api-server-prod-next`. Artifact must extract API contents at its root, preserving these host paths and `current/releases/shared` separation. Do not deploy the entire monorepo. |
| Persistent API state | Preserve shared env files, credentials, logs, uploads, snapshots and generated outputs. `COLLECTION_EXPORT_DIR`, `COLLECTION_BACKUP_DIR`, `COLLECTION_PUBLIC_DATA_DIR`, `COLLECTION_DAILY_DIR`, `COLLECTION_API_DIR`, `LPU_CATALOG_DIR` and `CLASSIFICATION_CATALOG_PATH` remain external absolute locations. Preserve raw exports, three export-state files, backups, `.collection-export-analysis.lock` semantics and the two readiness-required generated files. |
| Cron / SFTP | Existing cron calls pinned Node and `current/scripts/runFetchAnalyzeLogs.js` or `runCollectionExportAnalysis.js` with `NODE_ENV=production` and `cron`. Standalone artifact means host script paths need not change; verify Node/CWD anyway. WebStorm maps the local API root to `current-dev`; change only its local source to `apps/api`, retaining excludes and manual restart. Actual cron/SFTP settings were not read. |
| Legacy integrations | Older `src/projects` code may select production from usernames or read deprecated key directories. Importing code never authorizes execution. Keep its review separate from active import-safe API/export modules. |
| Future bot | CommonJS entry point and several ES-module utilities coexist; no pinned Node/package-manager version or test script in package.json. `start`, `dev`, and `deploy` contact Discord or change commands. Externalize request/log state before onboarding and remove install-state artifacts from the admitted tree. |

## Release triggers, settings and authority

| Workflow / authority | Current trigger and effects | Migration control |
| --- | --- | --- |
| Web `build.js.yml` / Build-N-Deploy | Selected `main` paths (`src`, `public`, `scripts`, HTML, package/lock, Node pin, workflow); successful `Import` completion via `workflow_run`; manual stage choice. Uses `github-pages`, publishes `dist` to Pages and uploads all seven snapshots to **both** API environments. | A shared commit or Import completion can release. Before merging path/workspace changes, use a reviewed, approved fail-closed migration hold covering push, dispatch and workflow-run jobs. Path filters alone cannot guard `workflow_run`. Do not dispatch Import or rely on a documentation-only run to prove safety. |
| Web `import.yml` / Import | Manual dispatch; reads Sheets, rewrites generated data, auto-commits with `--no-verify`; its completion can start Build-N-Deploy. | No migration dispatch. Any later generated diff needs review; synchronize the exact source commit and paired catalog, not merely the latest branch tip. |
| Web `publish-classification-dev.yml` | Manual, main-only; uploads compact catalog and atomically activates it on development using `github-pages` settings. | Still an external write requiring authorization; not a dry-run substitute. |
| Web `pull_request.yml` | PR event; npm ci, lint, full unit suite and test build; no publish step. | Keep validation separate from release controls and update paths after relocation. |
| API `pull-request-ci.yml` | PR event; pinned Node/Yarn, immutable install, `yarn validate`. | Move workflow to root `.github/workflows` and scope validation to API/shared changes. |
| API `deploy-production.yml` | Manual confirmation, main-only, verify job then protected `production` deploy job; Linux production dependencies, root git archive, SSH/SFTP, PM2 activation, readiness/collection smoke check and rollback. | Old repository remains sole API release authority through Phases 1–4. Candidate monorepo deploy job stays disabled/fail-closed until approved transfer; a manual trigger alone is insufficient protection against duplicate dispatches. |
| Functions / bot | No bot workflow directory found. Functions scripts expose CLI deploy; effective external automation unverified. | Independent release authority remains unchanged; no new schedule or implicit deploy from workspace adoption. |

Local workflow declarations establish intended controls, not effective environment protection. The production reference says one reviewer; actual required reviewers, branch rules and environment parity remain unverified.

Settings by name only:

- `github-pages` variables: `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `DEPLOY_ROOT`, `DEPLOY_ROOT_DEV`, `VITE_FIREBASE_API_KEY`, `VITE_REDDIT_CLIENT_SECRET`, `VITE_CLASSIFICATION_WRITE_STAGE`; secrets: `SFTP_PRIVATE_KEY`, `SFTP_KNOWN_HOSTS`, workflow `GITHUB_TOKEN`.
- Import variables: `GOOGLE_SHEET_ID`, `RAFL_SHEET_ID`.
- API `production` variables: `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `DEPLOY_ROOT`, `REMOTE_NODE_BIN`, `PM2_APP_NAME`, `HEALTHCHECK_URL`; secrets: `SFTP_PRIVATE_KEY`, `SFTP_KNOWN_HOSTS`.
- External controls to verify: environment required reviewers and allowed branches, branch protection/required status checks, Actions permissions, Pages branch/output/custom domain, cron entries, WebStorm deployment mapping/excludes, PM2 identity and host Node binary.

**Confirmed coordinating owner:** Neal Bayless owns coordination of GitHub environments/reviewers, Pages, DreamHost PM2/cron/WebStorm SFTP settings, and release actions, as recorded in owner question 2. Effective settings and protections remain unverified. Neal supplied the credential/data disposition in question 4. This assignment does not authorize hosted changes or releases.

Release sequence for later authorization:

1. Keep current releases unchanged while preparing review branches/worktrees. Review and activate migration release holds before any release-triggering merge; any control change to hosted workflows requires explicit authorization. Include in-flight builds and successful Import completions.
2. Import only cleared API history; old API repository retains release authority. Monorepo artifact/CI work cannot activate a host or upload snapshots.
3. Move web paths and tooling under the hold, validating offline output and catalogs. Rehearse only against a separately authorized development target; do not duplicate cron.
4. Before production transfer, verify the API source freeze and stop on drift, record frozen-source/sanitized-source/monorepo SHAs, verify settings/reviewers by name, review artifacts and approve the exact cutover order and rollback.
5. Disable old API dispatch authority and confirm no in-flight deployment before enabling the protected monorepo release. Concurrency groups do not serialize workflows across repositories. Approve API activation and the site/snapshot release explicitly; restore web automatic publishing only as part of that approved sequence.
6. Observe normal traffic and job cycles, retaining active plus two rollback API releases. Retire old workflows/schedules only after verification; no scheduled workload should have two owners.

No release hold was changed or activated during Phase 0. The current auto-publish behavior remains an operational constraint, not a completed migration control.

## Offline verification specifications

### API artifact inspection (defined; not executed)

Use a disposable Linux x64 checkout/container with the reviewed source SHA and pinned tools. Dependency downloads require available registry access; the resulting artifact inspection itself must need no credentials or live services. Do not include SSH setup, remote directory creation, SFTP, PM2 or exporter execution.

1. Install the retained API Yarn lock immutably inside the app boundary, validate at the authorized test gate, then focus production dependencies as the current workflow does. No developer macOS node_modules may enter a Linux artifact.
2. Archive the **API subtree contents** at artifact root, append its matching production node_modules and compute a checksum. Explicitly inspect the archive member list before extraction: no absolute/traversal paths, escaping symlinks, sibling apps, Git metadata, private env files, credentials, logs or mutable state. Permit only separately reviewed synthetic/template env files; do not treat a filename as proof of safety.
3. Extract to a temporary directory and confirm package.json/main, `.nvmrc`, Yarn config/lock, `src/lpubeltsApiServer.js`, PM2 JSON and job runners are present at expected relative paths. Check dependency symlinks remain within the artifact.
4. Run `node --check` on entry/runners, parse PM2 declarations without starting PM2, and load `sharp` from the extracted artifact on Linux. Compare package/tool versions and runtime dependency tree with the pre-workspace artifact.
5. Check `.release.json` will identify the exact monorepo SHA/release. Specify synthetic external shared paths and verify environment link/readiness/rollback logic statically. Actual readiness, activation and rollback demonstration belong to an authorized development rehearsal.

### Web publish dry run (defined; only test build/catalog validation executed)

Use a disposable checkout with test-mode synthetic inputs, no deployment credentials and outbound network blocked during build/copy/validation. Dependency installation is a separate step. Run `npm run build:test`; use only inspected local copy/export operations needed to construct the catalog/output layout. Never invoke `ci-build`, `Import`, `copyData`, a publisher action, SSH or SFTP. Produce an archive/checksum locally, with no job carrying publish permission or hosted environment secrets.

Validate `data.json` and `classification-catalog.json` with `scripts/validateClassificationCatalog.js`; compare all seven source hashes and the distinct safelocks upload source. Compare relocated test-build contents to the inventory, explaining changed asset names/path metadata rather than accepting silent output drift. Local `build:test` does not generate the complete production CSV/HTML/Markdown release, so production-output equivalence remains a later explicit check.

### Checks needing separate authorization or external evidence

Development host Node checks/install, SFTP upload, restart, readiness and rollback rehearsal; hosted release-control/environment changes; production activation/restart/cutover; site publication and catalog upload (including development catalog); Import and every live exporter/read-only job. Effective hosted settings and currently deployed release identities remain unverified. No host or GitHub account tooling was used as a baseline shortcut.

## Verification results

Existing installed dependencies were used; no clean install or lockfile regeneration was attempted.

| Exact command / inspection | Result |
| --- | --- |
| `git status --short`, `git rev-parse HEAD`, `git ls-files -z`, `git remote`, `git rev-list --all --count`, `git rev-list --objects --all` in each repository | Completed locally; identities/counts/path lists in inventory. Remote URLs normalized to public repository names; no fetch. |
| `node --version`; `npm --version` (web/Functions shell) | `v24.15.0`; `12.0.2`. Web pin matches; Functions engine is Node 24. |
| `PATH=/Users/nealbayless/.nvm/versions/node/v24.21.0/bin:$PATH node --version`; corresponding `npm --version`, `yarn --version` | `v24.21.0`; `11.19.0`; `4.18.0`. API lint used this PATH and the API working directory. |
| `npm run lint` | Passed, exit 0. |
| `npm --prefix firebase/functions run lint` | Passed, exit 0. |
| `PATH=/Users/nealbayless/.nvm/versions/node/v24.21.0/bin:$PATH yarn lint` (API directory) | Passed, exit 0. |
| `npm run build:test` | Passed, exit 0; 3,738 transformed modules; existing warning for chunks larger than 500 kB. Captured 499 output files / 21,167,391 bytes and per-file hashes. Generated ignored `dist/` only. |
| `node scripts/validateClassificationCatalog.js src/data/data.json src/data/classification-catalog.json` | Passed, exit 0; local paired source validation, no writes. |
| API history regex and field-name triage | Completed; owner disposition now specifies FTP-history exclusion and template/JSON retention. No credential values or private records emitted. |
| `npm run ci-pr`, `yarn validate`, focused Playwright | Initially deferred; subsequently authorized and executed. Web: 52 files / 280 tests passed plus lint/build. API confirmation: 89 files / 444 tests passed plus lint; earlier cleanup failure recorded below. Browser: 10 tests passed. |
| Firebase emulator suites; API artifact construction/native check; clean installs | Not run: no affected tracker/schema code; artifact work belongs to Phase 1; no dependency changes. |

The build hashes reflect existing local public assets, including any ignored generated assets, and installed dependencies. They are useful before/after evidence, not a hermetic clean-checkout or production-artifact certification.

## Phase 0 completion and Phase 1 handoff

Phase 0 is complete on 2026-10-25. All source identities, local path/release inventories, named coordination ownership, sanitation/retention decisions, offline verification specifications and final authorized baseline results are recorded. Full check results include failed attempts rather than treating retries as erasing prior failures.

- Preserve the API source freeze and current release authorities. Phase 1 must sanitize a disposable copy, retain a source-to-rewritten commit map, verify the four-blob exclusion and retained files, and only then import reviewed history.
- Track the intermittent multipart attachment-cleanup failure described below; its cause has not been diagnosed or fixed. Passing isolated and confirmation runs establish the current baseline while preserving this limitation.
- Effective hosted environment protection, deployed release IDs and host Node support still need external evidence before their corresponding release gates. Those later checks do not require a deployment or live exporter as a Phase 0 shortcut.

## Working-tree handoff

The three pre-existing untracked planning documents were preserved and updated in scope. Added one metadata-only inventory. No sibling source changed. The ignored web `dist/` output is intentionally unstaged. The planning/evidence documents and owner-question file are staged; owner answers are preserved verbatim. Initial staging was blocked by sandbox access to `.git/index.lock`; the authorized retry succeeded. Final metadata and local Markdown-link checks passed. `git diff --cached --check` flags 20 existing Markdown two-space hard line breaks in the previously untracked implementation plan; retained their formatting rather than changing unrelated sections. No commit, push or PR was created.


### Owner-answer follow-up verification

- Preserved all three owner answers verbatim and updated the overview, implementation plan and this report to reflect them. Added the remaining content-disposition question to the owner-question file because agent-chat questions were not visible.
- Rechecked the API frozen SHA and clean working tree; no source, ref or hosted setting was changed.
- Documentation-only follow-up: no application lint/build/unit/browser suite rerun is needed; prior baseline results above remain historical evidence. Verification passed for preservation of all three owner answers, local Markdown links and heading anchors, removal of stale decision text, and the frozen API SHA/clean working tree. Whitespace review retains the previously reported Markdown hard breaks.


### Question 4 clarification: current files versus historical content

Rechecked path existence with `git cat-file -e` against frozen API commit `2fa33cfbe0ba5376ca0ad503bc528164ebf33194`. The flagged `src/projects/logAnalysis/ftpFetchGodaddy.cjs` path is absent at that commit: its four flagged versions are historical only. All 33 JSON review paths and `.env.example` are present in the current tracked tree. Their current presence does not establish production use or private content; provenance/template review was open at that checkpoint and is now resolved by the owner disposition below. Added this distinction to owner question 4. No file contents, credentials, live services or tests were needed for this clarification.


### Question 4 resolution and sanitation handoff

The owner directs scrubbing password-bearing historical FTP versions, confirms `.env.example` is placeholder-only, and confirms the reviewed JSON directories contain placeholder or non-sensitive data. Recorded this answer in the owner-question file and selected a four-blob exclusion rule for Phase 1. The frozen source tree and retained template/JSON contents must remain unchanged. No history rewrite or import has run in Phase 0, and no credential retirement is asserted. The content-review question is resolved. The baseline test gate was still deferred at this checkpoint and has since been executed as recorded below.


Disposition follow-up verification: all four owner answers are recorded; local Markdown links/heading anchors resolve; the four-blob exclusion matches the inventory; the original API HEAD still matches the frozen SHA and its working tree is clean. Documentation whitespace checks passed for the report, overview and owner questions; the implementation plan retains its previously recorded Markdown hard breaks. No application tests were rerun for this documentation-only update.


## Final authorized Phase 0 baseline gate — 2026-10-25

The owner explicitly requested the remaining tests after reviewing the Phase 0 task list. Existing dependencies were used. Web ran with Node `v24.15.0` / npm `12.0.2`; API commands explicitly prepended `/Users/nealbayless/.nvm/versions/node/v24.21.0/bin` to PATH, using Node `v24.21.0`, npm `11.19.0` and Yarn `4.18.0`. No install, generator/export job, API runtime launch, migration, deployment or live-data operation ran.

| Command / attempt | Result |
| --- | --- |
| `npm run ci-pr` | **Passed, exit 0:** frontend lint, 52 unit-test files / 280 tests, and test-mode Vite build. Unit suite 10.87 seconds. Existing >500 kB chunk warning remains. |
| `PATH=/Users/nealbayless/.nvm/versions/node/v24.21.0/bin:$PATH yarn validate` — initial sandboxed attempt | **Failed, exit 1:** 25 files failed / 64 passed, 104 tests failed / 340 passed, 30 unhandled errors. Local Supertest listeners and ignored `logs/nodeserver-dev.log` writes were restricted; resulting address/worker errors are environmental, not a valid clean runtime baseline. |
| Same `yarn validate` — retry with approved local permissions | **Failed, exit 1:** 88 files / 443 tests passed; one test failed in `src/projects/multipartEndpoints.test.js`: `rejects and cleans up a file submitted to the email-form endpoint`. At line 237, the upload directory still contained one temporary attachment instead of being empty. |
| `PATH=/Users/nealbayless/.nvm/versions/node/v24.21.0/bin:$PATH yarn vitest run src/projects/multipartEndpoints.test.js` — focused check with local permissions | **Passed, exit 0:** 1 file / all 7 tests, including the previously failing cleanup assertion. No source or assertion changed. |
| Same full `yarn validate` — one confirmation run with local permissions | **Passed, exit 0:** lint plus all 89 files / 444 tests, 1.80 seconds. The earlier cleanup failure remains an observed intermittent baseline issue; root cause is not established. |
| `npx --no-install playwright test tests/e2e/viteBundle.spec.js tests/e2e/locks.spec.js tests/e2e/contentRoutes.spec.js` — initial sandboxed attempt | **Blocked, exit 1:** loopback preview could not listen on `127.0.0.1:5173` (`EPERM`); no browser test ran in this attempt. |
| Same focused Playwright command — retry with approved local permissions | **Passed, exit 0:** 10 tests in 4.2 seconds. Covered all emitted JavaScript chunks, hash-route navigation/history/refresh, content routes, anonymous Classification sign-in, lock detail/filter behavior and mobile controls. Fresh test-mode build/preview and existing non-loopback request blocking remained in use. |

The API failure occurred on frozen source `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` before migration. Treat it as a pre-existing baseline observation. Neither concurrency nor an exact root cause has been proven. No attempt was made to fix it by changing the frozen repository, relaxing assertions, adding retries or suppressing warnings. Existing build chunk-size warnings and Playwright runner color-environment warnings were retained; browser console-warning assertions passed.

Local logs and a copy of the generated browser HTML report are retained under `/private/tmp/lpu-monorepo-phase0-tests.i3IqVU/` (temporary local evidence, not committed): `web-ci.log`, `api-validate.log`, `api-validate-retry.log`, `api-multipart-focused.log`, `api-validate-confirm.log`, `browser.log`, `browser-retry.log`, and `browser-report.html`.

Generated effects: web `dist/`, ignored Playwright/Allure/test results, and ignored API test logs. The web repository already tracks `playwright-report/index.html`; the test run rewrote it, so its generated result was copied into the temporary evidence directory and the previously clean tracked file restored byte-for-byte from HEAD. No source change remains in either application; the API checkout is clean. The original baseline hash inventory remains the captured snapshot, not a new production artifact certification. Functions lint and paired catalog validation retain their earlier passing evidence; no Functions/schema code changed, so emulator suites were not rerun.

## Phase 1 progress — 2026-10-25

Started Phase 1. Original API HEAD remains `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` and its working tree is clean. Existing staged Phase 0 documents are preserved. Read both repository guides and API operational references. Preparing a disposable sanitized history and an isolated migration worktree; no source-repository edits, remote operations, exporter runs or deployments. Owner question 5 requests the specific local history-import merge commit exception; review is needed while independent preparation continues. Full suites are reserved for the final phase gate as requested.

### Import evidence and authorization

Owner question 5 explicitly authorized the local history-import merge. The only new destination commit is `fd2daca185393fe72737ad4083cc398f989c6e84`, on branch `monorepo/phase1-api` in `/private/tmp/lpu-monorepo-phase1.Evb7JY/worktree`; main HEAD was not changed. The merge parents are web baseline `0e3dcba14fef65af722e4499272271639a6ddff5` and sanitized API `1f7d64136c2f466b5b3486d3e119999991183b66`. Implementation edits are staged separately for owner review, without another commit. The pure history import used `core.hooksPath=/dev/null` to reserve full tests for the requested final phase gate; API and web full gates subsequently passed as recorded below.

The independent disposable clone has no push remote. `git filter-repo --strip-blobs-with-ids <four-blob-manifest> --prune-empty never --prune-degenerate never` removed entries referencing precisely the four reviewed blobs. Candidate refs were frozen main ancestry and the local v1.0.0 tag; remote topic/Dependabot branches and the source stash are intentionally outside this import. This covers 176 commits, versus the Phase 0 inventory's 189 commits across all original refs. The tag target is part of the main ancestry; no destination tag was created.

Verification compared every mapped commit's parent list and complete recursive tree against the source with only excluded entries removed. All 176 commits/topology were preserved. The sanitized tip tree is identical to the frozen source, including `.env.example` and all 33 reviewed JSON files. Every reachable candidate blob/commit/tag was checked in memory for the four blobs' password values; values were never printed or stored. All 1,352 reachable blobs passed. In the destination, every mapped commit is reachable from the import merge and the four excluded blobs are absent even from its object database. The initial verifier stopped because its assignment matcher accepted only `:`; it was corrected to cover `=` too, then all checks completed before importing history. No uncleared ref entered destination history.

[History verification and commit map](monorepo-api-history-verification.json) records source/sanitized/import identities, refs, counts and metadata-only results. Reproduction helpers and logs are local under `/private/tmp/lpu-monorepo-phase1.Evb7JY`; `verify-history.py` is temporary evidence tooling, not application source. Preserve that directory and worktree until the owner has reviewed and committed the staged candidate.

### Prepared implementation

- API retains its Yarn 4.18.0 lock, `.yarnrc.yml`, Node 24.21.0 pin and runtime behavior; root web remains npm/Node 24.15.0. No dependency versions, routes, middleware, PM2 declarations or checked-in fixtures changed. Only the workflow-path contract test and a frontend documentation link changed under existing `apps/api/src`.
- API workflows moved to root `api-ci.yml` and `api-deploy-production.yml`. PR CI is scoped to API/workflow/agent changes, uses the package working directory and Node pin, validates, focuses production dependencies on Ubuntu 22.04, builds/inspects/extracts the app-root archive, checks entry/job syntax and loads extracted Sharp. It retains the archive/checksum as an Actions artifact without host credentials or exports. The candidate manual deployment retains main-only verification, the protected `production` environment, exact Git SHA release identity, SSH host verification, shared-env link, PM2 activation, readiness identity, public smoke check and rollback. Its deploy job has an unconditional `if: ${{ false }}` hold; removing it requires the separate Phase 5 authority transfer.
- `scripts/releaseArtifact.js` archives `COMMIT:apps/api`, pairs committed dependency inputs with the installed package, appends package-local dependencies, validates archive paths/types/links before extraction, checks package/PM2/required-file contracts, and writes SHA-256. It rejects Git metadata, sibling apps, private root env files, key/credential directories, shared/log state, install-state and pre-existing release identity. It supports Git PAX and GNU long-name metadata using Node built-ins; no dependency was added. A dedicated unit file tests valid package layout, extended names, unsafe paths/links, missing dependencies, wrong package and corrupted headers.
- The imported tracked `.yarn/install-state.gz` is removed from the candidate index; the ignored local copy remains available for validation. Yarn regenerates it on install. The API's former hook installer fails with instructions to use the root hook, preventing accidental replacement of Husky. The root hook adds API validation for staged API changes and selects its Node pin. Dependabot now includes `/apps/api`. Root/API guides and operational references explain package boundaries, stable host roots, future SFTP mapping, cron preflight and rollback.
- Eventual SFTP maps local `<monorepo>/apps/api` directly to existing remote `current-dev`; the old mapping must be disabled first. Production keeps the existing `current/scripts/...` cron commands and pinned host Node because API contents remain at artifact root. No extra `/apps/api` component belongs on the host. PM2, `current/releases/shared`, env links, credentials, catalogs, outputs and rollback releases keep their existing boundaries. Actual settings changes, cron/job execution, development host rehearsal and production cutover remain separately approval-gated.

### Phase 1 verification

Commands ran from the isolated worktree (API commands from `apps/api`), using the respective pinned Node binaries via PATH. Existing dependency trees were initially copied for API and linked for web; no source-repository file was changed.

| Command / inspection | Result |
| --- | --- |
| `corepack yarn install --immutable --immutable-cache --mode=skip-build` | Passed with Yarn 4.18.0 / Node 24.21.0 using cached packages; no lockfile changes. Initial `--mode=skip-builds` spelling was rejected before install, then corrected. Builds were skipped to avoid package install side effects. This is not a pristine Linux/native install certification. |
| `corepack yarn test --run scripts/releaseArtifact.test.js src/config/nodeRuntimeContract.test.js` | Passed on final focused run: 2 files / 21 tests. Earlier iterations passed 16 packaging tests, then 18 tests across both files. |
| `corepack yarn exec eslint scripts/releaseArtifact.js scripts/releaseArtifact.test.js src/config/nodeRuntimeContract.test.js` | Passed. |
| `corepack yarn validate` | Passed, exit 0: API lint and 90 files / 464 tests on the final reviewed implementation (initial phase-gate run: 461 tests). Used local socket permissions for mocked Supertest tests. The observed Phase 0 intermittent multipart cleanup failure did not recur. Logs: `api-validate.log` and `api-validate-final.log`. Final review added rejection of noncanonical archive aliases and verification that the supplied SHA resolves to a commit; affected tests, lint and the API full gate were repeated after those changes. Web code did not change, so its passing gate was retained. |
| `npm run ci-pr` | Passed, exit 0: web lint, 52 files / 280 tests and test-mode build. Existing large-chunk build warning remains; no warning was hidden. Log: `web-ci.log`. |
| Real imported-source structural archive plus local dependencies; `node apps/api/scripts/releaseArtifact.js inspect <archive>` | Passed: 18,723 members. Built from import `HEAD:apps/api`, excluding tracked generated install-state, with copied macOS dependencies. This is structural evidence only, not the final candidate's Linux production release artifact. |
| Extracted `node --check` for server and both cron runners; extracted `import('sharp')` | Passed on macOS. An initial Sharp probe ran from the root web package and failed module resolution; rerunning from the extracted API passed. No service, PM2 or exporter started. |
| Ruby YAML parse of both API workflows and Dependabot; `bash -n` for every workflow run block | Passed: 13 shell blocks, including remote activation heredoc. Static checks confirm unconditional deploy hold and absence of SSH/SFTP in API CI. |
| Shell syntax checks for root and imported API hooks; history/topology/tree/object checks | Passed. Runtime route/fixture paths remain byte-identical to the frozen import; the original API remains clean at its agreed SHA. |

No Playwright or Functions/emulator suite ran: no browser behavior, Firebase code, Functions paths or schema changed in Phase 1. Full suites were reserved for the final local gate rather than run during iteration. No production build, `ci-build`, exporter, remote fetch, publish, push, PR, host command, hosted workflow dispatch or deployment ran. Local-only fetch from the verified sanitation copy was necessary for the authorized subtree merge.

### Remaining gate and review (historical checkpoint; resolved below)

**Phase 1 remains in progress.** Owner question 6 is clarified: no owner-provided Linux environment is required. The prepared API CI supplies Linux x64; its execution remains a normal verification gate. This workstation has no Docker/Podman/Colima/Lima. The prepared CI must run from a clean checkout of the owner-committed final implementation (as a PR check, or a manual dispatch once the workflow exists on the default branch), install/focus its actual Linux production dependencies and prove extracted Sharp loading. Local macOS evidence and YAML/shell syntax checks cannot replace that result or establish effective GitHub environment reviewers/branch settings. The archive/checksum upload action also remains unexecuted until that CI run.

Review the staged candidate on `monorepo/phase1-api`, the sanitized commit map, deployment hold and future SFTP/cron switch instructions. The original repository remains the sole API release authority and frozen source. Preserve the temporary worktree until reviewed; only the import merge is committed. Main-checkout documentation is intentionally also updated for discoverability, while runtime/tooling edits live solely in the isolated worktree. Generated `dist/`, logs, dependency trees, local Yarn state and structural archive remain ignored/temporary and unstaged.

Final handoff verification: source freeze rechecked clean at the agreed SHA. Candidate whitespace checks passed excluding the implementation plan’s previously recorded Markdown hard breaks. Both workflow YAML files, Dependabot and all 13 workflow shell blocks parsed; hooks passed shell syntax checks. The 18,723-member structural archive also passed the final tightened validator. All source/config/docs created for the candidate are staged; generated dependencies/install-state/build output/logs/archives remain ignored or temporary. No implementation commit was added after the authorized import merge.

Owner question 6 clarification: the frozen source repository is unchanged. The remaining Linux check covers the new monorepo packaging boundary and dependencies, not a suspected runtime regression or host change. Withdrew the request to choose/provide an environment; the prepared Linux CI is sufficient. No owner answer is needed to complete local preparation. Phase completion still requires the planned CI evidence; no new commit, push, PR, dispatch or deployment was performed. This documentation-only clarification required no application test rerun.

### Authorized CI run preparation

The owner authorized the CI test. The candidate remains local and uncommitted beyond the import merge. Confirmed GitHub’s documented default-branch requirement for manual dispatch: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow?tool=webui . Prepared an API CI push trigger limited to the exact migration branch `monorepo/phase1-api` and the existing API path filters; no PR or default-branch merge is needed. Existing web publication triggers require main push or Import completion and are not selected by this branch push. API deployment remains disabled.

Owner question 7 requests the implementation commit and push to `origin` (`mgsecure/lpu-belt-explorer`), which require explicit approval under AGENTS.md. The previous commit authorization covered only the import merge. No commit/push/PR/dispatch or CI run has occurred during this follow-up. GitHub CLI is absent and no connected GitHub tool is available; existing Git transport and GitHub REST monitoring can be used without exposing credentials once branch publication is authorized. Workflow-only preparation requires YAML/shell verification; no application code or assertions changed, so the passing local suites are retained.

Owner question 7 approved: the owner’s “I approve” authorizes the staged implementation commit and push of `monorepo/phase1-api` to `origin` for API CI. Preparing that exact commit and a branch-only push. No default-branch or upstream changes, tags, PR, deployment or live-data job is included. CI outcome will be recorded after execution.

## Phase 1 completion — authorized CI and clean-checkout evidence

**Complete, 2026-10-25.** The owner approved question 7. Created implementation commit `22ec5c9fef8871aefa678eefe9bbedb0d695285a` on `monorepo/phase1-api` and pushed that exact branch to `origin` (`mgsecure/lpu-belt-explorer`) using an explicit refspec with tag following disabled. No main/upstream/tag push, PR or merge occurred. The migration branch did not previously exist remotely. The push triggered only API CI; the production deploy job remained unconditionally disabled.

[API CI run 40212524559](https://github.com/mgsecure/lpu-belt-explorer/actions/runs/40212524559), job `121226638452`, **passed** for that exact SHA on Ubuntu 22.04 Linux x64. The clean runner installed the immutable Yarn graph with Node 24.21.0 / Yarn 4.18.0, passed API lint and **90 files / 464 tests**, focused production dependencies, loaded Sharp, created and inspected the standalone archive, extracted it, passed server/two-runner syntax checks and loaded Sharp from the extracted release. It did not start the API, PM2, an exporter or any host connection. Every job step succeeded; the baseline intermittent multipart cleanup failure did not recur.

The retained Actions artifact is `api-22ec5c9fef8871aefa678eefe9bbedb0d695285a`, ID `12606436091`, with seven-day retention (89,167,613 bytes). Downloaded it for independent local inspection:

| Evidence | Result |
| --- | --- |
| GitHub artifact ZIP SHA-256 | `0770482a6fe963833948ec41f39762d619973a7b2d3959e8c85120f50f1574f1` — matches GitHub metadata |
| `api.tar.gz` SHA-256 | `12b710cb98146eb969916b0d064012fe125659af17df3a5c9f00ceec31afc6ed` — matches retained checksum sidecar |
| Final Linux artifact validator | Passed: **15,163 members**; source at API package root, required files/PM2 declarations/dependencies present, excluded state absent |
| Artifact-to-Git source comparison | Passed: all **367 tracked API files** match the exact CI commit; compared file bytes and symlink targets without printing contents |

The Linux archive contains focused production dependencies, so its member count differs from the earlier macOS structural archive with development dependencies. No Linux binary was executed on the Mac; the extracted Linux Sharp check passed on the CI runner itself. The artifact and downloaded CI logs are temporary local evidence under `/private/tmp/lpu-monorepo-phase1.Evb7JY/`; the Actions artifact is also available from the linked run until retention expires. Hashes and source/run identities are recorded in `monorepo-api-history-verification.json`.

To meet the clean-checkout requirement for both apps, created an independent local clone at `clean-checkout` of the exact published candidate. A first `npm ci --offline --ignore-scripts` stopped with `ENOTCACHED` for `web-worker`; no application test failed. Retried using an isolated temporary cache and authorized registry access: `npm ci --ignore-scripts --no-audit --no-fund --cache=/private/tmp/lpu-monorepo-phase1.Evb7JY/npm-cache` **passed** (967 packages). Node was 24.15.0 and npm 12.0.2. Install hooks were disabled; no root hook or Git configuration was rewritten. Then `npm run ci-pr` **passed**, exit 0: web lint, **52 files / 280 tests**, and test-mode build. The fresh checkout remains Git-clean. Existing dependency deprecation notices and the Vite large-chunk warning remain visible; no dependency versions or assertions changed. Logs: `web-clean-install.log` (cache miss), `web-clean-install-network.log` and `web-clean-ci.log`.

The first public CI-log download returned HTTP 403 because that endpoint required authentication. Retried successfully using existing Git credentials in memory; credential values were never printed or stored. GitHub metadata, CI logs and the release artifact were read solely to verify the authorized run. No GitHub CLI/plugin installation was needed.

Rechecked the original API: clean at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194`. Its release workflows and source remain untouched and it remains sole production release authority. No production release, site publication, snapshot upload, live-data job, SFTP mapping change, cron change, API host access or PM2 operation occurred. GitHub Actions stored only the explicitly authorized offline release artifact. Source/template/data history disposition remains as verified in the import metadata.

All Phase 1 tasks and exit criteria now have evidence. Manual review still applies to the published branch, artifact, deployment hold and future SFTP/cron instructions; effective environment reviewers, host Node/settings and real readiness/rollback rehearsal retain their planned later-phase gates. Phase 2 is not started. Completion updates are staged locally in both the isolated worktree and the main checkout’s documentation, intentionally uncommitted and unpushed after the single approved implementation commit. Temporary dependency/build/log/artifact outputs remain unstaged. No further approval or owner response is needed for completed Phase 1.

## Phase 2 progress — 2026-10-25

Started in a separate worktree/branch from the verified Phase 1 candidate, preserving all existing staged documentation. Read architecture, Firebase/data safety, testing and change-index references. The web package moves under `apps/web`; root becomes a private npm coordinator with only the web workspace. API remains independently installed with Yarn and its existing Node pin. Firebase config/rules/Functions stay at root. Tracked environment files stay at root without content changes or copying; Vite/Vitest will explicitly select that env directory. Credential paths must preserve their existing resolved root/sibling locations without opening or relocating credentials.

Added unconditional local migration holds to Build-N-Deploy, Import and development catalog publishing before moving paths. This covers push/manual/workflow_run entry points; it changes no deployed GitHub setting and authorizes no merge or publish. No owner question is needed for these routine path choices. Phase 2 will remain uncommitted and unpushed unless separately authorized.

## Phase 2 completion — web workspace and path repair

**Complete, 2026-10-25.** Implementation is staged on `monorepo/phase2-web` at `/private/tmp/lpu-monorepo-phase2.Gl5KgW/worktree`, with no Phase 2 commit, push, PR, dispatch or deployment. The separate worktree starts from the verified Phase 1 candidate and carries its final completion evidence forward without altering the Phase 1 worktree. [Phase 2 verification metadata](monorepo-phase2-verification.json) records the dependency/source audits, checks, snapshot hashes and complete test-build hash set.

### Source, package and configuration boundaries

Moved web `src`, `public`, `scripts`, `tests`, HTML files and Vite/Vitest/Playwright/ESLint config together into `apps/web` using Git moves. An audit of the four source directories found **782 files byte-identical** and **nine reviewed edits**: eight credential-path adjustments and the browser version fixture. Application source, providers, routing, API URLs, auth contracts, static fixtures and catalog contents are unchanged. Vite and Vitest use explicit root `envDir`; root `.env.dev`, `.env.local`, `.env.production` and `.env.test` blob IDs remain unchanged, and no environment/key file was copied into the app.

Root `package.json` is now a private coordinator with only `apps/web` in npm workspaces. Its existing web commands delegate with app CWD and argument forwarding, including focused tests and emulator launchers. Root owns Husky; web keeps the same dependency ranges. The root `react-is` override now uses the equivalent original declared range because its former `$react-is` reference would have no direct root dependency to resolve. Every **1,020 existing lock dependency entries**, including versions, integrity and metadata, matches the previous lock as JSON; only root/workspace/link ownership metadata changed. The web package still uses root npm/Node 24.15.0; API Yarn 4.18.0/Node 24.21.0 and Functions package/lock remain independent. No dependency was added or upgraded, and no peer/engine checks were bypassed.

Retired generated root `.pnp.cjs`, `.pnp.loader.mjs` and `.yarn/install-state.gz` from the candidate index; ignored local copies remain. They are stale web Yarn install state, not authoritative npm inputs. The API retains its Yarn files. Added app-local output/cache/report ignores while retaining former root ignores to protect existing local data. Existing ignored root `public`, data and script outputs in the user's main checkout were not copied, rewritten or cleaned. Any later local-data relocation needs per-file review; it is not a reason to run a live exporter or copy private outputs into tests.

Firebase configs, aliases, rules, indexes and Functions source stay under `firebase` without byte changes. Web emulator scripts now reach shared configs via `../../firebase`; the Web SDK fixture config/rules move together under app tests. All config/rule/index/Functions source paths resolve from their declared config directories. Functions remains CommonJS with a separate lock and install. No tracker/schema/security-rule behavior changed. Root and package guides, architecture/testing/Firebase references, README and API frontend references now describe the current layout and commands.

Credential path edits add the two parent levels introduced by relocation; both former app-root CWD and script-subdirectory CWD resolve to the same root/sibling credential locations as before. URL-based imports remain relative to their source file. Credential contents were never opened or printed. Root npm jobs execute at app root; standalone legacy administrative routines retain their pre-existing subdirectory assumptions and require inspection plus approval before use. No administrative routine was executed.

### Workflow and publication controls

Before the move, added unconditional job-level `if: ${{ false }}` holds to candidate Build-N-Deploy, Import and development-catalog publishing. The Phase 1 API deployment hold remains intact. These are local candidate changes; the deployed default-branch workflows/settings remain unchanged. No phase merge or release activation occurred.

App-owned release/import/catalog shell steps use `apps/web`, npm installation stays at root, setup-node/cache use the unchanged root pin/lock, and the Pages action uses root-relative `./apps/web/dist`. The future Build-N-Deploy path filter includes web sources/config plus root package/lock/Node/env inputs. On eventual `workflow_run`, checkout identifies the exact Import `head_sha`; Phase 5 must restore a main-only release condition allowing only successful main Import completion before lifting the hold. Import’s eventual automatic commit is restricted to app data paths. Root PR validation watches web/shared/Firebase changes; Dependabot’s existing root npm entry follows the web workspace/root lock, with API still at its separate path.

Parsed seven workflow/Dependabot YAML files and syntax-checked **32 shell run blocks**. Audited the whole job boundary for web relocation pushes, shared lock changes, Import commits, successful/failed Import completion, and manual read/publish dispatches: every publication path is blocked by the unconditional hold before checkout, protected environment use, Pages or SSH/SFTP. Path filters are not being used as a substitute for the workflow_run hold. Future release steps retain validation, separate development/production roots, exact source hashes and atomic snapshot activation; no SFTP/Pages operation was used as a test.

### Exact checks and results

All root web checks used Node 24.15.0 / npm 12.0.2. API commands ran from `apps/api` with Node 24.21.0 / Yarn 4.18.0. Full suites ran at the final local phase gate after focused checks.

| Command / inspection | Result |
| --- | --- |
| `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund --cache=<Phase 1 temporary cache>` | Passed; retained every existing dependency entry and range, with only workspace ownership/link metadata changed. |
| `npm ci --offline --ignore-scripts --no-audit --no-fund --cache=<Phase 1 temporary cache>` | Passed from an empty web dependency tree: 968 packages. Scripts disabled to avoid changing shared worktree hook config. Existing package deprecation notices remain visible. Log: `npm-ci.log`. |
| `npm run test:run -- tests/vitest/ClassificationCatalog.test.js tests/vitest/firebaseConfig.test.js tests/vitest/firebaseInitialization.test.js tests/vitest/SafeTestEnvironment.test.js` | Passed: **4 files / 12 tests**, exercising relocated catalog imports/CWD, root test env and Firebase isolation. |
| `npm exec --workspace=apps/web -- eslint` with the eight changed script paths | Passed. No live script execution. |
| `npm run ci-pr` | Passed, exit 0: web lint, **52 files / 280 tests**, and test-mode build. Existing large-chunk warning retained. Log: `web-ci.log`. |
| API `corepack yarn install --immutable --immutable-cache --mode=skip-build` | Passed using copied existing package-local modules/cache, confirming the nested independent project boundary; no API lock drift. Log: `api-install.log`. |
| API `corepack yarn validate` | Passed, exit 0: API lint, **90 files / 464 tests**, using local socket permission for mocked Supertest. Baseline multipart instability did not recur. Log: `api-validate.log`. |
| `npm --prefix firebase/functions run lint` | Passed using the separate existing Functions dependency installation copied into this isolated worktree; no Functions source/lock/config change. |
| `npm run test:firebase:web-sdk` | Passed, exit 0, through both root/workspace wrappers against loopback Auth/Firestore emulators and explicit `demo-lpubelts`; temporary isolated CLI config and pinned CLI 15.30.0. Emulator shutdown succeeded. Log: `firebase-web-sdk.log`. |
| `npm run e2e -- tests/e2e/viteBundle.spec.js tests/e2e/contentRoutes.spec.js tests/e2e/locks.spec.js` | Initial run: **1 passed / 9 failed**, all failures caused by strict console warnings for missing ignored `/version.json`. After the fixture correction below, same command passed **10/10**. Logs: `browser.log`, `browser-confirm.log`. |
| Workflow YAML, shell syntax, candidate hold scenarios, Firebase config resources, hook syntax and credential/env path audits | Passed. The initial audit helper incorrectly expected the API verify job to have a deployment hold; corrected it to inspect the deploy job, while keeping verification runnable. |

The clean-worktree browser failure exposed a baseline fixture dependency: Phase 0’s local ignored `public/version.json` masked the missing release-generator output in fresh checkouts. The common Playwright fixture now fulfills only loopback `/version.json` with fixed synthetic version/minVersion values. All warnings/errors still fail tests and all non-loopback restrictions remain; no console assertion or production code was weakened. The final browser run rebuilt/served the moved app and covered every emitted JS chunk, hash navigation/history/refresh, content routes, anonymous Classification access, lock details/filtering and mobile controls. Reports are app-local and ignored.

A diagnostic `firebase --version` printed 15.30.0 but encountered the local updater config permission warning. The actual emulator check used isolated temporary `XDG_CONFIG_HOME` plus local test permissions and passed without accessing account config or requiring login. No security rule/schema change justified rerunning the full tracker/Classification emulator suites; the relevant relocated Web SDK fixture/launcher was exercised and shared config paths were checked statically. No Functions deploy, real API or live Firebase data was contacted.

### Build, snapshots and cross-app contract

Before adding copied snapshots, all **475 clean build files** were byte-identical to the Phase 0 hashes for those paths and exactly matched the Phase 1 clean-checkout build. No file was added or changed. Phase 0’s 499-file local inventory included **24 extra untracked/generated files**: `.DS_Store`, local cached public data/test duplicates, sitemap and version output. Verified none of those paths was tracked in the baseline; they were already absent in the Phase 1 clean build. This is a baseline local-output difference, not web migration drift. Did not copy or regenerate those potentially live/cache outputs to make a test match.

All seven catalog source SHA-256 values match Phase 0 exactly. Inspected `copyFiles.js` before running the authorized local-only copy step; `npm run copyFiles` produced 11 package-local `apps/web/dist` snapshots, each matching its source bytes (safelocks remains named `dials.json` in that copy). No root `dist` was created. `validateClassificationCatalog.js` passed for source and copied full/compact pairs. Future SFTP still deliberately uploads `src/data/safelocks.json` under its original safelocks name; it does not substitute `dist/dials.json`.

A temporary synthetic-only check imported the relocated web catalog producer/validator and API’s import-safe catalog consumer, wrote a small temp v1 compact catalog, and verified entry fields plus exact catalog version and missing-entry behavior. It passed without Firebase or network access. The first scratch assertion assumed the web formatter removed the literal make `Any`; corrected the helper to compare the consumer with the producer’s documented entry name. No application assertion or formatter changed. Existing web/API URL and auth code are byte-identical; unit suites and browser routes validate the same contracts after relocation.

### Handoff and remaining boundaries

Phase 2 is complete; Phase 3 is not started. No new owner question or environment decision is needed. Review the staged coordinator/move, root env ownership, candidate release holds and browser fixture correction before any later commit/merge. Phase 1’s prior commit/push/CI authorization does not cover Phase 2 publication; no Phase 2 commit/push/PR or hosted CI ran. The original API checkout remains clean and frozen at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194`, with its existing release authority. Firebase/Functions configuration and runtime code remain unchanged.

Logs, browser reports, dependency trees, emulator config/logs, synthetic catalog and copied/test build output remain ignored or temporary under `/private/tmp/lpu-monorepo-phase2.Gl5KgW/`. Source/config/docs, including new web guidance/package and metadata, are staged; no generated output, credential or env content is staged. The main checkout mirrors progress/evidence documents only; implementation lives in the isolated worktree. Source documentation records local-output ownership and the fact that deployed holds are not active until an approved merge. There was no live exporter/import, site publication, snapshot upload, host mapping/cron change or production deployment.

Final handoff checks: the retained dotenv version accepted the URL-based non-test config path using an isolated synthetic file and empty process environment; no project env/secret file was loaded for that check. Staged-path audit excludes env/credential/install/build/report outputs; Firebase source/config is unchanged and API changes are limited to frontend-reference guidance. Completion documents match main and the isolated worktree, local Markdown links resolve, and whitespace checks pass apart from the implementation plan’s retained Markdown hard breaks.

## Phase 3 progress — 2026-10-25

Started Phase 3 inspection. Read the dependency-upgrade skill, Firebase/testing references and API operational references. Phase 2 source is staged and uncommitted; preserve it in its existing worktree and carry its exact staged tree into a new isolated Phase 3 worktree without making an unrequested commit. The initial tooling review considered the API’s Node 24.21.0 and the prior web npm 12.0.2; the installed npm bundled with the selected Node is 11.19.0, which is the final pin. Host confirmation was pending at this checkpoint. No host command or live job has run. Reviewing npm workspace dependency packing to preserve a standalone API artifact under root hoisting. Phase 1/2 commit/push approvals are not reused for Phase 3.

Phase 3 implementation checkpoint: a default fresh API resolution floated packages including Express 5.2.1 to 5.3.0 and Sharp 0.35.4 to 0.35.5; rejected that draft. An installed-version/integrity seed is being built from the known Yarn installation and the existing web lock. Testing npm’s supported nested layout to keep both packages isolated and the API artifact self-contained; existing hoisted lock entries must be relocated too, since merely setting install-strategy does not rewrite the old lock layout. An offline synthetic npm-pack experiment demonstrated that hoisted workspace dependencies can be missing from the tarball, so naive npm pack is not the release solution. No application code or live service was used in those experiments.

Owner question 8 answered: the API host reports `node --version v24.21.0`. Finalized common Node 24.21.0 and the locally verified bundled npm 11.19.0. No host connection, installation, restart or configuration change was performed; exact deployment runtime-path verification remains in the existing pre-activation check.


### Phase 3 implementation and dependency review

The owner-confirmed common runtime is **Node 24.21.0 / npm 11.19.0**. Root workspaces now include web and API. Root `.npmrc` uses npm’s supported `install-strategy=nested`, retaining app-local dependencies rather than depending on workspace hoisting. Root scripts provide API lint/test/validation and combined validation. CI selects root `.nvmrc`, explicitly installs the pinned npm release and uses root `npm ci`; API artifact steps use a production-only workspace filter. Functions remains outside the workspace with its unchanged manifest/lock. Dependabot now monitors both apps through the root workspace update entry. The root hook validates API changes and shared install inputs with npm.

No existing web/API package version changed. The frozen Yarn installation seeded exact API versions and verified registry tarball integrity; existing web lock entries moved under the web package boundary without version drift. Root overrides retain the existing web policy and translate API `gaxios@6.7.1` → `uuid@11.1.1` resolution. All **386 prior Linux production package locations/versions** are present unchanged in the shared lock. The macOS production installation contains 386 packages, with just the two platform-specific Sharp packages replacing Linux equivalents. Fifteen unused node-gyp/build-infrastructure entries were pruned by npm; their exact names/versions are recorded in [Phase 3 verification metadata](monorepo-phase3-verification.json). No production dependency was removed or upgraded.

A macOS installed-tree seed omitted other-platform optional binaries. The production packaging check exposed Sharp’s Linux gap; an extra standalone `npm ci` check then exposed Linux test-tool bindings as well. Added **75 frozen-version optional platform/transitive entries** in total (25 Sharp/platform entries, then 50 test-tool/platform entries), using exact Yarn resolutions and registry integrity. This covers Linux Sharp, Rolldown, Lightning CSS and the resolver without choosing newer versions. API Yarn source files were retired after successful reproducible npm installs; ignored historical caches remain local. The root/shared graph has 578 API dependency entries, including optional binaries for other platforms. See npm’s [clean-install documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/) and [nested-install strategy](https://docs.npmjs.com/cli/v11/commands/npm-install/).

The release builder still starts from exact committed API source. It verifies all committed root/API dependency inputs and tool pins, derives an API-root manifest with effective root overrides and a local lockfile from the shared graph, stages only API production dependencies, and records commit/root-lock hash/tool identity in `.release-inputs.json`. The artifact inspector rejects absent runtime dependencies, mismatched installed versions, development packages, escaping paths/links and obsolete Yarn inputs. Remote activation checks the recorded commit before switching `current`; existing checksum, protected shared environment, exact Node path, Linux/Sharp, PM2 readiness and rollback checks remain. All live workflow holds remain unconditional. No API runtime source or Firebase configuration changed.

API dependency auditing now invokes `npm audit --workspace=apps/api --json` from root and summarizes modern npm JSON. Synthetic tests cover clean reports, vulnerability references, malformed output and registry errors; historical Yarn-report summarization remains available. No live audit was executed as a validation substitute.

### Phase 3 local verification

| Check | Result |
| --- | --- |
| Root clean `npm ci --no-audit --no-fund`, then final `npm ci --offline --no-audit --no-fund` after platform completion | Passed with pinned Node/npm; 1,472 packages, standard local Husky prepare enabled, no peer bypass. |
| Focused release inputs/artifact/audit/runtime contract tests | Passed: 4 files / 35 tests; targeted ESLint passed. |
| `npm run ci-pr` | Passed: web lint, 52 files / 280 tests, test build. |
| `npm run validate:api` with local socket access | Passed: API lint, 92 files / 478 tests. The first sandboxed invocation could not bind Supertest listeners (97 failures); the allowed local-socket rerun passed without code/assertion changes. |
| `npm run e2e -- tests/e2e/viteBundle.spec.js tests/e2e/contentRoutes.spec.js tests/e2e/locks.spec.js` | Passed: 10 tests against isolated loopback preview; non-loopback traffic blocked. |
| Separate Functions `npm ci --ignore-scripts --no-audit --no-fund`; `npm --prefix firebase/functions run lint` | Passed: 335 packages and lint. Functions source/lock unchanged. |
| Root production workspace-filtered `npm ci --workspace=apps/api --omit=dev --include-workspace-root=false --ignore-scripts --offline --no-audit --no-fund` in temporary profile | Passed: 386 API runtime packages plus workspace link, no web/root tooling installed. |
| Locally assembled standalone package inspection and Sharp import | Passed: 15,114 tar members; Sharp 0.35.4 loads. Synthetic identity only; this does not claim exact-commit builder or Linux execution. |
| Derived standalone `npm ci --omit=dev --ignore-scripts --offline --no-audit --no-fund` | Passed after adding frozen cross-platform tooling entries: 386 packages. No host installation was performed. |
| Comparable web test-build output | All 475 files byte-identical to Phase 2. Browser builds set an extra synthetic subscription flag; rebuilding with matching flags resolved that expected comparison difference. |
| Workflow/Dependabot YAML and hook shell syntax | All six workflows plus Dependabot parse; both hooks pass `sh -n`. |

The final platform completion changes only lock metadata for absent optional binaries; no locally installed version changed. The complete API suite will run again in Linux CI, followed by production install, exact-commit archive inspection, isolated extraction, syntax checks and native Sharp import. Download and compare that artifact with the prior Yarn Linux artifact before marking Phase 3 complete. No exporter, import, deployment, PM2 operation or live data access occurred. Existing npm deprecation notices and Vite’s large-chunk warning remain visible.

### Phase 3 review boundary

Local implementation is ready for review; **Phase 3 remains in progress until Linux artifact CI passes**. Owner question 9 requests the explicit commit/push authorization required by `AGENTS.md`: preserve the saved Phase 2 relocation as its own commit, commit Phase 3 conversion separately, and push only the final migration branch to the fork for CI. No main/upstream push, PR, merge, deployment or live job is included. Original Phase 2/main source and the frozen API repository remain preserved. Logs, node_modules, tarballs and reports remain temporary/ignored under `/private/tmp/lpu-monorepo-phase3.OS5o0i/`; source/configuration/evidence documents are staged for review.

Owner question 9 approved: “I authorize two local implementation commits and push to `origin`.” Proceed with the exact two-tree review boundary and CI-only migration branch publication; all deployment/live-data holds remain.
