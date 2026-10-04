# Filter context refactor implementation report

## Status

Phase 3 is complete. Both applications now use URL-authoritative committed filter
state, draft-only local UI state, ID-based row actions, common field-visibility policy,
and parsed applied-group chips. All ten LPU data providers consume committed groups,
LPU route controls follow explicit allowed-key policy, and profile/safelock defaults
commit without overriding direct filtered URLs. The jointly owned pure modules and
portable tests remain byte-identical.

## Scope

This report tracks the filter-context refactor described in
`filter-context-refactor-evaluation.md`. Work through Phase 3 covers:

- the route-policy, codec, and row-state API contract;
- portable codec cases for legacy syntax, canonical serialization, repeated keys,
  empty values, opaque URL state, and round-trip equivalence;
- pure row-state operations for committed-plus-draft rendering, stable IDs, field
  changes, duplicate prevention, ID-based changes/removal, and UI-only empty value
  slots;
- coffee context, row UI, visibility, mini-context, and applied-chip integration; and
- byte-identical portable modules and tests in LPU;
- LPU context, route-policy, provider, advanced-row, drawer, and applied-chip
  integration; and
- LPU profile/safelock defaults plus atomic belt-scope URL actions.

Deployment, live-data access, generated-data updates, and unrelated filter matching
changes remain outside Phase 3.

## Progress

- [x] Read the repository architecture and testing guidance.
- [x] Confirm the LPU working tree had no pre-existing tracked changes; the evaluation
  document was already present as an untracked file supplied for this task.
- [x] Locate the LPU filter context, filter definitions, URL consumers, data-provider
  consumers, and existing route/browser tests.
- [x] Inspect the current `something.coffee` filter codec, context, display, row hook,
  and focused tests. That repository has no `AGENTS.md` and its working tree was clean.
- [x] Complete and verify the URL-key inventory for both projects.
- [x] Record contract decisions and canonical URL examples.
- [x] Record representative compatibility URLs from checked-in sources.
- [x] Run and record focused baseline tests in both projects.
- [x] Map every known issue to a required regression test.
- [x] Finalize the implementation boundary and shared-file ownership process.
- [x] Review the resulting documentation diff for unsupported claims and omissions.
- [x] Define the policy-aware codec signatures around `allowedFilterKeys` and original
  `URLSearchParams` preservation.
- [x] Expand the portable codec suite with passing compatibility/canonical cases and
  executable expected failures for behavior still missing from the runtime codec.
- [x] Add the pure `advancedFilterState.js` contract implementation without wiring it
  into a runtime consumer.
- [x] Add row-state tests for active-plus-draft rows, navigation disposal, clearing a
  value, changing a field, duplicate prevention, stable IDs, hidden-row operations,
  immutable group addition, and `false`/`0` values.
- [x] Run focused Vitest and ESLint verification in `something.coffee`.
- [x] Update the evaluation with Phase 1 API and malformed-input findings.
- [x] Implement the allowed-key policy, repetition normalization, opaque-parameter
  preservation, unique-field serialization, and shared non-empty-value rule.
- [x] Convert all 11 codec expected failures to ordinary passing tests.
- [x] Integrate the pure row-state helper into the coffee provider and remove mirrored
  committed filter state.
- [x] Preserve drafts only for matching local URL writes and discard them on unrelated
  navigation and browser history changes.
- [x] Replace visible-array row edits/removals with stable `_id` operations while
  retaining the underlying index for progressive option counts.
- [x] Apply one beta/auth/admin visibility predicate across coffee filter pickers.
- [x] Render applied chips from parsed active groups and delete a complete group without
  dropping unrelated drafts.
- [x] Move both normal and mini providers to explicit allowed-key counting and preserve
  `false`/`0` in URL writers.
- [x] Copy the hardened pure modules and portable tests byte-for-byte into LPU.
- [x] Run coffee focused/full tests and lint, plus LPU portable tests, lint, and
  cross-repository equality checks.
- [x] Update the evaluation and implementation report in both repositories.
- [x] Repair the post-Phase-2 add-value regression by retaining empty value slots as
  UI-only draft metadata while serializing only the row's non-empty values.
- [x] Add pure-state, provider, and real button-interaction regressions for the repaired
  mixed committed/draft row behavior.
- [x] Replace LPU's embedded codec and mirrored committed state with the shared pure
  helpers and explicit committed/UI selectors.
- [x] Derive LPU allowed filter keys from route field registries and declare the hidden
  `photographers` filter on lock-list routes.
- [x] Migrate all ten audited LPU data providers to `activeFilterGroups()` atomically.
- [x] Move LPU advanced rows to ID-based actions and one beta/auth/admin visibility
  policy while preserving progressive option counts over rendered UI rows.
- [x] Render LPU applied chips from parsed committed groups and make multi-value delete
  and exclude actions group-aware.
- [x] Update the LPU drawer to use committed status and UI rows for editing.
- [x] Replace profile/safelock initialization with a shared default-group hook that
  yields to direct filtered URLs.
- [x] Make belt tab/scope changes atomic after immutable URL writers exposed their
  previous reliance on shared `URLSearchParams` mutation.
- [x] Preserve existing hidden rows when editing the fallback blank row and synchronize
  that hook fix and regression test to coffee.
- [x] Add LPU context, hook, display, default, value-slot, and real provider-route
  regressions.
- [x] Run LPU focused/full tests, lint, test build, focused Playwright journeys, coffee
  focused verification, and cross-repository equality checks.
- [x] Update the evaluation and implementation report in both repositories for Phase 3.

## Working decisions

The evaluation now records these decisions in detail:

- Treat the URL as the sole source of committed filters.
- Keep incomplete advanced-filter rows as local draft state.
- Treat an empty value slot on a committed row as temporary UI metadata: existing
  non-empty values stay URL-committed and the slot remains visible until filled or
  removed.
- Use one committed group per field and normalize repeated representations
  deterministically.
- Address advanced rows by stable ID rather than visible-array index.
- Keep current filter edits as history replacements; explicit navigation pushes, and
  browser history restores URL-derived committed filters while discarding drafts.
- Preserve the current URL syntax during the synchronization refactor.
- Preserve unknown keys without treating them as filters, and make active keys an
  explicit route policy.
- Canonicalize compatible repetitions to one AND group and resolve incompatible
  repetitions to the last valid occurrence.
- Pass `{allowedFilterKeys}` to parsing/counting and pass the original
  `URLSearchParams` plus `allowedFilterKeys` to serialization. This is required to
  preserve opaque repeated keys while replacing only managed filter fields.
- Normalize malformed syntax by dropping empty groups/segments and retaining unmatched
  single operator characters and dangling backslashes as literals.
- Keep visibility outside the pure state helper; project adapters select visible rows,
  while row edits always target the underlying `_id`.
- LPU route adapters derive allowed keys from `filterFields`; only declared hidden keys
  extend that set. Opaque controls remain URL-preserved but never affect filter count or
  data filtering.
- Treat coupled route-control changes as one filter action. Belt tab/scope changes
  delete legacy `belt` and set `tab` in the same `addFilters()` call.

## Audit findings added to the evaluation

- The global LPU non-filter list omits `uid` and `hours`, which are control state on
  `/userinfo` and `/recent`.
- `belt` cannot be globally classified: it is lock-list scope state but a real filter
  for ranking-request, scorecard, scorecard-exploration, and RAFL-entry routes.
  Classification now uses `assignedBelt`, matching its mapped data field and avoiding
  that collision on the classification route.
- `photographers` is an undeclared hidden lock filter used by both mapped lock data and
  the image gallery. The route adapter must either declare that contract or retire it
  separately.
- Coffee's global list omits `uid`, `rank`, and PSD `sampleSet`; several copied keys in
  the list have no active coffee consumer and are retained only for compatibility.
- Routes that pass an empty `filterFields` array currently treat any unknown query key
  as a data filter. The target policy gives those routes zero active keys by default.
- Checked-in LPU links cover single-value filter compatibility, but none cover the
  advanced `||`, `@@`, or negation syntax. Synthetic codec fixtures are therefore part
  of the required corpus.

## Verification log

- `npx vitest run tests/vitest/LockListRoute.test.jsx tests/vitest/SafelocksRoute.test.jsx tests/vitest/ContentRoutes.test.jsx`
  - Passed: 3 files, 16 tests.
  - Repeated successfully after the committed classification rename, at LPU revision
    `4ff5e2cf4ec848d4b0082704ecd06918f9e2039a`.
- `npx eslint src/data/filterFields.js src/classification/ClassificationDataProvider.jsx`
  - Passed with no errors or warnings after the `assignedBelt` rename.
- `yarn workspace @starter/client vitest run src/context/filterUrlState.spec.js src/context/FilterContext.spec.jsx src/filters/AdvancedSelect.spec.jsx src/filters/filterEntriesAdvanced.spec.js`
  - Passed: 4 files, 12 tests in `something.coffee`.
  - The first sandboxed attempt could not write Vite's temporary config cache outside
    the LPU workspace; the approved rerun completed successfully.
- Read-only Node checks confirmed the coffee codec's exact OR, AND, negation, and
  reserved-character wire forms. A repeated-field check confirmed the current lossy
  mixed-sign behavior documented in the evaluation.
- `yarn workspace @starter/client vitest run src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js src/context/FilterContext.spec.jsx src/filters/AdvancedSelect.spec.jsx src/filters/filterEntriesAdvanced.spec.js`
  - Passed: 5 files; 25 passing tests and 11 expected failures.
  - The expected failures are Phase 1 red-contract cases. They cover the policy API and
    known codec gaps and must become ordinary passing tests in Phase 2.
  - The initial sandboxed run failed before test collection because Vite could not write
    its sibling-repository `.vite-temp` config cache. The approved rerun completed.
- `yarn eslint client/src/context/filterUrlState.spec.js client/src/context/advancedFilterState.js client/src/context/advancedFilterState.spec.js`
  - Passed with no errors or warnings.
- `git -C ../something.coffee diff --check`
  - Passed with no whitespace errors.
- `yarn workspace @starter/client vitest run src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js src/context/FilterContext.spec.jsx src/filters/useAdvancedFilterRows.spec.jsx src/filters/FilterDisplayAdvanced.spec.jsx src/filters/AdvancedSelect.spec.jsx src/filters/filterEntriesAdvanced.spec.js`
  - Passed after integration: 7 files and 45 tests.
- `yarn workspace @starter/client test:run`
  - Passed during final Phase 2 validation: 11 files and 61 tests.
- `yarn workspace @starter/client vitest run src/context/FilterContext.spec.jsx`
  - Passed after the final navigation-render adjustment: 1 file and 5 tests.
- `yarn workspace @starter/client lint`
  - Passed with no errors or warnings after the final Phase 2 changes.
- `yarn test:run`
  - Passed after the add-value repair: 12 files and 64 tests in `something.coffee`.
- `yarn eslint src/context/advancedFilterState.js src/context/advancedFilterState.spec.js src/context/FilterContext.spec.jsx src/filters/AdvancedFilterValues.spec.jsx`
  - Passed with no errors or warnings after the add-value repair.
- `npx vitest run src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js`
  - Passed after synchronizing the repair to LPU: 2 files and 28 tests under Vitest 5.
- `npx eslint src/context/advancedFilterState.js src/context/advancedFilterState.spec.js`
  - Passed in LPU after synchronizing the repair.
- `npx vitest run src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js`
  - Passed in LPU under Vitest 5: 2 files and 27 tests.
- `npx eslint src/context/filterUrlState.js src/context/advancedFilterState.js src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js`
  - Passed in LPU with no errors or warnings.
- Four `git diff --no-index --exit-code` comparisons for the portable modules and tests
  - Passed with no differences between coffee and LPU.
- Builds and browser tests were not run because Phase 2 does not integrate the copied
  modules into LPU runtime bundles; route-level LPU validation belongs to Phase 3.
- `npx vitest run src/context/filterUrlState.spec.js src/context/advancedFilterState.spec.js tests/vitest/AdvancedFilterValues.test.jsx tests/vitest/FilterContext.test.jsx tests/vitest/FilterDisplay.test.jsx tests/vitest/useAdvancedFilterRows.test.jsx tests/vitest/useDefaultAdvancedFilterGroup.test.jsx tests/vitest/LockListRoute.test.jsx tests/vitest/SafelocksRoute.test.jsx tests/vitest/ContentRoutes.test.jsx`
  - Passed after Phase 3 integration: 10 files and 62 tests.
- `npm run test:run`
  - Passed after the final applied-exclusion regression: 29 files and 145 tests.
- `npm run ci-pr`
  - Passed after the final synchronized hook repair: lint completed with the one
    pre-existing warning below, all 29 files and 144 tests passed, and the test build
    completed successfully.
- `npm run lint`
  - Completed with no errors and one pre-existing warning:
    `src/entries/Entry.jsx:120` assigns unused `detailsWidth`.
- `npm run build:test`
  - Passed after Phase 3 integration; Vite transformed 3,678 modules. The existing
    large-chunk advisory remained informational.
- `npx playwright test tests/e2e/locks.spec.js tests/e2e/makeAutocomplete.spec.js`
  - Passed: 5 browser tests covering direct lock routes, details, drawer filtering,
    mobile controls, make autocomplete, and reset.
  - The sandboxed attempt could not bind the local preview port; the approved rerun
    completed successfully.
- `yarn workspace @starter/client vitest run src/filters/useAdvancedFilterRows.spec.jsx`
  - Passed in coffee after the synchronized hidden-only fallback repair: 1 file and 6
    tests. The first sandboxed attempt could not write Vite's temporary cache; the
    approved rerun completed successfully.
- `yarn workspace @starter/client eslint src/filters/useAdvancedFilterRows.js src/filters/useAdvancedFilterRows.spec.jsx`
  - Passed with no errors or warnings.
- Four `git diff --no-index --exit-code` comparisons for the portable modules and tests
  - Passed again after Phase 3 with no differences between coffee and LPU.

## Change log

- Created this report and recorded the initial audit scope and progress.
- Added the complete decision record, per-project URL inventory, canonical examples,
  compatibility corpus, regression matrix, implementation boundary, baseline results,
  and portable-file ownership/drift process to the evaluation.
- Reviewed the final documentation against current source, route fixtures, codec output,
  provider consumers, and both focused-test baselines. No application or test code was
  changed.
- Updated the inventory after the classification filter field was renamed from `belt`
  to `assignedBelt`.
- Added the Phase 1 codec contract cases to
  `something.coffee/client/src/context/filterUrlState.spec.js`.
- Added the currently unused portable row helper and tests at
  `something.coffee/client/src/context/advancedFilterState.js` and
  `something.coffee/client/src/context/advancedFilterState.spec.js`.
- Recorded the explicit route-policy signatures, malformed-input behavior, state-helper
  API, and expected-failure protocol in the evaluation.
- Hardened the shared codec, removed every expected-failure marker, and integrated the
  pure state helper into the coffee context.
- Replaced coffee row-index actions and scattered visibility checks with stable-ID
  actions and one beta/auth/admin predicate.
- Reworked the applied display around parsed active groups and added regressions for
  multi-value deletion and unrelated draft preservation.
- Added coffee context regressions for local active-plus-draft changes, external
  navigation, and browser history, plus a mini-context control-state regression.
- Copied the two pure modules and their tests unchanged to LPU and verified cross-repo
  equality.
- Updated both repositories' evaluation and report for Phase 2 findings and results.
- Fixed the add-value regression in the portable row helper. Mixed rows now commit only
  their non-empty values while retaining empty selectors as local presentation state;
  added pure, context, and `AdvancedFilterValues` interaction coverage.
- Synchronized the repaired portable helper and test to LPU, updated both repositories'
  evaluation and report, and reverified cross-repository equality.
- Integrated the shared codec/state model into LPU's runtime `FilterContext` and
  migrated all audited providers to URL-derived committed groups.
- Added LPU route-key policy, explicit hidden photographer support, stable-ID row
  operations, common field visibility, parsed group chips, and group-aware exclusion.
- Added a shared default-filter hook for profile and safelock collection routes.
- Made belt tab/scope actions atomic under immutable URL writes.
- Fixed and synchronized the hidden-only fallback-row edit case in both projects.
- Added the Phase 3 LPU regression suites and provider-route assertion, then completed
  full unit, lint, test-build, browser, coffee, and drift verification.
