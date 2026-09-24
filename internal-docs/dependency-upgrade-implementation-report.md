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
