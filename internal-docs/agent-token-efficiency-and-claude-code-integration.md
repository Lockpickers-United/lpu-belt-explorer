# Agent Token Efficiency and Claude Code Integration

Status: implemented  
Created: 2026-09-15

## Purpose

Reduce AI-agent token usage without weakening implementation quality, verification, repository safety, or durable project knowledge. Establish a consistent workflow in which Codex and Claude Code can both operate from the same project conventions without maintaining conflicting instruction sets.

## Implementation

Implemented on 2026-09-15:

- `AGENTS.md` is the concise canonical policy and routes task-specific reading by domain.
- `.agents/references/` contains committed architecture, Firebase/data safety, Firestore change-index, and testing guidance.
- `CLAUDE.md` imports the canonical `AGENTS.md` rather than duplicating it.
- `.claude/settings.json` contains a conservative allowlist for routine verification, explicit secret-file read denials, and access to the sibling server repository.
- `.gitignore` exposes only the shared reference/configuration files while continuing to ignore installed agent skills, local Claude settings, and `internal-docs/`.

Claude Code was not installed in the implementation environment, so the settings were JSON-validated but could not be exercised with `claude doctor` or `/permissions`. Those checks remain part of the first local Claude Code rollout.

## Token-efficiency recommendations

### Use a fresh session for each coherent task

Start a new conversation after completing a dependency phase, feature, or unrelated investigation. Give the new agent the relevant plan/report paths instead of carrying the full conversation forward. The repository, Git diff, tests, and implementation reports should be the durable source of state.

For example:

```text
Implement Phase 5 from internal-docs/major-dependency-upgrade-plan.md.
Only change React-related compatibility issues.
Run focused tests while iterating, then ci-pr once.
Append only the Phase 5 delta to the existing implementation report.
```

For unusually long tasks, add a concise progress checkpoint to the existing report before context compaction or handoff. Do not create a new progress file for every routine task.

Reference: [Anthropic's context and multi-window guidance](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables).

### Scope requests and context deliberately

- State the requested outcome, permitted scope, acceptance criteria, and required checks.
- Reference repository paths instead of pasting or attaching whole files when the agent can read them locally.
- Ask the agent to inspect related code, but avoid requests to explore the entire repository unless architecture discovery is genuinely necessary.
- Keep one task or tightly related migration phase per session.
- Request concise final handoffs: changed behavior, important decisions, checks actually run, limitations, and manual review.
- Avoid requesting the same detailed information in both chat and a durable implementation report. Put details in the report and keep the chat summary short.

### Make verification progressive

Use the smallest relevant check during iteration and run broader checks once after the implementation stabilizes:

1. Targeted source search and ESLint.
2. Closest focused unit test.
3. Relevant integration or browser test.
4. Required broad suite once before handoff.

Successful logs should be summarized rather than reproduced. For failures, retain the useful error, stack location, and command without returning unrelated output.

This approach reduces tool-output tokens while preserving the final quality gate already defined in `AGENTS.md`.

### Divide work between agents intentionally

Use one agent as the implementer and another as a focused reviewer. Do not ask both to independently rediscover and implement the same task.

Useful divisions include:

- routine implementation and tests: the faster or less expensive suitable model
- architecture, security boundaries, ambiguous migrations, and difficult diagnosis: the stronger reasoning model
- second agent: review the resulting diff against explicit acceptance criteria and identify missing tests or risks

Avoid subagents for single-file changes, tightly coupled changes, or sequential work. Subagents are most useful for genuinely independent workstreams that can be explored in parallel without duplicating context.

### Keep integrations focused

Enable MCP servers, plugins, browser automation, or other external tools only when the current task requires them. Their tool definitions and returned data increase context usage, and every additional integration expands the security surface.

## Claude Code repository setup

### Keep `AGENTS.md` canonical

Use the root `AGENTS.md` as the tool-neutral source of repository policy. Add a minimal root `CLAUDE.md`:

```md
# Claude Code project instructions

@AGENTS.md
```

Claude Code supports importing instruction files with `@path`, which avoids maintaining separate copies of the same conventions. Use `/memory` to confirm which instruction files Claude loaded.

Reference: [Claude Code memory documentation](https://docs.anthropic.com/en/docs/claude-code/memory).

### Restructure `AGENTS.md` for progressive disclosure

The current `AGENTS.md` contains useful guidance, but loading every architecture and integration detail for every task has a recurring token cost. Retain the high-value universal rules in the root file:

- stack, package manager, Node version, and formatting conventions
- routine commands and the verification matrix
- production deployment and live-data approval requirements
- authentication and authorization invariants
- dirty-worktree and destructive-action rules
- definition of done
- a routing table for task-specific references

Move detailed domain material into committed, on-demand documents, for example:

```text
.agents/references/
  architecture.md
  firebase-data-safety.md
  firestore-change-index.md
  testing.md
```

The root instructions should tell agents exactly when to read each document:

```md
## Task-specific references

Read only when relevant:

- Provider, route, or context changes: `.agents/references/architecture.md`
- Firebase, Functions, exports, or administrative scripts: `.agents/references/firebase-data-safety.md`
- Firestore change trackers/export contracts: `.agents/references/firestore-change-index.md`
- Test infrastructure or coverage changes: `.agents/references/testing.md`
```

Use a committed directory rather than the ignored `internal-docs/` directory for instructions that every developer and agent must receive.

Consolidate repeated safety and verification statements in the current `AGENTS.md`; duplication increases context size and makes later policy changes easier to apply inconsistently.

### Add explicit efficiency guidance to `AGENTS.md`

Recommended section:

```md
## Agent efficiency

- Use targeted `rg` searches and relevant file ranges before reading large files wholesale.
- During implementation, run the narrowest relevant lint and tests; run broader required checks once before handoff.
- Summarize successful command output instead of reproducing full logs.
- Do not use subagents for single-file, tightly coupled, or sequential work.
- For long tasks, record a concise progress checkpoint in the existing implementation report before context compaction or handoff.
- Keep final responses to changed behavior, verification results, known limitations, and manual review.
```

## Claude Code permissions

Start conservatively and commit a project `.claude/settings.json` only after reviewing the exact permissions with `/permissions`. Allow common read-only and verification commands, but do not pre-authorize deployments, Firebase administration, import/export jobs, migrations, package publishing, Git pushes, or pull-request creation.

Example starting point:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Bash(npm run build)",
      "Bash(npm run build:test)",
      "Bash(npm run ci-pr)",
      "Bash(npm run e2e)",
      "Bash(npm --prefix functions run lint)",
      "Bash(npx eslint *)",
      "Bash(npx vitest *)",
      "Bash(npx playwright test *)"
    ],
    "ask": [
      "Bash(firebase deploy *)",
      "Bash(firebase use prod *)",
      "Bash(npx firebase-tools * deploy *)",
      "Bash(npm run ci-build *)",
      "Bash(npm run import*)",
      "Bash(npm run migrate-*)",
      "Bash(npm publish *)",
      "Bash(git push *)"
    ],
    "deny": [
      "Read(**/.env.local)",
      "Read(**/.env.production)",
      "Read(**/keys/**)",
      "Read(**/*service-account*.json)",
      "Read(**/serviceAccount*.json)"
    ],
    "additionalDirectories": [
      "../explore-lpubelts-com-node"
    ],
    "defaultMode": "default",
    "disableBypassPermissionsMode": "disable"
  }
}
```

Before adopting this example, confirm that the installed Claude Code version accepts the patterns as written and that none of the allowed npm prefixes can invoke a live-data or deployment script. Add permissions incrementally in response to observed routine prompts rather than broadly allowing Bash.

Do not use `--dangerously-skip-permissions`. Commands such as `firebase deploy`, production exporters, migrations, `git push`, and package publishing should remain outside the allowlist so they require explicit approval. Instruction-level approval rules in `AGENTS.md` should remain in place as a second layer.

References: [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage) and [Claude Code security guidance](https://docs.anthropic.com/en/docs/claude-code/security).

## Concurrent-agent workflow

Never let Codex and Claude Code edit the same working tree concurrently. Use a separate Git worktree and branch for each active agent:

1. Assign one agent ownership of the implementation.
2. Give the other agent a different worktree for unrelated work, or wait and use it as a reviewer.
3. Transfer completed work through commits or an explicitly identified diff.
4. Ask reviewers to inspect the change against acceptance criteria rather than re-exploring the entire project.
5. For cross-repository changes, create corresponding isolated worktrees in both repositories.

Existing user modifications always remain authoritative. Agents should inspect status before editing and must not overwrite or reformat another agent's pending work.

## Suggested rollout

1. Install or update Claude Code and run `claude doctor`.
2. Add the minimal `CLAUDE.md` importing `AGENTS.md`.
3. Shorten and modularize `AGENTS.md`, preserving all safety and verification requirements.
4. Add a conservative `.claude/settings.json`; inspect it with `/permissions`.
5. Test Claude Code on a small, non-production task with a focused test.
6. Review its diff and command history before expanding permissions.
7. Establish the one-implementer/one-reviewer and separate-worktree conventions before using both agents concurrently.
8. Periodically review instruction files, permissions, enabled integrations, and stale references.

## Recommended outcome

The repository should ultimately have one concise canonical policy file, tool-specific entry points that import it, scoped reference documents loaded only when relevant, conservative executable permissions, and durable phase reports that make fresh agent sessions inexpensive. Verification remains behavior-focused and proportional to risk, while repeated exploration, duplicated reports, oversized logs, and parallel rediscovery are minimized.
