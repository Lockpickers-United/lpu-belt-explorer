# Filter context refactor implementation report

## Status

Pre-implementation evaluation is complete. No application code has been changed.

## Scope

This report tracks preparation for the filter-context refactor described in
`filter-context-refactor-evaluation.md`. The current task is documentation only:

- inventory URL keys and classify filter versus navigation state;
- define the synchronization and serialization contract;
- collect representative compatibility URLs;
- record current focused-test baselines and missing regression coverage;
- define the first implementation boundary; and
- define ownership and drift checks for files intended to be shared with
  `something.coffee`.

Implementation, deployment, live-data access, generated-data updates, and unrelated
filter matching changes are outside this task.

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
- [ ] Review the resulting documentation diff for unsupported claims and omissions.

## Working decisions

The evaluation now records these decisions in detail:

- Treat the URL as the sole source of committed filters.
- Keep incomplete advanced-filter rows as local draft state.
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

## Audit findings added to the evaluation

- The global LPU non-filter list omits `uid` and `hours`, which are control state on
  `/userinfo` and `/recent`.
- `belt` cannot be globally classified: it is lock-list scope state but a real filter
  for classification, ranking-request, and scorecard routes.
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
- `yarn workspace @starter/client vitest run src/context/filterUrlState.spec.js src/context/FilterContext.spec.jsx src/filters/AdvancedSelect.spec.jsx src/filters/filterEntriesAdvanced.spec.js`
  - Passed: 4 files, 12 tests in `something.coffee`.
  - The first sandboxed attempt could not write Vite's temporary config cache outside
    the LPU workspace; the approved rerun completed successfully.
- Read-only Node checks confirmed the coffee codec's exact OR, AND, negation, and
  reserved-character wire forms. A repeated-field check confirmed the current lossy
  mixed-sign behavior documented in the evaluation.

## Change log

- Created this report and recorded the initial audit scope and progress.
- Added the complete decision record, per-project URL inventory, canonical examples,
  compatibility corpus, regression matrix, implementation boundary, baseline results,
  and portable-file ownership/drift process to the evaluation.
