# Dependency Upgrade Skill Guide

Status: active  
Created: 2026-09-21

## Purpose

The `dependency-upgrade` skill provides a repository-aware process for assessing and implementing npm dependency updates in `lpu-belt-explorer`. It complements Dependabot: Dependabot monitors versions and opens pull requests, while the skill checks compatibility, identifies required migrations, implements source or configuration changes, and validates the result at a depth appropriate to the risk.

The skill covers:

- individual and grouped Dependabot pull requests;
- direct and transitive package updates;
- major-version migrations;
- Node, peer-dependency, ESM/CommonJS, React, browser, configuration, and lockfile compatibility;
- upgrade-related installation, test, lint, build, and CI failures;
- security updates when the affected advisory and requested package scope are known.

It does not add dependencies for unrelated feature work. Invoking the skill also does not authorize merging, closing, pushing, deploying, or changing a pull request unless the request separately asks for that action.

## How to invoke it

Start the request with `$dependency-upgrade`, followed by the task and its scope. File references are optional when the relevant files or pull request are available to the agent.

This is a natural-language skill invocation, not a shell command. It has no fixed flags or positional arguments; the information below tells the agent what outcome and boundaries you want.

The best requests identify:

1. **Task mode:** assess/review, implement, diagnose, or inventory.
2. **Scope:** pull-request number or URL, package names, version transition, or all available updates.
3. **Desired outcome:** report only, make local changes, update an existing branch, or prepare a reviewable migration.
4. **Known constraints:** packages that must stay grouped, versions that must remain pinned, compatibility requirements, or checks that must be included.
5. **Failure evidence, when applicable:** the failing command and complete relevant error output.

When the request names a Dependabot pull request, the agent can obtain exact versions and the diff from that PR. When no PR exists, provide the target version if a particular release is required. Otherwise, explicitly authorize an inventory of available versions so the agent can determine appropriate targets.

## Common requests

### Assess one Dependabot pull request

Required information:

- pull-request number or URL;
- whether the result should remain review-only, if that is not already clear from words such as “assess” or “review.”

```text
$dependency-upgrade
Assess Dependabot PR #297. Review compatibility, migration requirements,
lockfile changes, relevant call sites, and CI coverage. Do not change files
or modify the PR. Report readiness as ready, ready after manual check, or blocked.
```

The assessment uses the exact versions and diff in the PR. It does not expand the task to unrelated available upgrades.

### Assess all open Dependabot pull requests

Required information:

- which repository, if it is not the current repository;
- any preferred prioritization, such as security updates first.

```text
$dependency-upgrade
Assess all open Dependabot PRs in this repository. For each PR, classify risk,
check compatibility and migrations, inspect affected call sites and CI results,
and recommend merge, rebase/manual check, or close. Review only.
```

### Implement an existing Dependabot pull request

Required information:

- pull-request number or URL;
- whether to work from the PR branch or reproduce the change locally when that choice matters;
- any required manual behavior to preserve.

```text
$dependency-upgrade
Implement Dependabot PR #295 locally. Apply all source, configuration, and test
migrations required for the exact versions in the PR. Preserve the current filter
drawer behavior and run the relevant browser journey in addition to ci-pr.
Do not push or merge.
```

The skill updates only the requested package set and dependencies npm must change to satisfy it. It does not substitute a newer release for the PR’s target version without a reason and explicit scope change.

### Upgrade a package without a Dependabot pull request

Required information:

- package name or coordinated package family;
- exact target version or allowed target range;
- whether implementation is requested;
- behavior or environment constraints that are not discoverable from the repository.

```text
$dependency-upgrade
Upgrade react-router-dom and its required peer packages to 7.18.3. Implement the
migration, preserve all current routes and redirects, update tests where behavior
changed, and run route-focused tests followed by ci-pr. Do not push.
```

If the target is intentionally open-ended, say so explicitly:

```text
$dependency-upgrade
Determine the newest Firebase web SDK version compatible with this repository’s
Node, React, and Vite versions, then implement that upgrade. Use official migration
guidance and do not access live Firebase services.
```

### Review or implement a grouped update

Required information:

- group name or complete package list;
- exact versions or Dependabot PR;
- whether packages must remain version-aligned.

```text
$dependency-upgrade
Review and implement the Vitest group from PR #296: vitest, @vitest/ui, and
@vitest/coverage-v8. Keep the packages on the same version, resolve peer constraints
without bypass flags, and run npm ci and ci-pr. Do not push or merge.
```

### Diagnose an upgrade-related failure

Required information:

- package/version change or PR;
- failing command;
- relevant error output;
- whether the failure also occurs before the upgrade, if known.

```text
$dependency-upgrade
Diagnose the npm ci failure in Dependabot PR #296. The failure is:

[paste the relevant npm error]

Determine whether the package group is incomplete or version-misaligned. Implement
the smallest compatible fix locally and rerun npm ci and ci-pr. Do not change
unrelated dependencies.
```

For a CI-only failure, include the failed job or log URL when available:

```text
$dependency-upgrade
Assess the build failure in PR #123: [job URL]. The local install succeeds, but
npm run build:test fails in GitHub Actions. Identify whether the upgrade changes
Node engines, package exports, or environment handling, then implement and verify
the fix locally.
```

### Inventory available upgrades and propose groups

Required information:

- package scope, such as production dependencies, development dependencies, or all;
- whether the task is report-only or may update files;
- packages or major versions that must be excluded.

```text
$dependency-upgrade
Inventory all available direct npm upgrades. Classify runtime and tooling risk,
identify peer-dependent package families, and propose implementation groups in a
safe order. Report only; do not update package.json or package-lock.json.
```

For implementation, constrain the batch:

```text
$dependency-upgrade
Inventory and implement compatible patch and minor development-dependency updates.
Exclude ESLint and all major upgrades. Keep peer-dependent families aligned, then
run npm ci and ci-pr.
```

### Assess or implement a security update

Required information:

- advisory URL or identifier, when available;
- affected package and requested version/PR;
- whether only assessment or implementation is wanted.

```text
$dependency-upgrade
Assess and implement the package update required by GHSA-XXXX-XXXX-XXXX. Confirm
that the target version fixes the advisory, keep changes within the affected
dependency chain, and run the checks appropriate to its runtime impact. Do not run
a broad npm audit fix.
```

## Expected result

For every completed assessment or implementation, the agent reports:

- exact package version transitions;
- compatibility and migration sources reviewed;
- affected application, configuration, and test call sites;
- changes made, or concrete findings for a review-only task;
- commands actually run and their results;
- any remaining visual or manual checks;
- a readiness decision: `ready`, `ready after manual check`, or `blocked`.

Passing installation and CI are evidence, but they are not sufficient by themselves. The skill also evaluates whether those checks exercise the changed runtime, browser, configuration, or developer-tool behavior.
