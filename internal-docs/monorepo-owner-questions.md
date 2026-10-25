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
