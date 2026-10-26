# Dependency upgrade implementation report

Implementation date: 2026-09-23

## Phase 0: Record a reproducible baseline

### Phase delta

- Added `.nvmrc` with Node 24.21.0.
- Narrowed `engines.node` from `>=24.0.0` to `>=24.11.0 <25` while retaining Yarn 4.18.0.
- Changed production CI from the floating Node 24 major to `.nvmrc`.
- Added a pre-activation production check that requires `REMOTE_NODE_BIN` to provide the exact `.nvmrc` version.
- Updated agent, development, and production operations guidance to use the same runtime contract.
- Added a unit test that prevents the local pin, package engine, Yarn pin, CI setup, and remote deployment check from drifting apart.

No dependency version, resolution, or `yarn.lock` entry changed. No npm lockfile was created.

### Reproduced baseline

All commands below used checksum-verified Node 24.21.0 and Corepack with Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Immutable install | Passed with the existing peer warning; manifest and lockfile remained compatible |
| Direct packages | 42 runtime and 4 development |
| Resolved package locators | 802 |
| Peer requirements | Four unsatisfied requests, all for `@firebase/app-types` inside Firebase web SDK compatibility packages |
| Deduplication | One candidate: `@types/node` 22.15.17 can resolve to 24.9.1 with the highest strategy |
| Audit | 2 high and 11 moderate entries |
| Lint | 0 errors and 2 source warnings, plus the React package detection warning |
| Pre-change tests | 68 files and 301 tests passed |
| Import safety | Covered by the passing suite for collections exporters, Firebase activity, Reddit belts, upload, email form, request lock, Flickr info, and RAFL import |

The four unsatisfied peer hashes are `p902104`, `pcbbe24`, `pbe0798`, and `pfc2051`. They originate in `@firebase/auth-compat`, `@firebase/firestore-compat`, `@firebase/installations-compat`, and `@firebase/storage-compat`, respectively. Each requests `@firebase/app-types`; Phase 1 owns removal of the unused Firebase web SDK branch.

The audit entries are:

- High: two `ws` denial-of-service advisories through `snoowrap`.
- Moderate on the Snoowrap/request branch: `har-validator`, two `qs` advisories, `request`, `request-promise`, `snoowrap`, `tough-cookie`, and the UUID advisory's UUID 3.4.0 path.
- Other moderate entries: unsupported ESLint 9.39.5, deprecated `glob` 10.5.0, deprecated `node-domexception` 1.0.0, and the UUID advisory's UUID 9.0.1 path through Gaxios 6.7.1.

The two source warnings are both in `src/projects/logAnalysis/lpubeltsLogAnalyzer.js`: `import/no-named-as-default` at line 8 and an unused `logLines` assignment at line 60. ESLint also reports that React version detection cannot find a React package. Phase 4 owns these lint findings.

The first test attempt inside the restricted sandbox passed 55 files and failed 13 files because Supertest could not open loopback listeners (`listen EPERM`). Repeating the same complete mocked suite with local loopback access passed all 68 files and 301 tests. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service.

### Commands run

```sh
node --version
corepack yarn --version
corepack yarn install --immutable
corepack yarn info --recursive --name-only
corepack yarn explain peer-requirements
corepack yarn dedupe --check
corepack yarn npm audit --all --recursive
corepack yarn lint
corepack yarn test --run
```

After the Phase 0 changes, the focused runtime-contract test passed (1 file and 1 test), the final full suite passed (69 files and 302 tests), and `node --check` passed for the server entry point and the new test. Final root lint retained the baseline result of 0 errors, 2 source warnings, and the React detection warning. `git diff --check` passed. The immutable install regenerated the tracked-but-ignored local install metadata; its clean pre-task contents were restored and `yarn.lock` remained unchanged.

### Host runtime checks

The development host was manually confirmed to use `/home/lpubelts_api/.nvm/versions/node/v24.21.0/bin`, with Node v24.21.0 and Corepack selecting Yarn 4.18.0.

The protected production `REMOTE_NODE_BIN` value is not stored in the repository and remains to be checked before Phase 1 or a production deployment. Use the read-only command documented in `.github/DEPLOYMENT.md` to confirm that it reports Node v24.21.0 and Corepack selects Yarn 4.18.0. This check does not require a PM2 restart, deployment, dependency install, or live-service call.

No server, PM2 process, production deployment, collection job, or live integration was started as part of Phase 0. The user confirmed that nothing has been deployed to production.

## Phase 1: Remove dead and unsupported dependency branches

### Phase delta

- Removed the unused direct dependencies `@devvit/public-api`, `firebase`, `moment-timezone`, `ssl-root-cas`, and `eslint-config-flat-gitignore` after a repository-wide source and configuration reference scan found no consumer.
- Removed the Firebase-web-owned `@grpc/grpc-js@~1.9.0` resolution and the Devvit-owned `protobufjs@7.6.3` resolution. The remaining Firebase Admin and Google dependency paths resolve supported current versions without either override.
- Regenerated `yarn.lock`, reducing the root manifest from 46 to 41 direct packages and the resolved tree from 802 to 739 locators.
- Cleared all four unsatisfied Firebase web SDK peer requirements. `yarn explain peer-requirements` now reports no actionable unsatisfied requirement, and `yarn dedupe --check` reports no candidate.
- Retained the WIP Reddit scripts, `snoowrap`, `fuse.js`, and the Snoowrap-owned `form-data@~2.3.2` resolution as explicitly requested. The audit therefore remains at two high and eleven moderate entries; the two high findings and seven of the moderate paths remain wholly owned by the deferred Snoowrap/request branch.

No runtime source changed, so no new unit test was needed. The existing import-safety and full application suites cover the supported Firebase Admin and service paths, while static scans and `yarn why` directly verify these dependency removals.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Repository-wide removed-package import/reference scan | Passed; no runnable source or configuration consumer remains |
| Mutable then immutable install | Passed; final manifest and lockfile reproduce cleanly |
| Removed-package `yarn why` checks | Passed; none remains in the resolved tree |
| Remaining resolution ownership | Passed; Form-data remains under Snoowrap/request and HumanFS remains under ESLint 9 |
| Peer requirements | Passed; previous four unsatisfied Firebase web SDK requests are gone |
| Deduplication | Passed; no package can be deduplicated with the highest strategy |
| Audit | Two high and eleven moderate entries remain, unchanged because the requested Snoowrap deferral preserves every current advisory path |
| Lint | Passed with the two recorded source warnings and React detection warning owned by Phase 4 |
| Tests | 69 files and 302 tests passed |
| Diff hygiene | `git diff --check` passed |

The initial restricted test run passed 56 files and failed 13 files because Supertest could not open loopback listeners (`listen EPERM`). Repeating the same mocked suite with local loopback access passed all 69 files and 302 tests. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service.

No Phase 1-specific manual application check is needed because all removed packages had no runtime consumer. Before any deployment, the Phase 0 read-only production Node/Yarn version check remains outstanding; it is a deployment prerequisite rather than a dependency-removal behavior check.

No server, PM2 process, production deployment, collection job, or live integration was started as part of Phase 1.

## Phase 2: Replace the vendored Formidable implementation

### Phase delta

- Added 16 real multipart contract tests and ran the same tests before and after the parser replacement. They cover valid requests through upload, email-form, and request-lock handlers; repeated field/file shapes; filename/path handling; field-count, field-size, file-count, individual-file-size, and total-file-size limits; missing/malformed boundaries; interrupted streams; stable error status/code mapping; and temporary-file cleanup.
- Replaced the vendored imports in the three maintained multipart handlers and the tracked Reddit WIP upload utility with the direct `formidable` 3.5.4 package export.
- Removed the 19-file `src/util/formidable/` copy and the direct `hexoid` dependency. Formidable remains direct in the manifest, while its supported CUID2 dependency now owns default temporary filename generation.
- Regenerated `yarn.lock`, reducing the root manifest from 41 to 40 direct packages and the resolved tree from 739 to 738 locators.
- Updated `parseForm.js` to defer rejected-file cleanup until Formidable has registered the current file. This closes the `maxFiles: 0` ordering race that otherwise left an empty temporary file, while retaining the existing HTTP status and numeric error code.

The vendored/source comparison found the same parser defaults, numeric error constants, request parsing, limit enforcement, and file lifecycle structure used by the application. The material implementation difference was the vendored `hexoid` default-name generator versus Formidable 3.5.4's CUID2 generator. All active upload handlers supply explicit filename callbacks or reject files, so this generator change does not alter their accepted output filenames. The before/after contract results were identical after the shared cleanup fix.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Before/after multipart comparison | Passed twice: 2 files and 16 tests against the vendored parser, then Formidable 3.5.4 |
| Focused handler/import suites | Passed: 11 files and 35 tests |
| Full tests | Passed: 71 files and 318 tests |
| Lint | Passed with the two recorded source warnings and React detection warning owned by Phase 4 |
| Syntax checks | Passed for `parseForm.js`, the multipart endpoint test, and the migrated Reddit WIP upload utility |
| Mutable and immutable install | Passed; final manifest and lockfile reproduce cleanly |
| Dependency ownership | Direct Formidable 3.5.4 retained; `hexoid` absent; CUID2 remains only under Formidable |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Audit | Two high and eleven moderate entries remain unchanged; none is on the Formidable branch |
| Static scan | No vendored Formidable import, source file, or `hexoid` dependency remains |

The restricted sandbox could not open Supertest loopback listeners (`listen EPERM`), as in the earlier phases. The focused and full mocked suites passed when local loopback sockets were available. Tests used temporary files and injected Firebase, email, archive, thumbnail, metadata, activity-log, and Discord boundaries; no live service was contacted.

Before production rollout, manually exercise the three multipart flows in the development environment with non-sensitive data: submit two small images through upload and inspect the emailed archive, submit a valid email form plus rejected attachment/oversize cases, and submit one authenticated request-lock image and inspect its stored media URLs/files. Confirm rejected uploads and upload workspaces leave no unexpected temporary files. These checks require the normal separately approved development deployment and integration access.

No server, PM2 process, deployment, live-data job, email, Discord webhook, Firebase call, or other live integration was started as part of Phase 2.

## Phase 3: Apply low-risk current-line updates

### Phase delta

- Updated Nodemailer from 10.0.9 to 10.0.10, Supertest from 7.2.2 to 7.3.0, and Vitest from 5.0.0 to exact 5.0.1. Direct Vite remains at 8.3.0.
- Added a credential-free Nodemailer contract test that constructs the real JSON transport and sends the same message fields used by the application, including an attachment, without opening a network connection.
- Regenerated `yarn.lock`. The resolved tree remains at 738 locators; the only changed resolutions are Nodemailer, Supertest, Vitest, and Vitest's matching Mocker and Spy packages.
- Ran highest-strategy deduplication; Yarn reported no eligible package and made no additional lockfile change.
- Rechecked registry metadata for every package that Phase 3 designated to remain unchanged. Each still matches its stable `latest` version, so no package outside the phase list changed.

No application implementation changed. Existing injected email-sender tests continue to cover application behavior, while the new inert transport test reaches the real Nodemailer package boundary.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Nodemailer before/after contract | Passed against both 10.0.9 and 10.0.10; the final focused group passed 4 files and 12 tests |
| Supertest route compatibility | Passed every suite that imports Supertest: 14 files and 85 tests |
| Vitest runner compatibility | Vitest reports 5.0.1 under Node 24.21.0; focused mocks, fake timers, logging, process, environment, and transport coverage passed 6 files and 33 tests |
| Full tests | Passed: 72 files and 319 tests |
| Lint | Passed with the two recorded source warnings and React detection warning owned by Phase 4 |
| Mutable and immutable install | Passed; final manifest and lockfile reproduce cleanly |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Resolved tree | Unchanged at 738 locators |
| Audit | Unchanged at two high and eleven moderate entries; all remain on the already documented deferred Snoowrap, ESLint, and Firebase/Google paths |
| Syntax and diff hygiene | `node --check` passed for the new test and `git diff --check` passed |

No Phase 3-specific manual check is required. The only behavior outside automated coverage is delivery through the configured development SMTP service; an optional development mail-sink send can verify SMTP authentication and TLS after deployment and requires the normal separate approval for a live email integration.

No server, PM2 process, deployment, live-data job, email, or other live integration was started as part of Phase 3.

## Phase 4: Migrate ESLint 9 to ESLint 10

### Phase delta

- Rewrote `eslint.config.js` as native flat config under ESLint 9.39.5, preserving the 202-file lint scope, Node/browser globals, import extension policy, project ignores, and existing warning severities without `FlatCompat` or compatibility rule wrappers.
- Upgraded ESLint to 10.11.0 and `@eslint/js` to 10.0.1, replaced `eslint-plugin-import` 2.32.0 with `eslint-plugin-import-x` 4.17.1, and declared `eslint-import-resolver-node` 0.4.0 directly.
- Removed `@eslint/compat`, `@eslint/eslintrc`, `eslint-plugin-react`, and `eslint-plugin-react-hooks`. ESLint, `@eslint/js`, Globals, Import X, and the resolver now live under `devDependencies`.
- Removed the explicit `@humanfs/node` resolution. ESLint 10 still selects `@humanfs/node` 0.16.8 through its supported range without an override.
- Resolved the two recorded baseline warnings in `lpubeltsLogAnalyzer.js` by giving the Express Useragent default import an unambiguous local name and removing the unused log-line counter.
- Kept ESLint 10's new `no-unassigned-vars`, `no-useless-assignment`, and `preserve-caught-error` recommended rules enabled. `no-useless-assignment` identified one unnecessary empty-object initializer in `lpubeltsLogDataProcessor.js`, which was removed without changing its parse-error control flow.
- Resolved two Import X diagnostics by using Nodemailer's verified named `createTransport` export in the application module and its existing inert transport contract test.
- Regenerated and deduplicated `yarn.lock`, reducing direct packages from 40 to 37 and resolved locators from 738 to 708. The temporary `@types/estree` duplicate introduced during installation was consolidated to 1.0.9.

No new unit test was needed. The existing Nodemailer contract executes the changed package import and transport construction, while ESLint and `node --check` directly validate the static log-analyzer cleanup. The log analyzers were not executed because they read configured host log/data paths.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| ESLint 9 native-flat-config checkpoint | Passed over 202 files with the same two source warnings as baseline and no React detection warning |
| Official ESLint v9-to-v10 codemod | Dry run completed; 1,797 files were unchanged and zero files would be modified |
| ESLint 10 lint | Passed over the same 202 files with 0 errors and 0 warnings |
| Migration API/static search | No `eslint-env`, custom rule, RuleTester, legacy Linter API, or removed CLI-flag use requires migration |
| Focused Nodemailer contract | Passed: 1 file and 1 test using the real inert JSON transport |
| Full tests | Passed: 72 files and 319 tests |
| Syntax checks | Passed for the flat config and all four changed source/test modules |
| Mutable and immutable install | Passed; final manifest and lockfile reproduce cleanly |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Removed-package checks | Compatibility adapters, the old import plugin, and both React plugins are absent; the HumanFS resolution is gone |
| Audit | Reduced from two high and eleven moderate entries to two high and ten moderate entries; the unsupported ESLint 9 entry is gone |
| Diff hygiene | `git diff --check` passed |

The restricted sandbox run passed 58 files and failed 14 files because Supertest could not open loopback listeners. Repeating the same mocked suite with local loopback access passed all 72 files and 319 tests. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service.

No application-level manual test is required for this lint-only phase. Before relying on editor diagnostics, confirm the IDE ESLint integration uses Node 24 and the repository's flat config; an older embedded Node 23 runtime cannot run ESLint 10. The Phase 0 read-only production Node/Yarn version check remains a deployment prerequisite.

No server, PM2 process, deployment, live-data job, email, or other live integration was started as part of Phase 4.

## Phase 5: Upgrade dotenv 17 to 18

### Phase delta

- Upgraded only dotenv from 17.4.2 to 18.0.3 and regenerated its `yarn.lock` entry. The direct-package and 708-locator resolved-tree counts are unchanged.
- Confirmed that dotenv 18 retains the ESM default export used by `runtimeEnvironment.js` and supports the existing explicit `config({path, processEnv, override, quiet})` call. No runtime source change or preload migration was required, and no tracked file uses removed dotenv internal subpaths.
- Expanded `runtimeEnvironment.test.js` from six to ten tests using real temporary `.env.local`, `.env.development`, and `.env.production` files. The added coverage verifies exact file selection, quoted hashes, inline comments, escaped and literal multiline values, a supplied `processEnv`, shell-value precedence, explicit override behavior, preservation of the originally selected `NODE_ENV`, quiet loading, and real missing-file errors.
- Kept the stable application error codes `runtime_environment_invalid` and `runtime_environment_file_unavailable`. Quiet-mode assertions confirm that successful and missing-file loads do not print environment values or file paths.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Focused runtime/server configuration | Passed: 3 files and 35 tests |
| Configuration and import safety | Passed: 21 files and 99 tests |
| Full tests | Passed: 72 files and 323 tests |
| Lint | Passed with 0 errors and 0 warnings |
| Syntax checks | Passed for `runtimeEnvironment.js` and its expanded test |
| Mutable and immutable install | Passed; only dotenv changed in the manifest and lockfile, and the final pair reproduces cleanly |
| ESM/API and preload scan | Default import exposes `config`; no `dotenv/config`, legacy preload option, or internal dotenv subpath is used |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Audit | Unchanged at two high and ten moderate entries; none is on the dotenv branch |
| Resolved tree | Unchanged at 708 locators |

The restricted sandbox run passed 58 files and failed 14 files because Supertest could not open loopback listeners. The first loopback-enabled full run had one transient route-test timeout; that 14-test file passed immediately in isolation, and a repeated complete mocked suite passed all 72 files and 323 tests. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service.

Before production rollout, manually start the local and development service through the normal separately approved process and confirm each selects only `.env.local` or `.env.development`, respectively. Check console/PM2 output for the absence of dotenv's injected-environment message and environment-file paths. The production `.env.production` selection is covered by real-file tests; verifying it in a deployed process belongs to the separately approved development/production rollout checks.

No server, PM2 process, deployment, live-data job, email, or other live integration was started as part of Phase 5.

## Phase 6: Upgrade Firebase Admin and remediate its transitive audit path

### Phase delta

- Upgraded Firebase Admin from 14.4.0 to 14.5.0. Its core Google Auth dependency moved from 10.9.1 to 11.1.0, and highest-strategy deduplication consolidated the compatible Google Auth 11.0.2 locator into 11.1.0.
- Updated Firebase Admin's compatible optional Cloud Storage branch from 8.1.0 to the current 8.2.0. Storage 8.2.0 still depends on Gaxios 6.7.1 and Google Auth 9.15.1, and Gaxios 6.7.1 remains the latest release in that major with a declared UUID 9 range.
- Added the Yarn resolution `gaxios@npm:6.7.1/uuid: npm:11.1.1`. Inspection confirmed that Gaxios 6 uses only UUID's CommonJS `v4()` API, which UUID 11.1.1 retains. The resolution does not affect UUID 3.4.0 under the separately deferred Snoowrap/request branch.
- Added `firebaseAdminDependencies.test.js` to load the real modular `firebase-admin/app`, `/auth`, and `/firestore` exports without initializing an app, construct a Firestore `Timestamp`, load Gaxios 6 with its resolved UUID 11 dependency, generate and validate a version-4 UUID, and construct a Gaxios client without credentials or network access.
- Expanded the profile API contract with verified-token failure, non-owner denial, strict boolean admin-claim enforcement, owner access, admin access, and `private, no-store` cache assertions. Existing target tests continue to verify lazy initialization, credential/project validation, app caching, explicit named-database selection, and the guarded default database.
- Regenerated and deduplicated `yarn.lock`, reducing the resolved tree from 708 to 706 locators. No runtime application source changed.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Pre-upgrade Firebase/profile/exporter checkpoint | Passed: 8 files and 24 tests |
| Final API, Firebase, exporter, and import-safety group | Passed: 22 files and 95 tests |
| Full tests | Passed: 73 files and 331 tests |
| Lint | Passed with 0 errors and 0 warnings |
| Syntax checks | Passed for both added/expanded test modules |
| Mutable and immutable install | Passed; final manifest, resolution, and lockfile reproduce cleanly |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Firebase/Google dependency paths | Firebase Admin 14.5.0, Storage 8.2.0, and compatible consumers use Google Auth 11.1.0; Gaxios 6.7.1 resolves only UUID 11.1.1 |
| Audit | Two high and ten moderate entries remain; the Gaxios/UUID 9 path is gone, and the UUID finding now comes only from UUID 3.4.0 under deferred Snoowrap/request |
| Resolved tree | Reduced from 708 to 706 locators |

The latest supported Firebase tree retains two upstream deprecation findings that cannot be removed with a compatible update. Glob 10.5.0 is selected through Firebase Admin -> Firestore 9.1.0 -> Firestore API 0.2.0 -> Google GAX 5.0.8 -> Rimraf 5.0.10. Node-domexception 1.0.0 is selected through Firebase's Firestore/Storage Google request clients -> Node Fetch 3.3.2 -> Fetch Blob 3.2.0. Forcing newer Glob, Rimraf, Fetch Blob, or Node-domexception majors would cross their owners' supported ranges, so the plan continues to monitor upstream rather than adding broad overrides.

Before production rollout, perform a separately approved development smoke check against the configured named development database: verify a valid owner token can read its full profile, another non-admin token is denied, and an actual boolean admin claim can read another profile. Confirm the responses retain `private, no-store` and that logs contain no bearer token or private profile. A bounded development exporter run can additionally validate service-account and named-database integration, but it reads live Firebase and writes output, so it requires separate explicit approval under the repository rules.

No server, PM2 process, deployment, credential read, Firebase request, exporter, live-data job, or other live integration was started as part of Phase 6.

## Phase 7: Upgrade Google APIs 180 to 181

### Phase delta

- Upgraded only `googleapis` from 180.0.0 to 181.0.0 and regenerated its lockfile entry. Google APIs 181 keeps the existing `googleapis-common` 9.0.4 and Google Auth 11.1.0 dependency ranges, so the resolved tree remains at 706 locators.
- Extracted the active RAFL utility's cached-token authorization flow into the import-safe `googleAuthorization.js` helper. The runtime contract remains cached token first, interactive local authentication only on a cache miss, and an external `authorized_user` token written for later runs. File paths remain supplied by the caller, reads explicitly use UTF-8, and cache misses no longer print filesystem paths.
- Added five credential-free Google integration contract tests. They verify Forms v1 get/batch-update requests, the Sheets v4 values request, compatibility with the Google Auth 9.15.1 client supplied by `@google-cloud/local-auth` 3.0.1, cached-token reuse without reading the OAuth client file, and first-time token persistence using temporary synthetic files.
- Confirmed the existing Google Auth 9.15.1, 10.5.0, and 11.1.0 locators are required by incompatible upstream ranges from local-auth/Storage, Google GAX 5, and current Firebase/Google clients, respectively. Google APIs 181 introduces no new Google Auth major or duplicate.
- Retained the package-scoped `gaxios@6.7.1/uuid` resolution because Gaxios 6.7.1 remains required by supported local-auth and Firebase Storage branches. It resolves only UUID 11.1.1; UUID 3.4.0 remains isolated to the deferred Snoowrap/request branch.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Focused Google APIs and authorization contracts | Passed: 1 file and 5 tests |
| Full tests | Passed: 74 files and 336 tests |
| Lint | Passed with 0 errors and 0 warnings |
| Syntax checks | Passed for `googleAuthorization.js`, `googleApis.test.js`, and the updated `raflFormUtils.js` |
| Mutable and immutable install | Passed; only Google APIs changed in the manifest/lockfile dependency tree, and the final pair reproduces cleanly |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Google dependency paths | Google APIs 181.0.0 uses Google APIs Common 9.0.4 and Google Auth 11.1.0; local-auth 3.0.1 remains on its compatible Google Auth 9.15.1 branch |
| Audit | Unchanged at two high and ten moderate entries; no finding is on the Google APIs 181 branch |
| Resolved tree | Unchanged at 706 locators |

The restricted full-suite run passed 60 files and failed 14 files because Supertest could not open loopback listeners. The same complete mocked suite passed all 74 files and 336 tests when local loopback sockets were available. No test contacted Google, Firebase, Reddit, Flickr, SMTP, FTP, or another live service, and no real OAuth credential or token file was read.

Before production rollout, perform a separately approved development RAFL preview against non-sensitive development Forms and Sheets data. Confirm the existing external cached token is reused, Forms items/responses and the `Review!A:ZZ` sheet load successfully, and logs contain no OAuth secret, token, or credential path. An isolated development authorization refresh can additionally verify browser authentication and token persistence, but it contacts live Google services and must use non-production credentials under the repository's normal approval rules.

No server, PM2 process, deployment, credential read, Google request, live-data job, or other live integration was started as part of Phase 7.

## Deferred Reddit WIP dependency checkpoint

### Phase delta

- Verified that commit `59387a3` retired the four WIP files that contained every repository import of `snoowrap` and `fuse.js`. A follow-up static import scan found no remaining JavaScript consumer of either package.
- Removed direct `snoowrap` 1.23.0 and `fuse.js` 7.5.0 dependencies, along with the Snoowrap/request-owned `form-data@~2.3.2` resolution. Regenerating `yarn.lock` removed 46 locators, reducing the resolved tree from 706 to 660.
- Confirmed that Snoowrap, Fuse, Request, Request Promise, WebSocket 3, UUID 3, and the deprecated supporting branch are absent from the final dependency tree. The remaining Form-data 4.0.6 is the current branch used by Axios and Superagent, and UUID resolves only to 11.1.1 through the intentional Gaxios 6 compatibility resolution.
- Removed stale operational guidance that referenced the deleted WIP scripts and Snoowrap. The active Reddit belt refresh under `src/projects/redditBelts/` remains unchanged.
- No replacement unit test was added because the deleted scripts were the only behavior owned by these dependencies. Static consumer checks, dependency-tree inspection, the audit, and the unchanged full suite cover this removal.

### Validation

All validation used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Static imports and dependency paths | No Snoowrap or Fuse consumer; `yarn why` returns no path for Snoowrap, Fuse, Request, Request Promise, or WebSocket |
| Full tests | Passed: 74 files and 336 tests |
| Lint | Passed with 0 errors and 0 warnings |
| Mutable and immutable install | Passed; manifest and lockfile reproduce without the retired dependency branch |
| Peer requirements and deduplication | No actionable unsatisfied peer requirement and no package eligible for highest-strategy deduplication |
| Audit | Reduced from two high and ten moderate entries to zero high and two moderate upstream deprecations |
| Security report generator | Produced ignored JSONL and Markdown reports under `logs/`; its expected exit code was 1 because the two deprecation findings remain |
| Resolved tree | Reduced from 706 to 660 locators |

The two remaining audit entries are the already documented upstream-only Glob 10.5.0 path under Firebase Firestore and node-domexception 1.0.0 path under Google request clients. No compatible supported direct update removes either path.

No checkpoint-specific manual application test is required because the removed files were retired WIP utilities with no remaining route or runtime consumer. No server, PM2 process, deployment, credential read, Reddit request, live-data job, or other live integration was started.

## Phase 8: Final tree validation and development rollout notes

### Phase delta

- Final lockfile review found one prerelease transitive package: `eslint-import-resolver-node` 0.4.0 selected `resolve` 2.0.0-next.7. The flat ESLint configuration now uses Import X 4.17.1's supported built-in `createNodeResolver()` through `import-x/resolver-next`, and the redundant direct resolver package was removed.
- Regenerated `yarn.lock`, removing the prerelease Resolve branch and its otherwise unused supporting packages. The final manifest contains 27 runtime and 7 development dependencies, and the resolved tree decreased from 660 to 580 locators.
- Repeated the direct-package ownership scan. Every runtime package has a tracked import or configuration consumer, every lint/test package is under `devDependencies`, and direct Vite 8.3.0 remains intentionally retained as Vitest 5.0.1's peer. No npm lockfile, external prerelease locator, stale resolution, or avoidable duplicate in the reviewed Firebase Admin, Vite/Vitest, or ESLint families remains.
- Retained the single package-scoped `gaxios@npm:6.7.1/uuid` resolution. Supported local-auth and Cloud Storage branches still require Gaxios 6.7.1, which resolves UUID 11.1.1; Google Auth 9.15.1, 10.5.0, and 11.1.0 remain separated by incompatible upstream ranges.
- No new unit test was needed. Loading the changed flat configuration and resolving the complete lint target exercises the new resolver boundary, while the full application suite verifies that the dependency-tree cleanup does not change runtime behavior.

### Validation

All authoritative validation used Node 24.21.0 and Yarn 4.18.0. The default agent shell remains Node 23.11.0, so each final command explicitly selected the pinned Node binary before invoking Corepack.

| Check | Result |
| --- | --- |
| Immutable install | Passed with the final manifest and lockfile |
| Resolved tree | 580 locators; no external prerelease version remains |
| Direct-package and lockfile review | 27 runtime and 7 development dependencies; all imported, configured, or intentionally retained; no npm lockfile |
| Peer requirements | All requests satisfied; optional absent peers are reported as satisfied |
| Deduplication | No package can be deduplicated with the highest strategy |
| Audit | Zero high or critical findings; two moderate upstream deprecations remain for Glob 10.5.0 and node-domexception 1.0.0 |
| Dependency families | One Firebase Admin, Vite, Vitest, ESLint, and `@eslint/js` version; the three required Google Auth majors remain owned by incompatible upstream ranges |
| Scoped resolution | Gaxios 6.7.1 resolves only UUID 11.1.1; no other UUID locator remains |
| Lint | Passed with 0 errors and 0 warnings |
| Tests | Passed: 74 files and 336 tests |
| Syntax checks | Passed for the server entry point, flat ESLint config, and all standalone scripts changed during the upgrade phases |
| Local native-package probes | Sharp 0.35.4/libvips 8.18.6 generated a PNG and GeoIP 2.0.3 completed a lookup on Darwin ARM64 |

The first restricted full-suite run passed 60 files and failed 14 files because Supertest could not open loopback listeners. The same complete mocked suite passed all 74 files and 336 tests with local loopback access. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service, and no live credential was read.

The final audit still exits with status 1 for the two documented deprecation entries. Glob 10.5.0 remains under Firebase Admin -> Firestore -> Firestore API -> Google GAX 5 -> Rimraf 5, and node-domexception 1.0.0 remains under Firebase's Google request clients -> Node Fetch 3 -> Fetch Blob 3. No compatible supported direct update removes either path.

### Development rollout checklist

After code review and separate approval for the development deployment and integrations:

1. Upload the reviewed files to `/home/lpubelts_api/apps/api-server-dev/current-dev`, confirm the protected environment-file link was not replaced, select the protected Node 24.21.0 binary, and run `corepack yarn install --immutable`.
2. Before restart, run `node --check src/lpubeltsApiServer.js`. On the DreamHost architecture, import Sharp and GeoIP and perform the same one-pixel image conversion and non-sensitive IP lookup used locally. Development and production share the same VPS architecture, but the production release's own immutable install must repeat these probes before production activation.
3. Restart `lpubelts-api-server-dev`, then confirm `/ready` returns `ready: true`, identifies `development` and the expected release, and the public `/api/v1/stats/collections/locks` response is available.
4. With development credentials and non-sensitive data, verify owner profile access, denied cross-user access, boolean-admin access, `private, no-store`, valid and rejected upload/email-form/request-lock multipart requests, Flickr info, and an RAFL preview that reuses the external cached token.
5. Inspect the configured PM2 logs for structured JSON, request IDs, expected status codes, and the absence of bearer tokens, private profiles, OAuth material, environment values, credential paths, and dotenv configuration messages. If email delivery needs integration coverage, use the configured development mail sink.

The development upload, dependency install, PM2 restart, authenticated Firebase call, multipart side effects, Flickr request, RAFL preview, and mail-sink send were not performed because each needs separate explicit approval under `AGENTS.md`. Production deployment remains a later, separately approved operation. The protected production Node/Yarn version check and production-release Sharp/GeoIP probes also remain outstanding before production activation.

## Final definition-of-done verification

Verification completed: 2026-09-24

### Final delta

- Queried the npm registry's stable `latest` tag for all 27 runtime and 7
  development dependencies on 2026-09-23. Thirty-three already matched. Google
  APIs 182.0.0 had been published after Phase 7, so `googleapis` was upgraded
  from 181.0.0 to 182.0.0 and its lockfile locator was regenerated.
- Rechecked the official Node latest-v24 archive and Yarn release list. Node
  24.21.0 remains the current Node 24 patch and Yarn 4.18.0 remains the current
  stable Yarn 4 release.
- Confirmed Google APIs 182 retains the Node >=22 engine, Google APIs Common 9,
  and Google Auth 11 dependency contracts used by 181. The resolved tree remains
  at 580 locators and no new Google Auth major or audit path was introduced.
- Repeated the direct-package ownership review. Every direct runtime package has
  a source or configuration consumer, every development package has a lint/test
  owner, and all 34 direct versions now match their stable registry `latest`
  tags.
- Created an isolated tracked-files copy, supplied the final manifest and
  lockfile, and ran an immutable install under Node 24.21.0 and Yarn 4.18.0. The
  before/after SHA-256 hashes of both files were identical and no npm lockfile
  was created.
- Re-ran peer, deduplication, audit, lint, runtime-contract, focused Google, and
  full application checks. No production deployment, PM2 start/restart,
  credential read, Firebase/Google/Flickr/Reddit/SMTP/FTP request, or live-data
  job occurred.

### Direct-package disposition

Registry versions below are stable `latest` tags observed on 2026-09-23. The
owner column names the source boundary responsible for retaining each direct
package.

| Package | Declared/current latest | Owner and reason |
| --- | --- | --- |
| `@google-cloud/local-auth` | 3.0.1 | RAFL Google OAuth bootstrap and cached-token authorization |
| `archiver` | 8.0.0 | Upload archive creation |
| `axios` | 1.20.0 | Maintained HTTP integration utilities |
| `basic-ftp` | 6.2.1 | Server-log FTP fetch utility |
| `cors` | 2.8.6 | Express CORS middleware |
| `csv-parse` | 7.0.2 | Collection and integration data processors |
| `dayjs` | 1.11.23 | Date/time and timezone processing |
| `dotenv` | 18.0.3 | Explicit runtime environment-file loading |
| `express` | 5.2.1 | API server, routers, and service bundles |
| `express-useragent` | 2.2.3 | Request/log user-agent analysis |
| `firebase-admin` | 14.5.0 | Authenticated profiles, named Firestore access, and exporters |
| `flickr-sdk` | 7.1.0 | Flickr information integration |
| `formidable` | 3.5.4 | Shared multipart parsing boundary |
| `geoip-lite` | 2.0.3 | Request/log geolocation analysis |
| `googleapis` | 182.0.0 | RAFL Forms v1 and Sheets v4 clients |
| `helmet` | 8.3.0 | Express security headers |
| `joi` | 18.2.9 | Legacy/project input validation |
| `json-2-csv` | 5.6.0 | Data export processors |
| `node-fetch` | 3.3.2 | Maintained HTTP integrations and compatibility utilities |
| `node-fetch-cookies` | 2.1.1 | RAFL authenticated web-session utilities |
| `nodemailer` | 10.0.10 | Email-form and upload mail delivery |
| `pino` | 10.3.1 | Shared structured application logging |
| `pino-http` | 11.0.0 | Structured HTTP request logging |
| `pino-pretty` | 13.1.3 | Local readable log transport |
| `sharp` | 0.35.4 | Image conversion and thumbnail generation |
| `validator` | 13.15.35 | Existing string and form validation |
| `zod` | 4.6.5 | API and integration schemas |
| `@eslint/js` | 10.0.1 | ESLint recommended rule definitions |
| `eslint` | 10.11.0 | Repository lint runner |
| `eslint-plugin-import-x` | 4.17.1 | ESM import rules and resolver |
| `globals` | 17.12.0 | Node/browser globals for flat ESLint configuration |
| `supertest` | 7.3.0 | Express route and middleware contracts |
| `vite` | 8.3.0 | Intentionally direct peer required by Vitest 5 |
| `vitest` | 5.0.1 | Unit, service, and route test runner |

### Final validation

All authoritative checks used Node 24.21.0 and Yarn 4.18.0.

| Check | Result |
| --- | --- |
| Runtime versions | Node v24.21.0 and Yarn 4.18.0; `.nvmrc`, `engines.node`, `packageManager`, CI setup, and the remote pre-activation check remain aligned |
| Registry comparison | 34 of 34 direct packages match stable `latest` after upgrading Google APIs to 182.0.0 |
| Google APIs focused contracts | Passed: 1 file and 5 tests; Forms, Sheets, local-auth compatibility, cached-token reuse, and synthetic token persistence remain unchanged |
| Clean immutable install | Passed in an isolated tracked-files copy; final `package.json` and `yarn.lock` hashes were unchanged by installation and no npm lockfile was created |
| Runtime-contract test | Passed: 1 file and 1 test |
| Resolved tree | 580 locators |
| Peer requirements | All requests satisfied; absent optional peers are reported as satisfied |
| Deduplication | No package can be deduplicated with the highest strategy |
| Audit | Zero critical, zero high, two moderate upstream deprecations, and zero low findings |
| Lint | Passed with 0 errors and 0 warnings |
| Full tests | Passed: 74 files and 336 tests |
| Diff hygiene | `git diff --check` passed before documentation updates; the final staged diff is checked again at handoff |

The isolated restricted full-suite attempt passed 59 files and 252 tests. It
failed 14 Supertest-dependent files because the sandbox could not open loopback
listeners, and `exportCheckConfig.test.js` failed its ten cases because the
arbitrary temporary directory did not end in the repository name expected by
that path assertion. Repeating the exact complete mocked suite from the real
repository path with local loopback permission passed all 74 files and 336
tests. These environment failures did not involve Google APIs or an application
behavior regression.

The refreshed audit still exits with status 1 for two deprecation notices:

1. `firebase-admin@14.5.0` -> `@google-cloud/firestore@9.1.0` ->
   `@google-cloud/firestore-api@0.2.0` -> `google-gax@5.0.8` ->
   `rimraf@5.0.10` -> `glob@10.5.0`.
2. Firebase and Google request clients -> `node-fetch@3.3.2` ->
   `fetch-blob@3.2.0` -> `node-domexception@1.0.0`.

Firebase Admin 14.5.0 and Node Fetch 3.3.2 are current. Firestore 9.2.0 still
declares Firestore API `^0.2.0`, which cannot select the current 0.6 line that
uses Google GAX 6. Rimraf 6 and current Glob are outside Google GAX 5's declared
Rimraf 5 range. Node Fetch's current 3.3.2 release still declares Fetch Blob
`^3.1.4`, and even Fetch Blob 4 retains Node DOMException. No compatible
supported update removes either path; broad overrides would cross the upstream
owners' ranges and remain intentionally absent.

### Commands run

```sh
node --version
corepack yarn --version
corepack yarn up googleapis@^182.0.0
corepack yarn vitest run src/projects/raflFormUtilities/googleApis.test.js
corepack yarn security:scan
corepack yarn why -R glob
corepack yarn why -R node-domexception
corepack yarn install --immutable
corepack yarn explain peer-requirements
corepack yarn dedupe --check
corepack yarn vitest run src/config/nodeRuntimeContract.test.js
corepack yarn lint
corepack yarn test --run
corepack yarn info --recursive --name-only
```

The registry comparison used a read-only Node 24 script to read all dependency
and development-dependency names from `package.json` and fetch each package's
registry `dist-tags.latest` value. Audit reports were written to ignored files
under `logs/`.

### Remaining manual rollout checks

The repository definition of done is complete. The following operational checks
remain before production rollout and require the separate approvals described
in `AGENTS.md`:

1. Deploy the reviewed files to the development checkout, confirm its protected
   `.env.development` link was not replaced, select Node 24.21.0, and run
   `corepack yarn install --immutable`.
2. On the DreamHost architecture, run the server syntax check and the one-pixel
   Sharp conversion and non-sensitive GeoIP lookup before restarting the
   development PM2 process.
3. Restart only `lpubelts-api-server-dev`; verify `/ready` identifies the
   development environment and expected release, then verify the public
   collection-statistics endpoint.
4. With development credentials and non-sensitive inputs, verify owner profile
   access, denied cross-user access, boolean-admin access, private cache headers,
   accepted and rejected upload/email-form/request-lock flows, Flickr info, and
   an RAFL preview using the external cached token. Use the development mail sink
   only if delivery verification is desired.
5. Inspect PM2 logs for structured request IDs and expected statuses, and verify
   that they contain no bearer tokens, private profiles, OAuth material,
   environment values, credential paths, or dotenv configuration messages.
6. Before the first production deployment, use the documented read-only host
   check to confirm protected `REMOTE_NODE_BIN` supplies Node v24.21.0 and
   Corepack selects Yarn 4.18.0. The production release's immutable install must
   repeat the Sharp and GeoIP probes before activation.
7. Production deployment, PM2 reload, public smoke tests, and frontend cutover
   remain separate explicit-approval operations.
