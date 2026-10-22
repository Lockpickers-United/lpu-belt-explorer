# Discord belt request posting — implementation plan and progress

- Status: Complete; production monitoring
- Last updated: 2026-10-21
- Project definition: [Posting Belt Requests to Discord](./discord-belt-request-posting-plan.md)
- Developer report: [Discord belt request posting developer report](./discord-belt-request-posting-developer-report.md)

## Project snapshot

- **Outcome:** A signed-in member can authenticate with Discord for each belt request and post to #belt-requests, with the existing form and copy flow available.
- **Current phase:** Phase 6 is complete by owner confirmation. The API, bot, and frontend are in production and being monitored.
- **Next action:** Continue production monitoring and track the post-launch bot-outcome confirmation work below.
- **Overall blocker:** None reported. Production configuration, check results, and deployment details were not independently inspected for this documentation update.

| Phase | Status | Completed |
| --- | --- | --- |
| Phase 1: Verified Discord identity | Complete | 2026-10-20 |
| Phase 2: LockyJr webhook contract | Complete | 2026-10-20 |
| Phase 3: Trusted posting API | Complete | 2026-10-20 |
| Phase 4: Validate existing Discord linking and awards | Complete | 2026-10-20 |
| Phase 5: Form and callback experience | Complete | 2026-10-21 |
| Phase 6: Integration and release | Complete | 2026-10-21 |

Use **Not started**, **In progress**, **Blocked**, or **Complete** consistently. Enter a completion date only after the phase exit criteria are met.

## Phase 1: Verified Discord identity

- **Status:** Complete
- **Completed:** 2026-10-20 (local implementation and mocked checks; development OAuth validation is the Phase 4 gate)
- **Start when:** Work begins; no decision or external credential is needed for local implementation and mocked tests.

### Summary

Move Discord's OAuth code exchange and identity lookup to the authenticated server. Bind the callback to the initiating Firebase user and browser, issue a one-use, 15-minute posting grant for each belt request, and preserve award import. No persistent posting link is needed because the member may authenticate for each request. This phase does not post a request or contact a live webhook.

### Findings

- `AuthDiscordRoute.jsx` currently uses `VITE_DISCORD_CLIENT_SECRET` in the browser and always enters award import. `ImportButton.jsx` and `EditProfilePage.jsx` start Discord authorization without `state`.
- Firestore rules allow owners to write their `lockcollections` document, including `discordId` and `discordUsername`; those values cannot authorize posting.
- The server already has Firebase bearer-token middleware and a Firebase Admin service. Reuse the `/api/v1` route/service pattern for server-only OAuth state and posting grants.
- Current import reports `none_found` without saving profile Discord fields when no award matches. The migrated import saves its legacy profile association even with zero awards; posting remains independent of that association.

### Tasks

- [x] Define the OAuth API contract with `purpose`, allowlisted `returnTo` and redirect URI, browser nonce binding, short expiry, atomic one-time state consumption, and private responses.
- [x] Add authenticated start and exchange operations. Exchange the code and call Discord `/users/@me` on the server; issue a one-use posting grant only for `beltRequest`, never a Discord token in the browser or response.
- [x] Share a frontend Discord auth starter across import and profile entry points. Make the callback wait for Firebase auth, exchange through the server, clear the callback query, and branch using the server-validated purpose.
- [x] Preserve award import and profile display behavior. Cover success with no matching awards. Legacy profile unlink still removes the profile association; no persistent posting identity exists to unlink.
- [x] Add mocked server and frontend tests for UID/nonce binding, expiry, replay, invalid callbacks, denied access, grant consumption, and import regression; update API documentation and configuration guidance.
- [x] Remove `VITE_DISCORD_CLIENT_SECRET` from frontend build configuration and prepare a coordinated server-side secret rotation for release. Do not execute the rotation as part of local implementation.

### Exit criteria

- [x] Neither the client bundle nor client-writable profile fields can establish a trusted posting identity; start/exchange enforce Firebase identity and one-time browser-bound state, and only the server can consume the posting grant.
- [x] Existing Discord award import still works for verified users, including users with no matching awards, and the callback directs each purpose correctly.
- [x] Focused server and frontend tests and relevant lint pass with mocked Discord and Firebase; the developer report records exact commands and results. The full suites remain a final gate as requested.

### Open issues for next phase

- LockyJr's local embed handler recognizes webhook ID `1562162476009660489` in guild `140129091796992000` and the configured test/belt-request channels. The owner reports that the test webhook targets `#announcement-reactions` and that focused trust and rejection checks passed. Phase 5 later confirmed development bot processing; production deployment remains a Phase 6 gate.
- The bot's embed field for the verified Discord requester ID is `userId` (the role previously assigned to proposed `requesterId`). The other fields are `userName`, `requestedBelt`, `messageContent`, and optional `redditUsername`. The local bot fetches the guild member by `userId` and the shared same-belt lookup uses that ID; the owner reports focused checks for both paths.

### Open issues for later phases

- The owner reports that the three required OAuth settings are deployed on the development API. Phase 4 must verify the live development OAuth flow using the exact root callback `<site origin>/` registered in Discord and allowlisted by the API. The frontend routes a matching pending OAuth callback to `/#/auth/discord` locally.
- Secret rotation, production server configuration, and Firestore TTL cleanup remain Phase 6 release actions. Phase 5 later supplied an owner-confirmed development test-target send and LockyJr result.

## Phase 2: LockyJr webhook contract

- **Status:** Complete
- **Completed:** 2026-10-20 (owner-confirmed local behavior; deployed acceptance remains a Phase 6 gate)
- **Start when:** The supplied test target and bot contract have been reviewed with the bot owner. The owner has confirmed the test channel and current embed field names.

### Summary

Finalize the cross-repository contract for the `New Belt Request` embed and make LockyJr accept only the dedicated webhook in the intended guild and channel. Record the contract before the site sends requests.

### Findings

- The local `lpu-discord-utils-bot` handler checks `message.webhookId` against `beltRequestConfig.webhookId`, `message.guildId` against the configured LPU guild, and `message.channelId` against its configured belt-request and test channels before processing the embed. It also calls `isValidEvent(message, true)` first and logs the full request embed. Recheck deployed behavior and focused rejection tests.
- The owner confirmed test webhook ID `1562162476009660489`, guild ID `140129091796992000`, and target channel `#announcement-reactions` (`1360395141822812311`). The full webhook URL is a secret and is intentionally absent from this plan. The bot's local `#belt-requests` channel is `282173282546089985`; its `announce()` function posts the resulting request there. The production webhook ID/channel and deployed bot version remain Phase 6 gates.
- The agreed embed fields are `userId` (Discord ID from verified OAuth), `userName` (display only), `requestedBelt`, `messageContent`, and optional `redditUsername`. The bot fetches the guild member by exact `userId` and rejects lookup failures or username mismatches. A rejection is logged and saved as an error action, but is not returned to the posting API.
- The shared same-belt lookup compares the stored request's `userId` with the embed's `userId`. Its replacement audit name still uses the webhook author's username. The owner reports focused trust, member, and duplicate checks; those test commands and artifacts were not supplied. Phase 5 later showed a development-browser bot post replacing a prior White Belt request.
- A webhook response confirms channel delivery, not that LockyJr processed or accepted the belt request.

### Tasks

- [x] Record the supplied test webhook, guild, and channel identifiers without storing the webhook URL in source or documentation.
- [x] Record the owner's confirmation that the test webhook targets guild `140129091796992000` and channel `1360395141822812311`. Confirm the production webhook ID/channel and deployed bot version in Phase 6; keep webhook URLs in secret storage only.
- [x] Agree on the bot's current embed field names: `userId`, `userName`, `requestedBelt`, `messageContent`, and optional `redditUsername`.
- [x] Validate `userId` with an exact guild-member lookup; reject invalid or unknown members. The local bot also rejects a username mismatch after lookup.
- [x] Verify the shared same-belt replacement behavior in a focused bot test and define how a bot rejection can be observed. The owner confirms the test; the local bot logs and stores an error action on rejection.
- [x] Have the bot owner test strict webhook ID, guild, and channel checks, ID-based member lookup, and duplicate handling. The owner confirms those checks; no checked-in bot test file or command was available for independent rerun.
- [x] Record the finalized local contract and owner-reported verification evidence in the developer report before enabling a live sender.

### Exit criteria

- [x] The local bot accepts the dedicated webhook only in the intended guild/channel and attributes a request to an explicit OAuth-verified Discord ID; an unknown member is rejected under its existing rules.
- [x] Field shape and same-belt behavior are documented. The owner confirms focused bot-side checks; their commands and artifacts were not supplied for independent rerun.

### Open issues for next phase

- None. LockyJr applies its existing requester rules after matching the verified Discord ID.

### Open issues for later phases

- Confirm the production webhook ID/channel and deployed LockyJr version. Phase 5 now includes an owner-confirmed development test-target send and bot acceptance.

## Phase 3: Trusted posting API

- **Status:** Complete
- **Completed:** 2026-10-20 (local implementation and mocked checks; webhook target remains disabled by default)
- **Start when:** Phase 1 posting grants and Phase 2's field and eligibility contract are available. Local validation work may begin earlier.

### Summary

Build one authenticated server post path from structured form data. Validate Discord's limits, format the final embed once, and show ordinary send errors clearly. The existing form supplies the member-facing review; no server-generated preview endpoint is needed.

### Findings

- `formatDiscordRequest` produces the manual `@LockyJr request` text, while the bot's new path expects an embed. The manual copy formatter remains a separate contract.
- Existing `sendToDiscord.js` HTML-escapes text and does not return a message ID or propagate send failures; it cannot directly satisfy the post endpoint.
- The confirmed test webhook targets `#announcement-reactions`, while LockyJr announces the processed request in `#belt-requests`. A `wait=true` response identifies the webhook message in the test channel, not LockyJr's announcement; the API and UI must label that link as delivery only.

### Tasks

- [x] Define the post request and response shapes. Validate required fields, evidence URLs, text lengths, and Discord embed limits.
- [x] Build one server formatter for the final post, using `userId`, `userName`, `requestedBelt`, `messageContent`, and optional `redditUsername` in the `New Belt Request` embed, explicit `allowed_mentions`, and Discord embed limits. Reject oversized requests without truncation.
- [x] Recompute the embed from the submitted fields when posting. Atomically consume the one-use posting grant bound to the Firebase UID; derive the Discord ID and display identity from it, never from form or profile values. Require fresh Discord OAuth if the grant is expired or consumed.
- [x] Keep test and production webhook configuration server-side and fail closed for a missing target. Send with `wait=true`, return the message/channel IDs on success, and relay safe Discord errors and rate-limit timing.
- [x] Add focused mocked API/service tests for authentication, identity attribution, input and embed limits, mentions, success response, and Discord errors. Document the API.

### Exit criteria

- [x] Successful replies identify the posted message without exposing a webhook URL or token; a failed or timed-out send is reported without an automatic retry.
- [x] API, service, and validation tests pass with external services mocked; relevant server lint and the full server test suite pass and are recorded in the developer report.

### Open issues for next phase

- Confirmed: the frontend prevents repeat clicks during a send and shows the webhook message link only after confirmed delivery.

### Open issues for later phases

- Confirmed: the owner's Phase 5 screenshot shows LockyJr processing and same-belt replacement. A successful webhook response by itself confirms delivery only; on-site confirmation of the resulting bot post is tracked under Post-launch.

## Phase 4: Validate existing Discord linking and awards

- **Status:** Complete
- **Completed:** 2026-10-20 (owner-confirmed development-browser linking and award retrieval)
- **Start when:** Development API OAuth settings are deployed and a development frontend can reach that API. The owner reports the settings are deployed and has completed a browser authorization with an award preview.

### Summary

Verify existing Edit Profile linking and award retrieval with the new server-side Discord authorization before further posting development. Use a development account with a known Discord award history; do not send a webhook or post a belt request in this phase.

### Findings

- Both entry points call the shared OAuth starter with purpose `import`. The callback exchanges the code through the API, saves the verified Discord ID and username to the profile, and queries `awards-discord` by that ID for the award preview.
- The earlier 503 message, `Discord linking is unavailable`, is emitted when required API OAuth configuration is absent. The owner reports that `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URIS` are configured and deployed in the development API environment. A subsequent browser attempt completed Discord authorization and reached the existing award preview.
- An initial browser attempt used `http://localhost:3000/?discord_oauth=1` and Discord displayed `Invalid OAuth2 redirect_uri`. The local frontend was changed to request the root callback `http://localhost:3000/` and recognize the return from its pending OAuth session. The owner then reported successful authentication; the exact saved Discord/API configuration was not inspected by this agent.
- The supplied screenshot shows the Discord Import Results page with a recognized username and ranking rows. The owner separately confirmed that Edit Profile shows the linked Discord username and View Scorecard shows the expected awards. This validates the original profile-linking journey and award retrieval; a separate launch from the scorecard's Import Belts button and cancellation/retry were not observed in the browser.

### Tasks

- [x] Complete one Discord authorization and display an award preview through the new flow. The owner reports success and supplied the Import Results screenshot; the route and API allowlist were not inspected directly.
- [x] Complete the Edit Profile Discord authorization and return to the award preview. The successful browser journey establishes that the requested callback was accepted; the exact saved Discord/API allowlist values were not inspected by this agent.
- [x] Confirm Edit Profile retains the linked Discord username after the OAuth return. The owner reports that it does.
- [x] Confirm the expected awards are visible on View Scorecard after the Discord Import Results preview. The owner reports that they are.
- [x] Record the browser outcome and local focused checks in the developer report without authorization codes, state, tokens, credentials, or private profile data.

### Exit criteria

- [x] The Edit Profile flow completes against the development API with verified Discord identity, persistent linked username, and expected award preview and scorecard results.
- [x] Owner-observed browser results and relevant local tests are recorded in the developer report. No webhook send or belt-request post was used to prove this phase.

### Open issues for next phase

- Connect the belt-request form to the posting API while preserving its draft through OAuth. A separate browser launch from the scorecard's Import Belts button and cancellation/retry remain useful follow-up coverage but are not blockers for the validated Edit Profile linking and award retrieval flow.

## Phase 5: Form and callback experience

- **Status:** Complete
- **Completed:** 2026-10-21 (owner-confirmed one-click submission; the earlier bot result was confirmed on 2026-10-20)
- **Start when:** Phase 4 validates the existing linking and award-import flow against the development API.

### Summary

Add a signed-in posting action for Discord requests while keeping Copy Request available. Restore and send the saved draft after successful OAuth, and make send errors clear.

### Findings

- The user's new Post to Discord button called the same copy handler. The local implementation connects it to OAuth and the posting API; the owner has now completed the development browser journey.
- The initial implementation required a second Post to Discord click after OAuth. The successful callback now returns with an automatic-send signal; the form posts the same-user saved draft once with the fresh grant. Canceled or failed authorization leaves the draft available without posting.
- On 2026-10-20 the owner completed OAuth, then received `Could not post to Discord: Discord posting is unavailable`. The API emits this 503 when `BELT_REQUEST_WEBHOOK_TARGET` is not `test` or `production`, or when the selected webhook URL is absent or fails its Discord URL/ID checks. The browser response does not identify which condition failed. That attempt did not deliver a webhook message.
- After the 503, the owner confirmed the end-to-end path. The supplied screenshot shows LockyJr thanking `@mgsecure` for a White Belt request and saying it replaces the previous White Belt request. This is evidence of bot processing and same-belt replacement, beyond the webhook delivery response. The webhook message link and exact deployed environment values were not inspected by this agent.
- The owner subsequently confirmed that a single Post to Discord click completes the submission after OAuth returns to the saved draft.

### Tasks

- [x] Add a Discord post action that starts fresh OAuth for each request, a draft save/restore, automatic send after a successful callback, one-use grant handling, and the #belt-requests deep link in the copy dialog.
- [x] Let the member review the existing form content before posting, then disable repeated clicks while OAuth starts or a send is pending.
- [x] Show confirmed webhook delivery with a message link. On uncertain delivery, tell the member to check the channel before retrying; preserve copy fallback and use existing snackbar patterns.
- [x] Add focused Vitest coverage for signed-out, fresh OAuth, valid/expired/consumed grant, draft restore, repeat-click prevention, and errors.
- [x] Validate the entire journey in a signed-in development browser against the configured test webhook and deployed bot before adding preview functionality. The owner confirms success and supplied the bot-result screenshot.
- [x] Confirm an effective development test-target configuration by the successful browser send. The exact values of `BELT_REQUEST_WEBHOOK_TARGET` and `TEST_WEBHOOK_URL` were not inspected; keep the URL value out of reports and logs.

### Exit criteria

- [x] A signed-in user can review the form and click Post to Discord once; after successful authentication, the saved draft posts automatically. The owner confirmed the one-click submission. The earlier browser screenshot separately shows LockyJr's resulting post.
- [x] Copy remains available for Discord and Reddit; focused tests and `npm run ci-pr` pass. Direct copy behavior for both platforms still needs browser confirmation.

### Open issues for next phase

- Review the production webhook destination and deployed bot version. Direct browser checks of both Copy Request platform choices remain useful before release; the copy path was retained and covered by focused tests.

### Open issues for later phases

- None.

## Phase 6: Integration and release

- **Status:** Complete
- **Completed:** 2026-10-21 (owner-reported completion; exact deployment dates were not supplied)
- **Start when:** Phase 5's development-browser send and bot acceptance pass. Production deployment and production sends require explicit approval.

### Summary

Use the Phase 5 test-target results to coordinate the bot, server, and frontend release. The owner reports that all release checks are complete and the API, bot, and frontend are in production and being monitored.

### Findings

- The supplied test webhook URL is a secret. The owner confirmed Phase 5's browser journey and LockyJr result; the exact deployed test URL was not inspected.
- The owner reports completion of all Phase 6 checks and production rollout of the API, bot, and frontend. This update records that report; check artifacts, production configuration values, deployment order and timestamps, and smoke-test results were not independently inspected.

### Tasks

- [x] Review the cross-repository contract, server-only environment configuration, and release order with the bot/server owners (owner-reported complete).
- [x] Review Phase 5's browser test-target results and complete the remaining frontend/server release checks (owner-reported complete; exact results were not supplied for this update).
- [x] Confirm the approved production webhook and deployed bot use the expected IDs, guild, and channel before release (owner-reported complete; configuration values were not inspected).
- [x] Check Copy Request in a browser for both Discord and Reddit platform choices (owner-reported complete).
- [x] Complete the approved secret rotation, coordinated bot/server/frontend deployment, production smoke test, and obsolete CI variable removal check (owner-reported complete; no secrets or settings were inspected).
- [x] Record the owner-reported release outcome and verification limits in the developer report; update the phase status.

### Exit criteria

- [x] A signed-in member can authenticate with Discord for a request, post, and open the confirmed channel message; LockyJr processes it under the verified requester ID in the approved target (owner-reported production check).
- [x] No browser bundle includes the Discord client secret, no webhook URL appears in source or logs, and required tests and approved live checks are complete (owner-reported; exact artifacts were not supplied for independent review).

### Open issues for next phase

- None.

### Open issues for later phases

- Reddit modmail posting is outside this project.

## Post-launch

### On-site confirmation of the resulting post

- [ ] Show members whether LockyJr accepted their request and provide a link to its resulting post in `#belt-requests`. The current webhook message link identifies delivery to the input channel, not the bot's resulting post.
- [ ] Define a trusted way for LockyJr to report the outcome and resulting message ID to the server, correlated with the original request. Expose that status to the submitting member without treating webhook delivery as bot acceptance.
- [ ] Handle bot rejection, delayed processing, and missing confirmation clearly in the site UI; verify the full flow after launch.
