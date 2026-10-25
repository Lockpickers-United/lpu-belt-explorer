# Dependency Upgrade Definition-of-Done Verification Plan

Review date: 2026-09-23

Execution status: complete on 2026-09-24. Results and the remaining manual
rollout checks are recorded in
`internal-docs/dependency-upgrade-implementation-report.md`.

Scope: the seven unchecked criteria in the Definition of done section of
`internal-docs/dependency-upgrade-plan.md`. This review uses the final Phase 8
results in `internal-docs/dependency-upgrade-implementation-report.md`, the
current manifest and lockfile, the production workflow, and fresh local tree
diagnostics. It does not authorize or require a deployment, PM2 restart, or
live-service operation.

## Assessment

The unchecked list is mostly stale relative to the Phase 8 implementation
report. Five criteria already have strong recorded evidence. Direct-package
currency and audit status still need a fresh registry-backed check because both
can change without a repository change.

| Criterion | Current evidence | Remaining verification or remediation |
| --- | --- | --- |
| Every direct package is current, removed, or explicitly retained with an owner and compatibility reason | Phase 8 records 27 runtime and 7 development dependencies. Every runtime dependency has a tracked import or configuration consumer, lint/test packages are under `devDependencies`, and Vite is intentionally direct as Vitest's peer. | Produce a dated comparison of all 34 direct packages against their stable registry `latest` tags. Record the owning callsite or configuration and a reason for every retained non-current version. |
| Node is pinned to the current Node 24 patch for local/CI use and constrained below Node 25 | `.nvmrc` contains 24.21.0, `engines.node` is `>=24.11.0 <25`, CI consumes `.nvmrc`, and `nodeRuntimeContract.test.js` prevents drift. The official `latest-v24.x` archive reports 24.21.0. A local pinned binary also reports v24.21.0. | Rerun the runtime-contract test during the final clean validation. Keep the production `REMOTE_NODE_BIN` check as a predeployment prerequisite; it is not necessary to deploy in order to close this repository criterion. |
| Yarn remains on stable 4.18.0 and immutable installs reproduce the lockfile | `packageManager` pins Yarn 4.18.0, the official Yarn release list identifies 4.18.0 as latest, and Phase 8 records a successful immutable install. | Repeat the immutable install in a clean checkout and prove that `package.json` and `yarn.lock` do not change. |
| Peer requirements have no actionable failure and deduplication is clean | Phase 8 records both checks as clean. A fresh run under Node 24.21.0 reported every peer request as satisfied, including intentionally absent optional peers, and `yarn dedupe --check` reported no candidate. | Save the concise result in the implementation report and mark the criterion complete after the combined final gate passes. |
| Audit output has no actionable compatible fix and upstream-only deprecations are documented | Phase 8 records zero high or critical findings and two moderate upstream deprecations, with dependency paths and the reason broad overrides are inappropriate. | Refresh the registry-backed audit and check whether supported parent releases now eliminate either path. Upgrade and retest if a compatible fix exists; otherwise refresh the documented path and review date. |
| Full lint and all tests pass under pinned Node without unexplained warnings | Phase 8 records lint at 0 errors and 0 warnings and the complete suite at 74 files and 336 tests. | Repeat lint and the full suite from the same clean immutable installation under Node 24.21.0. Run where Supertest can use local loopback sockets. |
| No production deployment, PM2 restart, or live-data/live-service job occurs without explicit approval | Every implementation phase records that no such operation occurred. The production workflow is manual, restricted to `main`, and protected by the GitHub `production` environment. | Add a final historical attestation to the implementation report. Do not perform a production action merely to test this negative criterion. |

Primary external version references:

- Node latest-v24 archive: <https://nodejs.org/download/release/latest-v24.x/>
- Yarn releases: <https://github.com/yarnpkg/berry/releases>

## Verification sequence

### 1. Preserve a clean and reproducible starting point

Run the final gate in a clean checkout or CI job so generated local installation
metadata cannot obscure the result. Select the `.nvmrc` runtime explicitly; the
default agent shell observed during this review was Node 23.11.0 and is outside
the repository contract.

Record these versions before any other check:

```sh
node --version
corepack yarn --version
```

Expected output is Node v24.21.0 and Yarn 4.18.0. If the selected Node version is
different, stop and select `.nvmrc` rather than interpreting later failures.

### 2. Refresh direct-package disposition

Read `dependencies` and `devDependencies` from `package.json` and query registry
metadata for each package. Use stable `latest` tags rather than prerelease,
`next`, canary, or historical maintenance tags. Record a table containing:

- package name;
- runtime or development classification;
- declared and resolved versions;
- stable registry `latest` version and lookup date;
- importing source file, configuration consumer, or peer owner;
- disposition: current, upgrade, remove, or retain;
- compatibility reason and responsible subsystem for any retention.

For a newer compatible release, update the package in a focused checkpoint,
review the lockfile, and run the nearest contract tests. For a newer breaking
major, either schedule a separate migration or retain the current supported
version with the concrete incompatibility and owner recorded. Do not classify a
package as retained merely because it is already installed.

Weekly Dependabot configuration is useful for detecting later drift but is not
the evidence for this point-in-time sign-off.

### 3. Prove the install and dependency tree

From the clean checkout under the pinned runtime, run:

```sh
corepack yarn install --immutable
git diff --exit-code -- package.json yarn.lock
corepack yarn explain peer-requirements
corepack yarn dedupe --check
```

Acceptance requires:

- no manifest or lockfile change;
- no unsatisfied actionable peer requirement;
- intentionally absent optional peers shown as satisfied;
- `No packages can be deduped using the highest strategy`.

If a peer fails, inspect its hash with
`corepack yarn explain peer-requirements <hash>` and remediate the direct owner
instead of adding a broad peer override. If deduplication becomes available,
run the highest-strategy deduplication, review every lockfile change, repeat the
immutable install, and rerun affected tests.

### 4. Refresh and classify the audit

Run the repository report generator under the pinned runtime:

```sh
corepack yarn security:scan
```

The script writes ignored JSONL and Markdown reports under `logs/`. Its exit code
is 1 when it successfully reports findings, so review the parsed results rather
than treating every nonzero exit as an execution failure.

The expected remaining paths are:

1. `firebase-admin` -> Firestore -> Firestore API -> Google GAX -> Rimraf ->
   `glob@10.5.0`.
2. Firebase Google request clients -> `node-fetch` -> `fetch-blob` ->
   `node-domexception@1.0.0`.

Confirm the paths with:

```sh
corepack yarn why glob
corepack yarn why node-domexception
corepack yarn why rimraf
corepack yarn why fetch-blob
corepack yarn why node-fetch
```

For each finding, inspect the current supported releases and declared ranges of
the owning direct and transitive packages. If a compatible supported upgrade
removes a finding, apply it and rerun the relevant Firebase or Google contract
tests. If no compatible upgrade exists, update the implementation report with
the current path, lookup date, upstream owner, and reason an override would
cross a supported range.

Acceptance requires zero high or critical findings and no moderate or low
finding with an available compatible supported fix.

### 5. Run the final quality gate

Use the same clean immutable installation and pinned runtime:

```sh
corepack yarn vitest run src/config/nodeRuntimeContract.test.js
corepack yarn lint
corepack yarn test --run
```

Acceptance requires the runtime-contract test to pass, lint to report zero
errors and zero warnings, and the complete mocked suite to pass. The current
expected suite result is 74 files and 336 tests. If the execution environment
prevents Supertest from opening loopback listeners, repeat the complete suite in
CI or another environment that permits local sockets; do not weaken or skip the
affected tests.

### 6. Record completion without causing live effects

Update `internal-docs/dependency-upgrade-implementation-report.md` with:

- validation date and exact Node/Yarn versions;
- direct-package disposition table or a link to it;
- immutable-install, peer, and deduplication results;
- audit counts and remaining dependency paths;
- lint and test counts;
- an explicit statement that no production deployment, PM2 restart, or
  live-data/live-service job occurred during final verification.

Then check the applicable Definition-of-done boxes and change the plan status to
distinguish completed repository/tree validation from the separately
approval-gated development and production rollout work.

Do not use a deployment as evidence for the final safety criterion. The
read-only protected production Node/Yarn check remains required before the first
dependency-upgrade deployment, and development smoke checks remain subject to
the approvals described in `AGENTS.md` and the Phase 8 rollout checklist.
