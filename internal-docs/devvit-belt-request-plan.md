# LPU Reddit Integration — Phased Plan

Technical design and implementation roadmap · Version 1.1 · October 26, 2026

Incorporates the [October 25–26 design and repository review](devvit-belt-request-plan-review.md). Review findings are the planning baseline; recheck official SDK and policy requirements at implementation time. No app installation, live modmail access, or Reddit approval is implied by this document update.

## 1. Executive summary

### 1.1 Objective

Deliver a Reddit-native moderator tool for r/lockpicking as the committed first product. LPU account linking and external award transfer are a conditional second product, requiring a written Reddit go/no-go before implementation. The proposed workflows are:

1. Historical award discovery: Test recovery of approved awards in a bounded modmail sample. A persistent historical index requires separate moderator and Reddit approval; importing results into LPU additionally requires external-integration approval.
2. Ongoing modmail processing: Detect approvals and other agreed moderator messages inside Reddit, with moderator review and diagnostics. Results become available to LPU services only through a separately approved integration.

If Reddit approves the exact protocol and external-service requirements, the second product should support linking an existing LPU/Firebase account to a verified Reddit identity without requiring users to authorize access to their personal Reddit inbox.

The long-term objective is to move away from the existing user-authorized Reddit OAuth inbox-scanning process.

### 1.2 Recommended design

Use a single Devvit app with a shared message-classification engine, a historical scanning service, an event-driven message processor, and a minimal integration with the existing Node.js/Firebase infrastructure.

LPU Belt Explorer

React · Firebase Authentication · Firestore

User profiles, account linking, imported awards

LPU Node.js API

Verification requests · Approved-result exchange

Devvit App — r/lockpicking

Reddit-hosted processing and storage

Historical scanner

Paginated backfill

onModMail

New-message trigger

Shared message classifier

Belt detection · Approval matching · Confidence

Redis

Processing state · Deduplication · Scoped results

Reddit Modmail API

Conversations · Messages · Participants

External communication and identity linkage are subject to Reddit's approval. Internal Devvit processing can be implemented and validated before that approval is obtained.

### 1.3 Feasibility assessment

| Capability                                | Assessment                                             | Risk   |
| ----------------------------------------- | ------------------------------------------------------ | ------ |
| Monitor incoming modmail                  | Documented support via `onModMail`                     | Low    |
| Retrieve conversation contents            | Documented modmail APIs                                | Low    |
| Match structured approvals                | Straightforward application logic                      | Low    |
| Match historical approvals                | Existing regex provides starting point                 | Medium |
| Retrieve older conversations              | Owner-supplied UI evidence reports 2019 records; API enumeration unverified | High |
| Complete historical backfill              | API pagination and archive coverage require validation | Medium |
| Verify Reddit account ownership           | One-time challenge is technically feasible             | Medium |
| Transfer results to external website      | Requires policy and integration approval               | High   |
| Replace legacy inbox-based OAuth entirely | Depends on historical coverage                         | High   |

Overall assessment: The Reddit-side processing is technically viable. The largest risks are external account-linking compliance and whether the accessible modmail archive contains all the award evidence currently obtained from users' legacy inboxes.

### 1.4 Initial scope

The minimum viable implementation should:

- Process only r/lockpicking modmail.
- Run in read-only mode initially.
- Identify belt approvals, including Black Belt Dan levels.
- Preserve the existing historical matching semantics.
- Support deterministic matching of new standardized approval messages.
- Avoid exporting raw modmail contents.
- Start with a bounded, time-limited feasibility sample; build a persistent historical index only after scope, retention, deletion, and storage limits are approved.
- Provide diagnostics for missed messages, parsing failures, and ambiguous awards.
- Avoid automatically modifying Discord roles, Reddit flair, or existing award records until explicitly enabled.

Out of scope for the first release: automatic belt approval decisions, general-purpose modmail management, reading private Reddit Chat, and replacing existing Discord reviewer workflows.

## 2. Existing system assessment

### 2.1 Current historical award-import implementation

The existing browser implementation, [AuthRedditRoute.jsx](../apps/web/src/auth/AuthRedditRoute.jsx), is the reference for historical matching. The separate API migration is unfinished and must not be treated as the active importer.

Its present workflow is:

1. Authenticate using Reddit OAuth authorization-code flow.
2. Retrieve the authenticated Reddit username using `/api/v1/me`.
3. Retrieve the user's current r/lockpicking flair using `/r/lockpicking/api/flairselector`.
4. Read `/message/inbox` in batches of 100.
5. Filter for moderator-distinguished messages associated with r/lockpicking.
6. Apply the belt-award matching logic.
7. Discard matches that exceed the current flair award.
8. Deduplicate by award ID, keeping the earliest qualifying message.
9. Save imported awards and advance the per-user bookmark.
10. Revoke the temporary OAuth token.

The relevant implementation includes `matchToBeltAward()`. Migration inventory, based on the October 26 repository review:

| Area | Status and comparison baseline |
| ---- | ------------------------------ |
| Browser entry points | [ImportButton.jsx](../apps/web/src/scorecard/ImportButton.jsx) and [EditProfilePage.jsx](../apps/web/src/profile/EditProfilePage.jsx) still request temporary OAuth access with `VITE_REDDIT_CLIENT_ID`, `identity flair privatemessages`, and `${location.origin}/#/auth/reddit`. The callback exchanges the code and reads identity, flair, and inbox messages in the browser. |
| API migration | [redditImportService.js](../apps/api/src/api/services/redditImportService.js) and [redditImport.js](../apps/api/src/api/routes/redditImport.js) exist. Their five-page, 256 KiB, and 30-second limits apply to that server path. No frontend consumer was found; the [migration checkpoint](reddit-api-auth-developer-report.md#checkpoint) records Phase 1 server work complete and Phase 2 frontend migration pending. |
| Existing linking | The owner reports existing Reddit linking works and that Reddit would not authorize new apps for API-server redirect URIs. This is an approval constraint on the proposed migration, not evidence that current linking stopped working. |
| Callback routing | [routes.jsx](../apps/web/src/app/routes.jsx) registers the callback at `/_`, while the buttons request `/auth/reddit`. The discrepancy remains unresolved; deployed routing and a live successful OAuth round trip were not independently verified. |
| Import confirmation | `advanceBookmarkForRedditUser()` runs before `ImportPreview` renders; [DBContext.jsx](../apps/web/src/app/DBContext.jsx) writes awards during that call. The current preview is a post-write results page. Section 10.5 proposes a new confirmation gate. |
| Comparison fixtures | Use the current browser matcher and synthetic fixtures first. Real inbox/modmail examples or old/new comparisons require an explicitly authorized source and sanitized, approved fixtures; API limits do not define browser baseline behavior. |


### 2.2 Existing matching behavior

| Rule                | Historical logic                                       |
| ------------------- | ------------------------------------------------------ |
| Belt identification | White through Black, plus numbered Dan levels          |
| Strong approval     | Belt name followed by `approved` or `granted`          |
| General approval    | `approved`, `granted`, or `congrat` anywhere in body   |
| Belt fallback       | Search body, then subject                              |
| Ambiguity           | Reject if multiple belt patterns match during fallback |
| Flair validation    | Reject matched awards greater than current flair       |
| Deduplication       | Keep earliest award date for each award ID             |

The new implementation should use these as its baseline, not silently introduce different matching results.

There are, however, several weaknesses worth addressing.

Potential false positives: The current fallback can match a positive word in one sentence and a belt name in an unrelated sentence.

Historical ambiguity: A moderator message discussing an approval isn't necessarily confirmation that the conversation participant received the award.

Regex edge cases: Dan notation, word boundaries, and belt references embedded in longer text require more robust test coverage.

Data-source changes: The existing code parses `t4` messages. Modern modmail has a conversation-oriented data model with separate message metadata.

Current flair as a ceiling: This is an existing business rule, not an inherent Reddit API requirement. Whether it should continue to control historical imports needs an explicit product decision.

### 2.3 Existing Discord processing

The earlier `processBeltMessage.js` implements the belt-request lifecycle, including:

- Request submission and replacement.
- Reviewer assignment.
- Approval and rejection.
- Discord role assignment.
- Reddit flair synchronization.
- Request history and status tracking.

Its main value in this project is the established business vocabulary and request lifecycle. It should not be directly ported into Devvit. The Discord bot and the Devvit app have different responsibilities.


### 2.4 Historical data findings

The owner-supplied Reddit ModMail screenshot reportedly shows that the search:

`subreddit:lockpicking participant:mgsecure`

returns conversations from September 2019 through at least October 2022, including Orange, Blue, Purple, and Brown Belt requests.

The screenshot was not included in the repository review. Treat this as reported moderator-UI visibility, not verified Devvit archive coverage or proof of equivalent legacy awards.

It does not yet establish that:

- Those particular conversations contain machine-detectable approval replies.
- Every old award exists in modern modmail.
- Devvit's pagination API exposes the same complete history as the browser search.
- The old personal inbox messages and modern modmail records are equivalent.

These questions should be settled during the proof-of-concept phase.

## 3. Technology choices

Use the current Devvit Web architecture, rather than starting a new project on the deprecated `@devvit/public-api` interface.

Reddit's current documentation recommends `@devvit/web/server` and a `devvit.json` configuration. The legacy public API remains available but is deprecated.


| Component             | Proposed technology                         |
| --------------------- | ------------------------------------------- |
| Devvit runtime        | Devvit Web                                  |
| Language              | JavaScript ES Modules                       |
| Server framework      | Hono or minimal supported server routing    |
| Reddit API            | `@devvit/web/server`                        |
| Storage               | Devvit Redis                                |
| Background processing | Devvit Scheduler                            |
| Testing               | Vitest with mocked Reddit adapters          |
| External API          | Existing Node.js server                     |
| Authentication        | Existing Firebase Authentication            |
| Application database  | Existing Firestore                          |
| Deployment            | Devvit CLI plus existing deployment process |

Devvit's starter tooling may generate TypeScript files. Use JavaScript ES module source, but validate the generated starter and build first: Devvit Web requires the server output to be a CommonJS bundle. Verify `devvit.json` entry points, packaged files, and JavaScript compatibility with the pinned local CLI before standardizing the structure. See [Devvit Web configuration](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration).

Relevant documentation: [Reddit API](https://developers.reddit.com/docs/capabilities/server/reddit-api?utm_source=chatgpt.com), [Scheduler](https://developers.reddit.com/docs/capabilities/server/scheduler?utm_source=chatgpt.com), and [External Endpoints](https://developers.reddit.com/docs/capabilities/server/external-endpoints?utm_source=chatgpt.com).

## 4. Phase 0 — Feasibility, policies, and architecture validation

Critical dependency

Objective: Resolve architectural blockers before investing in production integration.

### 4.1 Validate Devvit modmail access

Create a minimal Devvit app installed in a private test subreddit, then test with r/lockpicking when safe and authorized.

Validate the following behaviors:

- Retrieve a newly created modmail conversation.
- Retrieve a known archived conversation.
- Retrieve a known older conversation, preferably the September 2019 Orange Belt request.
- Access all messages in a conversation, including moderator replies.
- Identify the non-moderator conversation participant.
- Distinguish moderator replies from internal moderator notes.
- Extract message creation timestamps.
- Retrieve a conversation without marking it as read.
- Confirm pagination over active and archived conversations.
- Verify whether modmail conversation identifiers remain stable.

A known conversation can be retrieved using:

```
const result = await reddit.modMail.getConversation({
  conversationId,
  markRead: false
})
```

This method is documented, but the exact data shapes should be captured from actual test responses and normalized behind an adapter.


### 4.2 Validate archive coverage

Use the oldest known relevant conversation from the screenshot as a test case.

First establish that it can be retrieved directly by ID. Then determine whether ordinary pagination can discover it without knowing that ID in advance.

Test pagination using:

```
const result = await reddit.modMail.getConversations({
  subreddits: ['lockpicking'],
  state: 'all',
  sort: 'recent',
  limit: 100,
  after: cursor
})
```

The documented request type supports `subreddits`, `state`, `sort`, `limit`, and `after`, with a maximum of 100 conversations per request. It does not document a participant filter.


For initial testing, compare the API results with moderator UI searches for several representative usernames.

Validation criteria:

- Known archived conversations are retrievable.
- Pagination consistently advances.
- No unexplained gaps occur in a fixed test window.
- Historical approvals can be distinguished from ordinary moderator correspondence.
- The oldest *enumerable* period is documented separately from direct-by-ID retrieval.
- Several known legacy inbox `t4` approvals are compared with modmail conversation/message IDs, award values, and approval dates, including an old archived case and negative cases.
- Cursor behavior is recorded when conversations reopen or change order.
- Recovery is reported as recovered known awards / eligible known awards, with discrepancies explained.
- Moderators and the product owner set a numeric minimum acceptable coverage before replacement is promised, or approve a manual-evidence fallback for missing history.

If the API cannot enumerate older conversations reliably, investigate a bounded backfill using another approved API mechanism or retain a manual import path.

### 4.3 Confirm external integration permissions

This is the largest nontechnical dependency.

Reddit's current Devvit Rules require explicit opt-in for account-linked services, a unique opaque linkage ID rather than transmitting Reddit identifiers, and security controls for external services. Those controls include SOC 2 Type II compliance and evidence of a recent third-party penetration test. Exceptions require Reddit's written approval.


The proposed LPU integration is an account-linked service because it associates Reddit identities with existing Firebase accounts.

The team should provide Reddit with:

- A description of the r/lockpicking use case and community benefit.
- A data-flow diagram identifying where message content is processed.
- A proposed verification and consent process.
- The exact result fields intended for external transfer.
- An explanation of why existing Devvit storage is insufficient for the user-facing workflow.
- Retention, deletion, unlinking, and security policies.
- A request for any needed security-requirement exceptions.
- A ruling on read-only OAuth scopes for external accounts and the prohibition on username/password authentication to external services, including how these apply to existing Firebase sign-in methods.
- The exact challenge protocol, field list, transfer direction, and award payload for approval.

Record a written go/no-go covering the account-linked service requirements, including SOC 2 Type II and a recent qualifying third-party penetration test or an explicit written exception. An opaque link ID alone does not authorize award transfer. Do not start Phases 5–6 on the assumption that an exception will be granted.

An approval to call an external domain does not automatically constitute approval to transfer user-linked data.

### 4.4 Determine the allowed communication mechanism

Evaluate these separately approved options; neither HTTP Fetch nor External Endpoints is an assumed fallback for the other:

| Option                       | Advantages                          | Limitations                                   |
| ---------------------------- | ----------------------------------- | --------------------------------------------- |
| Devvit HTTP Fetch            | Event-driven push to LPU backend    | External domain must be approved              |
| Devvit External Endpoints    | Node backend can query Devvit       | Limited-access feature                        |
| Reddit-only functionality    | Avoids cross-platform data transfer | Cannot automatically update external profiles |
| Existing approved Reddit API | Could preserve some functionality   | Separate credentials and policy constraints   |

Devvit HTTP Fetch supports HTTPS calls to allow-listed domains, but personal domains generally are not approved without an exception. External Endpoints require separate access approval.


Recommendation: Request approval for a minimal outbound event mechanism and for External Endpoints, but do not make the Reddit-side proof of concept dependent on either.

### 4.5 Phase 0 deliverables

- Working read-only Devvit proof of concept.
- Documented API response samples, sanitized of personal message contents.
- Verified historical retrieval boundaries.
- Feasibility matrix with confirmed and unsupported operations.
- Written policy questions submitted to Reddit.
- Approved architectural direction or a documented fallback.

### Exit criteria

Proceed with the Reddit-native tool when current and known old conversations can be read, the bounded sample scope is authorized, and coverage limitations are documented. A full-community index additionally requires the privacy and capacity gate in Section 7.9. Phases 5–6 require written approval of the specific external integration; a policy request or a possible approval path is insufficient.

If production account linking is not permitted, the project can still deliver a useful Reddit-native approval index, but it should not be represented as a complete replacement for the existing LPU integration.

## 5. Phase 1 — Project foundation and shared domain model

Objective: Create a testable application structure with no dependency on the external LPU service.

### 5.1 Suggested repository layout

The monorepo has already been created: `apps/web/` contains the React/Vite frontend and `apps/api/` contains the Node API. It will also contain the Reddit/Devvit project at `apps/devvit/`; do not create a third permanent repository. The Devvit directory is planned, not an existing implementation.

```text
apps/web/                    Existing React/Vite frontend
apps/api/                    Existing Node API
apps/devvit/                 Planned Reddit/Devvit npm workspace
    devvit.json              App-local configuration and entry points
    package.json             Pinned local CLI, build/test/publish scripts
    src/server/              Triggers, jobs, moderator routes
    src/core/                Pure matchers, normalization, award rules
    src/services/            Modmail adapter, index, scan/link/delivery state
    tests/                   Synthetic fixtures, unit/integration/regression tests
    docs/                    Architecture, privacy, matching, operations
firebase/functions/          Existing independent npm package and lockfile
packages/award-domain/       Optional future pure catalog/mapping package
```

Use the existing npm coordinator and root lockfile for web/API and the future Devvit workspace. The repository standard is Node 24.21.0 and npm 11.19.0 with nested installs; the review's earlier Node/Yarn repository-consolidation steps are historical context, not pending work. Keep npm overrides at the root. Firebase Functions retains its independent npm package and lockfile.

Keep `devvit.json` and the project-local CLI dependency inside `apps/devvit/`. Run Devvit CLI commands with that directory as the working directory and validate app-local paths against the generated starter. Give Devvit independent builds, tests, permissions, CI scopes, and publish credentials; preserve existing web/API release pipelines. Devvit publication remains separately approval-gated. Sharing a repository does not grant cross-system data access.

Do not add a shared package until needed. If approved shared source must be packaged from outside the Devvit directory, explicitly configure `additionalSourceRoots` and review the packaged contents. Never package web/API secrets or unrelated source.

### 5.2 Separate Reddit API access from domain logic

Introduce a small adapter so business logic never depends directly on Devvit's raw message format.

Suggested interface:

```
export const modmailService = {
  getConversation: async conversationId => {},
  getConversations: async options => {},
  getMessage: async (conversationId, messageId) => {}
}
```

These are application-defined wrappers, not direct Devvit method signatures.

The adapter should handle:

- Reddit API access.
- Missing or inaccessible conversations.
- Pagination normalization.
- Rate-limit and transient-error classification.
- Timestamp conversion.
- Participant identity normalization.
- Message-role normalization.
- Diagnostic logging.

Do not include authorization credentials, tokens, or message bodies in normal application logs.

### 5.3 Define a canonical message representation

Use one internal representation for new and historical messages.

Example schema:

```
{
  subreddit: 'lockpicking',
  conversationId: 'example-conversation',
  messageId: 'example-message',
  participantId: 't2_example',
  authorRole: 'moderator',
  isInternal: false,
  isAutomated: false,
  createdAt: '2022-09-01T12:00:00Z',
  subject: 'Belt Request - Brown',
  body: 'Brown Belt approved. Congratulations!'
}
```

This is an application-defined schema.

Key distinction:

- `participantId` identifies the Reddit account the conversation concerns.
- `authorRole` identifies whether the message was written by a moderator, participant, or system.
- `isInternal` distinguishes private moderator discussions from user-facing messages.

Use the stable Reddit account ID for internal identity matching wherever available. Account names can change or become unavailable and are unsuitable as the sole durable key.

For account-linked external services, the Reddit ID must not be sent externally unless Reddit explicitly authorizes that data transfer.

### 5.4 Define award-result schema

```
{
  awardId: 'blue-belt',
  belt: 'Blue Belt',
  level: 5,
  status: 'approved',
  approvedAt: '2020-02-15T12:00:00Z',
  source: 'historical',
  confidence: 'high',
  evidence: {
    conversationId: 'example-conversation',
    messageId: 'example-message'
  },
  matcherVersion: 1
}
```

Recommended additional metadata:

| Field            | Purpose                                                   |
| ---------------- | --------------------------------------------------------- |
| `detectedAt`     | When the app processed the record                         |
| `matcherVersion` | Supports reproducing past results                         |
| `source`         | Distinguishes historical scan from live trigger           |
| `status`         | Represents approved, rejected, or other explicit outcomes |
| `confidence`     | Enables manual review                                     |
| `evidence`       | Internal audit reference                                  |
| `supersedes`     | Supports corrections without losing history               |

The current [award dictionary](../apps/web/src/data/awards.json) remains the authority for award IDs, names, and ordering. Slugs such as `blue-belt` in this plan are illustrative internal labels, not production Firestore IDs. Define a versioned mapping from Devvit labels and Dan levels to existing catalog IDs; reject unknown mappings before any write.

Do not maintain independent, diverging belt definitions across the Discord bot, Belt Explorer, and Devvit app.

### 5.5 Award ordering

Use an ordered dictionary or common `level` field to support:

- White through Black.
- Black Belt Dan 1, Dan 2, and subsequent supported levels.
- Duplicate award detection.
- Highest-award calculation.
- Optional current-flair validation.

Preserve the existing `lookupAwardByBelt()` and `awardGreaterThan()` behavior during migration.

### 5.6 Phase 1 deliverables

- Devvit project skeleton in `apps/devvit/`, with a pinned project-local CLI and independently scoped CI.
- Pure JavaScript matching and normalization modules.
- Shared award data definitions.
- Versioned internal schemas.
- Mock Reddit adapter.
- Vitest configuration.
- Local test fixtures.
- README and operational documentation.

Exit criteria: A normalized message can be classified and converted into a canonical award record without calling Reddit, Discord, or Firebase. A JavaScript-source build produces the required CommonJS server bundle, and app-local CLI execution resolves the tested `devvit.json` entry points and only approved packaged source.

## 6. Phase 2 — Historical approval matcher

Objective: Preserve existing import behavior while substantially improving testability and confidence.

### 6.1 Retain two distinct matching algorithms

Do not apply the new strict message format retroactively.

| Matcher                  | Intended use                                |
| ------------------------ | ------------------------------------------- |
| `matchHistoricalAward()` | Existing, variable-format moderator replies |
| `matchStructuredAward()` | New standardized approval messages          |

Both should return the same award-result schema.

### 6.2 Historical matcher

Start by extracting the existing `matchToBeltAward()` from `AuthRedditRoute.jsx` into a standalone pure function.

The first version should match the original behavior as closely as possible.

After creating regression tests, incrementally add stricter confidence evaluation.

Proposed result:

```
{
  matched: true,
  awardId: 'purple-belt',
  confidence: 'medium',
  matcher: 'historical-fallback',
  needsReview: true
}
```

Recommended confidence classifications:

| Confidence | Meaning                                              | Proposed handling           |
| ---------- | ---------------------------------------------------- | --------------------------- |
| High       | Unambiguous approval phrase tied to one belt         | Automatic candidate         |
| Medium     | Positive language and one belt identified indirectly | Review or corroborate       |
| Low        | Belt mentioned with weak approval evidence           | Do not import automatically |
| None       | No qualifying evidence                               | Ignore                      |

These are proposed heuristics and should be calibrated against actual historical messages.

### 6.3 Structured matcher

For future approvals, adopt a deliberately narrow, documented format.

Examples:

```
Yellow Belt approved. Congratulations!
Blue Belt approved. Congratulations!
Black Belt 2nd Dan approved. Congratulations!
```

The format should specify:

- Valid award names.
- Supported Dan notation.
- Allowed punctuation and whitespace variations.
- Whether the standardized line must begin the message.
- Whether additional moderator commentary is allowed.
- Whether rejection, correction, or revocation messages have distinct formats.

A starter matcher for ordinary belts:

```
const BELTS = [
  'white', 'yellow', 'orange', 'green', 'blue',
  'purple', 'brown', 'red', 'black'
]

export function matchStructuredAward(body = '') {
  const names = BELTS.join('|')

  const pattern = new RegExp(
    `^(${names})\\s+belt\\s+approved\\.\\s*congratulations!`,
    'i'
  )

  const match = body.trim().match(pattern)

  if (!match) return null

  return {
    belt: `${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()} Belt`,
    status: 'approved',
    confidence: 'high',
    matcher: 'structured-v1'
  }
}
```

This is starter logic only. It deliberately excludes Dan awards and should not be adopted as the complete production classifier.

### 6.4 Sender and context validation

A regex match must not, by itself, establish an approval.

Validate:

1. The conversation belongs to r/lockpicking.
2. The intended recipient is the conversation's participant.
3. The message came from an authorized moderator or approved automation.
4. The message was not a private moderator note.
5. The message is not merely quoting a previous message.
6. The message represents an actual approval, not a hypothetical, denial, or appeal.
7. No later correction or revocation invalidates the result.

Moderator identity masking must be accounted for. Devvit does not guarantee all identity fields will be present in every event.


### 6.5 Build a regression corpus

The most valuable test asset will be a representative set of sanitized historical messages.

Include:

| Test case                                          | Expected behavior         |
| -------------------------------------------------- | ------------------------- |
| `Yellow Belt approved. Congratulations!`           | Yellow approved           |
| `Your Blue Belt has been granted`                  | Blue approved             |
| `Congratulations on your Purple Belt!`             | Purple approval candidate |
| `Blue Belt request approved`                       | Blue approved             |
| `Your request is still being reviewed`             | No approval               |
| `Green Belt was not approved`                      | No approval               |
| `Congrats on Blue, next up is Purple`              | No automatic Purple award |
| `Black Belt 2nd Dan approved`                      | Dan 2 approved            |
| `2nd Dan approved`                                 | Dan 2 approved            |
| Body mentions two belt colors                      | Ambiguity handling        |
| Subject identifies belt, body says congratulations | Historical fallback       |
| Quoted approval from another conversation          | No new award              |

The test corpus should also include real, sanitized cases for unusual historical phrasing only from explicitly authorized sources. Do not obtain fixtures through live inbox/modmail reads without the required approval. Record provenance and sanitization; synthetic fixtures remain the default.

### 6.6 Regression comparison

Run both the original matcher and new matcher against the same historical fixture set.

Produce a difference report containing:

```
{
  fixtureId: 'test-042',
  legacyResult: 'blue-belt',
  newResult: 'blue-belt',
  classification: 'unchanged'
}
```

Other classifications:

- `new-match`
- `removed-match`
- `changed-award`
- `changed-confidence`
- `error`

Manually review every changed result before enabling production imports.

### 6.7 Phase 2 deliverables

- Standalone historical matcher.
- Structured approval matcher.
- Award normalization utilities.
- Historical regression corpus.
- Automated comparison report.
- Documented false-positive and false-negative cases.
- Versioned matching rules.

Exit criteria: All curated historical approval fixtures have approved expected results. No known denial, hypothetical approval, or unrelated conversation is automatically classified as an award.

## 7. Phase 3 — Historical modmail scanning and indexing

Objective: Build a resumable, read-only scanner that discovers approved awards in the accessible modmail archive.

### 7.1 Scanning strategy

Start with an approved bounded sample with an explicit time window, conversation limit, and deletion deadline. Measure coverage and storage before proposing a full backfill. If separately approved, scan the wider history by page rather than issuing a full-history scan for each username.

There are two operational modes worth implementing.

Full backfill: Process the available modmail history once and build an internal award index.

Targeted lookup: Resolve a particular user's awards against the already-built index. Optionally inspect additional known conversation IDs when needed.

The full backfill should be independently resumable and should not depend on an individual visiting the Belt Explorer website.

### 7.2 Scanning algorithm

```

Start historical scan
    |
    v
Load scan configuration and cursor
    |
    v
Fetch next page of conversations
    |
    v
For each eligible conversation:
    - Skip already processed conversations
    - Identify participant
    - Retrieve complete conversation
    - Extract eligible moderator messages
    - Run historical award matcher
    - Validate context and confidence
    - Store minimal result
    - Record processing checkpoint
    |
    v
Save pagination cursor
    |
    +--- More conversations? --- Yes ---> Next page
    |
    No
    |
    v
Reconcile scan results
    |
    v
Mark scan complete

```

### 7.3 Conversation eligibility

Use the following initial rules:

- Subreddit must be r/lockpicking.
- Prefer normal subreddit-to-user conversations.
- Include archived conversations.
- Exclude internal moderator-only conversations.
- Exclude automated messages unless they originate from a known approval mechanism.
- Do not restrict by subject, because historical subjects are inconsistent.
- Use subject and body as matching evidence, but ensure matches originate from qualifying moderator replies.

Avoid filtering the entire scan to conversations whose subjects contain "Belt Request". That optimization would miss legitimate historical approvals sent in differently named conversations.

### 7.4 Efficient scanning

The principal performance costs are Reddit API requests and persistent-storage operations.

Recommendations:

- Retrieve conversation metadata in pages of up to 100.
- Process a bounded number of conversations per scheduled task.
- Use conservative concurrency, initially sequential or very low parallelism.
- Save progress after each completed batch.
- Track permanent failures separately from retryable failures.
- Retry transient failures with bounded exponential backoff.
- Deduplicate by conversation ID and message ID.
- Run scanning independently from the live-message handler.

Devvit requests have time limits, so historical backfills must be divided into scheduled jobs. Reddit documents this checkpoint-and-resume pattern for larger Redis and scheduler workloads.


### 7.5 Pagination and checkpointing

A checkpoint might contain:

```
{
  scanId: 'historical-v1',
  state: 'running',
  queue: 'all',
  cursor: 'example-cursor',
  pagesCompleted: 54,
  conversationsSeen: 5320,
  conversationsProcessed: 5288,
  candidateAwards: 812,
  failures: 3,
  startedAt: '2026-10-25T12:00:00Z',
  updatedAt: '2026-10-25T13:00:00Z'
}
```

These counts are illustrative.

Persist enough information to resume safely after an interruption, but do not assume a single cursor is a permanent snapshot of the inbox.

Because conversation ordering can change when new replies arrive, a robust scanner should:

1. Deduplicate already-seen conversation IDs.
2. Reconcile the newest portion of the archive after the backfill.
3. Maintain separate cursors for historical and ongoing scans.
4. Record the time range covered by each successful pass.
5. Avoid declaring completeness solely because one page is empty.

A scan interruption must never result in an award silently disappearing from the index.

### 7.6 Suggested Redis structures

Use stable, discoverable collections rather than scattered keys that cannot be enumerated.

Devvit Redis supports hashes and sorted sets, but does not support general key enumeration through a global scan.


Example logical structures:

```
scan:historical:state
scan:historical:failures
scan:historical:processed
awards:by-reddit-user
awards:by-message
awards:pending-review
```

Possible semantics:

| Key                         | Suggested structure | Purpose                          |
| --------------------------- | ------------------- | -------------------------------- |
| `scan:historical:state`     | JSON string         | Current checkpoint               |
| `scan:historical:failures`  | Hash                | Retryable errors                 |
| `scan:historical:processed` | Sorted set          | Deduplication and reconciliation |
| `awards:by-reddit-user`     | Hash                | Per-user award summaries         |
| `awards:by-message`         | Hash                | Evidence indexing                |
| `awards:pending-review`     | Sorted set          | Ambiguous matches                |

These are logical proposals, not unbounded collections. Measure bytes per conversation, participant, evidence record, and retry in the sample; project total installation storage and transaction sizes against current Devvit Redis limits. Choose bounded/sharded collections, expiry, and cleanup indexes before a full scan. General key enumeration is unavailable, so deletion must use maintained indexes.

### 7.7 Historical evidence and deduplication

Each approval candidate should be uniquely identified by its source message.

Use a key conceptually equivalent to:

```
subreddit + conversationId + messageId + awardId
```

Keep two separate concepts:

Evidence records: Individual qualifying approval messages.

Resolved awards: The accepted award history for a Reddit user.

One user could have several messages mentioning the same award. The existing application chooses the earliest qualifying award date. Preserve that policy unless the team explicitly changes it.

For corrections or revocations, the newest valid decision may override an earlier one. This must be represented as an explicit business rule, not as accidental deduplication behavior.

### 7.8 Historical validation

Before considering the backfill complete:

- Compare a sample of results with the original OAuth-based importer, where lawful access and test data remain available.
- Compare at least several known belt histories against the moderator UI.
- Include users with several awards spanning many years.
- Include Dan awards.
- Include users with no approvals.
- Include conversations containing rejections, appeals, corrections, and approvals.
- Validate oldest and newest archive coverage.
- Record unexplained discrepancies.

### 7.9 Privacy and retention

A permanent index of every participant's identifiable approval history is not automatically permitted merely because it resides within Devvit Redis.

For production, prefer the smallest approved scope, potentially indexing only users who have opted in to linking their accounts.

A community-wide scan indexes people who may never use LPU. Obtain separate moderator and Reddit approval for its scope, size estimate, retained participant/evidence fields, and retention schedule before running it. Specify deletion across participant and evidence indexes, pending review, retries, diagnostics, and any LPU copy. Test account-deletion handling and deletion of linked external data within 30 days of unlinking. If approved, retain only minimal evidence and do not retain raw message bodies unnecessarily. Reddit's current rules recommend deleting stored user data within 30 days where possible and require account-deletion handling.


### 7.10 Phase 3 deliverables

- Historical scanning service.
- Pagination and checkpoint manager.
- Internal approval index.
- Resumable scheduler job.
- Failure and retry handling.
- Scan progress diagnostics.
- Historical comparison report.
- Coverage and completeness report.
- Sample size/storage measurements and approved retention/deletion schedule before any persistent full-community index.

Exit criteria: The scanner can locate known approvals, survive interruptions, resume without duplicating awards, and produce an auditable account of which conversations were processed.

## 8. Phase 4 — Real-time modmail processing

Objective: Detect and classify newly received approval messages without polling the complete modmail archive.

### 8.1 Trigger configuration

Use Devvit's `onModMail` trigger.

In current Devvit Web, triggers are declared in `devvit.json` and delivered to an internal server endpoint.

Conceptual configuration:

```
{
  "triggers": {
    "onModMail": "/internal/triggers/on-modmail"
  }
}
```

This is an illustrative configuration fragment, not a complete `devvit.json`.

The event contains message metadata, including conversation ID, message ID, author role, and conversation type. It does not contain the message body. The handler must retrieve the conversation to classify its contents.


### 8.2 Trigger processing flow

1. Receive `onModMail` event.
2. Validate the associated subreddit and conversation type.
3. Check whether the message has already been processed.
4. Retrieve the conversation and target message.
5. Normalize the message and identify its participant.
6. Apply the moderator workflow contract in Section 8.8: run the structured matcher and queue nonconforming candidate replies for review.
7. Validate sender role, approval context, and award name.
8. Write a deduplicated award result.
9. Queue approved integration delivery if configured.
10. Mark processing as complete and record operational metrics.

### 8.3 Idempotency and event reliability

Do not assume events are delivered exactly once or in chronological order.

Reddit explicitly documents that triggers may be delivered more than once and that events can arrive after the referenced state changes.


Use an idempotency key such as:

```
const eventKey = `${subreddit}:${conversationId}:${messageId}`
```

The processor should have three possible outcomes:

- `processed`
- `ignored`
- `retryable-error`

Make claiming the event and committing the result safe under concurrent execution, using supported Redis transaction or atomic-operation patterns.

### 8.4 Handling message changes

Define how to handle:

- Duplicate events.
- Deleted or inaccessible messages.
- Edited messages, if edits are supported by the relevant Reddit surface.
- Moderator corrections.
- Rejected or revoked awards.
- Unknown belt values.
- Missing participant IDs.
- Internal notes or automated replies.
- A conversation reopened years after it was originally archived.

A correction must not simply create a second active award.

### 8.5 Real-time reconciliation

Use a scheduled reconciliation job alongside the trigger.

For example, periodically examine recently updated modmail conversations to identify any messages not captured by the event processor.

This protects against missed events, temporary API failures, and deployment outages.

The reconciliation frequency should be configurable. A modest cadence is preferable to aggressive polling.

### 8.6 Do not take automatic moderation actions initially

The first production processor should observe and classify, not approve requests on behalf of moderators.

In particular, it should not immediately:

- Set Reddit flair.
- Assign Discord belt roles.
- Post announcements.
- Reply to modmail.
- Modify existing approved-award records without reconciliation.

Once the detection system proves reliable, these behaviors can be separately evaluated.

### 8.7 Phase 4 deliverables

- Live `onModMail` handler.
- Structured award parser.
- Deduplicated event processing.
- Retry and reconciliation jobs.
- Operational metrics.
- Event replay tests.
- Moderator-facing diagnostics.

Exit criteria: All messages in a controlled end-to-end test are correctly classified, and duplicate events or transient failures never create duplicate awards.

### 8.8 Moderator workflow contract

Before enabling live classification, agree with moderators on authoritative evidence, exact approval/denial/correction/revocation templates, allowed automation, and an adoption date. Free-form replies will continue until adoption; structured-only processing would silently miss them. Route nonconforming candidate moderator replies to a bounded review queue rather than treating them as confirmed awards or assuming there were no approvals.

Fetch the target message because `onModMail` carries metadata, not a body. Preserve moderator-reply versus internal-note distinctions. Test duplicate and unordered events, late corrections/revocations, free-form replies, and reconciliation across the adoption date. Include the workflow contract and review-queue retention in Phase 4 deliverables and acceptance criteria.

## 9. Phase 5 — Reddit account linking

Objective: Verify that an authenticated LPU user controls a particular Reddit account without requiring broad Reddit OAuth permissions.

Requires Reddit policy approval

### 9.1 Proposed linking flow

Candidate protocol, contingent on Reddit approving these exact fields and directions:

1. The Firebase-authenticated user explicitly opts in. The LPU backend creates a random challenge and random opaque link ID and stores their association with the UID, expiry, consent version, and pending state. Store a challenge hash where practical.
2. The browser displays the challenge and link ID for the user to send in r/lockpicking modmail. Neither is a Firebase UID or Reddit identifier.
3. Devvit reads the actual message sender's stable Reddit ID and reserves that identity internally for this attempt. A browser cannot supply or attest the Reddit identity.
4. Through the approved authenticated server channel, Devvit delivers the challenge, link ID, protocol version, and idempotent attempt ID to LPU. The backend atomically checks ownership of the challenge/link pair, expiry, consent, unused state, and account conflicts, then consumes the challenge and records a pending binding. Devvit cannot establish backend expiry or single-use state from the code alone.
5. On an authenticated acceptance, Devvit atomically binds the reserved Reddit ID to the link ID, enforcing one active association on both sides. It confirms commitment through the approved channel; LPU marks the link verified only after confirmation. Award transfer remains disabled until both sides agree.
6. Recover partial completion through idempotent retries and authenticated status reconciliation. This is a two-system state machine, not a distributed transaction.

No part of this candidate protocol is an authorization to transfer data. If the approved channel cannot support the handshake and its acknowledgements, redesign it and obtain approval before implementation.

### 9.2 Challenge format

Example:

```
Subject: LPU Account Verification

LPU-VERIFY 7f49c2e8b0...
LPU-LINK opaque-random-link-id
```

The actual challenge should be cryptographically random, sufficiently long, single-use, and short-lived.

For the Node.js backend:

```
import {randomBytes} from 'node:crypto'

export function createVerificationChallenge() {
  return randomBytes(24).toString('hex')
}
```

A 24-byte random challenge provides 192 bits of entropy.

### 9.3 Verification requirements

The service must verify:

- The challenge was issued to an authenticated Firebase account.
- The challenge has not expired.
- The challenge has not already been used.
- The message belongs to r/lockpicking.
- The message was authored by the external user being linked.
- The challenge matches exactly.
- The Reddit account is not already linked to a different Firebase account.
- The Firebase user explicitly consented to linking.
- The confirmation originates from the approved Devvit integration.

The last point is especially important: the Node server must not accept a client-supplied assertion that a Reddit account has been verified.

### 9.4 Identity-mapping design

There are three separate identifiers:

| Identifier        | Where used                        |
| ----------------- | --------------------------------- |
| Firebase UID      | Existing application account      |
| Reddit account ID | Internal Reddit identity          |
| Link ID           | Approved cross-system association |

The preferred design is to maintain the Reddit account ID only on the Reddit side and associate it with a randomly generated, opaque link ID.

The Firebase side stores that link ID and associated verification status.

Do not assume that hashing the Reddit username or account ID makes it anonymous. Reddit's rules explicitly limit external identity associations to a unique ID and prohibit re-identification.


### 9.5 Linkage protocol options

Use the end-to-end protocol in Section 9.1 as the candidate design. HTTP Fetch approval must include the authenticated delivery, acknowledgements, and reconciliation operations it needs. A pull-based External Endpoint design is a separate limited-access request and requires a complete equivalent protocol before adoption; it is not an automatic fallback.

Required lifecycle behavior on both sides:

| Case | Required behavior |
| ---- | ----------------- |
| Retry or lost acknowledgement | Same attempt ID and payload return the prior outcome; never consume twice or create a second link. |
| Expired/unissued challenge | Backend rejects without binding. Devvit clears its reservation; the user starts a fresh attempt. |
| Conflicting claim | Reject an attempt to bind either side to a different active account; do not overwrite an existing link. |
| Partial completion | Reconcile pending states with authenticated status checks; expire abandoned reservations and prevent award delivery until committed. |
| Unlink/revocation | Disable transfer immediately, invalidate outstanding challenges and queued deliveries, and propagate idempotent deletion to both stores. Delete linked external data within 30 days. |
| Re-link | Require fresh consent, challenge, attempt ID, and link ID; never resurrect old queued results or let an earlier acknowledgement restore a revoked association. |

Manual verification also needs a separately approved policy basis and protocol; it does not bypass external account-linking rules.

### 9.6 Security safeguards

Implement:

- Challenge expiration.
- One-time consumption.
- Challenge hashing at rest where practical.
- Rate limits per authenticated account.
- Protection against concurrent claims.
- Constant-time comparison for sensitive challenge validation where applicable.
- TLS for external communication.
- Backend authentication independent of client Firebase tokens.
- Replay protection.
- A manual unlinking capability.
- Deletion handling.
- Structured audit records without retaining challenge contents unnecessarily.

### 9.7 Account-link state

Proposed states:

```
unlinked
    |
    v
pending_verification
    |
    +-- expired
    |
    +-- rejected
    |
    v
verified
    |
    +-- unlinked
    |
    +-- revoked
```

A verified link should also record the verification-method version to support future migrations.

### 9.8 Phase 5 deliverables

- Account-linking specification.
- Verification challenge service.
- Devvit challenge validator.
- Approved identity-association protocol.
- Firebase account-link state.
- Unlinking and deletion workflows.
- Abuse-prevention tests.
- End-to-end security tests.

Exit criteria: A test user can verify, link, query, and unlink an account without exposing Reddit identifiers or modmail contents through an unauthorized channel.

## 10. Phase 6 — Integration with the LPU backend and Firestore

Objective: Make approved award results available to the existing application while preserving its current award-management behavior.

### 10.1 Integration boundary

The Devvit app should not know about internal Belt Explorer implementation details such as React contexts or Firestore document layouts.

Instead, introduce a dedicated Node.js API layer that:

1. Authenticates the integration request.
2. Validates the approved data-transfer schema.
3. Resolves the opaque link ID to a Firebase user.
4. Applies award normalization and deduplication rules.
5. Records the source and verification status.
6. Updates Firestore through the Firebase Admin SDK.

All client-side reads remain governed by the existing authentication and authorization model.

### 10.2 Proposed API operations

These are conceptual application routes, contingent on Reddit approving the required communication flow.

| Operation                         | Method | Purpose                          |
| --------------------------------- | ------ | -------------------------------- |
| `/api/reddit/link/challenge`      | POST   | Create an account-link challenge |
| `/api/reddit/link/status`         | GET    | Return verification state        |
| `/api/reddit/link`                | DELETE | Unlink Reddit account            |
| `/api/reddit/awards/import`       | POST   | Request historical import        |
| `/api/reddit/awards/status`       | GET    | Retrieve import status           |
| `/api/integrations/reddit/events` | POST   | Receive authorized result events |

The first five routes would use Firebase authentication and appropriate authorization.

The integration event endpoint would require separate server-to-server authentication and must not be publicly writable by ordinary authenticated users.

For a pull-based External Endpoints design, the inbound event route may be unnecessary.

### 10.3 Minimal external award-result payload

A permitted transfer might conceptually resemble:

```
{
  eventId: 'unique-event-id',
  linkId: 'opaque-link-id',
  type: 'belt-award',
  awardId: 'yellow-belt',
  status: 'approved',
  awardedAt: '2026-10-25T12:00:00Z',
  source: 'modmail',
  matcherVersion: 1
}
```

This schema intentionally excludes:

- Reddit username.
- Reddit account ID.
- Message body.
- Conversation subject.
- Moderator identity.
- Complete conversation history.

Whether even this reduced payload can be transferred is subject to Reddit approval.

Keep raw evidence identifiers within Devvit unless sharing them is specifically authorized.

### 10.4 Firestore structure

Use the current data contract rather than a new nested award store:

```text
awards/{documentId}
    userId
    awardId
    awardUrl
    awardCreatedAt

lockcollections/{existingProfileId}
    Existing related profile fields
```

The prior `users/{uid}/awards/{awardId}` proposal was illustrative and does not describe this application. Design pending import/link metadata separately after inspecting existing account and authorization contracts; do not duplicate the authoritative award collection.

Before implementation, version the Devvit-to-catalog ID mapping and timestamp conversion. Decide how an approved result with no externally shareable Reddit message URL is represented in `awardUrl` and displayed; do not fabricate a URL or export evidence IDs to fill it. Check the scorecard and activity-cache consumers and update their refresh/invalidation paths for the approved contract. Preserve existing manual awards and profile fields.

### 10.5 Importing awards

The import operation should:

1. Authenticate the Firebase user.
2. Confirm a valid linked Reddit account.
3. Check for an existing import request.
4. Submit or queue an approved lookup request.
5. Retrieve only permitted award results.
6. Normalize award identifiers against the current catalog.
7. Compare with existing user awards.
8. Return a preview of proposed changes.
9. Require user confirmation before applying changes, unless an automatic-update policy has been explicitly approved.

For initial deployment, the recommended policy is explicit acceptance before writes. This requires a new backend pending-candidate state and authenticated accept action, plus a preview UI before awards or import bookmarks are changed. Existing `ImportPreview` displays results after writes and cannot supply this gate unchanged. Acceptance must revalidate link status, candidate version, permissions, and concurrent award changes, then commit idempotently. If product policy instead chooses automatic writes, document that decision and call the screen a post-write results page.

### 10.6 Import reconciliation rules

Define behavior for each case:

| Existing state             | Incoming result             | Action                  |
| -------------------------- | --------------------------- | ----------------------- |
| No matching award          | Confirmed approval          | Offer import            |
| Same award, same date      | Duplicate                   | Ignore                  |
| Same award, earlier date   | Historical evidence         | Offer date correction   |
| Same award, later date     | Duplicate or correction     | Review                  |
| Current award higher       | Lower historical approval   | Import if appropriate   |
| Imported award now revoked | Explicit revocation         | Flag for review         |
| Existing manual award      | Conflicting Reddit evidence | Preserve pending review |
| Ambiguous result           | Uncertain approval          | Do not auto-import      |

The existing `awardGreaterThan()` behavior should be revisited here.

A current flair may be a useful validation signal, but it should not necessarily prevent a legitimate historical award from being recorded. For example, someone currently holding Brown Belt may have historical Orange through Purple approvals worth including in their award history.

The application should distinguish historical achievements from currently recognized highest award.

### 10.7 Consistency and replay handling

Integration events should be safe to retry.

Store a processed-event ID so duplicate delivery does not produce duplicate Firestore writes.

For operations that must atomically update an award and its associated import status, use Firestore transactions or batches where appropriate.

Do not assume Devvit and Firestore updates occur in one distributed transaction.

A result should remain recoverable after a temporary Node server outage.

### 10.8 Phase 6 deliverables

- Node integration endpoints.
- Firebase authentication and authorization middleware.
- Approved result-transfer mechanism.
- Firestore repository functions.
- Pending-candidate storage, pre-write preview, and explicit accept action (subject to the product decision).
- Reconciliation logic.
- Idempotent event processing.
- End-to-end tests with the existing Belt Explorer.

Exit criteria: A verified user can import authorized historical awards into their existing profile without duplicate records, unauthorized updates, or disclosure of private modmail content.

## 11. Phase 7 — Deployment, monitoring, and operational controls

Objective: Prepare the integration for reliable, maintainable production use.

### 11.1 Environments

Maintain distinct environments for development, staging, and production.

| Environment | Devvit installation              | External backend               |
| ----------- | -------------------------------- | ------------------------------ |
| Development | Private sandbox subreddit        | Local or development API       |
| Staging     | Private moderator test subreddit | Staging backend / Firestore    |
| Production  | r/lockpicking                    | Production backend / Firestore |

Exact installation and version promotion behavior should be tested with the current Devvit deployment tooling.

Avoid using production modmail for routine regression tests.

### 11.2 Deployment sequence

1. Run linting and unit tests.
2. Build the Devvit project.
3. Deploy to development.
4. Run synthetic modmail acceptance tests.
5. Deploy to staging.
6. Run historical retrieval and event processing checks.
7. Verify Reddit's required app and domain approvals.
8. Deploy the approved version to production with external delivery disabled.
9. Enable live classification in shadow mode.
10. Review results with moderators.
11. Enable authorized external result delivery for a small pilot group.
12. Expand only after validating accuracy and operational reliability.

### 11.3 Feature flags

Recommended flags:

```
{
  historicalScanEnabled: false,
  liveMatchingEnabled: true,
  externalDeliveryEnabled: false,
  automaticImportEnabled: false,
  structuredOnlyMode: true,
  dryRun: true
}
```

Feature flags should be server-controlled and persisted through app upgrades.

They should never be used to bypass policy approval.

### 11.4 Observability

Track at least:

| Metric                         | Purpose                          |
| ------------------------------ | -------------------------------- |
| `modmail.events.received`      | Incoming trigger volume          |
| `modmail.events.duplicate`     | Duplicate event detection        |
| `modmail.events.failed`        | Processing failures              |
| `modmail.events.ignored`       | Nonqualifying messages           |
| `awards.structured.matched`    | New-format approvals             |
| `awards.historical.matched`    | Historical approvals             |
| `awards.ambiguous`             | Cases requiring manual review    |
| `scan.conversations.processed` | Backfill progress                |
| `scan.pages.completed`         | Pagination progress              |
| `scan.errors.retryable`        | Temporary failures               |
| `integration.events.delivered` | Successful external transfers    |
| `integration.events.failed`    | Failed transfers                 |
| `link.verifications.completed` | Successful account verifications |

Include the relevant app version and matcher version in operational diagnostics.

### 11.5 Logging policy

In development, detailed logs can include sanitized metadata necessary for debugging.

In production, logs should be minimal on success and detailed only for errors, without recording message bodies, verification codes, tokens, or identifying data unnecessarily.

Example:

```
logger.info({
  operation: 'modmail-process',
  outcome: 'matched',
  matcher: 'structured-v1',
  awardId: 'yellow-belt'
})
```

Internal evidence IDs may be useful in protected diagnostics, subject to the approved retention policy.

### 11.6 Moderator controls

Provide a restricted administrative interface or moderator menu actions for:

- Viewing current scan status.
- Starting or pausing an approved historical scan.
- Retrying failed batches.
- Reviewing ambiguous matches.
- Viewing recent processing metrics.
- Temporarily disabling external result delivery.
- Rebuilding a particular index.
- Performing a controlled reclassification with a new matcher version.

All administrative operations must verify moderator permissions server-side, not just hide buttons in the UI.

### 11.7 Data retention and deletion

Define written procedures covering:

- Account unlinking.
- Reddit account deletion.
- Deleted or removed Reddit content.
- Expired verification challenges.
- Historical evidence retention.
- Redis index cleanup.
- Firestore data removal.
- Audit-record retention.
- User privacy requests.

Reddit's rules require external linked-account data to be deleted within 30 days after unlinking, and deleted Reddit-account identifiers must be removed from applicable stores.


The retention design should be approved before building a persistent full-community index.

### 11.8 Failure recovery

Document procedures for:

- Reddit API outages.
- Devvit deployment failures.
- Missing or duplicate triggers.
- Redis quota or write failures.
- External API outages.
- Expired external integration credentials.
- Schema migrations.
- Incorrect matcher releases.
- Compromised integration credentials.

Where possible, support a rollback to the previous matcher version without changing previously accepted award records.

### 11.9 Phase 7 deliverables

- Production deployment workflow.
- Moderator operation guide.
- Logging and monitoring configuration.
- Alert thresholds.
- Data deletion procedures.
- Release and rollback checklist.
- Incident-response runbook.

Exit criteria: The service can operate without regular developer intervention, and moderators can safely disable or diagnose it when needed.

## 12. Phase 8 — Migration and retirement of the old importer

Objective: Replace the legacy OAuth inbox importer only after the new workflow demonstrates adequate coverage.

### 12.1 Parallel validation period

During an initial pilot, keep the existing browser importer available where it remains authorized and functional. The owner reports it works. Do not assume the unfinished API OAuth migration is approved or available, and do not require new API-server redirect clients as a Phase 8 dependency. Resolve the callback routing discrepancy separately before relying on a deployed comparison flow. Use authorized existing exports or sanitized fixtures if a live comparison cannot be approved.

Compare:

- Historical award counts.
- Award dates.
- Highest recognized awards.
- Dan levels.
- Missing approvals.
- Duplicate awards.
- Cases that require manual review.

Classify differences by root cause.

### 12.2 Migration cases

| Case                                   | Approach                                          |
| -------------------------------------- | ------------------------------------------------- |
| All old approvals found in modmail     | Import through new system                         |
| Some approvals only in legacy inbox    | Preserve existing imported results                |
| Approval found but wording ambiguous   | Manual review                                     |
| Existing award with no Reddit evidence | Do not delete automatically                       |
| Newly linked user                      | Run approved historical lookup                    |
| Existing linked user                   | Reuse existing imported award history where valid |
| New structured approval                | Process through Devvit trigger                    |

Do not require every existing user to reprove every previously imported award.

### 12.3 Cutover criteria

Retire the old importer only when:

- The numeric coverage threshold agreed in Phase 0 has passed, or an approved manual-evidence fallback covers missing history, including newly linked users with inbox-only approvals.
- New approvals are processed correctly.
- The account-linking path is operational and approved.
- Existing records remain stable.
- User import previews function.
- Rollback is documented.
- Privacy and deletion requirements are implemented.

### 12.4 Phase 8 deliverables

- Migration report.
- Historical coverage comparison.
- Legacy importer deprecation plan.
- User-facing migration notes.
- Final cutover checklist.

Exit criteria: The replacement provides the required workflows without relying on unsupported or unapproved legacy inbox access.

## 13. Security and privacy review

The project should have a dedicated security review before any external account-linking feature goes live.

### 13.1 Existing OAuth implementation concern

One issue in the attached `AuthRedditRoute.jsx` deserves attention independently of the Devvit migration.

The current implementation retrieves a Reddit client secret from Vite environment variables:

```
const clientSecret =
  import.meta.env.VITE_REDDIT_CLIENT_SECRET_LOCAL ||
  import.meta.env.VITE_REDDIT_CLIENT_SECRET
```

It subsequently uses that value in the browser to exchange and revoke OAuth tokens.


A confidential Reddit OAuth client secret should never be distributed through client-side Vite variables. Values prefixed with `VITE_` are exposed to the client bundle.

Check whether a real confidential secret was ever compiled into a deployed artifact through an authorized configuration/artifact audit; do not print secrets. The unexpected callback path does not prevent Vite from bundling configured values. If exposure is confirmed, remove the browser secret flow and rotate the credential through the normal approved release process. The API implementation already keeps its own `REDDIT_CLIENT_SECRET` server-side; moving that secret is not future work. Any frontend migration to it still needs valid Reddit client/redirect authorization. If the browser intentionally uses a public OAuth client, verify that flow against applicable requirements.

This correction should not wait for the Devvit migration.

### 13.2 Security checklist

- No OAuth client secrets in browser bundles.
- Verification challenges are cryptographically random.
- Challenges are single-use and expire.
- Server-side authorization is enforced for account changes.
- Reddit identities are not exposed to the external service without approval.
- Modmail message contents remain within their approved processing boundary.
- Raw message contents are excluded from ordinary application logs.
- External integration endpoints are authenticated.
- Events and writes are idempotent.
- Data deletion and unlinking are implemented.
- Reviewer-only operations verify moderator permissions.
- Historical imports cannot overwrite existing achievements without appropriate authorization.
- All external integration capabilities have Reddit's required approvals.

## 14. Testing strategy

Testing should be performed at three levels.

### 14.1 Unit tests

Use Vitest for the pure matching, normalization, and resolution modules.

Suggested test suites:

```
matchHistoricalAward.test.js
matchStructuredAward.test.js
normalizeModmail.test.js
resolveAward.test.js
awardRules.test.js
verificationChallenge.test.js
```

Prioritize authorized sanitized historical fixtures, Dan-level parsing, conflicting messages, and negative examples; use synthetic equivalents when real fixtures are unavailable.

### 14.2 Integration tests

Use mocked or recorded, sanitized Reddit API responses to test:

- Pagination across multiple pages.
- Missing participant metadata.
- Archived conversation retrieval.
- Duplicate trigger delivery.
- Concurrent processing.
- Transient Reddit API errors.
- Redis write failures.
- Resume after checkpoint.
- External delivery retries.
- Account-link verification and replay prevention.
- Lost handshake acknowledgements, partial commitment, competing claims, unlink during retries, and fresh re-link attempts.
- Unordered approval/correction/revocation events and moderator replies versus internal notes.
- Nonconforming replies before and after template adoption, with review-queue expiry.
- Catalog mapping, missing shareable evidence URLs, scorecard/activity-cache refresh, and pending imports that write only after acceptance.
- Deletion across participant/evidence indexes, diagnostics, retries, and approved external copies; storage/transaction bounds.

Use a separate test subreddit for explicitly authorized live integration tests; default CI uses synthetic data and mocked services.

### 14.3 End-to-end acceptance tests

| Test                                         | Expected outcome                                      |
| -------------------------------------------- | ----------------------------------------------------- |
| Moderator sends standardized Yellow approval | Exactly one Yellow award result                       |
| Same event delivered twice                   | No duplicate                                          |
| Moderator sends rejection                    | No approval                                           |
| Old Blue approval in archived conversation   | Historical match found                                |
| Conversation contains several belt names     | Ambiguous result or validated unambiguous match       |
| Historical scan interrupted                  | Resume without losing state                           |
| User completes valid challenge               | Account becomes verified                              |
| Incorrect challenge sent                     | No linkage                                            |
| Expired challenge sent                       | No linkage                                            |
| Another account reuses a consumed challenge or claims an active link | Rejected |
| External API unavailable                     | Authorized result retained for retry                  |
| User unlinks account                         | Link invalidated and data deleted according to policy |
| New matcher version differs from old         | Differences captured before records change            |

### 14.4 Accuracy benchmarks

Suggested initial release criteria, subject to adjustment based on the historical corpus:

| Measure                          | Target                                      |
| -------------------------------- | ------------------------------------------- |
| Structured approval precision    | 100% in controlled test fixtures            |
| Structured approval recall       | 100% for documented formats                 |
| Historical false-positive rate   | Zero observed in curated validation sample  |
| Duplicate award creation         | Zero in idempotency tests                   |
| Historical scan recovery         | Successful across tested interruptions      |
| Unauthorized data transfer       | Zero                                        |
| Known unresolved ambiguous cases | Flagged for review, never silently imported |
| Known historical award recovery | Report numerator/denominator and oldest enumerable period; meet the Phase 0 threshold or approved manual fallback before cutover |

A zero-observed-false-positive result in a limited sample is not a guarantee of zero production errors. The production workflow should retain manual correction capability.

## 15. Risk register

| Risk                                                     | Impact   | Mitigation                                                         |
| -------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| Reddit does not approve external account linking         | Critical | Seek approval during Phase 0; preserve Reddit-native functionality |
| SOC 2 / penetration-testing requirements are impractical | Critical | Request written exception or modify integration scope              |
| Historical modmail archive is incomplete                 | High     | Validate coverage; preserve legacy imports                         |
| Pagination cannot reach oldest records                   | High     | Test known 2019 records early                                      |
| Historical regex produces false approvals                | High     | Regression corpus, confidence classification, manual review        |
| Moderator replies contain quoted approvals               | High     | Validate message context and author role                           |
| Live trigger missed or duplicated                        | Medium   | Idempotency and reconciliation                                     |
| Redis data exceeds limits or retention policy            | Medium   | Minimal indexing, expiration, bounded storage                      |
| Reddit API/SDK changes                                   | Medium   | Adapter layer and integration tests                                |
| External backend unavailable                             | Medium   | Retryable result queue and reconciliation                          |
| Account verification replay or hijacking                 | High     | One-time challenges and secure linkage protocol                    |
| Existing imported awards conflict with new records       | Medium   | Preview and conflict-resolution rules                              |

The policy and historical-access risks should be treated as go/no-go decisions, rather than problems deferred until the final deployment phase.

## 16. Recommended work breakdown

The Reddit-native tool is the committed product; Phases 5–6 and importer retirement remain conditional. Technical work may overlap after the proof of concept, but persistent scanning, external integration, and live publication retain their separate approval gates. Phase 7 operational controls also apply to a Reddit-only release and do not depend on completing external integration.

| Phase                        | Priority | Dependencies               | Main output                   |
| ---------------------------- | -------- | -------------------------- | ----------------------------- |
| 0. Feasibility and approvals | P0       | None                       | Validated architecture        |
| 1. Project foundation        | P0       | SDK selection              | Testable project              |
| 2. Matching engine           | P0       | Existing code and fixtures | Reusable classifiers          |
| 3. Historical scanner        | P1       | Phases 0–2; scan/privacy approval | Bounded sample, conditional index |
| 4. Live processing           | P1       | Phases 0–2                 | Incoming approval detection   |
| 5. Account linking           | P1       | Reddit policy approval     | Verified account associations |
| 6. Backend integration       | P1       | Phases 3–5 and approval    | Award import workflow         |
| 7. Production operations     | P1       | Phases 3–4; 5–6 if approved | Reddit-native or integrated readiness |
| 8. Legacy migration          | P2       | Validated replacement      | OAuth importer retirement     |

### Recommended milestones

Milestone A — Technical feasibility

In an authorized bounded sample, retrieve and enumerate known old/current conversations, compare legacy award evidence and dates, measure coverage and storage, and classify moderator replies with the existing historical matcher.

Phases 0–2

Milestone B — Reddit-side MVP

Deliver moderator-approved live processing and review inside Devvit with no external data transfer. Expand the bounded historical sample to a persistent index only after separate privacy, retention, capacity, and coverage approval.

Phases 3–4

Milestone C — Approved LPU integration

Only after written approval of the exact linking protocol, external-service compliance or exceptions, channel, and payload, establish verified linking and permitted result transfer. This milestone may be declined without blocking the Reddit-native tool.

Phases 5–6

Milestone D — Production replacement

Complete validation, rollout, and migration away from the old OAuth-based historical importer.

Phases 7–8

## 17. Decisions to resolve before implementation

Several product and architecture choices are not determined by the existing code and should be explicitly decided.

| Decision                                                   | Recommended default                                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Is historical scanning global or user-initiated?           | Begin with a bounded, time-limited approved sample; global indexing needs separate review |
| Should historical awards be imported automatically?        | Recommend no; add pending candidates and explicit acceptance because current ImportPreview is post-write |
| Should new structured approvals be added automatically?    | Initially record as verified candidates                                                             |
| Should current flair limit historical awards?              | Preserve existing behavior for comparison, then reconsider                                          |
| Should ambiguous historical matches be imported?           | No, require review                                                                                  |
| Can a user link multiple Reddit accounts?                  | Start with one active account                                                                       |
| Can one Reddit account link to multiple Firebase accounts? | No                                                                                                  |
| Should modmail contents be stored?                         | No, except approved short-lived diagnostic processing                                               |
| Should historical scanning use LLM-based classification?   | No, deterministic parsing first                                                                     |
| Should Devvit modify Reddit flair?                         | Not in the initial release                                                                          |
| Should Devvit modify Discord roles?                        | Not in the initial release                                                                          |
| What constitutes authoritative proof of approval?          | Explicit moderator approval in qualifying modmail                                                   |
| How are corrections or revocations handled?                | Separate, auditable state transitions                                                               |
| Is LPU linkage approved as a second product? | Written Reddit go/no-go for protocol, fields, channel, Firebase sign-in, and compliance/exception before Phases 5–6 |
| What coverage allows importer retirement? | Set a numeric threshold from known-case comparisons and approve a manual-evidence fallback before promising replacement |
| Which moderator formats are authoritative? | Agree approval, denial, correction, revocation templates, adoption date, and a nonconforming-message review queue |
| What survives a full-community scan? | Approve retained fields, participant indexes, expiry, deletion across all copies, and storage budget before expanding the sample |
| How is missing external evidence represented? | Approve awardUrl/display semantics and catalog mapping without exporting unapproved evidence IDs |

A specific product decision is needed for users whose current flair has changed or whose historical approvals have no surviving modmail evidence. Those cases should not silently erase previous achievements.

## 18. Documentation and external references

The following official documentation should serve as the technical baseline. Recheck versions and policy requirements at implementation time.

| Resource                                                                                                                                 | Purpose                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Devvit Web configuration](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration) | Entry points, CommonJS bundle, additional source roots |
| [Devvit CLI guide](https://developers.reddit.com/docs/guides/tools/devvit_cli) | Project-local CLI and app working directory |
| [Devvit Web Overview](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview?utm_source=chatgpt.com)             | App architecture and deployment model               |
| [Reddit API Overview](https://developers.reddit.com/docs/capabilities/server/reddit-api?utm_source=chatgpt.com)                          | Reddit access and permissions                       |
| [ModMailService](https://developers.reddit.com/docs/api/public-api/classes/ModMailService?utm_source=chatgpt.com)                        | Conversation APIs and migration reference           |
| [Trigger Event Catalog](https://developers.reddit.com/docs/capabilities/server/trigger-events?utm_source=chatgpt.com)                    | `onModMail` event contract                          |
| [GetConversationsRequest](https://developers.reddit.com/docs/api/redditapi/models/type-aliases/GetConversationsRequest) | Pagination and filtering options                    |
| [Devvit Redis](https://developers.reddit.com/docs/capabilities/server/redis?utm_source=chatgpt.com)                                      | Persistence and checkpoints                         |
| [Devvit Scheduler](https://developers.reddit.com/docs/capabilities/server/scheduler?utm_source=chatgpt.com)                              | Background scanning                                 |
| [HTTP Fetch](https://developers.reddit.com/docs/capabilities/server/http-fetch-policy)                                          | Outbound connectivity and domain approval           |
| [External Endpoints](https://developers.reddit.com/docs/capabilities/server/external-endpoints?utm_source=chatgpt.com)                   | Inbound backend communication                       |
| [Devvit Rules](https://developers.reddit.com/docs/devvit_rules?utm_source=chatgpt.com)                                                   | Privacy, account linking, data retention and review |

Existing project references:

- `AuthRedditRoute.jsx` — Historical message matching, OAuth, user-flair validation, import and bookmarks.
- `processBeltMessage.js` — Discord-based request lifecycle, approval handling, flair synchronization and request status tracking.
- Moderator UI screenshot — Reported visibility of 2019 conversations; not included in the repository review and not proof of API enumeration.
- [Plan review](devvit-belt-request-plan-review.md) — Policy, privacy, migration, schema, and build findings incorporated in this revision.
- [API migration report](reddit-api-auth-developer-report.md#checkpoint) — Server Phase 1 complete; frontend Phase 2 pending.

## 19. Final recommendation

Prepare Milestone A in the existing monorepo, with the future Devvit project at `apps/devvit/`. Run installations or live modmail experiments only after the required explicit authorization. Commit to the Reddit-native moderator tool; treat external LPU integration as a separate product requiring written approval.

The highest-value first technical experiment is quite small: create a Devvit app that retrieves a known archived belt-request conversation, normalizes its messages, and runs the existing historical award matcher against moderator replies.

If that works, the main remaining engineering work is conventional: event handling, batch processing, deterministic classification, state management, and integration testing.

The account-linking and external transfer requirements remain the biggest potential blockers. They should be investigated in parallel with the technical proof of concept, not after the rest of the software has been built.

With that sequencing, the project can produce useful Reddit-native functionality even if the external Firebase integration ultimately requires a different approach.