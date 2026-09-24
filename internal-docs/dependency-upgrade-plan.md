# Dependency Upgrade Plan

Status: active; Phases 0 through 7 and the deferred Reddit WIP dependency checkpoint implemented on 2026-09-23, with final tree validation and production runtime verification pending

Planning snapshot: 2026-09-23

Scope: root Node.js package only; completed work covers the reproducible runtime baseline, unused dependency removal, the Formidable migration, low-risk current-line updates, the ESLint 10 migration, the dotenv 18 runtime-loading checkpoint, Firebase Admin 14.5 audit remediation, Google APIs 181, and removal of the deprecated Snoowrap/request dependency tree without changing deployment state or live data

## Executive recommendation

The repository is already close to current: 24 of its 46 direct packages match the current stable registry release, and the September 14 upgrade moved most runtime libraries to their newest major. The remaining work should not be implemented as another bulk `package.json` and lockfile rewrite. The safest route is a sequence of small checkpoints:

1. Pin and verify the Node 24 LTS toolchain used for every checkpoint.
2. Remove confirmed unused packages, then resolve the separately deferred deprecated `snoowrap` tree before final validation.
3. Replace the vendored Formidable copy with the current declared package after adding multipart contract tests.
4. Apply low-risk patch/minor updates.
5. Migrate the lint stack from ESLint 9 to ESLint 10 without peer overrides.
6. Upgrade dotenv 17 to 18 as an isolated runtime-loading change.
7. Upgrade Firebase Admin and Google APIs in separate integration checkpoints.
8. Rebuild, deduplicate, audit, and validate the final tree under a clean Node 24 install.

This ordering removes dead dependency branches before upgrading them, eliminates the current high-severity audit paths early, and avoids mixing source migrations with unrelated lockfile churn. Each numbered phase should be one independently reviewable commit or pull request.

## Evidence and current baseline

The registry and installed tree were inspected on 2026-09-23. Versions below are stable `latest` tags from Yarn/npm registry metadata, not prerelease, `next`, `canary`, or historical maintenance tags.

| Baseline item | Current result |
| --- | --- |
| Direct dependencies | 42 runtime + 4 development = 46 |
| Resolved package locators | 802 |
| Pre-Phase 0 declared Node range | `>=24.0.0` |
| Default agent shell | Node 23.11.0, which is outside the project contract and unsupported by ESLint 10 |
| Verified baseline runtime | Node 24.21.0 and Yarn 4.18.0 |
| Latest Node 24 LTS snapshot | 24.21.0 |
| Yarn | 4.18.0, already current |
| Pre-Phase 0 tests | 68 files and 301 tests pass under Node 24.21.0 |
| Lint | 0 errors and 2 existing warnings; it also prints an unnecessary React detection warning |
| Peer requirements | Four unsatisfied requests are inside the unused Firebase web SDK compatibility tree |
| Lockfile deduplication | One eligible duplicate: `@types/node` 22.15.17 can resolve to 24.9.1 |
| Audit | 2 high and 11 moderate entries |

The initial in-sandbox Supertest run could not open loopback listeners. The same complete mocked suite passed when local loopback sockets were available. No test contacted Firebase, Reddit, Flickr, Google, SMTP, FTP, or another live service.

### Current audit findings

| Source | Findings | Planned resolution |
| --- | --- | --- |
| `snoowrap` -> `request` / `request-promise` / old `ws` | Resolved in the deferred Reddit WIP checkpoint | The four WIP consumers were retired, then `snoowrap`, `fuse.js`, and the obsolete Form-data resolution were removed together |
| ESLint 9.39.5 | 1 moderate unsupported-version entry | Resolved in Phase 4 by ESLint 10.11.0 |
| `gaxios` 6.7.1 -> UUID 9.0.1 | Resolved in Phase 6 | The latest compatible Storage/Gaxios 6 line still declared UUID 9, so a tested `gaxios@6.7.1/uuid` resolution supplies UUID 11.1.1 without changing the Snoowrap/request UUID branch |
| Latest Firebase Admin optional Firestore/Storage tree | `glob` 10.5.0 and `node-domexception` 1.0.0 deprecation entries | Confirmed in Phase 6 as upstream-only paths with no compatible supported replacement; monitor upstream |

The two high findings are both old `ws` releases below 5.2.5 pulled in only by deprecated `snoowrap`. That branch also contains deprecated `request`, `request-promise`, `har-validator`, old `tough-cookie`, old UUID, and two `qs` advisories. It should be removed rather than patched through broad transitive overrides.

The baseline four `resolutions` were also signs of dependency branches that could be eliminated:

| Resolution | Current owner | Expected action |
| --- | --- | --- |
| `@grpc/grpc-js@~1.9.0` -> 1.9.16 | Unused Firebase web SDK | Remove with `firebase`, then prove it is no longer needed |
| `@humanfs/node@^0.16.6` -> 0.16.8 | ESLint 9 | Removed in Phase 4; ESLint 10 still selects 0.16.8 without a resolution |
| `form-data@~2.3.2` -> 2.5.6 | Deprecated `request` tree from Snoowrap | Removed with `snoowrap` in the deferred Reddit WIP checkpoint |
| `protobufjs@7.6.3` -> 7.6.6 | Exact Devvit dependency; Firebase Admin also accepts a current range | Remove with Devvit and confirm Firebase Admin resolves safely without it |

Do not carry these resolutions forward automatically. Remove them one at a time with their owning branch, regenerate the lockfile, rerun the audit, and use `yarn why` to prove whether anything still needs them.

Phase 6 adds one current resolution scoped to `gaxios@6.7.1/uuid`. Phase 7 confirmed that Gaxios 6.7.1 remains required by supported Firebase Storage and local-auth branches, so retain the resolution until final validation proves that branch is gone.

## Direct dependency disposition

### Packages that should change

| Package | Current | Target or action | Reason and compatibility gate |
| --- | ---: | --- | --- |
| `@devvit/public-api` | 0.14.3 | Remove; 0.14.5 only if a hidden consumer is identified | No repository import or runtime reference was found. Removing it also removes a large protobuf/Devvit tree. |
| `@eslint/compat` | 2.1.1 | Remove | The server has no JSX and can use native flat configs without compatibility wrappers. |
| `@eslint/eslintrc` | 3.3.7 | Remove | `FlatCompat` is unnecessary after the native flat-config rewrite. |
| `@eslint/js` | 9.39.5 | 10.0.1; move to `devDependencies` | Must move with ESLint 10. |
| `dotenv` | 17.4.2 | 18.0.3 | Major runtime-loading change; verify default import, `config({path, processEnv, override, quiet})`, missing-file errors, and environment precedence. |
| `eslint` | 9.39.5 | 10.11.0; move to `devDependencies` | Current release is reported unsupported by the audit. Node 24 meets ESLint 10's engine requirement. |
| `eslint-plugin-import` | 2.32.0 | Replace with `eslint-plugin-import-x` 4.17.1 | The current plugin's peer range stops at ESLint 9. Import-x supports ESLint 10. Add `eslint-import-resolver-node` 0.4.0 directly. |
| `eslint-plugin-react` | 7.37.5 | Remove | No `.jsx` files, JSX syntax, React dependency, or React rules are needed in this server repository. Its peer range stops at ESLint 9. |
| `eslint-plugin-react-hooks` | 7.1.1 | Remove | No React Hooks are present. |
| `firebase` | 12.19.0 | Remove | No web SDK import exists. API and exporter code use `firebase-admin`. Removal should clear the current Firebase compatibility peer failures. |
| `firebase-admin` | 14.4.0 | 14.5.0 | Keep modular Admin imports and named-database behavior; run all Firebase target, auth, profile, and exporter mocks. |
| `formidable` | 3.5.4 | Retain 3.5.4 and make it the actual multipart implementation | Runtime code currently imports a vendored older copy instead. Migrate only after real multipart tests establish limits, filenames, malformed-body behavior, cleanup, and error codes. |
| `globals` | 17.12.0 | Retain; move to `devDependencies` | Lint-only package. |
| `googleapis` | 180.0.0 | 181.0.0 | Major generated-client release. Test Forms and Sheets client construction plus request shapes without making live calls. Node 24 exceeds its Node 22 minimum. |
| `hexoid` | 2.0.0 | Remove after Formidable migration | It is used only by the vendored Formidable copy; current Formidable uses CUID2. |
| `moment-timezone` | 0.6.3 | Remove; 0.6.4 only if a hidden consumer is identified | No repository call site was found. The application uses Day.js timezone plugins. |
| `nodemailer` | 10.0.9 | 10.0.10 | Patch release. Verify transporter construction and the injected mail-send contract; no live email. |
| `snoowrap` | 1.23.0 | Remove after replacing or retiring its three WIP scripts | The package is deprecated and owns every current high-severity audit path. Do not preserve it through overrides. |
| `ssl-root-cas` | 1.3.1 | Remove | No repository call site was found. Node 24's trust store remains the runtime behavior. |
| `eslint-config-flat-gitignore` | 2.4.0 | Remove | The config uses `includeIgnoreFile` from `@eslint/compat`, not this package. The native config can express ignores directly. |
| `supertest` | 7.2.2 | 7.3.0 | Patch/minor test-only update; the full route suite is the compatibility check. |
| `vitest` | 5.0.0 | Exact 5.0.1 | Keep Vite 8.3.0 directly declared because Vitest 5 makes Vite a peer. Rerun all 301 tests. |

### Packages already at the stable current release

Retain these unless a phase-specific source audit shows that the dependency is unnecessary:

| Area | Packages |
| --- | --- |
| Google/auth | `@google-cloud/local-auth` 3.0.1 |
| HTTP/server | `axios` 1.20.0, `cors` 2.8.6, `express` 5.2.1, `helmet` 8.3.0 |
| Data/parsing | `csv-parse` 7.0.2, `dayjs` 1.11.23, `joi` 18.2.9, `json-2-csv` 5.6.0, `validator` 13.15.35, `zod` 4.6.5 |
| Media/files | `archiver` 8.0.0, `sharp` 0.35.4 |
| Integrations | `basic-ftp` 6.2.1, `flickr-sdk` 7.1.0, `node-fetch-cookies` 2.1.1 |
| Logging | `pino` 10.3.1, `pino-http` 11.0.0, `pino-pretty` 13.1.3 |
| Analysis | `express-useragent` 2.2.3, `geoip-lite` 2.0.3 |
| Fetch/runtime | `node-fetch` 3.3.2 |
| Test/build | `vite` 8.3.0 |

`fuse.js` and its sole WIP consumer were removed with the retired Snoowrap utilities. `basic-ftp` is used by a CommonJS log-fetch utility, and `node-fetch-cookies` is used by the RAFL utilities, so neither should be removed as an assumed Node 24 cleanup.

Do not downgrade `@eslint/compat`, `geoip-lite`, or Vitest based on stale or historical `latest` values from a single `npm outdated` display. Direct registry metadata confirms 2.1.1, 2.0.3, and 5.0.1 respectively as the current stable releases.

## Compatibility tests to add before source migrations

The broad API and project suite is healthy, but several dependency boundaries are either mocked above the library or untested. Add small contract tests before changing those boundaries.

### Multipart/Formidable

Use Supertest with in-memory or temporary files and the real parser to cover:

- a valid upload through each active multipart endpoint;
- multiple fields/files and the field shapes expected by handlers;
- configured file-size, total-size, field-count, and field-size limits;
- malformed boundary and interrupted-stream errors;
- temporary-file cleanup on success and failure;
- filename/path handling and the stable error-code mapping in `parseForm.js`.

Run the same tests once against the vendored parser and once against Formidable 3.5.4. Any behavior difference must be reviewed before deleting `src/util/formidable/` or `hexoid`.

### Environment loading

Expand `runtimeEnvironment.test.js` to invoke the real dotenv implementation against temporary `.env.local`, `.env.development`, and `.env.production` fixtures. Cover quoting, `#`, multiline values if used, `processEnv`, `override: false`, `quiet: true`, missing files, and the rule that the originally selected `NODE_ENV` wins over file contents.

### Firebase Admin

Keep all tests credential-free and verify:

- modular imports load under Node 24;
- initialization stays lazy and import-safe;
- app caching still keys on project, database, and credential path;
- named Firestore databases are passed through;
- token verification and owner/admin authorization behavior is unchanged;
- exporter imports do not initialize Firebase or read credentials.

### Google APIs and email

Add module-level or injected-client tests that construct Forms v1 and Sheets v4 calls and compare the method/options contract without sending a request. Retain the Nodemailer injected handler tests and add a transporter-construction smoke test with inert configuration if current coverage does not reach it.

### Deprecated Reddit client

If the three WIP Snoowrap scripts are still required, write tests around their observable Reddit request/response mapping and replace Snoowrap with a maintained client or the existing authenticated fetch pattern. Do not validate this migration against live Reddit. If the scripts are historical, remove or archive them and their dependency together so tracked scripts are not left broken.

## Upgrade phases

### Phase 0: Record a reproducible baseline

Implementation status: complete for repository changes and local validation. The development host is confirmed on Node 24.21.0 and Yarn 4.18.0. Before any production deployment, perform the documented read-only version check against the protected production `REMOTE_NODE_BIN` directory; repository access does not expose that host-specific value.

1. Start from a clean worktree and create `internal-docs/dependency-upgrade-implementation-report.md` for actual results.
2. Add `.nvmrc` with Node 24.21.0, narrow `engines.node` to `>=24.11.0 <25`, and make CI consume `.nvmrc` rather than a floating major where practical.
3. Keep Yarn at 4.18.0. Use Corepack and `yarn install --immutable`; do not create an npm lockfile.
4. Confirm the protected development and production `REMOTE_NODE_BIN` locations provide a compatible Node 24 before any later deployment. Do not deploy or restart PM2 during the upgrade work.
5. Update `AGENTS.md` and the applicable development/release references when the Node declaration changes.
6. Record direct/resolved counts, peer output, audit output, lint warnings, test count, and import-safety checks.

Baseline commands:

```sh
node --version
corepack yarn --version
yarn install --immutable
yarn info --recursive --name-only
yarn explain peer-requirements
yarn dedupe --check
yarn npm audit --all --recursive
yarn lint
yarn test --run
```

Exit criteria:

- [x] Local, CI, development server, and production runtime declarations agree on Node 24.21.0; the development binary is confirmed and the installed production binary remains a manual pre-Phase 1 check.
- [x] The baseline remains 68 files and 301 tests; Phase 0 intentionally adds one runtime-contract test.
- [x] Every existing lint warning and audit path is recorded before dependency changes begin.
- [x] No install uses `--force`, ignores peer requirements, or edits `yarn.lock` manually.

### Phase 1: Remove dead and unsupported dependency branches

Implementation status: complete on 2026-09-23 for the requested scope. The WIP Reddit scripts, `snoowrap`, `fuse.js`, and the Snoowrap-owned Form-data resolution were explicitly retained for a later checkpoint.

1. Remove `@devvit/public-api`, `firebase`, `moment-timezone`, `ssl-root-cas`, and `eslint-config-flat-gitignore` after repeating repository-wide static and dynamic import searches.
2. Remove the Firebase-web-owned `@grpc/grpc-js` resolution and the Devvit-owned `protobufjs` resolution; use `yarn why` to confirm the remaining supported dependency paths resolve without them.
3. Run `yarn install`, review every `package.json` and `yarn.lock` change, then run `yarn install --immutable` from the final manifest/lock pair.
4. Confirm that all four Firebase web SDK peer failures disappear. The audit is expected to retain two high and eleven moderate findings until the explicitly deferred Snoowrap work and later ESLint/Firebase checkpoints are complete.

Exit criteria:

- [x] No tracked runnable file imports a removed package.
- [x] `yarn explain peer-requirements` has no actionable unsatisfied requirement.
- [x] The Firebase web SDK compatibility branch and its four unsatisfied peer requirements are gone.
- [x] Tests, lint, and import-safety suites pass without loading credentials or contacting services.

### Deferred Reddit WIP dependency checkpoint

Implementation status: complete on 2026-09-23. The four WIP consumers were retired in commit `59387a3`; no tracked runnable file imports Snoowrap or Fuse, and removing their dependency branch reduced the resolved tree from 706 to 660 locators.

1. Keep the current WIP Reddit scripts, `snoowrap`, and `fuse.js` runnable until their ownership and required behavior are decided.
2. If the scripts are required, capture their observable request/response behavior under mocks and migrate them to a maintained client or the existing authenticated-fetch pattern. If they are historical, retire the scripts.
3. Remove `snoowrap` and its `form-data@~2.3.2` resolution together only after no tracked runnable script imports it.
4. Reconsider `fuse.js` only as part of that same WIP ownership decision.
5. Re-run the audit and confirm that the two high `ws` findings and the Snoowrap/request moderate findings disappear.

Exit criteria:

- [x] No tracked runnable file imports `snoowrap` or `fuse.js`.
- [x] `snoowrap`, `fuse.js`, and the Snoowrap-owned Form-data resolution are absent from the manifest and lockfile.
- [x] The old Request, Request Promise, WebSocket 3, UUID 3, and related deprecated branches are absent from the resolved tree.
- [x] The audit has no high-severity finding and retains only the two documented upstream deprecations.

### Phase 2: Replace the vendored Formidable implementation

Implementation status: complete on 2026-09-23. The same 16 multipart contract tests passed against the vendored parser and Formidable 3.5.4. The shared parser wrapper now closes the rejected-file cleanup race exposed by `maxFiles: 0`.

1. Add the real multipart contract coverage described above while the vendored parser is still active.
2. Audit the vendored diff against Formidable 3.5.4. The completed comparison found matching application-facing parser contracts and a material default-name generator change from `hexoid` to CUID2.
3. Change imports in upload, email-form, request-lock, and the tracked Reddit WIP upload utility from `src/util/formidable/src/index.js` to the package export.
4. Preserve endpoint-specific size limits, keep the existing centralized error mapping, and verify temporary-file lifecycle behavior.
5. Remove the vendored parser and `hexoid` only after the old/new contract comparison passes.
6. Confirm Formidable remains direct because application code now imports it. Do not rely on Supertest's transitive copy.

Exit criteria:

- [x] Real multipart requests pass through every active endpoint.
- [x] Malformed and oversized requests retain stable status/code responses.
- [x] No vendored Formidable code or `hexoid` dependency remains.
- [x] No unexpected upload file remains after tests.

### Phase 3: Apply low-risk current-line updates

Implementation status: complete on 2026-09-23. Nodemailer 10.0.10, Supertest 7.3.0, and exact Vitest 5.0.1 are installed; direct Vite remains 8.3.0. The highest-strategy deduplication pass found no eligible package, and the required registry recheck found no newer stable release among the packages designated to remain unchanged in this phase.

Update one small group at a time:

1. `nodemailer` 10.0.9 -> 10.0.10.
2. `supertest` 7.2.2 -> 7.3.0.
3. `vitest` 5.0.0 -> exact 5.0.1 while retaining direct Vite 8.3.0.
4. Run `yarn dedupe --strategy highest`, review the lock diff, and verify any reported deduplication does not affect runtime behavior. The Phase 1 removals already eliminated the previous `@types/node` deduplication candidate.

Run the closest focused tests after each package, then full lint and tests once at the end of the phase. Keep `pino`, Express, Sharp, and the other already-current packages unchanged unless a newer stable release appears when implementation begins.

### Phase 4: Migrate ESLint 9 to ESLint 10

Implementation status: complete on 2026-09-23. ESLint 10.11.0 and Import X 4.17.1 lint the same 202-file scope with zero diagnostics. All three newly recommended ESLint 10 rules remain enabled, the unsupported ESLint audit entry is gone, and the explicit HumanFS resolution was removed.

The sibling project already completed this migration and provides a proven model in `../../lpu-belt-explorer/internal-docs/major-dependency-upgrade-implementation-report.md`. This server repository is simpler because it has no React or JSX source.

1. At an ESLint 9 checkpoint, rewrite `eslint.config.js` as native flat config using `@eslint/js` recommended rules and explicit project rules.
2. Remove `FlatCompat`, `fixupConfigRules`, `fixupPluginRules`, React settings, JSX parsing, React plugins, and the unused gitignore package.
3. Replace `eslint-plugin-import` with `eslint-plugin-import-x` 4.17.1 and declare `eslint-import-resolver-node` 0.4.0 directly.
4. Move ESLint, `@eslint/js`, Globals, Import-x, and the resolver into `devDependencies`.
5. Preserve current lint file scope, `.gitignore` behavior, project ignores, extension rules, globals, and warning severities. The WIP exclusion remains unless that directory is explicitly brought into maintained scope.
6. Run the official ESLint v9-to-v10 codemod in dry-run mode and search for `eslint-env`, custom rules, RuleTester, Linter APIs, and removed CLI flags.
7. Upgrade to ESLint 10.11.0 and `@eslint/js` 10.0.1.
8. Review the new recommended rules, especially `no-unassigned-vars`, `no-useless-assignment`, and `preserve-caught-error`. Fix real issues in a focused change or record deliberate temporary exceptions; do not silently weaken unrelated rules.
9. Resolve the current two source warnings or record them as pre-existing with owners. The React detection warning must disappear with the unused React config.

Exit criteria:

- [x] ESLint 10 loads the config natively with no compatibility adapter or peer override.
- [x] The same intended files are linted before and after migration.
- [x] Lint has no unexplained new diagnostic and no React-package warning.
- [x] The ESLint 9 audit entry and `@humanfs/node` resolution are gone.

### Phase 5: Upgrade dotenv 17 to 18

Implementation status: complete on 2026-09-23. Dotenv 18.0.3 retains the repository's ESM default import and explicit `config({path, processEnv, override, quiet})` contract. Real temporary-file tests cover all environment selections and parsing/precedence behavior without emitting configuration output.

1. Upgrade only dotenv and regenerate the lockfile.
2. Run the real-file environment tests under Node 24.
3. Verify that the repository uses the supported explicit API rather than removed preload behavior: it imports dotenv and calls `config()` with an explicit environment file.
4. Confirm the default import shape still works in ESM. If dotenv 18 requires a named import or another supported form, make that source change in this phase only.
5. Verify `quiet: true` prevents configuration noise in tests, server startup, direct scripts, and PM2 logs.
6. Run runtime configuration, server configuration, import-safety, and full tests. Do not start the production service or run a live job.

Exit criteria:

- [x] Local/development/production file selection and precedence are unchanged.
- [x] Missing/invalid configuration retains stable error codes.
- [x] No environment values or paths are logged unexpectedly.

### Phase 6: Upgrade Firebase Admin and remediate its transitive audit path

Implementation status: complete on 2026-09-23. Firebase Admin 14.5.0 uses its current compatible optional dependencies, including Storage 8.2.0. A package-scoped resolution supplies UUID 11.1.1 only to Gaxios 6.7.1; modular Firebase imports, authentication boundaries, profiles, named databases, exporters, and import safety pass mocked tests.

1. Upgrade `firebase-admin` 14.4.0 -> 14.5.0 without changing the Firebase web SDK, because that package should already be removed.
2. Confirm modular `firebase-admin/app`, `/auth`, and `/firestore` imports and named-database access.
3. Run the API/service and exporter mock suites, including import-safety checks.
4. Re-run the audit and `yarn why gaxios uuid glob node-domexception`.
5. If the latest supported Firebase Admin tree still selects `gaxios` 6.7.1 with vulnerable UUID 9.0.1, first check for a compatible upstream Google package update. If none exists, use a Yarn resolution scoped specifically to `gaxios@6.7.1/uuid` at 11.1.1. Inspect the installed Gaxios use (currently `v4()` only), test UUID generation and Gaxios/Firebase imports, and record why the cross-major resolution is safe. Do not apply a global UUID override.
6. Do not force newer `glob`, `rimraf`, `fetch-blob`, or `node-domexception` majors into Firebase's optional dependency tree. If the two deprecation entries remain on the latest supported tree, document the exact `yarn why` paths and monitor upstream.

Exit criteria:

- [x] Firebase initialization, token verification, profiles, named database selection, and exporters pass mocked tests.
- [x] No import reads credentials, contacts Firebase, or writes export state.
- [x] The Gaxios UUID advisory path is removed with a tested package-scoped resolution; the remaining UUID 3 path belongs only to the separately deferred Snoowrap/request branch.
- [x] Remaining Firebase audit output contains no actionable vulnerability with a compatible supported fix.

### Phase 7: Upgrade Google APIs 180 to 181

Implementation status: complete on 2026-09-23. Google APIs 181 retains Google APIs Common 9.0.4 and Google Auth 11.1.0, the resolved tree remains at 706 locators, and the existing scoped Gaxios 6/UUID 11 resolution is still required.

1. Upgrade only `googleapis` and its lockfile branch.
2. Confirm `@google-cloud/local-auth` remains compatible and no duplicate incompatible Google Auth runtime is introduced.
3. Run mocked Forms v1 and Sheets v4 construction/request-shape tests.
4. Verify token/cache path behavior without reading real OAuth credentials.
5. Use `yarn why googleapis-common google-auth-library gaxios uuid` to review deduplication and confirm the upgrade does not reintroduce the remediated UUID path. Retain the package-scoped Gaxios resolution unless the upgraded tree no longer contains Gaxios 6.7.1.
6. Do not run the RAFL utilities against live Google Forms or Sheets during implementation.

Exit criteria:

- [x] Forms and Sheets client contracts are unchanged under mocks.
- [x] OAuth configuration stays external and no secret is logged.
- [x] The final Google dependency tree has no avoidable duplicate major or vulnerable transitive package.

### Phase 8: Final tree validation and development rollout

From a clean Node 24.21.0 environment:

```sh
corepack yarn install --immutable
yarn info --recursive --name-only
yarn explain peer-requirements
yarn dedupe --check
yarn npm audit --all --recursive
yarn lint
yarn test --run
node --check src/lpubeltsApiServer.js
```

Also run focused syntax/import checks for changed standalone scripts. Do not execute jobs that access Firestore, Reddit, Flickr, FTP, email, Google services, or production files.

Review the final manifest and lockfile for:

- every direct package being imported or intentionally retained;
- lint/test packages under `devDependencies`;
- no npm lockfile;
- no prerelease dependency unless separately approved;
- no stale resolution;
- only one intended major for Firebase Admin, Google Auth, Vite/Vitest, and ESLint families where their ranges can converge;
- the remaining Google Auth 9.15.1, 10.5.0, and 11.1.0 majors are still required by their upstream ranges, and Gaxios 6.7.1 still resolves UUID 11.1.1;
- native-package install results for Sharp and GeoIP on the development and production host architecture.

After code review, deploy to the development environment through its normal upload/install/restart procedure and perform bounded manual checks for readiness, public collection stats, authenticated profile access, upload/email-form/request-lock parsing, Flickr info, RAFL preview, and structured logging. Development PM2 restart and any integration call still require the approval rules in `AGENTS.md`. Production deployment is a later, separately approved operation.

## Verification matrix

| Change | Required automated checks | Manual development check before production |
| --- | --- | --- |
| Dependency removal/resolutions | Static import scan, `yarn why`, peer requirements, audit, immutable install, full tests | None for confirmed dead packages; handle WIP ownership in the deferred Reddit checkpoint |
| Formidable | New real multipart tests, upload/email/request-lock suites, full tests | Representative valid and rejected uploads with non-sensitive files |
| ESLint 10 | Old/new file-list comparison, codemod dry run, full lint, full tests | IDE uses Node 24 and the same flat config |
| dotenv 18 | Real temp-file tests, runtime/server config suites, import safety | Local and development startup load only the intended file |
| Firebase Admin | Firebase target/auth/profile/export mocks, import safety, audit | Development database auth/profile read only after separate approval |
| Google APIs | Mocked Forms/Sheets/auth tests, import safety, audit | Development RAFL preview only after separate live-service approval |
| Nodemailer | Injected transport/send tests | Development mail sink only after separate approval |
| Vitest/Supertest | All 74+ files and 336+ tests | None beyond normal development smoke tests |

At every checkpoint:

- use Node 24 and Yarn 4.18.0;
- review `package.json` and `yarn.lock`, never edit the lockfile manually;
- run focused checks first and one full `yarn lint && yarn test --run` after the phase stabilizes;
- run the audit after every lockfile change that affects an advisory path;
- avoid `--force`, peer-dependency bypasses, and global transitive overrides;
- record version, source/config changes, exact commands, result counts, audit differences, and unresolved upstream issues in the implementation report.

## Delivery sequence

Recommended review units:

1. Node 24.21/Yarn baseline and implementation report.
2. Unused packages and stale resolutions.
3. Multipart tests and vendored Formidable replacement.
4. Nodemailer, Supertest, Vitest, and lockfile deduplication.
5. ESLint 10 native flat-config migration.
6. dotenv 18.
7. Firebase Admin 14.5 and scoped audit remediation.
8. Google APIs 181.
9. Deferred Reddit WIP decision and Snoowrap cleanup.
10. Final integrated validation and development rollout notes.

Do not combine the Formidable, ESLint, dotenv, Firebase, and Google API migrations into one lockfile commit. Keeping these checkpoints separate makes failures bisectable and lets a runtime migration be reverted without losing unrelated security cleanup.

## Definition of done

- [ ] Every direct package is current, removed, or explicitly retained with an owner and compatibility reason.
- [ ] Node is pinned to the current Node 24 LTS patch for local/CI use and constrained below Node 25 for compatibility with Vitest 5.
- [ ] Yarn remains on current stable 4.18.0 and immutable installs reproduce the lockfile.
- [x] No deprecated Snoowrap/request tree or high/critical advisory remains.
- [x] The Firebase web SDK, unused tooling packages, and stale resolutions are gone.
- [x] The application uses supported Formidable rather than an undocumented vendored older copy.
- [x] ESLint 10 runs without compatibility or peer overrides.
- [x] dotenv, Nodemailer, Supertest, and Vitest pass their focused contracts.
- [x] Firebase Admin passes its focused contracts.
- [x] Google APIs pass their focused contracts.
- [ ] `yarn explain peer-requirements` has no actionable failure and `yarn dedupe --check` is clean.
- [ ] Audit output has no actionable vulnerability for which a compatible supported upgrade exists; any upstream-only deprecation is documented with its dependency path.
- [ ] Full lint and all tests pass under the pinned Node version with no unexplained warning.
- [ ] No production deployment, PM2 restart, or live-data/live-service job occurs without explicit approval.

## Primary references

- [Sibling dependency upgrade plan](../../lpu-belt-explorer/internal-docs/major-dependency-upgrade-plan.md)
- [Sibling dependency upgrade implementation report](../../lpu-belt-explorer/internal-docs/major-dependency-upgrade-implementation-report.md)
- [Node.js 24.21.0 archive](https://nodejs.org/en/download/archive/v24.21.0)
- [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [ESLint flat-config migration guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [Vitest 5 migration guide](https://vitest.dev/guide/migration/)
- [Firebase Admin Node release notes](https://firebase.google.com/support/release-notes/admin/node)
- [Google APIs Node client releases](https://github.com/googleapis/google-api-nodejs-client/releases)
- [dotenv changelog](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md)
- [Nodemailer releases](https://github.com/nodemailer/nodemailer/releases)
- [Yarn manifest and resolutions](https://yarnpkg.com/configuration/manifest)
- [Yarn deduplication](https://yarnpkg.com/cli/dedupe)
- [Request SSRF advisory](https://github.com/advisories/GHSA-p8p7-x288-28g6)
- [Old WebSocket header DoS advisory](https://github.com/advisories/GHSA-3h5v-q93c-6h6q)
- [Old WebSocket fragment memory-exhaustion advisory](https://github.com/advisories/GHSA-96hv-2xvq-fx4p)
