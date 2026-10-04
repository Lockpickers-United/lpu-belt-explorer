# Filter context refactor evaluation

## Recommendation

Adopt the architectural direction from `something.coffee`, but do not copy its current implementation unchanged.

The useful change is the separation between:

- committed filters, parsed from the URL and used by data providers; and
- local advanced-filter rows, which may include incomplete UI drafts that must not filter data.

That separation fixes a real defect in `lpu-belt-explorer`: its URL reconciliation preserves old local groups that are absent from a newly visited filtered URL, and its data providers use those local groups as active filters. For example, navigating from a URL filtered by field A to one filtered only by field B can leave A in `advancedGroups`; the data layer then applies A and B even though the URL contains only B (`src/context/FilterContext.jsx`, current lines 281-324).

The `something.coffee` version makes the URL authoritative through `activeFilterGroups()`, which is the right contract. Its synchronization code still has several correctness problems, so the recommended implementation is a hardened common core with thin project-specific adapters.

## Findings in `something.coffee`

### High-priority correctness issues

1. **An incomplete row can disappear when another active filter exists.**

   `setAdvancedFilterGroups()` preserves a draft across the next empty URL sync only when there are no concrete groups (`client/src/context/FilterContext.jsx`, lines 135-156). When there is one active group and the user adds or edits a second incomplete row, the URL still contains the active group. The URL-to-UI effect then rebuilds the local rows exclusively from `urlAdvancedFilterGroups` and drops the incomplete row (lines 222-244). Whether this is immediately visible depends on whether React Router emits a new location for a same-search replace, making the behavior timing-sensitive as well as incorrect.

2. **Multi-value filter chips do not remove their filter.**

   `FilterDisplayAdvanced` builds a chip from the raw encoded URL value, such as `Alma||Portrait`, but its delete handler compares that encoded string with parsed values `['Alma', 'Portrait']` (`client/src/filters/FilterDisplayAdvanced.jsx`, lines 20-40). Neither value matches the encoded string, so deleting the chip writes the same group back.

   The component also excludes only six control parameters when building chips even though the context declares a much larger non-filter list. If any real filter is present, parameters such as `expandAll`, `dataset`, `cId`, or `tableSort` can appear as filter chips. Deleting a chip whose key has no parsed advanced group can dereference `newVaules.length` when `newVaules` is undefined (lines 21-23). The unused `actualFilters` context value appears intended to prevent this mismatch.

3. **Multiple groups for one field are lossy.**

   `serializeAdvancedFilterGroups()` calls `URLSearchParams.set()` for every group (`client/src/context/filterUrlState.js`, lines 113-124). A later group with the same `fieldName` overwrites the earlier one. The parser can produce repeated same-field groups from legacy or hand-authored URLs, so this is not merely a theoretical input. A direct check with positive `roaster=A` and negative `roaster=B` groups serialized only `roaster=!B`.

   The URL-to-UI effect compounds this by finding an existing row by `fieldName` for every incoming group (`FilterContext.jsx`, lines 234-242). Duplicate incoming groups can therefore receive the same React `_id`.

4. **Filtering visible rows changes row indexes.**

   `useAdvancedFilterRows()` filters out rows based on beta/auth visibility, then passes the visible array index to `changeGroup()` and `removeGroup()`, which apply it to the unfiltered array (`client/src/filters/useAdvancedFilterRows.js`, lines 23-55). If a hidden row precedes a visible row, editing or removing the visible row changes the hidden one. Row actions should address stable `_id` values, not display indexes.

### Medium-priority issues

5. **Visibility policy is inconsistent.**

   `AdvancedFilterField` considers `adminEnabled`, while `useAdvancedFilterRows` considers only `beta` and `userBased`. An admin-only filter already present in the URL can therefore render for a non-admin even though it is absent from the field selector. Each project should supply one visibility predicate that all filter UIs use.

6. **The non-filter key list is global, incomplete, and project-specific.**

   `DEFAULT_NON_FILTER_KEYS` includes several `something.coffee` route controls, but it omits `uid`, which `UserInfoMain` uses as navigation state. That makes `uid` count as an active data filter. The LPU project has different omissions, including `uid`, `belt`, and `hours`. A single copied constant will continue to drift. The common codec should accept a project or route policy, with a small shared base list.

7. **One helper mutates an existing group object.**

   `addAdvancedFilterGroup()` assigns `existing.operator` before creating the replacement object (`FilterContext.jsx`, lines 167-181). The later state update normally masks the problem, but mutating an object from React state makes memoization and concurrent rendering harder to reason about.

8. **`addFilters()` and `setFilters()` disagree about valid scalar values.**

   `cleanFiltersObject()` retains `false` and `0`, while `addFilters()` uses truthiness and removes them. The advanced matcher explicitly supports boolean and numeric data, so filter writers should use the same `hasNonEmptyValue()` predicate as the codec.

9. **Navigation intent is implicit.**

   Every filter write uses `{replace: true}`. This may be intentional, but it means browser Back does not step through filter changes. The contract should state whether filter edits replace the current history entry while route/link navigation pushes a new one, and tests should lock down that choice.

10. **The synchronization tests are too narrow for the state model.**

    The focused suite passed 12 tests across four files, but `FilterContext.spec.jsx` contains only two cases: clearing active filters on route navigation and adopting a filtered URL after a draft. It does not cover active-plus-draft rows, same-search writes, multiple groups, chip deletion, hidden rows, clear/reset timing, or browser back/forward.

### Improvements worth retaining

- URL parsing and serialization are extracted into a pure module.
- URL writes clone `URLSearchParams` instead of mutating the router-owned instance.
- `setFilters()` no longer mutates its caller's object.
- active filtering is explicitly URL-derived.
- malformed empty query parameters do not increase `filterCount`.
- reserved filter syntax characters can round-trip through the URL codec.
- clear-animation timers have cleanup.
- filter changes reset catalog pagination.

## Gap analysis

| Area | `something.coffee` | `lpu-belt-explorer` | Integration consequence |
| --- | --- | --- | --- |
| Active state | Data providers use URL-derived `activeFilterGroups()` | Ten data-provider paths use draft-capable `advancedFilterGroups()` | Every data consumer must migrate to the committed/active selector in one change; option-count UI may continue using UI rows. |
| URL codec | Separate `filterUrlState.js` with escaping and cleanup | Parser and serializer are embedded in `FilterContext.jsx` | Add the pure module first and test it without React. Keep this file byte-for-byte interchangeable where possible. |
| Draft rows | Separate active and UI selectors, but reconciled with a fragile effect/ref | One local array is both UI and data state | Model incomplete drafts separately instead of trying to infer navigation origin from an “empty next sync” ref. |
| Advanced row operations | Extracted `useAdvancedFilterRows`, index-based | Inline logic in `AdvancedFilters`, also index-based after filtering visible rows | Share a corrected hook that updates/removes by `_id` and accepts one visibility predicate. |
| Non-filter URL state | Coffee/catalog controls such as `cId`, `dsId`, and table sort | LPU controls such as `belt`, `hours`, `uid`, scorecard and preview state | Use a shared base plus an explicit project/route extension. Audit all URL consumers before migration. |
| Pagination | `startEntry` and local-storage `entriesPerPage` live in `FilterContext` | No matching pagination contract | Keep pagination in the coffee adapter or a separate pagination provider; do not force it into the common filter core. |
| Mini context | `MiniFilterContext` reuses the codec for the PSD area | No mini context | Keep it coffee-only while importing the same pure helpers. |
| Filter semantics | Adds blank/not-blank sentinels and string-to-number/boolean matching | Strict equality only | Port separately after LPU fixtures prove the behavior is wanted; this is independent of URL synchronization. |
| Field policy | Coffee has `adminEnabled`, `blankControls`, autocomplete | LPU has belt/scope behavior and many `userBased` collection filters | Keep field definitions and access/visibility policy in project adapters. Do not hide active URL filters silently without deciding their behavior. |
| Default filters | Primarily catalog URL filters | Profile and safelock pages programmatically inject a default `collection=Any` group | Migrate those initializers to a committed-filter action and test refresh/direct-link behavior. |
| UI surface | Catalog drawer, advanced display, toggles | Belt scope, inline display, excluded chips, search cutoff, several drawers | Share state/actions and codec; retain site-specific presentation components unless their behavior is identical. |
| Runtime/tooling | Yarn workspace, React 18, Vitest 4 | npm, React 19, Vitest 5 | Avoid a linked React package or shared context package initially. Identical pure source files and a thin local provider are lower risk. |

The ten LPU data-provider paths that need the committed selector are:

- `src/classification/ClassificationDataProvider.jsx`
- `src/locks/LockDataProvider.jsx`
- `src/projectsQuests/ProjectsDataProvider.jsx`
- `src/rafl/RaffleCharitiesProvider.jsx`
- `src/rafl/RaffleDataProvider.jsx`
- `src/rafl/admin/RaffleAdminDataProviderEntries.jsx`
- `src/rafl/admin/RaffleAdminDataProviderPots.jsx`
- `src/rankingRequests/LockRequestsDataProvider.jsx`
- `src/safelocks/SafelocksDataProvider.jsx`
- `src/scorecard/ScorecardDataProvider.jsx`

`src/filters/AdvancedFilterByField.jsx` should continue to use the UI rows when it calculates progressive option counts, but that use needs explicit tests because it intentionally differs from the data-provider contract.

## Target design

Use three explicit representations with one-way responsibilities:

1. `searchParams` is the persisted, shareable source for committed filters and route controls.
2. `activeFilterGroups` is a pure parse of the committed filter parameters. Data providers, badges, and applied-filter chips use this representation.
3. `draftFilterRows` contains only incomplete rows or temporary UI metadata. Drafts never filter entries and never serialize until they contain a valid field and value.

The rendered advanced rows are derived by combining active groups with drafts. This avoids keeping two complete mutable copies of active filters “in sync.” A local action that makes a row concrete serializes it and removes its draft. Clearing the last value removes the active URL group and creates or retains a draft with the same stable row ID. External navigation replaces active groups from the URL and follows an explicit draft policy; the recommended default is to discard drafts on a different location key and preserve them only for the local action that created them.

Enforce one group per field. Both UIs already prevent choosing the same field twice, and the URL format naturally maps a field to one encoded group. The parser should canonicalize compatible repeated parameters into one group and reject or deterministically normalize incompatible repeated forms. This is safer than pretending the current `set()` serializer supports duplicates.

Keep the following files interchangeable between projects:

- `context/filterUrlState.js`: parsing, serialization, cleanup, active-count logic, and shared base non-filter keys.
- `context/advancedFilterState.js`: group validation, canonicalization, stable-ID reconciliation, and draft/active row operations. This should be pure JavaScript.
- `filters/useAdvancedFilterRows.js`: only if it receives a visibility predicate/config instead of importing project-specific auth and app contexts.
- `filters/filterEntriesAdvanced.js` and its tests after the two projects agree on blank and type-coercion behavior.

Keep `FilterContext.jsx` as a thin local adapter. It can supply project-specific non-filter keys and field visibility and expose compatibility aliases during migration. Coffee-only pagination should move to its own provider/hook or be composed into the local context value after the shared filter state is created.

Prefer value-shaped context fields in the final API:

```js
{
    filters,
    activeFilterGroups,
    advancedFilterRows,
    setAdvancedFilterRows,
    addFilter,
    removeFilter,
    clearFilters
}
```

The existing function-shaped `activeFilterGroups()` and `advancedFilterGroups()` can remain as temporary aliases to limit the first migration diff.

## Pre-implementation decision record

This section satisfies the documentation gate for Phase 1. The audit reflects
`lpu-belt-explorer` at `4ff5e2cf4ec848d4b0082704ecd06918f9e2039a` and
`something.coffee` at `44a74c267ba69f7ca018d0e1f5f0681a7c70b30c`, both on
`main` on 2026-10-03. The inventories cover URL state that reaches either filter
context plus directly parsed route keys that a context must preserve when present.

### Contract decisions

| Concern | Decision for the first refactor |
| --- | --- |
| Committed source | `location.search` is the only committed-filter source. `activeFilterGroups` is a value parsed from the current URL, and all data providers consume it. |
| Editable state | Local state stores draft rows and stable UI metadata. A row becomes committed as soon as it has an allowed field and at least one non-empty value. Rendered rows are derived from committed groups plus drafts; the provider does not keep a second editable copy of every committed group. |
| Allowed filter keys | Each provider supplies its allowed data-filter keys from its `filterFields`, plus an explicit list for supported hidden filters. A key is not a data filter merely because it is absent from a global non-filter list. |
| Unknown keys | Preserve unknown query parameters by decoded key/value and multiplicity across local filter edits, but exclude them from active groups and `filterCount`. This prevents unrelated route state from filtering data while avoiding destructive URL cleanup. `URLSearchParams` may normalize equivalent percent encoding. Emit a development-only diagnostic when practical. |
| One field, one group | A canonical URL contains at most one parameter per active field and the in-memory model contains at most one committed group per field. The field selector prevents duplicates and the state helper rejects a second draft choosing an occupied field. |
| Compatible repeated fields | Legacy `field=A&field=B` and `field=!A&field=!B` inputs retain their current AND meaning and canonicalize on the next filter edit to `field=A@@B` and `field=!A@@B`. Duplicate values are removed while preserving first-seen order. |
| Incompatible repeated fields | Mixed-sign or mixed-operator repetitions cannot be represented by one group. Parse them deterministically using the last valid occurrence, matching the current serializer's effective last-write behavior, and canonicalize on the next local filter edit. Add a development diagnostic and a regression fixture for the discarded occurrences. |
| Operators | `||` means OR within a group, `@@` means AND within a group, and one leading unescaped `!` negates the completed group. Groups for distinct fields combine with AND. Operator tokens inside values are backslash-escaped. |
| Empty values | `undefined`, `null`, and `''` are empty and are neither committed nor counted. Boolean `false` and number `0` are valid values and must survive every writer, parser, and serializer. Whitespace matching behavior remains unchanged in this refactor. |
| Count | `filterCount` is the number of distinct committed field names, independent of the number of values or repeated legacy parameters. Search, sort, and route controls are not included. |
| Draft navigation policy | A local edit may preserve the draft it just created. Navigation to a different location key, including browser Back/Forward, discards all drafts and renders committed groups from that location. Same-search replaces caused by a local filter action preserve unrelated drafts. |
| History | Filter edits, row edits, chip deletion, sort changes, and clear/reset replace the current history entry. Explicit route/link navigation pushes unless that caller already has a documented redirect reason to replace. Browser Back/Forward must still restore committed filters from the visited URL. |
| Clear/reset | Clear removes committed filters and drafts while preserving controls named by the active route policy. The animation is presentation-only and cannot delay state or URL correctness. |
| Default groups | Profile locks and profile safelocks explicitly commit `collection=Any` only when the initial URL has no committed data filters. A direct filtered link wins over the default. Initialization runs once per route location and must not race URL reconciliation. |
| Stable identity | Row actions accept `_id`, never a visible-array index. IDs are local UI metadata, survive edits to the same row, and are not serialized. Committed rows receive deterministic reconciliation to existing IDs; new rows receive IDs through one injected/testable helper. |
| Visibility | One project-supplied predicate covers beta, authentication, and admin visibility in the field picker and rendered rows. Visibility affects editing only: a permitted committed URL filter is not silently removed or ignored because its row is hidden. Authorization remains outside this UI policy. |
| Applied-filter display | Applied chips render parsed committed groups. The first implementation uses one chip per group and deletion removes the group; per-value chips can follow only with explicit value-aware deletion tests. Raw encoded values and route controls never become chips. |
| Matching enhancements | Blank/not-blank sentinels and string-to-boolean/number coercion remain out of scope. The URL codec may round-trip their strings, but LPU matching semantics do not change in this refactor. |

The incompatible-repeat rule intentionally changes malformed URLs from “apply several
same-field groups until the next edit silently keeps the last” to “apply the last valid
occurrence immediately.” This is the smallest deterministic rule consistent with the
unique-field invariant and the existing serializer. It must be called out in release
notes if representative traffic or support links show that such URLs exist.

### Canonical URL examples

The logical form below is easier to read; the wire form is what
`URLSearchParams.toString()` produces. Controls such as `sort=name` are shown to prove
that serialization preserves them.

| Case | Input/model | Canonical wire query |
| --- | --- | --- |
| OR | `roaster Is [Alma, Portrait]` | `sort=name&roaster=Alma%7C%7CPortrait` |
| AND | `varietalsRecognized Is [Gesha, Caturra]` | `sort=name&varietalsRecognized=Gesha%40%40Caturra` |
| Negated OR | `processingMethod Is Not [Washed, Natural]` | `sort=name&processingMethod=%21Washed%7C%7CNatural` |
| Compatible repetition | `?roaster=Alma&roaster=Portrait` | `roaster=Alma%40%40Portrait` after the next filter edit |
| Empty filter | `?roaster=&sort=name` | `sort=name` after the next filter edit; active groups and count are empty before it |
| `false` and `0` | values `false` and `0` | the literal strings `false` and `0`; neither is deleted as empty |
| Reserved characters | values `A || B`, `C @@ D`, `!Literal`, `Back\Slash` | `sort=name&roaster=A+%5C%7C%5C%7C+B%7C%7CC+%5C%40%5C%40+D%7C%7C%5C%21Literal%7C%7CBack%5C%5CSlash` |

Serialization preserves existing parameter order for opaque controls and unknown keys
where possible, then writes managed filter fields in rendered committed-group order.
Tests should compare parsed entries for preservation-sensitive cases and exact strings
only for canonical managed-filter examples.

### Phase 1 executable contract findings

The codec contract now uses an explicit policy object rather than overloading a list of
keys to skip:

```js
const policy = {allowedFilterKeys: ['roaster', 'originCountry']}

parseFiltersToGroups(filters, policy)
countActiveFilterParams(searchParams, policy)
serializeAdvancedFilterGroups({
    groups,
    searchParams,
    allowedFilterKeys: policy.allowedFilterKeys
})
```

`parseFiltersToGroups()` and `countActiveFilterParams()` classify only allowed keys.
`serializeAdvancedFilterGroups()` receives the original `URLSearchParams`, removes and
rewrites only allowed keys, and leaves every opaque key/value pair in decoded order.
This signature makes unknown-key preservation possible; the former `filters` object
cannot retain interleaved parameter order after repeated keys are collapsed into arrays.
The existing `filters` and non-filter-list signatures may remain as migration adapters,
but they are not the portable contract.

Malformed syntax is normalized conservatively. A lone negation marker produces no
group, empty segments around `||` or `@@` are dropped, unmatched single `|` or `@`
characters remain literal values, and a dangling backslash remains literal. Valid
escape sequences keep the reserved-character behavior in the canonical examples.

The pure row-state contract is represented by these functions:

- `reconcileAdvancedFilterRows()` combines URL-derived active groups with local drafts,
  reuses IDs by field, and accepts an injected ID generator;
- `changeAdvancedFilterRow()` and `removeAdvancedFilterRow()` address rows by `_id`;
- `addAdvancedFilterGroup()` merges a value into the one row for its field without
  mutating the input; and
- `splitAdvancedFilterRows()` separates concrete groups from incomplete drafts after a
  local row operation.

The helper rejects a field change that would duplicate an occupied field. Changing a
row's field clears its values while retaining its ID, and clearing its last value turns
the same row into a draft. External navigation discards drafts by reconciling with an
empty `draftRows` list; local same-search work supplies the drafts it intends to retain.
Visibility is intentionally absent from the pure helper, so a project adapter filters
rendered rows but still sends the stable ID of the selected row to these operations.

Phase 1 added the unused pure helper and its passing tests to `something.coffee` so the
row API is concrete before context integration. The codec file still has runtime
consumers, so it was not changed in this phase. Eleven codec assertions use Vitest's
`it.fails` as executable red tests for the missing allowed-key policy, repetition
normalization, malformed-input cleanup, opaque-parameter preservation, `false`/`0`, and
policy-aware round trips. Phase 2 must remove every `it.fails` marker as it makes the
assertion pass; an unexpectedly passing red test already fails the suite and therefore
cannot be forgotten silently.

### URL-key inventory: `lpu-belt-explorer`

The current global `nonFilters` list contains `id`, `name`, `search`, `tab`, `sort`,
`image`, `locks`, `debug`, `preview`, `single`, `expandAll`, `dataset`, and
`scorecardId`. The audit confirms those are controls, but the list is insufficient and
cannot classify every route correctly.

| Classification | Keys | Owner and behavior |
| --- | --- | --- |
| Shared filter-context controls | `id`, `name`, `search`, `tab`, `sort`, `image`, `expandAll` | Entry expansion/share labels, text search, list scope, ordering, gallery position, and expansion state. Preserve on applicable routes; never parse as advanced groups. |
| LPU route controls already excluded | `locks`, `debug`, `preview`, `single`, `dataset`, `scorecardId` | Scorecard mode, edit diagnostics, RAFL/advanced preview, RAFL admin mode, scorecard cohort, and scorecard-entry linkage. |
| LPU route controls currently missing | `uid`, `hours` | `/userinfo` profile selection and `/recent` time window. They currently inflate `filterCount` and become bogus advanced groups. |
| Route-dependent collision | `belt` | Legacy/fallback lock-list scope on `/locks`; a real active field on ranking-request, scorecard, scorecard-exploration, and RAFL-entry providers. It must be supplied by route policy, never placed in a global list. Classification now uses the unambiguous `assignedBelt` field. |
| Supported hidden active filter | `photographers` on lock data routes | `LockDataProvider` maps photographer names and `LockImageGallery` also narrows media with the same value. Keep it active only where this hidden URL contract is intended; add it explicitly rather than relying on unknown-key parsing. |
| Direct route controls outside filter context | `term`, `pageId`, `user`, `bb1`, `bb2`, `title` | Glossary selection, content/path selection, and leaderboard search/compare state are parsed by their route components. They remain opaque if a filter provider is later added around those routes. |
| OAuth/external query state | `code`, `state`, `error`, `error_description`, `h` | Authentication callback state or external share-host metadata. It is outside the hash-route filter codec. |

Allowed LPU active fields are route-scoped subsets of the following audited registry:

- locks/profile: `makes`, `lockingMechanisms`, `filterBelts`, `features`, `content`,
  `collection`, plus the explicit hidden `photographers` contract;
- classification: `makes`, `displayName`, `votedBelt`, `hasVotes`, `hasConsensus`,
  `assignedBelt`, `lockingMechanisms`, `features`, `content`, `collection`;
- safelocks: `make`, `wheels`, `group`, `tier`, `fence`, `digits`, `features`,
  `content`, `collection`;
- scorecard: `type`, `makes`, `lockingMechanisms`, `belt`, `features`, `content`,
  `documentation`, `scoring`;
- scorecard exploration: `userBelt`, `makes`, `lockingMechanisms`, `belt`,
  `features`, `content`, `collection`;
- RAFL pots/winners: `collection`, `tags`, `contributedBy`, `country`,
  `shippingType`, `splitShipping`, `usShipText`, `content`, `winnerUsernames`,
  `winnerStatus` as configured for the route;
- RAFL entries: `status`, `content`, `charities`, `potNames`, `potWinner`,
  `platform`, `belt`;
- ranking requests: `requestStatus`, `makes`, `lockingMechanisms`, `belt`,
  `approximateBelt`, `userBelt`; and
- projects/quests: `discipline`, `tierName`, `pickerName`, `source`.

Routes that instantiate `FilterProvider` with no filter fields must have zero allowed
active keys unless they explicitly add hidden filters. This covers content submission,
tools, server-test, user-info, and similar control-only uses and prevents their query
state from being treated as data filters.

### URL-key inventory: `something.coffee`

| Classification | Keys | Owner and behavior |
| --- | --- | --- |
| Shared controls in the current codec | `id`, `name`, `search`, `tab`, `sort`, `image`, `expandAll` | Same general UI/navigation roles as LPU. |
| Coffee-specific controls in the current codec | `cId`, `dsId`, `addNew`, `tableSort`, `tableSortDir` | Catalog/detail identity, add flow, and table ordering. The first three have no active consumer in the audited client and should remain reserved until a later cleanup proves they can be removed. |
| Copied/reserved controls requiring route confirmation | `locks`, `debug`, `preview`, `single`, `dataset`, `scorecardId` | Present in `DEFAULT_NON_FILTER_KEYS`; no active coffee client owner was found in this audit. Preserve for compatibility during the refactor and remove only in separate cleanup. |
| Coffee controls currently missing | `uid`, `rank`, `sampleSet` | User-info selection, speed-pick “Show All,” and PSD demo selection. `uid` and `rank` currently become active groups in `FilterContext`; `sampleSet` is consumed by `MiniFilterContext` and currently counts as a filter there. |

Allowed coffee active fields are route-scoped subsets of:

- catalog: `roaster`, `originCountry`, `originContinent`, `originRegion`,
  `varietalsPlus`, `varietalsUnrecognized`, `varietalPrimary`, `processingMethod`,
  `processingTags`, `tastingNotesFilter`, `tastingNotesCategories`, `types`,
  `stockLevelFilter`, `transparencyCosts`, `roasterCountry`, `sourceAdded`,
  `firstRoasterEntry`, `fobCostPound`, `ddpCostPound`, `farmGateCost`;
- roasters: `continent`, `country`, `stateRegion`, `city`, `countries`, `varietals`,
  `types`;
- profile/setup data: `roasterName`, `origin`, `roastLevel`, `caffeine`;
- shot/equipment data: `roaster`, `origin`, `caffeine`, `machine`, `grinder`,
  `roasterCity`, `roasterCountry`;
- log/admin data: `coffeeName`, `roasterName`, `machineName`, `grinderName`,
  `isFlagged`; and
- the small location set: `city`, `stateRegion`.

`MiniFilterContext` is a separate PSD URL-state adapter and should reuse cleanup and
preservation helpers without inheriting catalog active-field rules.

### Compatibility URL corpus

These checked-in URLs form the minimum backward-compatibility corpus. Tests may use
the route/query portion and stable fixture data rather than fetching the public URL.

| Project | Representative URL | Source and expected classification |
| --- | --- | --- |
| LPU | `/locks?tab=White&makes=Master+Lock` | `LockListRoute.test.jsx`; `tab` is control, `makes` is one active group. |
| LPU | `/locks?tab=search&lockingMechanisms=Dimple` | `pathToBlack/pathPages/mgsecure.md`; search scope control plus one active group. |
| LPU | `/safelocks?group=2&make=AMSEC` | `SafelocksRoute.test.jsx`; two distinct active groups. |
| LPU | `/profile/:userId?name=:safeName&collection=Own` | `UserMenu.jsx`; `name` is control and `collection` is active. |
| LPU | `/locks?tab=search&search=:id&id=:id&name=:safeName` | ranking-request and share-link builders; all four keys are controls and active count is zero. |
| LPU | `/profile/:userId/scorecard?scorecardId=:id` | entry link builders; `scorecardId` is preserved control state. |
| coffee | `/catalog?roaster=Alma` | `FilterContext.spec.jsx`; one active group. |
| coffee | `/catalog/roasters?country=:country` | `RoasterStatsTable.jsx`; `country` is active on the roasters route. |
| coffee | `/psd?sampleSet=a92951f6` | PSD intro/examples; `sampleSet` is a mini-context route control. |

The synthetic OR, AND, negation, repetition, empty, `false`/`0`, and reserved-character
queries in the canonical examples supplement this corpus because no checked-in LPU
link exercises the advanced delimiters.

### Baseline and required regression coverage

Baseline commands run on 2026-10-03:

- LPU: `npx vitest run tests/vitest/LockListRoute.test.jsx tests/vitest/SafelocksRoute.test.jsx tests/vitest/ContentRoutes.test.jsx` — 3 files and 16 tests passed.
- coffee: `yarn workspace @starter/client vitest run src/context/filterUrlState.spec.js src/context/FilterContext.spec.jsx src/filters/AdvancedSelect.spec.jsx src/filters/filterEntriesAdvanced.spec.js` — 4 files and 12 tests passed.

The LPU baseline proves basic direct filtering, search, sorting, and route rendering; it
does not directly test `FilterContext` synchronization or advanced row editing. The
coffee baseline proves three codec cases, two navigation cases, two blank-control
cases, and five matching cases. Before implementation is complete, add the following
tests without weakening those baselines:

| Regression | Required test level |
| --- | --- |
| URL changes from field A to field B remove A from active data and UI rows | Context integration in both projects; one LPU provider/route assertion. |
| A committed group plus a second incomplete draft survives the local same-search write | Pure state helper and context integration. |
| External navigation and Back/Forward discard drafts and restore committed groups | Context integration with multiple `MemoryRouter` history entries; focused Playwright journey in LPU. |
| OR/AND and negated groups round-trip, including escaped `!`, `|`, `@`, and `\` | Table-driven codec tests copied unchanged between projects. |
| Compatible repeated fields canonicalize; incompatible repetitions choose the last valid occurrence | Table-driven codec tests, including duplicate-value order. |
| Empty values are dropped while `false` and `0` survive every writer | Pure codec tests plus one context writer test. |
| `filterCount` counts distinct allowed fields and ignores controls, unknown keys, empty values, and repeated params | Pure policy/count tests for each adapter. |
| Multi-value applied chip deletes the whole parsed group and controls never render as chips | Component test for `FilterDisplayAdvanced`/LPU equivalent. |
| Editing/removing a visible row after a hidden row targets the visible row's `_id` | Pure row-state test and hook/component test. |
| Beta, user-based, and admin-only visibility use one predicate | Project-specific row/picker component tests. |
| `addAdvancedFilterGroup` is immutable and prevents duplicate fields | Pure state helper test with frozen input. |
| Clear/reset is immediate, preserves route controls, cancels animation timers on unmount, and leaves no active groups | Context/component tests with fake timers only around presentation cleanup. |
| Profile and safelock `collection=Any` defaults yield to a direct filtered URL and commit once on an empty URL | LPU profile and safelock route tests. |
| All ten LPU providers consume committed groups while progressive option counts consume rendered UI rows | Static consumer audit plus representative provider tests and an `AdvancedFilterByField` option-count test. |

### First implementation boundary

The first refactor includes URL parsing/serialization, route policy, committed versus
draft ownership, stable-ID row operations, visibility injection, applied-chip removal,
provider migration, default-group initialization, timer cleanup, and the tests listed
above. It preserves the current URL syntax and current strict LPU match semantics.

It excludes blank/not-blank matching in LPU, boolean/number coercion in LPU matching,
coffee pagination ownership, unrelated drawer/layout redesign, route restructuring,
and migration to a published or linked shared package. Any of those additions requires
a separate behavior decision and fixtures.

### Portable-file ownership and drift prevention

During Phases 1 and 2, `something.coffee` is the canonical implementation workspace
because it already contains the extracted codec and focused tests. During Phase 3 the
following files become jointly owned exact copies, with project adapters kept outside
them:

- `context/filterUrlState.js`;
- `context/advancedFilterState.js`; and
- their portable pure test files.

Every later change to one of these files must update both repositories in the same
work item. Before handoff, run `git diff --no-index --exit-code` for each corresponding
file, for example:

```sh
git diff --no-index --exit-code \
  ../something.coffee/client/src/context/filterUrlState.js \
  src/context/filterUrlState.js
```

The CI follow-up should wrap these comparisons in a small read-only script in each
repository. A local relative-path check is sufficient for paired development; CI must
check out the pinned sibling revision or compare against an explicitly versioned
contract fixture rather than assuming a sibling directory exists. `FilterContext.jsx`,
route policy, pagination, visibility predicates, field definitions, and presentation
components remain project-owned adapters and are not subject to byte-for-byte checks.

## Refactor plan

### Recommended project order

Phase 1 should be implemented in `something.coffee` first, but only after a read-only audit of both projects establishes the shared contract and identifies site-specific exceptions. Use this sequence:

1. Audit both projects' URL keys, filter semantics, consumers, and required route behavior without changing either implementation.
2. Define the shared contract from that combined evidence rather than treating current coffee behavior as the contract by default.
3. Add the portable codec and state tests to `something.coffee`, where the codec is already extracted and the focused filter test infrastructure exists.
4. Harden the `something.coffee` implementation until the new shared tests and its project-specific integration tests pass.
5. Copy the hardened pure modules and portable tests to `lpu-belt-explorer`.
6. Add the LPU context, provider, and route integrations, with LPU-specific tests for belt scope, profile defaults, safelocks, raffle filters, classification, ranking requests, projects, and scorecards.

Before the first implementation change, record the following artifacts in this document or a linked implementation report. The pre-implementation decision record above now supplies them:

- a URL-key inventory that classifies every known key as an active filter, shared route control, or project/route-specific control;
- the decisions listed in Phase 1, including examples of the expected canonical URL for OR, AND, negation, repeated fields, empty values, and reserved characters;
- a small corpus of representative existing share URLs from checked-in tests, routes, or documentation for backward-compatibility checks;
- baseline focused-test results for both projects and explicit regression cases for each known issue in this evaluation;
- the boundary of the first refactor: synchronization and state ownership are in scope, while blank/not-blank matching, type coercion, pagination ownership, and unrelated UI redesign remain separate unless explicitly added;
- the canonical owner and synchronization method for interchangeable files, including a simple cross-repository diff check so the copies do not silently drift.

### Phase 1: define and test the contract

Execute the portable contract tests in `something.coffee` first. LPU-specific tests belong to Phase 3, but the LPU audit must inform these decisions before the coffee tests make them permanent.

1. Decide and document these behaviors before changing consumers:
   - one group per field;
   - OR/AND and negation encoding compatibility;
   - distinct-field meaning of `filterCount`;
   - which URL keys are route controls for each provider/route;
   - draft disposal on route navigation and browser back/forward;
   - replace-versus-push history behavior;
   - treatment of unknown filter keys.
2. Add table-driven pure tests for legacy query strings, escaping, repeated keys, empty values, `false`/`0`, non-filter preservation, malformed encodings, and parse/serialize/parse equivalence.
3. Add reducer/helper tests for active-plus-draft rows, clearing a value, changing a field, duplicate field prevention, stable IDs, and operations when hidden rows exist.

### Phase 2: harden the common implementation

1. Extract and correct `filterUrlState.js`; replace truthiness checks with one `hasNonEmptyValue` rule.
2. Harden and integrate the Phase 1 `advancedFilterState.js` helper so navigation reconciliation and row edits use its tested pure operations.
3. Remove same-field overwrite ambiguity by enforcing/canonicalizing the unique-field invariant.
4. Replace index-based row actions with `_id`-based actions.
5. Make one injected visibility predicate cover beta, authenticated-user, and admin-only fields.
6. Fix applied-filter displays to render from `activeFilterGroups`, not raw `filters`. A group chip should either remove the whole group or render one chip per parsed value with a value-aware delete action.
7. Remove in-place group mutation and generate IDs through one helper.

Apply these fixes to `something.coffee` first because its current implementation is the behavioral prototype and already has focused tests. Copy the hardened pure files and portable tests to LPU only after this phase passes.

### Phase 3: integrate into `lpu-belt-explorer`

1. Add the shared pure modules and context tests under `tests/vitest`.
2. Replace the embedded codec in `src/context/FilterContext.jsx` with the shared helpers and expose committed and UI selectors separately.
3. Audit route-control keys and pass the LPU extension list. At minimum, verify `uid`, `belt`, `hours`, `photographers`, `preview`, `dataset`, `scorecardId`, and all currently listed keys by behavior rather than name alone.
4. Migrate the ten data-provider paths above to the committed selector in the same change. Leaving any provider on draft rows would preserve inconsistent behavior between routes.
5. Move `AdvancedFilters` row operations to the corrected shared hook, retaining LPU-specific field visibility and layout.
6. Update `AdvancedFilterDrawerButton` to use committed groups for “active” status and UI rows only for edits.
7. Update profile/safelock default-group initialization so it intentionally commits the default to the URL without racing the first URL reconciliation.
8. Keep the existing public context methods as aliases until all consumers and test mocks are migrated, then remove obsolete names in a small cleanup.

### Phase 4: assess independent filter enhancements

Treat coffee's blank/not-blank controls and boolean/number coercion as a separate behavior change. Add LPU fixtures for boolean fields such as raffle flags and classification fields, numeric fields, arrays, missing values, and whitespace before adopting it. This avoids coupling a state-consistency refactor to changed matching semantics.

### Phase 5: verification and rollout

Run, at minimum:

- targeted ESLint for changed context, filter, and provider files;
- focused codec/reducer/context Vitest tests;
- the nearest route tests for locks, safelocks, classification, raffle, ranking requests, projects, and scorecards;
- `npm run test:run` because the context is shared across many routes;
- `npm run build:test` because provider exports and route bundles change;
- focused Playwright journeys for direct filtered URLs, reload/share round trips, adding an incomplete second row while another filter is active, deleting an OR/AND group chip, clear/reset, and browser back/forward.

Roll out without changing the existing URL syntax. Before merge, manually compare representative existing shared links from both sites and confirm that parsing and results are unchanged. If malformed or duplicate-field URLs are canonicalized, document that normalization and verify the resulting URL after the first edit.

## Evaluation evidence

- Both working trees had no tracked modifications at the start of this documentation pass. The supplied evaluation document was untracked in LPU.
- The LPU focused route baseline passed: 3 test files and 16 tests (`LockListRoute`, `SafelocksRoute`, and `ContentRoutes`).
- Focused ESLint passed for `src/data/filterFields.js` and `src/classification/ClassificationDataProvider.jsx` after the `assignedBelt` rename.
- The `something.coffee` focused filter suite passed: 4 test files and 12 tests (`filterUrlState`, `FilterContext`, `AdvancedSelect`, and `filterEntriesAdvanced`).
- A direct serializer check demonstrated that two same-field groups reduce to the last group.
- A direct parser check demonstrated that compatible repeated scalar parameters become one AND group, while mixed-sign repetitions become two groups and then reserialize to only the last group.
- No live services, credentials, generated-data workflows, deployments, or production data were used.
