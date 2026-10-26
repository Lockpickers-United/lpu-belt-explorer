# Phase 0: Baseline and migration decisions
Status: Phase 0 complete (2026-10-25)

## Answered questions

All four questions have owner answers, incorporated into the developer report and implementation plan. API source is frozen, Neal Bayless coordinates external settings/releases, and migration history must scrub the flagged password-bearing versions while retaining the owner-reviewed template and JSON files. Sanitized-copy verification remains required before import.

### 1. Freeze API changes or synchronize continued work?

Can API source changes pause at `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` until cutover, or should migration allow continued API development with an explicit final sync?

- **Recommended:** Continue API work; record and review later commits, then synchronize them before cutover.
- **Alternative:** Freeze API source at the recorded commit until cutover.

This determines how changes made after the baseline reach the monorepo. A freeze simplifies synchronization but pauses API development.

**Owner answer:** Freeze API source at the recorded commit until cutover.

### 2. Who owns external settings and release coordination?

May I record Neal Bayless as coordinating owner for GitHub environments/required reviewers, Pages settings, and DreamHost PM2/cron/WebStorm SFTP settings, with actual settings verification still pending? If separate people own these areas, please name them and their responsibilities.

- **Proposed:** Neal Bayless coordinates GitHub and DreamHost settings and release actions.
- **Alternative:** Assign separate GitHub and host owners.

Local files cannot establish the effective hosted settings or their owners. This assignment does not authorize a settings change or deployment. The settings checklist is in the [developer report](monorepo-developer-report.md#release-triggers-settings-and-authority); only setting names, never secret values, are needed.

**Owner answer:** Neal Bayless coordinates GitHub and DreamHost settings and release actions.

### 3. How should the historical credential finding affect API import?

The local API history contains potential literal FTP passwords in four historical blobs of `src/projects/logAnalysis/ftpFetchGodaddy.cjs`. Should Phase 1 use a sanitized history copy that preserves commit structure but rewrites commit IDs, subject to your credential-disposition review?

- **Recommended:** Plan sanitized history in a disposable copy; hold import until credential and private-data review is resolved. Leave the source repository unchanged.
- **Alternative:** Keep import on hold while you investigate before choosing a history method.

Sanitation would preserve reviewed ancestry with an original-to-rewritten commit map. Keeping the flagged original commits reachable would also retain their sensitive blobs. Removing a file from the current tree alone does not remove its history.

The [developer report](monorepo-developer-report.md#tracked-file-and-history-review--import-disposition) contains paths, blob IDs, line numbers and related commit IDs; no credential values are included. Please confirm the finding's disposition and who owns any required credential retirement or remediation, without entering credentials here. API JSON/template provenance was also part of the review; its disposition is now recorded in question 4.

**Owner answer:** Plan sanitized history in a disposable copy; hold import until credential and private-data review is resolved. Leave the source repository unchanged.

### 4. What is the disposition of the flagged credentials and tracked data?

The owner supplied the disposition below. The original review scope and current-versus-historical clarification are retained for reference. No credential values or private records are included.

**Current files versus history:** Verified against frozen API commit `2fa33cfbe0ba5376ca0ad503bc528164ebf33194` using Git object/path checks, without displaying file contents.

| Review item | Where it exists |
| --- | --- |
| `src/projects/logAnalysis/ftpFetchGodaddy.cjs`, containing the four flagged password-assignment versions | **Historical commits only.** The file is absent from the current frozen tree. Those older blobs would still enter an unchanged history import. |
| All 33 JSON paths in `api.data_review_paths` | **Current tracked files** at the frozen commit. These include `src/api/requirements/current-json-files/*`, `src/api/requirements/samples/*`, collection/evidence fixtures under `src/data/`, and Reddit data under `src/projects/redditBelts/data/`. Historical versions also need review if their ancestry is imported. |
| API `.env.example` | **Current tracked template**, with 10 historical blob versions identified by the inventory. Its contents were excluded from the original credential-pattern scan, so the filename list is not template clearance. |

“Current” means present in Git at the frozen commit; it does not establish that a file is actively used in production or contains private data. The JSON/template review is a provenance question, not a finding that all those files contain secrets.

- **Historical FTP credentials:** Were the flagged assignments real credentials, and have any required retirement/rotation actions been completed? Alternatively, record that they must be treated as sensitive and excluded from the sanitized history while remediation remains tracked separately. Identify the responsible reviewer if different from Neal Bayless.
- **API tracked data and templates:** Which paths are confirmed synthetic/public and may be retained, and which require removal or replacement with synthetic fixtures? The [baseline inventory](monorepo-baseline-inventory.json) lists all 33 JSON data/sample paths under `api.data_review_paths`, the field-name candidates under `api.private_data_triage`, and historical `.env.example` candidates. A path or path group plus its disposition is sufficient; do not paste contents. Unknown provenance remains on hold.

This answer determines the sanitation rules and which runtime/test fixtures need replacement. The selected method alone does not clear the flagged content. Local review and planning can continue; no import or external remediation will run based on silence.

I can provide more detail on the path list or review criteria if needed.

**Owner answer:**

- Versions of `src/projects/logAnalysis/ftpFetchGodaddy.cjs` with password should be scrubbed from the history.
- `.env.example` only contains placeholder data.
- The JSON files in `src/api/requirements/current-json-files/`, `src/api/requirements/samples/`, `src/data/` and `src/projects/` contain either placeholder data or non-sensitive information.

**Recorded disposition:** Exclude the four identified password-bearing historical blob versions from the disposable migration history. Retain `.env.example` and the 33 inventoried JSON paths based on the owner's provenance confirmation. Preserve original source and refs. Before import, verify the flagged blobs and password content are absent from all candidate reachable history and retained files match the frozen source. No credential retirement/rotation is claimed by this answer.

## Status

Phase 0 is complete as of 2026-10-25. Questions 1–3 are resolved: freeze the recorded API commit until cutover; Neal Bayless coordinates GitHub/DreamHost settings and release actions; plan sanitized history in a disposable copy while preserving the source repository. Question 4 resolves the content disposition: scrub the flagged FTP history and retain owner-reviewed template/JSON data. No owner question remains unanswered; sanitation implementation and verification are still pending. The owner authorized the final baseline gate: web CI and 10 browser checks passed; API full validation passed on confirmation after an intermittent multipart cleanup failure, which is recorded in the developer report. No source rewrite, import, hosted settings change, or deployment has been performed.

# Phase 1: API import and release artifact

## 5. Local history-import merge commit

**Resolved (2026-10-25).** Phase 1 requests a history-preserving import in an isolated worktree, which requires a local merge commit. The repository policy prohibits commits unless requested. Please authorize that specific merge commit on a migration branch, or choose to leave the verified sanitized history and import files prepared with the merge pending. Implementation changes will remain uncommitted for review. No push, pull request, or deployment is requested or authorized by this question.

**Owner answer:** “For owner question **5. Local history-import merge commit**, I authorize the local merge commit.”

Authorization is limited to the local history-import merge commit. Implementation changes remain uncommitted for review; no push, PR, deployment or live-data action is authorized.

## 6. Linux release-artifact gate

**Clarified; no owner decision required.** The owner asked whether this check is necessary given that the original API repository is unchanged. The frozen source and runtime behavior remain unchanged, but Phase 1 changes the artifact boundary, packaging script and workflow working directories. The Linux check verifies that the new monorepo archive has the required API files and matching Linux production dependencies, and that Sharp loads after extraction. It does not require access to the original API repository or a running API host.

The prepared root `api-ci.yml` already supplies the Linux x64 runner. A separate owner-provided Linux environment is unnecessary. Withdraw the environment-choice request and retain artifact validation as a normal Phase 1 CI gate when the implementation reaches authorized CI review. Existing commit/push/PR authorization boundaries still apply; this clarification authorizes none of those actions.

**Owner follow-up:** “For question 6, no changes have been made to the api repo, is that check really neccessary?”

**Disposition:** The environment-choice request was withdrawn. The owner subsequently authorized CI and branch publication in question 7. Linux API CI and fresh web checkout gates passed; Phase 1 is complete. No owner response remains pending.

## 7. Publish the exact candidate branch for authorized CI

**Approved.** The owner authorized the CI test. The candidate and its new workflow are still local. GitHub manual dispatch requires the workflow on the default branch, so the prepared alternative is a CI-only push trigger on the exact `monorepo/phase1-api` branch. No merge or PR is needed.

May I create one implementation commit from the reviewed staged Phase 1 candidate and push only `monorepo/phase1-api` to `origin` (`mgsecure/lpu-belt-explorer`) to run API CI? AGENTS.md explicitly requires authorization for commits and pushes; question 5 authorized only the local import merge. This request excludes pushes to main/upstream, tags, merges, PRs, deployments and live-data jobs. The new API production deploy job remains unconditionally disabled.

**Owner answer:** “I approve” in response to question 7. Authorized: commit the staged Phase 1 implementation and push only `monorepo/phase1-api` to `origin` to trigger API CI. No main/upstream/tag push, merge, PR, deployment or live-data job is authorized.

## Phase 1 outcome

Question 7’s approved commit/push completed: implementation `22ec5c9fef8871aefa678eefe9bbedb0d695285a` is on `origin/monorepo/phase1-api`. [API CI passed](https://github.com/mgsecure/lpu-belt-explorer/actions/runs/40212524559), including Linux packaging and extracted Sharp loading. Fresh web checkout validation also passed. No main/upstream/tag push, PR, merge, deployment or live-data action occurred. Phase 1 is complete and no owner question is pending. Final completion evidence is staged locally; no additional commit/push was made beyond the approved candidate publication.

# Phase 2: Web relocation and path repair

**Status:** Complete; no owner response is needed. Routine path decisions preserved root environment/credential ownership and unchanged Firebase/Functions roots, kept API on Yarn, and used a web-only root npm workspace. Candidate live publication/import/upload jobs remain held. All local phase gates passed; the clean-worktree browser fixture gap and correction are recorded in the developer report.

Phase 2 implementation/evidence is staged on `monorepo/phase2-web`. No Phase 2 commit, push, PR or hosted CI was requested or performed; earlier approvals apply only to Phase 1. Further publication or release actions retain the repository’s explicit authorization requirement.

# Phase 3: npm workspaces and Node alignment

## 8. Confirm API host Node availability

**Resolved.** The existing API pin, cron documentation and successful Linux CI artifact use Node 24.21.0; the web/root currently uses 24.15.0. Proposed common runtime: **24.21.0**, preserving the API host’s documented target and avoiding a speculative host upgrade. Pinned npm candidate: **11.19.0**, verified with the existing Node 24.21.0 installation; the previous web toolchain used npm 12.0.2. No global npm update is needed.

Please confirm the `node --version` supplied by the development and production `REMOTE_NODE_BIN` directories (version output only; no secrets or environment dumps). If both provide v24.21.0, that satisfies the Phase 3 host-availability gate. No host access, binary installation, restart, deployment or live job is requested here. Local graph/package work continues with 24.21.0 as a provisional candidate; the phase cannot claim host verification from local/CI evidence alone.

**Owner answer:** “For owner question **8. Confirm API host Node availability**, the API host reports `node --version v24.21.0`.”

Node 24.21.0 availability is confirmed by the owner. Select it as the common pin with npm 11.19.0. No host change or connection was performed. The existing exact `REMOTE_NODE_BIN` runtime check remains required before deployment activation.


## 9. Publish the Phase 3 candidate for Linux artifact CI

**Approved.** Question 8 is resolved and local Phase 3 checks pass: root clean install, web/API lint and 758 combined unit tests, ten browser checks, separate Functions install/lint and standalone production packaging with Sharp. The remaining phase gate is the exact committed Linux artifact, using the prepared CI-only branch trigger.

Please authorize two local implementation commits (the saved Phase 2 relocation tree, then the reviewed Phase 3 npm/Node conversion) and a push of **only `monorepo/phase3-npm` to `origin` (`mgsecure/lpu-belt-explorer`)** to run API CI. Separate commits preserve the planned review boundary between moving files and converting dependencies. The local candidate is `/private/tmp/lpu-monorepo-phase3.OS5o0i/worktree`; the saved Phase 2 tree is `1a144beadad25f36f76f5d25a0ce3b41f5094c5e` and its original worktree is preserved.

Root `AGENTS.md` explicitly says “Never commit, push, deploy, or open a PR unless asked.” Question 7 covered only Phase 1, so this needs a new authorization. This request excludes main/upstream/tag pushes, PRs, merges, deployment, live-data jobs and release-hold removal. CI installs/tests and constructs an offline archive on a Linux runner; it does not connect to the API host. More detail is available in the developer report and Phase 3 verification metadata.

**Owner answer:** “I authorize two local implementation commits and push to `origin`.” Authorized scope is the two Phase 2/3 implementation commits and only `monorepo/phase3-npm` publication described above. No other branch, PR, merge, deployment or live job is authorized.

**Publication checkpoint:** The two approved commits were created and only `origin/monorepo/phase3-npm` was pushed. Phase 3 candidate: `2725290cb7ddfa284113f7bb570992e9986fe6b0`. API CI run 40230235649 is in progress. No additional owner response is pending.


## Phase 3 outcome

Question 9’s approved two commits and branch push completed: Phase 2 `f64e7fc73672e014cff9227b9ecf841b02f05cba`, Phase 3 `2725290cb7ddfa284113f7bb570992e9986fe6b0`, published only to `origin/monorepo/phase3-npm`. [Linux API CI passed](https://github.com/mgsecure/lpu-belt-explorer/actions/runs/40230235649). The downloaded release artifact passes checksum/identity/archive validation, has exactly the same 386 production dependency locations/versions as the prior Yarn artifact, and passed extracted Sharp loading on Linux. All local phase gates also passed. **Phase 3 is complete; no owner response is pending.** Completion evidence is staged locally, with no additional commit/push. No PR, main/upstream/tag push, merge, deployment or live-data job occurred; all candidate release holds remain. Phase 4 is not started.


# Phase 4: Integrated validation and development rehearsal

## 10. Development rehearsal target

**Resolved — existing development target selected.** The owner selected the existing api-dev directory and port for rehearsal. The original target-choice question follows for context: prepare an isolated local rehearsal with synthetic state, or a DreamHost development-target procedure? Phase 4 requires API health, a representative web/API journey, activation and rollback evidence. Existing operational guidance separately gates host rehearsal; no deployment, restart, settings change, live data read or job run is authorized merely by starting Phase 4.

The default proposal is an isolated local rehearsal; feasibility must respect the server's Firebase initialization contract and the Linux-only native artifact. A local mock is not evidence of DreamHost PM2 readiness or Linux activation. Alternatively prepare DreamHost development deployment using `api-dev.lpubelts.com`, port `10081`, PM2 `lpubelts-api-server-dev`, and `/home/lpubelts_api/apps/api-server-dev`, with shared state outside candidate releases. Confirm these target names and the protected `REMOTE_NODE_BIN` directory without sharing credentials.

The concrete procedure will be prepared before requesting any activation authorization. Independent offline validation continues. I can provide more details on scope and tradeoffs. No production action, live-data job, cron execution or release-hold removal is included.


**Prepared evidence for question 10:** Clean-checkout web/API/Functions, emulator contracts and ten browser journeys pass. The [runbook](monorepo-phase4-runbook.md) describes both options and the proposed development procedure for review. Seven stubbed shell scenarios pass; real PM2 readiness and supported-Linux checksum rejection remain pending. Development uses mutable `current-dev`, not production's `current` symlink. For DreamHost, confirm separate temporary process/port versus replacing development, protected Node directory and access method (names only). Concrete commands and exact activation approval follow these choices. Hosted reviewer/settings/trigger and duplicate-schedule review remains necessary. No deployment has run.


**Owner answer (2026-10-25):** “For owner question **10. Development rehearsal target**, can you use the existing api-dev directory and port? It is not currently in use.”

**Disposition:** Use `/home/lpubelts_api/apps/api-server-dev/current-dev`, port `10081`, and `lpubelts-api-server-dev`; preserve the existing mutable directory layout and shared state. No alternate port/process or symlink conversion is needed. Target selection is resolved. Read-only preflight through the existing `lpubelts-dev-inspect` SSH alias confirms Linux x64, Node v24.21.0, readable development environment/PM2 declaration and the existing directories.

## 11. Replace the running development process for rehearsal

**Approved — ongoing project authorization.** Preflight found port `10081` listening and PM2 `lpubelts-api-server-dev` **online**, using the expected `current-dev` cwd and entry point. “Not currently in use” may mean no one is using the running service. No process was stopped or replaced.

Please confirm that the running development process may be stopped/replaced for this rehearsal. Proposed operations: upload and verify the exact Linux candidate archive (`2725290cb7ddfa284113f7bb570992e9986fe6b0`, SHA-256 `8af03b10d7ed883ec08391e0b191c4f589229186874eeb41cc9c85c79c0a3206`); stage outside `shared`; preserve the entire previous `current-dev` source/dependencies by rename; activate the candidate at that same path; start/restart only `lpubelts-api-server-dev` on port `10081`; verify development readiness and approved API reads; demonstrate failed-candidate rollback and restore the previous development arrangement. Preserve protected shared state and keep IDE uploads paused during replacement.

The [runbook](monorepo-phase4-runbook.md#existing-development-target--concrete-replacement-sequence) gives the concrete replacement/recovery sequence. Protected configuration must pass the development-only checks before startup; stop and report any production database, enabled side-effect integration or absent development fixture. Authenticated/private-data checks still need an approved test account/access method and must not be improvised. No production action, live exporter, manual cron execution, shared-data replacement, PM2 save, or workflow-hold removal is included. AGENTS.md requires explicit deployment authorization; the observed running process makes the service interruption worth confirming. I can provide further detail if needed.


**Owner answer:** “yes, you can interrupt that development process for replacement and rollback rehearsal whenever needed for this project.”

**Authorization:** Ongoing authorization to interrupt/replace/recover the selected development process for this project; do not ask again for those operations. Preserve previous source/dependencies and protected shared state. Production releases, live exporters, manual cron execution and unrelated external writes remain outside scope. Proceed with question 11's concrete development rehearsal.


## 11 outcome — real development rehearsal completed

The corrected full activation/failure/rollback cycle passed all 25 gates on Linux. Original development `current-dev`, integration settings and `local-development` readiness identity are restored; selected protected shared files are unchanged. The report retains the earlier staging/harness/restoration failures and their corrections. Continuing project authorization remains valid; no repeat approval is needed for in-scope development interruption/rehearsal. Production/live-export/cron/publication gates remain separate.

## 12. Phase 4 evidence and final review

**Resolved — Phase 4 review complete.** The owner asked whether they must run UI tests and whether the listed review areas reflect changed procedures. They do not need to execute the automated tests. The agent owns building/running the remaining integrated browser check and gathering/reporting deployment-setting evidence where access permits.

### Browser journey — agent runs it

Proposed representative journey: open an owner-designated development test member's public profile in the monorepo web build, point its API calls at the exact candidate on `api-dev`, and verify that the summary renders correctly. Continue verifying anonymous private-profile access is denied. Locks browsing alone primarily exercises bundled data and does not establish this web/API contract.

The requested fixture has now been supplied and the proposed public-profile journey passed; no further profile input is needed. The original fixture requirement was a safe development test profile ID/name with expected public summary data. No password or token is needed for the public-profile journey. If an authenticated journey is preferred, the owner may need to complete interactive sign-in in a development browser; the agent can perform the subsequent checks. Manual test execution by the owner is optional. No production site switch or write is required. Existing authorization covers reactivating/recovering the development candidate as needed.

### What changed, and what the review means

No production release procedure, GitHub protection, cron schedule, hostname or port was changed during Phase 4. Earlier monorepo implementation changes are confined to the candidate branch; actual old release authority is unchanged. The review checks that existing operational controls survive that migration, plus the explicit transfer needed in Phase 5. It does not ask the owner to invent a new deployment process or approve unspecified external actions.

| Area | Existing behavior / migration change | Evidence or owner decision needed |
| --- | --- | --- |
| GitHub environment protection | API workflow names `production`, checks main, and uses the existing approval model. Web uses `github-pages`. Workflow YAML does not prove the hosted reviewer/branch rules. | Confirm existing reviewers and deployment branch restrictions carry over to the actual monorepo release repository. Preserve the intended main-only production release; no new reviewer policy is proposed. The agent should inspect metadata where available and ask only for inaccessible confirmation. |
| API setting names | The new repository's API workflow needs `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `DEPLOY_ROOT`, `REMOTE_NODE_BIN`, `PM2_APP_NAME`, `HEALTHCHECK_URL`; secrets `SFTP_PRIVATE_KEY`, `SFTP_KNOWN_HOSTS`. | Confirm the names exist in the destination `production` environment and privately map to the intended existing production target. Repository environment settings/secrets do not automatically transfer with source. Never paste secret values into this document. |
| Web/Import setting names | Preserve `github-pages` SFTP names, `DEPLOY_ROOT`/`DEPLOY_ROOT_DEV`, existing `VITE_*` build settings including `VITE_CLASSIFICATION_WRITE_STAGE`; Import uses `GOOGLE_SHEET_ID`/`RAFL_SHEET_ID`. | Check names and intended target ownership, including distinct dev/prod snapshot roots. No credential rotation, stage promotion or target change is requested. Full inventory remains in the developer report. |
| Workflow triggers and release authority | Web retains intended main-push/manual/successful-main-Import publication; Import is manual-only and auto-commits generated changes. API production remains a manual main-only release. Candidate live jobs are temporarily held unconditionally. API deployment source will move from the old repository to the monorepo. | Phase 5 must disable old API dispatch authority/check in-flight runs, then enable the reviewed monorepo job. Restore the web's successful-main-only conditions when removing holds. Review the exact release-control diff before execution. No hold removal or authority transfer happened in Phase 4. |
| Catalog publication effects | Existing site workflow publishes Pages, then uploads seven snapshots to both production and development APIs. This is pre-existing behavior; monorepo changes repair source/output paths. | Confirm an approved site release still includes both catalog destinations and the Pages-before-catalog compatibility window. This phase did not publish the site or replace shared catalogs. |
| Production-output gap | Test-mode output is verified: 475 common files and seven source catalog hashes match. The subsequent local generator comparison verified 2,275 CSV/HTML/Markdown/copied outputs plus three version/sitemap files. Vite production-mode compilation and effective release build settings are not thereby certified. | This is remaining validation work for the agent before release, not a new owner procedure or a request to waive checks. Prepare/inspect safe generation separately; do not run Import or live exporters as a shortcut. |
| Cutover and rollback | Preserve host paths/public URLs, shared-state separation, exact artifact identity and API readiness/rollback. Transfer source authority, activate compatible API, then release the approved web/catalog set. | Review that order and recovery scope. API rollback restores the prior source/dependency release; it does not restore Pages or catalogs. Those need their own retained artifacts and explicitly approved restore actions. Keep active plus two API rollback candidates and agree on the observation period before old-source retirement. |

### Narrow owner input still needed

The designated test profile and public browser journey are complete. Remaining owner review is confirmation/correction of the release sequence and existing GitHub protections/settings inventory once presented with verified metadata. Inaccessible hosted settings may require the owner's confirmation; code-level verification, automation and production-output checks remain agent work. No secrets, broad authorization, production cutover approval or manual test run are requested by this clarification. I can provide more detail on any individual item.


**Owner answer — development fixture:** Profile ID `GGplAdctTfVDLVvYsfIADJmfp8f2`, display name `mgsecure`. The agent will run the read-only public-profile browser journey against the exact candidate development API; no owner sign-in/manual test is needed for this journey. Hosted-control/runbook review remains separate.


**Browser outcome:** Passed using the owner-designated mgsecure profile and the exact candidate API. Real public summary returned 200 and rendered correctly; Locks/Safes navigation and reload passed without console/module errors; anonymous private-profile access returned 401. The 28-gate host cycle restored the original development service, settings and readiness identity, with selected protected shared-file hashes unchanged. Ancillary activity reads used empty local demo emulators; the live public summary was not mocked. No manual owner test or additional account input is needed for this journey.

**Additional output evidence:** All 2,275 local generated dist files and three version/sitemap files match the pre-relocation source under a fixed clock. CSV/HTML/Markdown generation/path equivalence is verified. Production-mode compilation with effective hosted settings remains before-release work, alongside effective GitHub-control and runbook review. No production release or workflow-hold removal is authorized by supplying this fixture.


### Owner confirmations — unchanged operations and setting names

- GitHub environment protection: owner confirms no changes to operations procedures are requested. Preserve existing protections; this confirms intended policy, not independently queried effective reviewer/branch metadata.
- API deployment settings: owner confirms the required names exist in the destination `production` environment. Do not request those names again. Values/target routing remain private and are checked by the existing deployment preflight at the approved release.
- Web/Import settings: owner confirms no settings changes are requested. Preserve the existing names and behavior.

### Ignored environment files — local setup clarification

The owner noticed ignored value-bearing files missing from the migration worktree. Git does not carry ignored files into an import or a separate worktree. Filename-only checks confirm root web `.env.keysNew` exists in the original main checkout but not in the Phase 3 worktree; tracked root web `.env.local`, `.env.dev`, `.env.production`, `.env.test` are present in both. The original API has ignored `.env.local` and `.env.production`; neither is imported into `apps/api`.

For **local development in the migrated checkout**, the owner can manually **copy, rather than move**, the original web `.env.keysNew` to the monorepo root and the original API `.env.local` to `apps/api/.env.local`, if those local runtimes are needed. Keep source copies intact until cutover, do not overwrite the tracked root web env files, and check API-relative path references privately after relocation. Those destinations are confirmed ignored in the candidate. No copying is needed merely to run the completed synthetic tests. Local production API startup is not needed for this phase, so do not copy production credentials just for rehearsal.

For **hosted API releases**, development/production environment files remain protected in their existing server `shared` directories and are linked into the application at deployment. Nothing needs moving into Git or the local monorepo for that. GitHub deployment environment variables/secrets are a separate mechanism and do not create application `.env` files. The agent did not inspect values, copy, move or modify any secret file. AGENTS.md prohibits agent modification of secret-bearing `.env*` files; any local secret provisioning is owner work under that policy.

### Remaining owner decision — runbook acceptance and observation window

No more profile/test execution, API setting-name confirmation or environment/Web/Import policy redesign is needed. The remaining human review from the Phase 4 plan is acceptance/correction of the already-documented cutover sequence and its existing publication effects:

1. Disable old API deployment authority/check in-flight runs before enabling monorepo API releases; preserve manual main-only API deployment and existing web publication triggers.
2. Verify the compatible API first; an approved web release still publishes Pages and the seven catalog snapshots to both API environments. API recovery and Pages/catalog recovery have separate prior artifacts.
3. Retain active plus two API rollback releases and agree on the observation interval before retiring the old source/backend. Proposed interval: seven days, consistent with the existing preference in deployment-topology guidance.

Confirm this sequence and seven-day observation interval, or specify corrections. This is acceptance of the review plan, not authorization to merge, remove holds, publish, deploy production, run live jobs or retire anything. Production-mode compilation and final exact-release settings/artifact checks remain agent validation work; effective hosted protection metadata has not been independently verified. The agent can provide more detail if needed.


### Final owner approval — resolved

**Owner answer:** “I confirm and approve the sequence and seven-day observation interval.”

The owner accepts the documented API authority-transfer/no-overlap sequence, API verification before the approved Pages/seven-catalog release to both API environments, separate API/Pages/catalog rollback, active plus two API rollback releases, and **seven days of observation after cutover before considering retirement**. Observation does not start at rehearsal or review approval, and expiry does not automatically authorize retirement.

Together with the earlier unchanged-operations/Web/Import confirmations, API destination setting-name confirmation and passing designated-profile journey, this closes question 12 and the Phase 4 human-review task. **Phase 4 is complete; no owner response remains pending for it.** Effective hosted reviewer/branch metadata was not independently queried; intended policy is owner-confirmed. Production-mode compilation, exact release identity/target preflight and effective hosted-control checks remain explicit Phase 5 pre-execution gates, not waived checks.

This approval accepts the runbook and observation interval. It does not authorize starting Phase 5, committing/pushing/merging, removing migration holds, transferring live authority, deploying or publishing production, live jobs, or old-source/backend retirement. Existing ongoing development rehearsal authorization remains valid. No further approval question is required to close Phase 4.


# Phase 5: Production cutover and old-source retirement

## 13. Destination API environment discrepancy

**Resolved — owner provisioned `api-production`; setting names and protections independently verified (2026-10-25).** Read-only authenticated GitHub metadata identifies `Lockpickers-United/lpu-belt-explorer` as the current Pages release repository (`lpubelts.com`, `gh-pages`). It lists only `github-pages`; its `production` environment endpoints return 404. The CI fork `mgsecure/lpu-belt-explorer` lists no environments. The old API repository lists `production` with all seven required variable names and two secret names. This differs from question 12's earlier destination-setting-name confirmation; no values were printed or copied.

Please confirm `Lockpickers-United/lpu-belt-explorer` as the production monorepo destination and privately provision its API environment/settings (now named `api-production` by owner choice), or identify another intended destination. Required variables: `SFTP_HOST`, `SFTP_PORT`, `SFTP_USER`, `DEPLOY_ROOT`, `REMOTE_NODE_BIN`, `PM2_APP_NAME`, `HEALTHCHECK_URL`. Required secrets: `SFTP_PRIVATE_KEY`, `SFTP_KNOWN_HOSTS`. Do not paste values here. The agent can recheck names afterward. AGENTS.md prohibits agent modification of secrets/CI variables, so private provisioning belongs to the owner.

Effective old API `production` has **no required reviewers and no deployment branch policy**; main-only deployment is enforced by workflow code. Preserve the owner-approved existing policy unless a change is explicitly requested; do not describe it as requiring hosted reviewer approval. Web `github-pages` has a custom branch policy allowing `main` and `gh-pages`, and `VITE_CLASSIFICATION_WRITE_STAGE=publish`. No protection/settings change is authorized by this question.

Production execution remains pending exact final commit/artifacts, destination controls and separately scoped approval. Offline production-mode comparison and concrete cutover preparation continue. I can provide more detail on the metadata or required names.


### Owner clarification — environment roles and unchanged procedures

The owner asks whether `github-pages` remains the web environment and whether to create `production` for the API, and confirms: “no changes to authorizations or operations procedures should be included in this project.”

**Answer:** Yes to both. Keep the existing `github-pages` environment for the web client. In `Lockpickers-United/lpu-belt-explorer`, create a separate `api-production` environment for the imported API using the same seven variables, two secrets, target values and effective protection settings as the old API repository's `production` environment. This transfers the existing API configuration to its new source repository; it does not introduce a new release procedure or authorization policy. Preserve the old environment and release authority until the approved cutover.

Do not add reviewers, approval gates, branch-policy changes or operational redesign as part of the migration. Existing repository safety requirements and already-agreed cutover/observation steps remain applicable; this clarification grants no new external-action authorization. Environment creation/settings provisioning has not yet been reported complete. **Question 13 remains pending private provisioning and read-only verification**, rather than another policy decision. No secret values should be entered here. The agent can provide further setup details if useful.


### Owner-selected destination name — `api-production`

The owner requested `api-production` for clarity. **Accepted and implemented in the held candidate API deployment workflow.** Create `api-production` in `Lockpickers-United/lpu-belt-explorer` with the same seven variables/two secrets and effective protections as the old API repository’s `production` environment. The destination does not need an additional environment named `production` for this workflow. Web retains `github-pages`; the old repository retains `production` through cutover.

Only the GitHub environment binding changes. Runtime `NODE_ENV=production`, `.env.production`, host paths, PM2 process names, authorization policies and operational procedures stay unchanged. Earlier references to destination `production` document the original proposal/inspection and are superseded by this naming decision; historical metadata is preserved. Provisioning completion/read-only verification is still pending under question 13.


### Provisioning complete — question 13 resolved

**Owner answer:** “The `api-production` environment has been created and configured.”

Read-only GitHub REST verification at `2026-10-25T23:25:33Z` confirms `api-production` in `Lockpickers-United/lpu-belt-explorer`, with all seven required variable names and both secret names present. No required reviewer or deployment branch policy is configured, matching the previously inspected old API `production` policy. Web `github-pages` remains present with its existing branch-policy configuration. No values were displayed, copied, changed or tested. Secret correctness and private deployment-target routing still require normal release preflight.

**Question 13 is resolved; no further owner response is needed for environment provisioning.** Earlier pending/absent notes above are retained as history. Candidate API workflow already binds to `api-production`; all migration holds remain intact. This resolves the configuration-availability gap without changing authorizations or operational procedures, and does not authorize a production release or source publication.


## 14. Publish the held candidate for exact-commit Linux CI

**User input required**

Approve committing the current 15-file reviewed workflow/documentation change set in `monorepo/phase3-npm`, based on `2725290cb7ddfa284113f7bb570992e9986fe6b0`, then pushing that branch to **`mgsecure/lpu-belt-explorer`** (the existing CI fork) and inspecting its automatic **API CI** run and retained Linux archive/checksum?

The six files outside `internal-docs/` cover only the API `api-production` binding, current-main checkout/release-SHA recording after Import, and operational reference updates. The nine internal documents carry Phase 3–5 findings, prior owner answers and verification evidence. The exact path list and source hashes are recorded in `monorepo-phase5-verification.json` under `heldCandidateReview`. Non-internal-document patch SHA-256: `8e18303d6ba60500d3c338dd46d71fa1615dc06cf18a00fd028d49df9bb69807`.

All four live-job holds remain unconditional. This publication is to the existing fork branch; main adoption, PR creation, authority transfer, hold removal, deployment, Pages/catalog publication, live-data access and retirement remain subsequent actions. No new authorization policy or deployment procedure is proposed.

This approval is needed because AGENTS.md Working-tree discipline says: “Never commit, push, deploy, or open a PR unless asked.” Beginning Phase 5 authorizes preparation but has not explicitly authorized this new commit/push. Exact final commit identity and its Linux archive cannot be certified before the commit exists and CI runs. The previous successful Linux artifact belongs to the earlier candidate. The agent can provide further diff details if useful.

**Status:** Awaiting owner authorization; no commit or push performed.

**Waiting for input before continuing**


### Question 14 — owner authorization received

**Owner answer:** “You can procede to commit and push the held candidate to the existing CI branch.”

Accepted for the reviewed candidate on `monorepo/phase3-npm` in CI fork `mgsecure/lpu-belt-explorer`. Commit/push and automatic API CI/artifact inspection can proceed. All four live holds remain; production and main-branch actions remain separately scoped. **Question 14 is resolved.**


## 15. Adopt the held candidate into the production repository

**User input required**

Approve opening a PR from `mgsecure/lpu-belt-explorer:monorepo/phase3-npm` at `c5080a5a75a8074e19e2beb64e74b33ff56a6d98` into `Lockpickers-United/lpu-belt-explorer:main`, then merging that same held candidate after required/available PR checks pass? The destination main was rechecked at `0e3dcba14fef65af722e4499272271639a6ddff5`; recheck before execution and stop for review if either source or destination drifts. Preserve imported sanitized history with a normal merge; do not squash the migration history.

The full adoption contains the reviewed Phase 1 API history import, Phase 2 web relocation, Phase 3 npm/Node alignment and the Phase 4–5 held workflow/documentation updates. All four live-job holds remain unconditional. PR CI runs tests/builds and offline API packaging; held main adoption leaves Pages, Import, development-catalog uploads and monorepo API deployment disabled. Old API source/release authority remains intact. No settings/protection changes or new authorization procedure is proposed. The PR description will document the intended release pause while the held code is on main and the separate API-first activation sequence.

The fork API CI passed for this exact commit: [run 40254583475](https://github.com/mgsecure/lpu-belt-explorer/actions/runs/40254583475). Downloaded archive SHA-256 is `26c3b29f224453005dd36bec1bca51ffb027d81776ea5f0b417a910c98555363`; embedded commit/lock/tool identities, all 15,161 members and the unchanged 386 production dependency locations/versions are verified. A main merge will create a new commit identity; its exact artifact must be recertified before any activation. Fork success is not production-release certification.

AGENTS.md Safety invariants and Working-tree discipline require explicit authorization before opening a PR or publishing/merging. Question 14 authorized only the fork-branch commit/push. Approval here covers held source adoption; authority transfer, hold removal, production deployment, Pages/catalog publication, live-data recovery capture and retirement remain later scoped actions. No PR or main merge has occurred. The agent can provide the full migration diff or draft PR description if useful.

**Status:** Awaiting owner authorization.

**Waiting for input before continuing**


### Question 15 — owner authorization received

**Owner answer:** “You have my approval for adoption into the organization repository’s main branch with all holds retained.”

Accepted for the exact held candidate `c5080a5a75a8074e19e2beb64e74b33ff56a6d98` via PR and normal merge into `Lockpickers-United/lpu-belt-explorer:main`, after passing validation and drift checks. Retain all four live holds and old API release authority. Exact resulting main commit and artifact validation remain agent work. **Question 15 is resolved; no further owner answer is needed for held adoption.** This does not authorize production activation or release-control removal.


## 16. Production target and recovery preflight before authority transfer

**User input required**

Approve the read-only target/recovery inspection in the Phase 5 runbook's **Next execution scope** for adopted main `f7041a5eca486da7b1a71e133febf060a54d9ba3`? This covers the existing API production host and both configured catalog destinations, plus the currently served Pages tree. Compare existing destination settings privately; read filtered release/PM2/Node/path/cron metadata and readiness identity; verify active plus two complete API recovery candidates; download the prior Pages output and seven existing catalog snapshots from each API environment to private local recovery storage. Retain hashes/identities in the report and keep payloads outside Git. No secret/environment-file content or complete PM2 environment will be printed/copied.

The exact adopted-main Linux API artifact is certified: [CI 40255215188](https://github.com/Lockpickers-United/lpu-belt-explorer/actions/runs/40255215188), archive SHA-256 `98e0d7e5242f977f83bce4d4834978c29c44ff3b11d6f18a7d68ee09632b4073`. All four main holds are independently verified; automatic Build-N-Deploy skipped publication. No production process/workflow/settings change, activation, restart, uploader/exporter, cron execution or retirement is included. Missing recovery material will be reported for a separately reviewed remedy.

This approval is required by [AGENTS.md](../AGENTS.md), Safety invariants: “Production deployments and every live-data script run are approval-gated, including read-only exports.” The [data-safety reference](../.agents/references/firebase-data-safety.md#approval-boundary) likewise requires explicit approval for live read-only exports. The completed held-main adoption does not include live recovery capture. This applies the existing repository policy; it adds no new operational approval mechanism. The agent can provide further command/data-scope details if useful.

**Status:** Awaiting owner authorization; no production host inspection or snapshot capture has run in this turn.

**Waiting for input before continuing**


### Question 16 — owner authorization received

**Owner answer:** “I Approve the read-only target/recovery inspection in the Phase 5 runbook's Next execution scope.”

Approved filtered production target/release/PM2/Node/path/cron/readiness inspection, active-plus-two recovery verification, and private local copies of the existing Pages output and seven catalog snapshots from each API environment. No workflow disablement, hold removal, host write, restart, deployment, uploader/exporter/cron execution or retirement is authorized. **Question 16 is resolved; execution results remain to be recorded.**


### Question 16 — execution complete

Read-only target/recovery preflight passed. All seven variable values/target controls match; active and selected two rollback release structures/provenance pass; actual-listener/HTTPS readiness identify the frozen release; one cron owner per runner; current Pages and 14 catalogs retained/hash-verified in private durable local storage. No remote mutation or production-control change occurred. Question 17 below presents the next concrete authority-control patch for review.


## 17. Transfer API dispatch authority and prepare the API-only control commit

**User input required**

Approve these concrete next actions, based on adopted main `f7041a5eca486da7b1a71e133febf060a54d9ba3` and the passed question 16 preflight?

1. Recheck source/main/target/recovery identities and all pages of old/new API deployment runs immediately before transfer. Stop on drift or unresolved deployment activity.
2. Disable only old API deployment workflow **`357527280`** in **`Lockpickers-United/explore-lpubelts-com-node`**, then confirm disabled and drained. Preserve its repository, settings, releases, process, runtime data and cron schedules. Do not archive or shut down anything.
3. Only after that gate, apply the one-file API control patch below on a new `monorepo/phase5-api-authority` branch from the confirmed organization main, commit/push it to the existing CI fork, open its PR to organization main, run validation and normal-merge after checks pass. Keep the web, Import and development-catalog holds. Certify the resulting exact main API artifact through offline API CI.

```diff
--- a/.github/workflows/api-deploy-production.yml
+++ b/.github/workflows/api-deploy-production.yml
@@ -1,4 +1,4 @@
-name: API deploy production (migration hold)
+name: API deploy production

 on:
   workflow_dispatch:
@@ -61,8 +61,6 @@
         run: npm run validate:api

   deploy:
-    # Phase 5 must explicitly remove this hold after old release authority is disabled.
-    if: ${{ false }}
     name: Upload and activate release
     needs: verify
     runs-on: ubuntu-22.04
```

Patch SHA-256: `c203a742d86e62aacd032a14432be582f7fad9dd431cee1a8b9299116df700db`. Proposed YAML and all **10 Bash blocks** pass syntax validation; manual confirmation/main-only guard, `api-production`, concurrency and the other three live holds remain unchanged. The patch is prepared outside the working tree and has **not** been applied. This enables manual API dispatch authority only; **do not dispatch production deployment** under this approval. Present the resulting exact control commit/artifact and recovery identities for activation approval afterward.

Recovery preflight passed: production current is `2fa33cfbe0ba5376ca0ad503bc528164ebf33194-40152214333-1`; selected complete rollback releases are `1346063b1b95ff07e0e5cc82079a4712ee55af3f-40103339171-1` and `4fe7280771588098afd3624813a9f5d25769aad9-40053388046-1`, each with successful prior deployment provenance. All 14 live catalogs and the 2,755-file current Pages tree are retained in private durable local storage, with hashes in Phase 5 evidence. One older incomplete API release is explicitly excluded; nothing was deleted. The current listener and public HTTPS readiness both identify the frozen production release; cron has one owner per runner.

This approval is required by [AGENTS.md](../AGENTS.md), Safety invariants/Working-tree discipline, which require explicit authorization for external publication/PR and production-control changes. Question 16 authorized inspection/capture only. This follows the previously accepted no-overlap sequence and existing manual release procedure; it adds no authorization policy. If control preparation fails after old dispatch is disabled, leave the service running and report the state; do not re-enable an overlapping authority or deploy as an unapproved recovery action. The agent can provide more detail if useful.

**Status:** Awaiting owner authorization; all four holds and old dispatch authority remain intact.

**Waiting for input before continuing**


### Question 17 — owner authorization received

**Owner answer:** “For owner question Transfer API dispatch authority and prepare the API-only control commit: You have approval to procede.”

Approved the reviewed freshness checks, old workflow 357527280 disable/drain, exact API-only patch on a new branch, fork publication/PR/normal merge after passing checks and exact resulting main artifact certification. Preserve the other three holds, running production service, settings, schedules, recovery releases and original source. **Question 17 is resolved. Production deployment remains excluded and requires its exact commit/artifact approval afterward.**


### Question 17 — necessary contract-test scope extension approved

Initial PR #333 API CI failed one of 478 tests: `apps/api/src/config/nodeRuntimeContract.test.js` still asserted the API migration hold that question 17 removes. The owner answered: “You have approval for a small scope extension.”

Approved adding the focused contract-test update alongside the reviewed workflow patch. Keep all Node/runtime assertions; replace the obsolete hold expectation with checks for manual confirmation, main-only deployment, `api-production`, enabled API job and each of the other three workflow holds. Targeted lint and all five focused test cases pass. This is a two-file PR with no additional runtime/dependency/authorization-policy change; production deployment remains excluded.


### Question 17 — authority transfer and certification complete

PR #333 normal-merged as `44026a8c1c71ee361caf3ab43913361502f97bf7` after corrected API CI passed. Old API workflow remains disabled/drained; three other holds remain. Exact-main offline API CI 40258112958 and downloaded artifact verification passed (archive SHA-256 `93d55afd88e7f188b22bd8a7efe1c3823d2ef3feef0e5651f4dc6e75fc12008c`, 15,161 members, all 386 prior dependency versions/locations unchanged). API dispatch authority is transferred; no deployment occurred under question 17 approval.

## 18. API-only production activation — owner approval received

**Owner answer:** “I approve the commit for API-only activation.”

Accepted for exact main `44026a8c1c71ee361caf3ab43913361502f97bf7`, the commit just presented with successful exact-main certification. Use only existing `API deploy production` workflow 396550668 in `Lockpickers-United/lpu-belt-explorer`, `main`, confirmation `deploy-production`, existing `api-production` targets and PM2/current/shared arrangement. Recheck source/target/recovery/run freshness, then activate API only and verify readiness/release/Git identity/public behavior; use the reviewed API rollback if activation fails and verify recovery. Preserve web/Import/development-catalog holds and old workflow disablement. No Pages/catalog publication, extra live job, Firebase deployment or retirement is authorized. **Question 18 is resolved; production execution and results are pending.**

The existing deployment workflow rebuilds its archive from the exact approved source/lock and performs packaging/checksum/host validation. Its runtime archive checksum will be recorded separately; the certified CI archive hash is provenance and is not assumed identical to a rebuilt archive.

## 19. Authenticated owner/admin verification method

**User input required**

For the required authenticated owner/admin API checks after activation, will the owner perform them in an existing signed-in production session, or should the agent use an existing authenticated browser session? Verify an owner read of their own `/api/v1/users/:id/profile` and admin access handling through a deliberately nonexistent synthetic profile ID (expected not-found after passing admin authorization), without copying response bodies or credentials. Do not create users, change claims, bypass authentication, or write user data. Existing public/anonymous denial checks remain agent work.

Activation approval in question 18 remains valid; independent deployment preparation/public checks continue. This requests a verification method/access clarification, not another deployment approval or a new authorization policy. The agent can provide exact read-only steps if useful.

Coninuing with current task, please respond when possible.


### Question 18 — API-only activation completed

Production run [40258859190](https://github.com/Lockpickers-United/lpu-belt-explorer/actions/runs/40258859190) succeeded for approved `44026a8c1c71ee361caf3ab43913361502f97bf7`; active release `44026a8c1c71ee361caf3ab43913361502f97bf7-40258859190-1`, activation step completed `2026-10-26T02:25:13Z`. Independent runtime/readiness/public/anonymous checks pass; all 13,175 comparable deployed records match the certified artifact. Catalogs/Pages/schedules and previous recovery releases remain intact. Three holds and old API workflow disablement remain. No rollback was needed. The existing workflow verified upload integrity but removed the physical runtime archive/checksum before its hash value could be captured; CI gzip hash is not presented as that runtime gzip hash.

**Question 19 remains pending:** authenticated owner/admin verification method/access has not been answered. No further deployment approval is requested for the completed API activation. Web/catalog publication and full-cutover observation remain future steps.


### Question 19 — owner verification complete

**Owner answer:** “I have verified an owner read of my own /api/v1/users/:id/profile and admin access handling through a deliberately nonexistent synthetic profile ID. Various other read-only scenarios returned expected results.”

**Question 19 is resolved.** Authenticated owner/admin reads pass based on the owner's report; the agent did not observe the session or capture tokens/private responses. No additional HTTP codes are invented. Together with independent runtime/public/anonymous checks, this closes the API verification gate. No extra API deployment or authentication/claim change is required. Web/catalog release remains separately authorized.


## 20. Web control release, automatic Pages publication and both catalog targets

**Owner approved**

Approve this concrete release from current main **`44026a8c1c71ee361caf3ab43913361502f97bf7`**, now that API activation and authenticated verification are complete?

1. Recheck source/main, approved API release `44026a8c1c71ee361caf3ab43913361502f97bf7-40258859190-1`, target settings, release queues, retained Pages `a22c44cb301eb3df5a33f8cb940c7494da5cfc97`, all 14 catalog recovery hashes and required API recovery releases. Stop on drift or unresolved conflicting publication/deployment activity.
2. Apply the prepared **two-file** web-control/test patch on isolated `monorepo/phase5-web-release`, commit/push to the existing CI fork, open its PR to organization main, validate and normal-merge after checks pass. Patch SHA-256: **`33929439c5e1c59eec5882d1a9d69f1d35af2c8082ace0f25009d33e0265fad8`**. Full machine-applicable diff and expected seven catalog hashes are in `monorepo-phase5-verification.json` → `webControlReview`.
3. **That merge itself triggers automatic `Build-N-Deploy`:** compile the web production release using unchanged `github-pages` settings (`publish` stage), publish Pages, then replace **seven snapshots in each API environment (14 writes total)** using the existing verified/atomic upload procedure. Approval must cover all these existing effects, even though the snapshot content hashes are expected to remain identical. Record actual checkout/source SHA, workflow run, Pages commit/output and catalog hashes; verify compiled production API URL/stage and public/browser/read-only behavior. No new live exporter or Sheet import is included; `ci-build` here is the existing release workflow's inspected local static-generation/build/copy sequence.
4. If release verification fails, restore the retained previous Pages tree through an ordinary recovery publication and the exact prior catalog snapshots in both targets as needed; verify that recovery. This authorization concerns Pages/catalog recovery, not another API deployment or API authority re-enable. Preserve the active API and selected rollback releases. Keep Import and development-catalog jobs held. Do not dispatch Import, an uploader job, cron/export, Firebase deployment or retirement.

The workflow condition restores main-only push/manual publication and permits `workflow_run` only for successful main Import completion whose head repository matches the organization repository. Existing current-main checkout/actual-SHA recording, manual stage selection, Pages-first/catalog-second ordering, target paths/settings and API manual controls remain unchanged. The contract test retains runtime/API assertions, replaces its obsolete web-hold assertion with **12 event/branch/repository cases**, and retains the Import/development-catalog hold assertions. No application runtime, dependency, auth/rules, target-setting or generated catalog-data change is proposed.

Preparation passed in an isolated preview: targeted ESLint, five focused cases (including the 12-scenario web guard), four YAML documents and 28 Bash blocks. Neither source working tree nor live hold has been changed. Web sources/manifests/root lock/Node/env inputs have **zero changes** since the earlier pinned production comparison; its seven catalog hashes match every current retained live snapshot. That comparison used synthetic sensitive inputs and is historical; actual hosted release output must be verified during this approved publication. The existing API remains deployed from `44026a8c…` even though the subsequent independent web release has a new main SHA.

[AGENTS.md](../AGENTS.md) Safety invariants and the [data-safety reference](../.agents/references/firebase-data-safety.md#generated-artifacts) require explicit authorization for this publication and both catalog destinations. Question 18 authorized API-only activation; questions 17–19 do not authorize this web merge/publication. This request preserves the previously accepted release procedure and sequence; it adds no authorization policy. The agent can show any part of the two-file diff or hash table if useful.

**Owner answer:** “I approve the concrete release from current main 44026a8c1c71ee361caf3ab43913361502f97bf7.”

**Status:** Question 20 resolved. Approved two-file commit/push/PR/merge, automatic Pages and both catalog-target publication, verification and scoped recovery. Execution pending; all other holds remain.

Execution proceeding under the recorded approval.


### Question 20 execution result

**Resolved and executed.** PR #334 merged as `684ea9d9e31884742268fd5ed7c5f6605dea9514`; production web run 40263182081 succeeded. Actual Pages `8c30aacf36a6d0d656dd18105541c3ca57647282`, compiled production settings, browser checks, all 14 catalog hashes and unchanged approved API release verified. No recovery needed. Observation began `2026-10-26T03:18:52Z`, earliest retirement review `2026-11-02T03:18:52Z`. Import/development-catalog holds remain. No further input is needed for this completed release; restoring those held workflows and eventual retirement still require separate authorization. See the runbook/report/Phase 5 JSON for full evidence.
