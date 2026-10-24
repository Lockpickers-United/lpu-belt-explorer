# Reddit authentication via the API server — implementation plan and progress

- Status: Phase 1 complete
- Last updated: 2026-10-23
- Project definition: [Reddit authentication overview](reddit-api-auth-plan.md)
- Developer report: [Reddit authentication developer report](reddit-api-auth-developer-report.md)

## Project snapshot

- **Outcome:** Import Belts and Link Reddit Account use a Firebase-authenticated API server for Reddit OAuth and inbox reads, without exposing a Reddit token or client secret to the browser.
- **Current phase:** Phase 1 server OAuth and Reddit reads complete with mocked tests; Phase 2 has not started.
- **Next action:** Implement the frontend starter, root callback routing, matcher handoff, and zero-award linking in Phase 2.
- **Overall blocker:** None for local Phase 2 work. Live Phase 3 validation requires the traditional Reddit OAuth web apps, server-only configuration, and confirmation that Reddit has approved this Data API use case under its current policy.

| Phase | Status | Started | Completed |
| --- | --- | --- | --- |
| Phase 1: Server OAuth and Reddit reads | Complete | 2026-10-23 | 2026-10-23 |
| Phase 2: Frontend import and profile linking | Not started | — | — |
| Phase 3: Integration and release | Not started | — | — |

Use **Not started**, **In progress**, **Blocked**, or **Complete** for each phase. Record a completion date only after its exit criteria pass; put detailed evidence in the developer report.

## Phase 1: Server OAuth and Reddit reads

- **Status:** Complete
- **Completed:** 2026-10-23
- **Start when:** Implementation work begins; use synthetic data and mocked Reddit/Firebase services.

### Summary

Add authenticated Reddit OAuth start and exchange operations to `../explore-lpubelts-com-node`. Keep the access token on the API server while it retrieves identity, flair, and relevant approval messages; return only the fields the existing frontend matcher needs. No ModMail send or persistent credential storage belongs in this phase.

### Findings

- The server already has `/api/v1/discord/oauth/start` and `/oauth/exchange`, `requireAuth`, Firebase Admin database selection, one-use state, and private no-store responses. Reuse their patterns, with Reddit-specific routes and configuration.
- The current browser flow requests `identity flair privatemessages` with `duration=temporary`, scans `/message/inbox`, and uses `redditBookmark` to avoid repeating older messages. The profile and award writes remain browser-owned under the current Firestore rules.
- Reddit's OAuth documentation requires the redirect URI to match registration. The final hosted callback syntax is `https://dev.lpubelts.com/` for development and `https://lpubelts.com/` for production. Each server uses one `REDDIT_REDIRECT_URI` with its own Reddit web app. A local `http://localhost:3000/` flow needs a separate app if one URI per app is enforced.
- Reddit's [Devvit FAQ](https://developers.reddit.com/docs/guides/faq) distinguishes Reddit-hosted Devvit apps from external websites. This project's external OAuth code flow needs traditional **web app** clients from [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps), as Reddit's [OAuth guide](https://github.com/reddit-archive/reddit/wiki/OAuth2) and [Help Center](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=19623931614484) describe. Reddit's [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) requires explicit Data API approval before live access; confirm coverage for this use case or use its [request form](https://support.reddithelp.com/hc/en-us/requests/new?tf_42139884615700=api_request_type_developer_clone&ticket_form_id=14868593862164).
- The server returns verified username, raw flair text, relevant moderator messages, and old/proposed bookmarks. It scans at most five 100-item inbox pages and 256 KiB of relevant message JSON; an oversized scan fails visibly without partial data. The token is temporary and revocation is attempted after each token-bearing import.

### Tasks

- [x] Define and document the Reddit start/exchange request and response shape, exact fragment-free redirect URI allowlist, `import` and explicit `debugImport` purposes, and safe error codes. Accept only the intended purpose and callback URI; leave `beltRequest` for a later project.
- [x] Add Firebase-authenticated start with a short-lived one-use state bound to UID and a browser nonce. Exchange the code with server-only `REDDIT_CLIENT_ID`/`REDDIT_CLIENT_SECRET`; validate and consume state before contacting Reddit. Return no token or secret.
- [x] Read the caller's existing Reddit bookmark from the selected Firestore database only when the verified Reddit username matches the linked username. Fetch identity, flair, and relevant `/r/lockpicking` moderator inbox messages on the server; preserve bookmark ordering and return the next bookmark without advancing it on an incomplete scan.
- [x] Bound inbox work, response size, and external request time; handle Reddit errors/rate limits without leaking tokens or message text. An oversized first import fails visibly and requires a continuation design if encountered during development validation. Attempt to revoke the temporary token after the import. Keep debug message export explicit and free of profile/award writes.
- [x] Add synthetic service/route tests for authentication, UID/nonce binding, expiry/replay, username/bookmark behavior, pagination, zero messages, partial failures, revocation, and safe output. Inspect HTTP logging for body/token exposure. Update the server API documentation and environment guidance.

### Exit criteria

- [x] A mocked signed-in exchange returns only the verified import data, and rejected or failed exchanges never expose a Reddit token or advance a bookmark.
- [x] Focused server tests and lint pass; results and the chosen scan limit are recorded in the developer report.

### Open issues for next phase

- Route the root callback query to `/auth/reddit` before mounting the hash router. The current redirect points to `/#/auth/reddit`, while the route table registers the Reddit component at `/_`.
- Convert existing `DEBUG_DOWNLOAD` state-prefix behavior to explicit `debugImport` and preserve the no-write download path. Consume `flairText`, `messages`, and `nextBookmark` from the server response without browser Reddit calls.

### Open issues for later phases

- Register separate development and production Reddit apps with the exact root callbacks above. Configure each server's client ID, secret, URI, and user agent, and arrange secret rotation in Phase 3. Do not conflate this user OAuth client with the server's existing Reddit export job.
- Confirm Reddit Data API approval covers this project and the new OAuth clients before live testing. If a request is needed, present development and production as environments of the same use case; Reddit's current policy cautions against duplicate requests for one use case.
- Configure TTL cleanup for `redditOAuthStates.expiresAt` and test whether real first imports fit the five-page/256 KiB/30-second limits. Add continuation before release if a development import reaches a cap.
- A future ModMail belt-request phase must establish its own endpoint, scope, fresh authorization, and Discord queue contract; `redditUsername` is editable profile data, not posting authority.

## Phase 2: Frontend import and profile linking

- **Status:** Not started
- **Completed:** —
- **Start when:** Phase 1's API contract and mocked server behavior are stable.

### Summary

Route both entry points through one Reddit start helper and the authenticated server exchange. Keep the existing award matcher, deduplication, preview, and `DBContext` writer while correcting the zero-award linking behavior.

### Findings

- Both buttons duplicate the authorize URL and use `DBContext.oauthState`; `AuthRedditRoute.jsx` exchanges the code, reads Reddit, and revokes the token in the browser.
- `advanceBookmarkForRedditUser` writes the linked username only when called with a bookmark; the callback currently calls it only if at least one award was found.

### Tasks

- [ ] Add a shared frontend Reddit OAuth starter and APIContext methods. Store only the browser nonce and pending purpose in session storage, use the exact registered root callback, and route that return to `/auth/reddit` before the hash router mounts.
- [ ] Refactor the callback to wait for Firebase authentication, verify the pending state/nonce, call the API once, and clear OAuth query parameters. Render cancellation, expiry, Reddit failure, and incomplete-scan states through the existing preview/error UI.
- [ ] Feed the returned flair and relevant messages into the existing belt matcher. Preserve award deduplication and bookmark semantics; persist the verified Reddit username even when no awards match, without advancing a bookmark after a partial scan. Preserve explicit debug download without saving awards or profile state.
- [ ] Remove browser Reddit token/secret use and obsolete `DBContext.oauthState` only after its callers are gone. Update callback, entry-point, zero-award, debug, and regression tests with synthetic data.

### Exit criteria

- [ ] Both entry points complete through the same server flow; a verified account links with zero awards, and existing awards still import without duplicates or skipped messages.
- [ ] Focused frontend tests, lint, and a test build pass; the callback and failure paths are covered without contacting Reddit or Firebase live services.

### Open issues for next phase

- Phase 3 must confirm the exact registered redirects and the real inbox behavior in development, including an existing bookmark and an account with no new awards.

### Open issues for later phases

- A future ModMail sender must use its own fresh verified identity and purpose, rather than the imported profile association.

## Phase 3: Integration and release

- **Status:** Not started
- **Completed:** —
- **Start when:** Local implementation and focused checks in Phases 1 and 2 pass.

### Summary

Validate the full development journey, then coordinate server configuration, frontend cutover, secret rotation, and production verification. Deployment and live-data operations remain separately approval-gated.

### Findings

- The frontend build workflow currently injects `VITE_REDDIT_CLIENT_SECRET`; the browser-exposed Reddit secret needs rotation after server-side exchange is ready.
- The server uses separate development and production Firestore databases and protected environment files. OAuth state expiry must be enforced in code even if TTL cleanup is configured later.
- Devvit does not provide this external website's OAuth redirect/client-secret flow. The traditional `prefs/apps` web-app registration is still documented, but Reddit's current Responsible Builder Policy requires explicit Data API approval before live access. App creation alone is not approval.

### Tasks

- [ ] Confirm Reddit Data API approval covers this use case and the new clients. Register traditional web apps at `reddit.com/prefs/apps` with the exact development and production redirects, then confirm the server configuration. Test a development import/link with a consenting account only after Reddit approval and the required project approval; record outcomes without codes, tokens, message bodies, or credentials.
- [ ] Verify import with awards, zero new awards, an existing bookmark, cancellation, retry after an expired callback, and explicit debug download. Confirm that bounds and timeouts either complete or fail visibly without losing the bookmark.
- [ ] Run `yarn validate` in the API server and `npm run ci-pr` plus relevant Playwright coverage in the frontend; record exact results and distinguish any pre-existing failures.
- [ ] Prepare the server-first release, remove the frontend `VITE_REDDIT_CLIENT_SECRET` CI mapping, rotate the exposed Reddit secret, deploy the frontend, and perform a production smoke test only with the required approvals. Confirm the shipped browser bundle contains no Reddit client secret.

### Exit criteria

- [ ] The development and approved production journeys work from both entry points with the registered callback and server-only Reddit credentials.
- [ ] Required checks and release evidence are recorded in the developer report; no Reddit token or client secret reaches the browser, and message bodies appear only in the signed-in member's minimal import response or explicit debug download, never in normal logs or persistent browser storage.

### Open issues for next phase

- None.

### Open issues for later phases

- User-originated ModMail requests and synchronization with the Discord-maintained queue require a separate design and release plan.
