# Discord belt request posting — developer implementation report

> Companion to [the implementation plan](./discord-belt-request-posting-implementation-plan.md). The [project definition](./discord-belt-request-posting-plan.md) holds the original feasibility and integration analysis.

- Last updated: 2026-10-21
- Implementation report: `internal-docs/discord-belt-request-posting-developer-report.md`
- Plan: `internal-docs/discord-belt-request-posting-implementation-plan.md`

## Checkpoint

- **Phase / task:** Phase 5 is complete after owner-confirmed one-click submission; Phase 6 release preparation follows.
- **State:** After an initial `503 belt_request_posting_disabled`, the owner confirmed the earlier two-click development-browser OAuth and post flow. The supplied screenshot shows LockyJr thanking `@mgsecure` for a White Belt request and saying it replaced the previous White Belt request. The owner subsequently confirmed that the revised one-click path submits after OAuth.
- **Resume with:** Review production webhook and deployed bot configuration, outstanding browser copy checks, and release order. Production deployment and sends remain approval-gated.
- **Watch out for:** The posting grant is single-use and expires after 15 minutes. A send timeout is uncertain, so ask the member to check the channel before retrying with fresh OAuth. Do not trust `lockcollections.discordId`, print secrets, or send to a live webhook without approval. Server configuration and secret rotation must precede the frontend release.

## Cross-phase reference

- **Repositories affected:** `lpu-belt-explorer` (frontend and documents) and `../explore-lpubelts-com-node` (OAuth and posting API, tests, and API documentation). Bot-owner work in `../lpu-discord-utils-bot` is in progress.
- **Approval-gated actions:** Production deployments, production webhook sends, and live-data scripts. Secret rotation and server configuration need owner coordination. No external action was performed for this report.
- **Environment notes:** Frontend uses npm/Node 24; the server uses Yarn/Node 24.21.0. OAuth and posting tests mock Discord and Firebase. No live credentials were used.
- **Baseline metrics:** No test or build baseline was measured during the initial documentation-only handoff. Focused Phase 1 results are recorded below.

## Phase 1: Verified Discord identity

### Changes and decisions

- Added Firebase-authenticated `POST /api/v1/discord/oauth/start` and `/oauth/exchange` in the sibling API server. Start stores a hashed, 10-minute OAuth state tied to Firebase UID, purpose, exact allowlisted redirect URI, and a hash of the browser nonce. Exchange atomically consumes that state, exchanges the code server-side, and obtains the Discord user from `/users/@me`.
- A `beltRequest` exchange creates a hashed, 15-minute, one-use posting grant containing the verified identity and Firebase UID. Phase 3 will consume it atomically. An `import` exchange creates no grant. Neither flow returns a Discord access token. These collections are server-only under the current default-deny Firestore rules; `expiresAt` needs TTL cleanup configured for release.
- Frontend import/profile buttons now use one OAuth starter. The callback waits for Firebase authentication, removes OAuth query parameters, and uses the authenticated API. Award import still writes the legacy profile Discord fields, including when no awards match. A belt-request callback stores only the posting grant in session storage and returns to the request route. The existing profile "Remove Discord account" behavior applies only to the award-import association.
- Removed the `VITE_DISCORD_CLIENT_SECRET` mapping from the frontend build workflow. Server configuration uses `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and exact comma-separated `DISCORD_REDIRECT_URIS`. Added OpenAPI paths, readable guidance, and synthetic response samples.
- The user's per-request sign-in preference removes persistent posting-link storage, linked-status and unlink APIs, token refresh, and account-link synchronization. The user also confirmed that no server-generated preview is needed. Phase 3 therefore needs one final-post formatter and one send endpoint, with the existing form serving as the member's review. Do not add submission reservations or automatic retries for this low-risk feature.

### Verification

| Command / check | Result |
| --- | --- |
| `yarn vitest run src/api/services/discordIdentityService.test.js src/api/testing/discordIdentityRoutes.test.js` (sibling API server) | Passed: 2 files, 9 tests. Supertest needed loopback access; the first sandboxed route-test run failed to bind an ephemeral port, then the same command passed with loopback permission. |
| `npx vitest run tests/vitest/AuthCallbackRoutes.test.jsx tests/vitest/DiscordAPICommand.test.jsx` (frontend) | Passed: 2 files, 9 tests. |
| `yarn eslint src/api/index.js src/api/routes/discordIdentity.js src/api/services/discordIdentityService.js src/api/services/discordIdentityService.test.js src/api/testing/discordIdentityRoutes.test.js` | Passed with no output. |
| `npx eslint src/app/APIContext.jsx src/auth/AuthDiscordRoute.jsx src/auth/discordAuth.js src/profile/EditProfilePage.jsx src/scorecard/ImportButton.jsx` | Passed with no output. Tests are ignored by the repository's ESLint configuration and were run directly in Vitest. |
| `npm run build:test` | Passed; Vite reported existing large-chunk advisory warnings. |
| Ruby YAML parse of `src/api/documentation/openapi.yaml`; `git diff --check` in both repositories | Passed. |
| Full frontend/server suites, browser OAuth, live Discord, webhook, and deployment checks | Not run. Full suites are reserved for the final gate as requested. Live checks need configuration and release approval. |

### Blockers and open questions

- **Phase 2:** The owner confirmed the test webhook ID, guild, and `#announcement-reactions` target and reported a successful simulated post plus focused trust, member, rejection, and duplicate checks. The local bot now fetches the guild member by `userId` and the shared same-belt lookup compares that ID. No checked-in bot test file or test command was available for independent rerun. Deployed verification remains a Phase 6 gate.
- **Phase 4 result:** The owner reports that `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URIS` are deployed to the development API; their values were not read. After an initial redirect rejection, a browser authorization succeeded. The screenshot shows the award preview, and the owner confirms linked-username persistence and expected awards on View Scorecard. The local frontend requests the fragment-free root callback `<site origin>/` and routes its pending OAuth return to `/#/auth/discord`; exact deployed configuration was not independently inspected.
- **Later phases:** Phase 5's one-click development-browser submission is owner-confirmed; the earlier bot result was also confirmed. Phase 6 needs production secret rotation and Firestore TTL on both temporary collections.

### Callback URI correction

- The previous frontend requested `<site origin>/#/auth/discord` as the OAuth redirect URI. OAuth redirect endpoints cannot include a URL fragment. The first local correction used `<site origin>/?discord_oauth=1`, but the owner observed Discord's `Invalid OAuth2 redirect_uri` for the localhost variant even though the same URI was visible in a Redirects screenshot. Save status and application identity were not independently verified. The frontend now requests `<site origin>/`, and a pending OAuth session routes a matching code or error callback to the existing hash route before React mounts. OAuth query parameters are cleared after processing.
- The root-URI correction passed `npx vitest run tests/vitest/AuthCallbackRoutes.test.jsx tests/vitest/DiscordAPICommand.test.jsx` (2 files, 11 tests), `npx eslint src/auth/discordAuth.js src/index.jsx`, and `npm run build:test` with the existing large-chunk advisory. The repository's ESLint configuration ignores the two test files. No live OAuth call or deployment was run by this agent.

## Phase 4: Existing Discord linking and awards validation

- **Status:** Complete, 2026-10-20. After an initial `Invalid OAuth2 redirect_uri` response for the query callback, the owner completed the Edit Profile linking flow through the root callback. Discord Import Results displayed a recognized username and ranking rows.
- **Evidence and limit:** The owner confirms that Edit Profile now shows the linked Discord username and View Scorecard shows the expected awards. This completes the requested existing-flow validation. A separate browser launch from the scorecard's **Import Belts** button and cancellation/retry were not observed; the root callback and deployed allowlist values were not independently inspected. No environment file was opened.
- **Next work:** The Phase 5 development-browser send has now passed by owner confirmation. Production posting remains gated by Phase 6 release checks.

## Phase 5: Form and callback experience

- **Local behavior:** The form's Post to Discord button saves a same-user session draft and starts a fresh `beltRequest` OAuth flow. A successful callback stores the grant for that Firebase user and returns to `/beltRequests` with an automatic-send signal. The form restores and posts that saved draft once with the one-use grant. Cancellation or exchange failure returns with an error and the draft without posting. It blocks repeat clicks during OAuth startup and posting.
- **Automatic-send revision (2026-10-21):** The single-click callback path is covered by focused tests for success, cancellation, and a missing same-user draft. The owner confirmed that the one-click submission now completes in the development browser.
- **Revision checks:** `npx vitest run tests/vitest/BeltRequestDiscordPost.test.jsx tests/vitest/AuthCallbackRoutes.test.jsx` passed (2 files, 25 tests); `npm run test:run` passed (51 files, 263 tests); targeted ESLint and `npm run build:test` passed. The test build emitted its existing large-chunk advisory. Scoped `git diff --check` passed. No live OAuth or webhook send was run for this revision.
- **Member feedback:** A confirmed webhook delivery shows its message link and a `#belt-requests` link. Grant failures call for fresh authorization; uncertain delivery calls for checking Discord before retrying. Copy Request still uses its original formatter and its dialog now links to `#belt-requests`. The form draft remains on recoverable errors.
- **Verification:** Focused Vitest passed (4 files, 27 tests) after callback error handling. `npm run ci-pr` passed after the final code edits (ESLint, 51 Vitest files / 259 tests, and the test build). The build retained its large-chunk advisory. No relevant Playwright test exists for this authenticated cross-service route; no live OAuth, webhook send, or bot result was run by this agent.
- **Browser acceptance:** The owner confirms the signed-in development-browser journey reached LockyJr. The supplied bot screenshot shows a White Belt request and same-belt replacement. This establishes bot processing separately from webhook delivery. The exact webhook message link, deployed environment values, and direct browser behavior of both Copy Request platform choices were not inspected by this agent; the copy checks remain Phase 6 follow-up.
- **Observed browser blocker (2026-10-20):** The owner authorized Discord and clicked the restored form's Post to Discord button. The screenshot shows a snackbar with `Discord posting is unavailable`. The server returns `503 belt_request_posting_disabled` before consuming the grant or contacting Discord if the target is unset/invalid, the selected webhook URL is absent/malformed, or its ID differs from the expected test ID. OAuth configuration is separate and has already passed. The exact development environment value was not inspected; no secret was read or changed.
- **503 feedback check:** The form now explains that the API test target is disabled and that the draft is saved. Focused verification passed: `npx vitest run tests/vitest/BeltRequestDiscordPost.test.jsx` (1 file, 11 tests), targeted ESLint, and scoped `git diff --check`. The earlier `npm run ci-pr` result predates this small error-message change.
- **Resolved browser blocker:** The owner's subsequent end-to-end confirmation and LockyJr screenshot show that the test-target 503 no longer blocks posting. The exact configuration change was not inspected; no secret value was read or recorded. The earlier two-click flow was accepted on 2026-10-20, and the owner confirmed the one-click submission on 2026-10-21.

## Phase 2: LockyJr webhook contract

### Confirmed contract and source evidence

- The embed title is `New Belt Request`. The bot's current fields are `userId` (the Discord ID from the server-verified OAuth identity), `userName` (display only), `requestedBelt`, `messageContent`, and optional `redditUsername`. These names supersede the earlier proposed `requesterId`, `username`, `belt`, and `message` fields.
- The local `messageCreate.js` checks the webhook ID, LPU guild ID, and configured belt-request/test channel IDs before processing an embed. It calls `isValidEvent(message, true)` first and logs the full embed. This is uncommitted local bot code, not evidence of a deployed rule.
- The local `processBotRequest.js` reads the agreed fields, fetches the guild member by exact `userId`, and rejects a failed lookup or username mismatch before calling the shared `handleBeltRequest`. On rejection it logs the error and saves an error action; the posting API does not receive that outcome. The shared existing-request lookup compares `userId`, while its replacement audit name still comes from the webhook author.
- The owner confirmed that the test webhook targets guild `140129091796992000`, channel `#announcement-reactions` (`1360395141822812311`), and that a simulated payload resulted in a request post. The bot's local config names `282173282546089985` as `#belt-requests`, where `announce()` posts the response. The owner also confirms focused checks of strict webhook trust, ID-based member lookup, rejection, and same-belt replacement. Phase 5 later supplied a development-browser LockyJr result; the exact deployed webhook URL and production bot version remain uninspected.

### Release follow-up

- Confirm the production webhook ID/channel and the bot version deployed to each target. Bot rejection is visible in its error log and error action, separately from successful Discord webhook delivery. The replacement audit name currently comes from the webhook author; review that attribution before release.
- The test-target posting API was enabled for the owner's Phase 5 browser send. Production posting remains subject to separate release approval; no live webhook call was run by this agent.

### Verification

| Check | Result |
| --- | --- |
| Local bot source inspection of `messageCreate.js`, `isValidEvent.js`, `processBotRequest.js`, and `processBeltMessage.js` | Confirmed the current trust check, exact `userId` guild-member lookup, rejection log/error action, and `userId` same-belt lookup. |
| Owner-reported simulated payload | One request posted as expected. The payload used `userId: '671828049540677682'`, `userName: 'mgsecure'`, `requestedBelt: 'White Belt'`, and `messageContent` containing a test request. The simulation command and assertions were not supplied. |
| Owner-reported focused bot checks | Webhook ID, guild/channel, ID-based member lookup, rejection, and same-belt replacement confirmed. No checked-in bot test file or command was available for independent rerun. |
| `git diff --check` (frontend/docs repository) | Passed. |
| Live webhook delivery and deployed bot acceptance | Not run during Phase 2 source review; the owner later confirmed a Phase 5 development-browser bot post. |

## Phase 3: Trusted posting API

### Changes and decisions

- Added Firebase-authenticated `POST /api/v1/belt-requests/discord` in the sibling API server. It accepts a one-use posting grant and structured belt, entry, quest, evidence, and optional note/Reddit fields. Unknown request fields, including a client-supplied `userId`, are rejected.
- The server validates HTTP(S) evidence links and input lengths, constructs the `New Belt Request` embed using `userId` and `userName` from the verified posting grant, and rejects a `messageContent` over Discord's 1,024-character embed-field limit. Mentions are suppressed in the webhook request and escaped in free text that LockyJr may repeat.
- The endpoint defaults to disabled. An explicit `BELT_REQUEST_WEBHOOK_TARGET` selects `test` or `production`; the corresponding server-only webhook URL and expected ID/channel must be configured. A configured send uses `wait=true` once and returns the webhook message IDs and link. Rate limits return `Retry-After`; network timeouts and invalid responses report uncertain delivery without an automatic retry. The one-use grant is consumed before sending.
- The confirmed test webhook targets `#announcement-reactions`, while LockyJr announces a processed request in `#belt-requests`. The returned test link points to the webhook message and proves delivery only. The server does not claim bot acceptance.
- Updated OpenAPI, readable API guidance, and a synthetic response sample. No webhook URL or Discord credential was added to source or reports.

### Verification

| Command / check | Result |
| --- | --- |
| `yarn vitest run src/api/services/discordBeltRequestService.test.js src/api/testing/discordBeltRequestRoutes.test.js` | Passed: 2 files, 10 tests. The first sandboxed run could not bind Supertest's ephemeral loopback port; the same command passed with loopback permission. |
| `yarn eslint src/api/index.js src/api/routes/discordBeltRequests.js src/api/services/discordBeltRequestService.js src/api/services/discordBeltRequestService.test.js src/api/testing/discordBeltRequestRoutes.test.js` | Passed with no output. |
| `node --check src/api/routes/discordBeltRequests.js` and `node --check src/api/services/discordBeltRequestService.js` | Passed with no output. |
| `yarn test --run` | Passed: 87 files, 420 tests. Existing tests emitted expected mocked error logs. |
| Ruby YAML parse of `src/api/documentation/openapi.yaml`; `git diff --check` (server) | Passed. |
| Live Discord send, deployed bot processing, and server deployment | Not run during Phase 3 implementation. The owner later confirmed a Phase 5 development-browser bot post; production deployment remains pending. |

## Phase 0: Planning and source review

### Changes

#### Planning documents

- Created the template-based [implementation plan](./discord-belt-request-posting-implementation-plan.md) with observable exits and explicit release gates. It now has six phases after adding the existing-flow validation gate.
- Created this initial report to preserve source findings and a resumable Phase 1 starting point. Updated the existing [project definition](./discord-belt-request-posting-plan.md) to keep validation and error handling proportionate to the low-risk posting flow.

### Decisions

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| Start with verified identity, then finalize bot acceptance before enabling posts. | OAuth hardening is independently implementable; the current bot embed path does not accept the proposed webhook author or bind a requester by Discord ID. | A sender built first would need rework when the bot contract is settled. |
| Keep posting authorization separate from `lockcollections` profile fields. | Current Firestore rules allow the owner to edit those fields. Per-request OAuth now issues a one-use, server-only grant instead of a persistent link. | Reusing the profile fields as proof of identity would permit forgery. |
| Keep the manual copy formatter as a separate flow. | It emits `@LockyJr request …` text, while the planned bot path expects a `New Belt Request` embed. | Sending the clipboard text to the webhook would not meet the bot's embed contract. |
| Treat webhook delivery and LockyJr acceptance as separate results. | Discord's webhook response confirms message creation; the bot may reject or miss the message. | Reporting a processed belt request solely from a webhook success would overstate the result. |
| Keep posting recovery simple. | These requests contain information the member already intends to post publicly; disabling repeat clicks and explaining timeouts cover the likely failure cases. | Persistent submission reservations and reconciliation would add storage and operational work for a low-risk convenience feature. |

### Verification

| Command / check | Result |
| --- | --- |
| `git status --short --branch` | Passed read-only baseline inspection: the project definition was modified, the developer-report template was staged, and the implementation-plan template was untracked before this work. |
| Source inspection of frontend OAuth, form, Firestore rules, server auth/API, sender, and bot embed handler | Completed; findings below match local worktrees on 2026-10-20. No runtime behavior was exercised. |
| Discord developer documentation: OAuth2, webhook, message/embed, and rate-limit references | Reviewed on 2026-10-20; the implementation must use the current API contract when coded. |
| `git diff --check -- internal-docs/discord-belt-request-posting-plan.md` | Passed; no whitespace errors in the updated project definition. |
| `git diff --cached --check -- internal-docs/discord-belt-request-posting-implementation-plan.md internal-docs/discord-belt-request-posting-developer-report.md` | Passed; no whitespace errors in the new documents. |
| Relative Markdown link check for the three Discord planning documents | Passed; zero missing local targets. |
| Template placeholder search in the two new documents | Passed; no unresolved placeholders. |
| Tests, lint, builds, and live webhook checks | Not run; this task only creates planning documents. |

### Environment and tooling notes

- `src/auth/AuthDiscordRoute.jsx` exchanges an OAuth code with `VITE_DISCORD_CLIENT_SECRET` and calls Discord `/users/@me` from the browser. `ImportButton.jsx` and `EditProfilePage.jsx` omit OAuth `state`. The callback only saves legacy profile Discord fields if matching awards exist.
- `firestore.rules` permits owner writes to `lockcollections` except `admin`. `src/app/DBContext.jsx` stores and removes Discord profile fields there. Those fields remain award-import data only; posting identity comes from a server-only one-use grant.
- The server already provides `/api/v1` routing, `requireAuth`, Firebase Admin access, route tests, and service tests. Its `sendToDiscord.js` escapes HTML and swallows send failures, so a posting sender must report confirmed message IDs and errors.
- At initial source review, `messageCreate.js` dispatched `New Belt Request` embeds authored by the bot itself. The owner subsequently changed the local check to webhook ID `1562162476009660489` and changed the embed field contract as recorded in Phase 2. Check the deployed bot version during Phase 6 acceptance.
- At initial source review, the test webhook's channel and whether LockyJr watched it were unverified. The owner later confirmed the channel and reported a successful simulation, as recorded in Phase 2. Keep the webhook URL out of source, tests, reports, and output.

### Files touched

| File | Change |
| --- | --- |
| `internal-docs/discord-belt-request-posting-implementation-plan.md` | Added — phased implementation and progress tracker. |
| `internal-docs/discord-belt-request-posting-developer-report.md` | Added — initial findings, decisions, and checkpoint. |
| `internal-docs/discord-belt-request-posting-plan.md` | Modified — retained the user's existing contract corrections and simplified posting/recovery requirements. |

### Manual review needed

- **Phase 4 development check:** The owner reports development API OAuth settings are deployed. Verify the running configuration through the browser flow; do not expose their values. Rotate the previously browser-exposed secret before production release.
- **Before enabling a webhook target:** Confirm that the deployed bot includes the owner-tested `userId` member lookup, strict webhook trust checks, and same-belt replacement behavior. The focused checks are owner-reported; no bot test artifacts were supplied for independent rerun.
- **Before Phase 6 live work:** Verify the configured test webhook targets the owner-confirmed channel during an approved integration send. Coordinate secret rotation and obtain explicit approval for production deployment and any production smoke test.
