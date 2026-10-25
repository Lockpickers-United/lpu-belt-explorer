# LPU monorepo — implementation plan and progress

Status: In progress (Phase 3 npm workspace conversion and Node alignment)  
Last updated: 2026-10-25  
Project definition: [Monorepo overview and migration plan](monorepo-plan.md)  
Developer report: [Monorepo developer report](monorepo-developer-report.md)

## Project snapshot

**Outcome:** The active web client and API share the `lpu-belt-explorer` repository with independent, verified releases and room for Devvit and LockyJr.  
**Current phase:** Phase 3 in progress — npm conversion, standalone production packaging and Node alignment; Phase 2 remains complete.
**Next action:** Review owner question 9 for separate Phase 2/3 implementation commits and publication of only the Phase 3 branch for Linux API CI. Local npm, lint/test/build/browser and standalone packaging checks pass.
**Overall blocker:** Linux artifact CI awaits explicit candidate commit/push authorization. Production cutover, release-hold removal, host settings and live-data jobs retain separate review/approval gates.

| Phase | Status | Completed |
| --- | --- | --- |
| Phase 0: Baseline and migration decisions | Complete | 2026-10-25 |
| Phase 1: Import the active API and prepare its release artifact | Complete | 2026-10-25 |
| Phase 2: Move the web app and repair web/Firebase paths | Complete | 2026-10-25 |
| Phase 3: Adopt npm workspaces and align Node | In progress | — |
| Phase 4: Integrated validation and development rehearsal | Not started | — |
| Phase 5: Production cutover and old-source retirement | Not started | — |
| Phase 6: Future Devvit and LockyJr onboarding | Not started | — |

Use **Not started**, **In progress**, **Blocked**, or **Complete** for phase status. Mark a phase complete only when its exit criteria have evidence in the developer report. Keep source moves, dependency conversion, and production cutover separately reviewable.

## Phase 0: Baseline and migration decisions

**Status:** Complete  
**Completed:** 2026-10-25  
**Start when:** The overview is available; read-only inspection and planning may begin immediately.

### Summary

Establish a reproducible starting point and a complete migration map before changing either runtime. Treat the current API service as active despite its deprecated repository name. Record every automatic release trigger and persistent-data boundary so the later moves can be verified without contacting live services.

### Findings

- The web package is npm-based and pins Node `v24.15.0`; the API package uses Yarn 4.18.0 and pins Node 24.21.0. `firebase/functions` has a separate npm lockfile.
- The web `Build-N-Deploy` workflow publishes on selected `main` pushes and after `Import`; it also uploads catalog snapshots. The API's manual production workflow packages a repository-root Git archive and Linux `node_modules` for a PM2 release.
- The LockyJr repository tracks `data/*.json`; its import needs a private-data and mutable-state review. No Devvit project has been installed as part of this planning work.
- Local tracked-file inventories and source SHAs for all three repositories, catalog hashes, test-build hashes, and API history triage are captured in [baseline metadata](monorepo-baseline-inventory.json).
- API history contains four historical FTP password-assignment candidates. The owner selected sanitized-history planning in a disposable copy, preserving the source repository. Owner disposition now requires exclusion of the four password-bearing FTP blobs and retention of the placeholder/non-sensitive template and JSON files. Plan rewritten ancestry with a source commit map; import requires sanitation verification.
- Owner answers confirm API source is frozen at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover; Neal Bayless coordinates GitHub/DreamHost settings and release actions. Local API HEAD and working-tree cleanliness were rechecked after the answers.
- The owner authorized the final baseline test gate. Web `npm run ci-pr` passed (52 files / 280 tests plus lint/build); focused Playwright passed (10 tests); API `yarn validate` passed on confirmation (89 files / 444 tests plus lint). Functions lint and paired catalog validation had already passed.
- The first API run was blocked by sandbox permissions. With local test permissions, one multipart cleanup test failed; the focused file (7 tests) and one full confirmation then passed. Record this as an observed intermittent baseline failure, not a migration regression or a diagnosed/fixed bug. No runtime source or assertion was changed.

### Tasks

- [x] Record source commit IDs, working-tree state, repository/remotes, tracked-file lists, and release authorities for web, API, and the future bot. Review tracked files and API history for credential or private-data exposure before any history-preserving import; decide how to handle any finding before importing it.
- [x] Inventory package scripts, local path assumptions, `.gitignore` behavior, API/Firebase/web contracts, generated artifacts, and persistent runtime state. Include Vite, Vitest, Playwright, Firebase CLI, PM2, cron, SFTP, Pages, `Import`, catalog publishing, and GitHub environment settings by **name only**.
- [x] Run safe local baselines: `npm run ci-pr` and relevant focused browser checks for web, `yarn validate` for API, and `npm --prefix firebase/functions run lint`; record exact Node/package-manager versions and results. Do not run `ci-build`, exporters, credential-dependent checks, or live services as a baseline shortcut. **2026-10-25 final gate:** explicitly authorized by the owner and executed; exact commands, results, permission retries and the intermittent API failure are recorded in the developer report.
- [x] Confirm the destination repository, `apps/api` and `apps/web` layout, the source-commit/freeze-or-sync strategy during migration, the API history-import method, and the sequence for transferring release authority. Record decisions and alternatives in the developer report.
- [x] Define an offline API artifact inspection and a web publish dry run that cannot publish to Pages or upload snapshots; identify which real development and production checks require separate authorization.

### Exit criteria

- [x] The developer report contains the source SHAs, path/trigger inventory, safe baseline results, known gaps, and named owners for external settings and release actions.
- [x] The history and tracked-file review has an explicit import disposition; no unresolved secret/private-data finding is silently carried into the destination Git history.
- [x] The release sequence states how the existing web auto-publish and the old API workflow stay controlled while both repositories exist.

### Open issues for next phase

- Track the observed API multipart cleanup instability at `src/projects/multipartEndpoints.test.js:237`. Do not conceal the initial failure or modify the frozen API source as part of baseline capture.
- Apply the owner-directed four-blob FTP history scrub in a disposable copy and verify every reachable candidate ref before importing. Retain the owner-reviewed `.env.example` and 33 inventoried JSON paths. Rewritten ancestry plus an original-to-rewritten commit map replaces original-SHA reachability; raw flagged history must remain outside the destination.
- Preserve the confirmed API freeze at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover. Check HEAD and working-tree cleanliness before sanitation, import and cutover; stop on drift and ask Neal before changing the agreed source SHA.
- Determine whether the new repository has the same protected `production` environment, secrets, variables, and required reviewers. Record names and ownership without copying values.

### Open issues for later phases

- Select a common Node 24 patch after verifying the API host and CI support (Phase 3).
- Determine Devvit policy/coverage gates and LockyJr data/runtime readiness before their onboarding (Phase 6).

## Phase 1: Import the active API and prepare its release artifact

**Status:** Complete  
**Completed:** 2026-10-25  
**Start when:** Phase 0 exit criteria pass, the frozen source SHA is verified, and the owner-directed sanitation rules are ready for implementation. Import itself additionally requires verification that the four flagged blobs and their sensitive content are absent from candidate reachable history.

### Summary

Import the active API under `apps/api` with inspectable history. Keep its Yarn package and production behavior intact while changing only the paths and automation needed to validate it from the monorepo. The old repository remains the production release authority during this phase.

### Findings

- Imported the verified 176-commit frozen ancestry under `apps/api` on isolated branch `monorepo/phase1-api`, merge `fd2daca185393fe72737ad4083cc398f989c6e84`. Four excluded blobs and their password content are absent from candidate reachable history; the import tree matches frozen source. Metadata and original-to-rewritten map are in `monorepo-api-history-verification.json`.
- Root API CI, disabled candidate production workflow, app-root artifact tooling, hook/Dependabot routing and operational references are committed and published at `22ec5c9fef8871aefa678eefe9bbedb0d695285a` on the isolated migration branch; completion evidence is staged locally after the run. The old API repository remains untouched and release authority is unchanged.
- API full validation passed (90 files / 464 tests); web `npm run ci-pr` passed (52 files / 280 tests, lint and test build). Structural archive inspection passed (18,723 members), extracted entry/job syntax passed and Sharp loaded on macOS. Final API CI passed on Ubuntu 22.04 with 464 tests, production dependency focus, a 15,163-member artifact and extracted Sharp loading. Its downloaded checksum and all 367 tracked API source files were verified. A fresh web install/checkout also passed `npm run ci-pr` (280 tests, lint and test build). [CI run](https://github.com/mgsecure/lpu-belt-explorer/actions/runs/40212524559). Phase 1 is complete.

### Tasks

- [x] Perform the reviewed history-preserving import in an isolated worktree; confirm reviewed source commits are reachable and `apps/api` history is traceable. Under the selected sanitized-history plan, these are rewritten commits with an original-to-rewritten map; original sensitive history must not become reachable. Exclude local credentials, environment files, installed dependencies, logs, and runtime state.
- [x] Update root and API `AGENTS.md`, API operational references, CI, Dependabot, and scripts that assume the API is at Git root. Move active API workflows to root `.github/workflows/`; keep the new production workflow manual and unable to create a duplicate live release before cutover.
- [x] Make the API package's path the root of its deploy artifact, retaining matching Linux dependencies, Sharp load check, environment-file link, PM2 entry point, `current`/`releases`/`shared` separation, readiness check, and rollback. Test artifact contents and script syntax offline; do not run export jobs.
- [x] Define WebStorm SFTP and cron path changes for the eventual server switch, with a rollback to the existing release. Compare the API's public routes and checked-in fixtures before/after import.
- [x] Run API `yarn validate`, artifact validation, and web `npm run ci-pr` on the imported tree; document any pre-existing versus migration failures.

### Exit criteria

- [x] A clean checkout validates both apps; API source history and runtime package contents are independently reviewable.
- [x] The candidate API workflow has equivalent manual approval, exact-commit identity, readiness, and rollback behavior, with no live deployment from this phase.
- [x] The old API repository still owns production releases, the source freeze is verified, and any owner-approved freeze exception has an explicit review/synchronization disposition.

### Open issues for next phase

- Update web paths and publish triggers without releasing from an unapproved `main` merge.

### Open issues for later phases

- Transfer production environment settings and release authority only during Phase 5.

## Phase 2: Move the web app and repair web/Firebase paths

**Status:** Complete  
**Completed:** 2026-10-25  
**Start when:** Phase 1 API import and independent CI/artifact checks pass.

### Summary

Move the web package to `apps/web` and add a private root coordinator. The API remains a separate Yarn installation for now, and `firebase/functions` remains a separate npm package. Keep site output and API catalog inputs equivalent.

### Findings

- Use a private root coordinator with only `apps/web` in npm workspaces; preserve API Yarn and the separate Functions package. Keep tracked environment files at root and configure explicit env-directory resolution, avoiding secret ownership changes. Candidate publishing/import/upload jobs are unconditionally disabled before path edits.

- Root npm clean install and `ci-pr` passed (280 tests, lint/build), API Yarn validation passed (464 tests, lint), Functions lint and relocated Web SDK emulator check passed. Browser checks passed 10/10 after adding a synthetic version fixture for clean worktrees; console/network assertions remain strict.
- All 475 clean build files match Phase 1 and common Phase 0 hashes; the 24 additional Phase 0 files were untracked local/generated extras. Seven catalog hashes and 11 local copied snapshots match their sources. Dependency graph versions/integrity are unchanged across all 1,020 existing lock entries. See [Phase 2 verification](monorepo-phase2-verification.json).
- Implementation is staged on isolated `monorepo/phase2-web`, uncommitted/unpushed. Candidate hold/path audit covered pushes, shared lock changes, Import commits/completions and manual dispatch; no deployed workflow changed.

### Tasks

- [x] Move web source, public assets, tests, scripts, package/config files, and generated-file ownership with Git history intact. Establish a root npm workspace for web only; update root developer commands and references.
- [x] Repair Vite, Vitest, Playwright, Firebase emulator/config, Pages, and catalog path assumptions. Keep Firebase CLI configs at `firebase/` and Functions packaging independent.
- [x] Update root workflows for app paths and required shared paths. Prove web moves, root lockfile changes, `Import` commits, and `workflow_run` events cannot silently publish or upload snapshots during migration; preserve the later intended automatic-release behavior.
- [x] Compare test build output and catalog artifact hashes with the Phase 0 baseline; validate web/API URL and classification-catalog contracts with synthetic data.
- [x] Run `npm run ci-pr` through the new root command, relevant Playwright journeys, and Functions lint plus any emulator checks justified by actual Firebase path changes. Do not dispatch `Import` or a live publish as validation.

### Exit criteria

- [x] Clean install, lint, unit tests, test build, and relevant browser tests pass from the documented new paths.
- [x] Workflow/path review establishes that the web release will occur only under the intended approval and trigger conditions; catalog uploads still use verified artifacts for each API environment.
- [x] API Yarn validation and Firebase Functions lint still pass independently.

### Open issues for next phase

- Convert API dependencies and resolve any package/Node version divergence in Phase 3.

### Open issues for later phases

- A `main` merge that triggers Pages publication or snapshot upload belongs to the approved release sequence in Phase 5.

## Phase 3: Adopt npm workspaces and align Node

**Status:** In progress  
**Completed:** —  
**Start when:** Phase 2 paths and independent checks are stable.

### Summary

Add `apps/api` to the root npm workspace and pin a common Node 24 patch. Change dependency management separately from file relocation so lockfile or native-module regressions can be identified.

### Findings

- Selected common Node is the API’s existing 24.21.0; npm 11.19.0 is installed with it. Owner question 8 confirms the API host provides v24.21.0. Preserve the existing production versions while converting Yarn to npm, and retain a self-contained API package despite workspace dependency layout.

### Tasks

- [x] Verify the API host's available Node patch, choose a supported Node 24 patch for root/CI/PM2/cron, and pin the npm release used by CI. Update docs and host-path checks together.
- [x] Convert the API Yarn graph to the root `package-lock.json`; move required Yarn `resolutions` to root npm `overrides`. Review hoisting, peer dependencies, native Sharp resolution, package scripts, and the complete lockfile diff. Remove API Yarn files only after reproducible installs pass.
- [x] Use root `npm ci` and app-targeted scripts in CI while keeping Functions on its own lockfile. Ensure API production packaging includes only needed runtime files and dependencies and still supports rollback.
- [ ] Run full web/API lint and tests, web test build, relevant browser checks, and offline Linux API artifact validation; compare the resolved production dependency tree with the prior Yarn artifact.

### Exit criteria

- [x] A clean checkout with the pinned Node/npm completes root `npm ci` and app-targeted validation; separate Functions install/lint remains valid.
- [ ] API native dependencies load in the release artifact on the target platform, and the artifact remains self-contained under the existing runtime directory contract.
- [ ] The developer report records material dependency changes and their checks; no unreviewed lockfile or runtime drift remains.

### Open issues for next phase

- Rehearse the complete release and cross-component contracts in development.

### Open issues for later phases

- Do not assume Devvit or LockyJr can join the same workspace until their own packaging/runtime review.

## Phase 4: Integrated validation and development rehearsal

**Status:** Not started  
**Completed:** —  
**Start when:** Phase 3 clean installs and CI pass; development deployment inputs and permission are available.

### Summary

Prove that the monorepo can build, package, and operate each component without changing production. This is the gate for proposing an exact production cutover.

### Findings

- None yet.

### Tasks

- [ ] Run web/API/Functions checks from a clean checkout and contract tests for `/api/v1`, catalog loading, and Firestore change-index consumers using mocks or emulators. Run relevant Playwright journeys under the test-mode network restrictions.
- [ ] Exercise API artifact construction, checksum, PM2 readiness, failure rollback, and cron command/path preflight against an authorized development target; keep development shared data outside releases. Confirm no duplicate scheduled job runs.
- [ ] Verify web build and catalog outputs without invoking the production `Build-N-Deploy` or `Import` workflows. Rehearse release ordering, exact commit mapping, environment settings by name, and rollback steps.
- [ ] Record the development evidence, gaps, and final production runbook in the developer report; obtain human review of workflow triggers, protected environments, and external data effects.

### Exit criteria

- [ ] Development API health and a representative web/API journey pass on the monorepo artifact; API rollback is demonstrated or an explicitly reviewed equivalent rehearsal is documented.
- [ ] CI checks are green, release contents and catalog hashes are recorded, and a production cutover/rollback runbook is reviewable.
- [ ] No production release or live-data exporter was used as a test shortcut.

### Open issues for next phase

- Obtain explicit approval for each production deployment, automatic site publish path, live-data action, and production cutover step before execution.

### Open issues for later phases

- None.

## Phase 5: Production cutover and old-source retirement

**Status:** Not started  
**Completed:** —  
**Start when:** Phase 4 exit criteria pass and the exact external actions have the required approval.

### Summary

Make the monorepo the sole release source while preserving the current public URLs and API rollback path. Retirement follows observation; it is not part of the initial activation.

### Findings

- None yet.

### Tasks

- [ ] Confirm protected environment reviewers, named settings, exact source SHA, artifact hashes, and approved order. Prevent both repositories from deploying or scheduling the same workload concurrently.
- [ ] Release the API and site in the approved order. Verify PM2/HTTPS readiness, representative authenticated API behavior, catalog content, Pages output, and a browser journey; monitor exports and scheduled jobs without running an extra live job unless separately approved.
- [ ] Keep the previous API release and original repository available through the agreed observation period. Exercise the written rollback procedure if a gate fails; record the actual release IDs and results.
- [ ] Once stable, disable old release workflows and duplicate schedules, archive the old source repository as appropriate, and update operational docs, branch protection, Dependabot, ownership, and onboarding.

### Exit criteria

- [ ] One repository owns each production release and scheduled job; deployed versions correspond to reviewed monorepo commits.
- [ ] Site, API, catalog, and Functions contracts work in production; rollback candidates remain available for the agreed period.
- [ ] The report records approvals, exact release evidence, remaining follow-up, and old-source retirement status.

### Open issues for next phase

- None; future-app onboarding has separate readiness gates.

### Open issues for later phases

- None.

## Phase 6: Future Devvit and LockyJr onboarding

**Status:** Not started  
**Completed:** —  
**Start when:** The core monorepo is stable; each future app's own feasibility and data review permits import or creation.

### Summary

Add the planned apps as isolated build and release units. Their repository placement does not approve Reddit account linking, data transfer, bot deployment, or live moderation actions.

### Findings

- None yet.

### Tasks

- [ ] Create `apps/devvit` with its project-local `devvit.json`, CLI, build artifact, tests, and scoped CI. Complete the bounded Reddit-native proof of concept and the policy/coverage gates in the [Devvit review](devvit-belt-request-plan-review.md) before LPU account-link integration.
- [ ] Audit LockyJr's tracked files and Git history, runtime version, mixed module usage, untracked `keys/` and config requirements, mutable `data/`, and deployment process. Import under `apps/discord-bot` only with an explicit private-state layout and validation baseline.
- [ ] Decide separately whether either app benefits from npm workspace membership or a pure shared `packages/award-domain` contract. Keep app credentials, CI triggers, and publish approvals independent.

### Exit criteria

- [ ] Each admitted app has an isolated install/build/test/release process and documented data and credential boundaries.
- [ ] No Devvit external integration or bot production action is claimed complete without its separate approval and observed verification.

### Open issues for next phase

- None.

### Open issues for later phases

- None.
