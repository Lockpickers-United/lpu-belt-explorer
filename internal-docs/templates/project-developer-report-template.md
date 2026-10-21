<!--
Implementation developer report template

Purpose: the detailed developer/agent reference behind an implementation report. It records
what changed, why, and how it was verified, so the main report can stay short.

How to use:
1. Copy to `internal-docs/<project>-developer-report.md` and replace every `<placeholder>`.
2. Add one "Phase N" section when a phase starts; leave unused subsections out rather than
   filling them with "None".
3. Record a Checkpoint before handoff, context compaction, or pausing mid-phase (see AGENTS.md).
   Replace the previous checkpoint rather than accumulating them.
4. Record exact commands and results. Never mark a check as passed unless it ran; note skipped,
   failed-then-fixed, and pre-existing failures explicitly.
5. Delete these comments once the report is created.
-->

# [Project name] — developer implementation report

> Optional companion to [the implementation plan](./project-implementation-plan-template.md). Copy this file when technical detail would make the plan hard to scan. Keep phase status, tasks, exit criteria, and forward-looking issues in the plan; use this report for decisions, implementation details, and verification evidence.

Last updated: YYYY-MM-DD  
Implementation report: `internal-docs/<project>-implementation-report.md`
Plan: `internal-docs/<project>-plan.md`


## Checkpoint

<!-- Latest resumable state only. Clear it (write "None — phase boundary") when a phase closes. -->

- **Phase / task:** <Phase N: task in progress>
- **State:** <what is done, what is partially done, uncommitted/unstaged work>
- **Resume with:** <next concrete step or command>
- **Watch out for:** <traps, flaky checks, pending approvals>

## Cross-phase reference

<!-- Stable context that applies to every phase. Remove items that don't apply. -->

- **Repositories affected:** <lpu-belt-explorer, ../explore-lpubelts-com-node, functions/>
- **Approval-gated actions:** <deployments, live-data scripts, production switches — and approval status>
- **Environment notes:** <Node/tool versions, emulators, required local installs>
- **Baseline metrics:** <coverage, bundle size, test counts, etc. with date measured>

## Phase 0: <Name>

### Changes

<!-- Group by area. Name files, functions, scripts, or config keys so a reviewer can find them. -->

#### <Area>

- <Change — reason if not obvious>

### Decisions

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| <What was decided> | <Why> | <What was rejected and why> |

### Verification

| Command / check | Result |
| --- | --- |
| `<command>` | <Passed / Failed — counts, warnings, notes> |

<!-- Note any checks intentionally skipped and why (e.g. requires credentials or approval). -->

### Environment and tooling notes

- <Issue encountered, workaround, and whether follow-up is needed>

### Files touched

<!-- Optional; useful for large or cross-repository phases. -->

| File | Change |
| --- | --- |
| `<path>` | <Added / Modified / Removed — purpose> |

### Manual review needed

- <Anything a human should inspect before merge or before the next phase>
