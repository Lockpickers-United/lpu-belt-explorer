---
name: dependency-upgrade
description: Evaluate, review, and implement npm dependency upgrades for lpu-belt-explorer, including Dependabot pull requests, grouped package-family updates, major-version migrations, and upgrade-related CI failures. Use when assessing or applying package.json or package-lock.json version changes; do not use for adding a new dependency as part of unrelated feature work.
---

# Dependency Upgrade

Use Dependabot as the version monitor. Apply this skill when a dependency update needs repository-aware review or implementation.

Follow the repository `AGENTS.md` and its routed references. Do not merge, push, close or modify a pull request, deploy, or run a live-data workflow unless the user has separately authorized that action.

## Choose the task mode

- For a review request, inspect and report findings without changing files.
- For an implementation request, make the package, lockfile, configuration, source, and test changes needed to complete the upgrade.
- If the request names a Dependabot pull request, use its exact versions and diff as the initial scope. Do not expand it to every available upgrade.
- If the request asks about all available upgrades, inventory and classify them before changing files, then propose or implement compatible groups rather than installing every latest version at once.
- Keep packages that share peer dependencies or release versions together when their compatibility requires coordinated upgrades.

## Establish the upgrade baseline

Before changing dependencies:

1. Inspect the working tree and preserve unrelated user changes.
2. Read `package.json`, the relevant `package-lock.json` entries, `.nvmrc`, the Dependabot configuration, and the PR diff or proposed version range.
3. Classify each changed package as runtime, build, test, lint, type, script, or transitive infrastructure.
4. Find imports, configuration, mocks, test setup, scripts, overrides, and documented workflows that use the package. Search for package exports and affected APIs rather than relying only on the package name.
5. When existing failures could be confused with upgrade regressions, run the smallest useful baseline check before modifying the dependency.

Record the current version, target version, direct or transitive status, and reason the update is grouped or isolated.

## Compatibility and migration assessment

Use current primary sources: the package's official migration guide, release notes or changelog, API documentation, and published package metadata. For a major upgrade, reading the migration guidance is required. Also read it for minor or patch releases that change peer dependencies, engines, exports, defaults, browser behavior, build output, or test behavior.

Check all applicable items:

- Node and npm compatibility against `.nvmrc`, `engines`, CI setup, and deployment runtime.
- Peer-dependency compatibility across the complete package family. Do not bypass conflicts with `--force` or `--legacy-peer-deps`.
- ESM/CommonJS and package-export changes against this repository's ESM frontend, CommonJS `functions/` package, scripts, and configuration files.
- React compatibility, including hooks, Strict Mode, rendering behavior, refs, and test utilities.
- Browser support, CSS or visual defaults, accessibility behavior, bundle behavior, and SSR or global-object access where relevant.
- Configuration schema, command-line flags, environment variables, generated output, and CI workflow changes.
- Removed, renamed, or behaviorally changed APIs at every repository call site.
- Lockfile integrity, new transitive dependencies, install scripts, overrides, duplicated major versions, and unexpected package removals.
- Test doubles and mocks that may continue passing while no longer representing the upgraded library.
- Security-advisory scope when the update is security-driven. Verify the relevant advisory is addressed; do not run a broad `npm audit fix` that introduces unrelated updates.

Treat semver as an input, not a risk verdict. A patch can be high risk when it changes a build tool or peer constraint, and a major can be low impact when the package is unused.

## Risk and verification depth

Choose checks from actual impact:

- Low risk: compatible patch update with no relevant API, peer, engine, lockfile, or runtime changes. Run installation validation, the closest focused test when one exists, and `npm run ci-pr` before handoff.
- Medium risk: runtime minor, grouped update, test/lint/build tool change, changed transitive graph, or a migration confined to a small surface. Add focused tests for affected behavior and run `npm run ci-pr`.
- High risk: major upgrade; React, router, MUI, Nivo, Motion, Firebase, authentication, bundler, or virtualization change; peer/engine/module-system change; broad source migration; or user-visible behavior risk. Run focused tests, `npm run ci-pr`, and the relevant Playwright journey when one exists. Perform or clearly request a manual visual check when automation cannot validate the behavior.

Use the repository-specific minimums as the floor. For Firebase or Functions changes, read `.agents/references/firebase-data-safety.md` and use emulator-backed checks only when the repository guidance calls for them. Never validate an upgrade against live services or production data.

Use `npm ci` as the final clean-install validation when the updated lockfile is intended for handoff. This check must succeed without peer-dependency bypass flags before running `npm run ci-pr`.

## Implement the upgrade

Use the package manager and lockfile already owned by the repository. Update only the requested dependency set and dependencies npm must change to satisfy it.

- Prefer the target versions established by the Dependabot PR or user request. Do not substitute an unspecified `latest` version.
- Make required source and configuration migrations in the same change as the version update.
- Preserve supported behavior and remove obsolete compatibility code only when the new version makes it unnecessary and the removal stays in scope.
- Resolve peer and engine conflicts at their source. Do not suppress install errors or weaken tests.
- Inspect the final manifest and lockfile diff for unrelated churn before validation.
- Do not run generators, exporters, deployments, or live-data scripts as dependency validation.

If an upstream defect or incompatible peer range blocks the upgrade, stop implementation at a reviewable state. Report the exact incompatibility, evidence, safe version ceiling or upstream issue when known, and what change would unblock it.

## Review an upgrade

Review the package and lockfile changes together with affected application code. Findings should identify a concrete failure mode, the affected call site or workflow, and the required correction. Pay particular attention to:

- a grouped PR that omitted a required peer package;
- a passing build that does not exercise changed runtime or visual behavior;
- a lockfile-only success masking a deprecated or removed API;
- tests that require migration but were loosened or skipped instead;
- new runtime code accidentally placed in `devDependencies`, or tooling placed in `dependencies`;
- new lifecycle scripts, native binaries, or dependency duplication that materially changes installation or deployment.

Do not report generic upgrade risk as a finding without repository-specific evidence.

## Handoff

Report:

- packages and exact version transitions;
- compatibility and migration evidence reviewed;
- source, configuration, and test changes made;
- exact checks run and their outcomes;
- remaining manual checks or unresolved upstream limitations;
- a readiness result: `ready`, `ready after manual check`, or `blocked`.

Never describe an upgrade as safe solely because installation, tests, or CI passed.
