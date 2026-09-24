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
