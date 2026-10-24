# Reddit authentication via the API server — developer implementation report

> Companion to the [implementation plan](reddit-api-auth-implementation-plan.md). The [project overview](reddit-api-auth-plan.md) records the recommendation and scope.

- Last updated: 2026-10-23
- Implementation report: `internal-docs/reddit-api-auth-developer-report.md`
- Plan: `internal-docs/reddit-api-auth-implementation-plan.md`

## Checkpoint

- **Phase / task:** Phase 1 complete; Phase 2 frontend migration is next.
- **State:** The sibling API server has authenticated Reddit start/exchange routes, bounded inbox reads, mocked tests, API documentation, and synthetic response samples. No frontend application code was changed in Phase 1.
- **Resume with:** Add one frontend starter for `import` and `debugImport`, route the root OAuth callback to `/auth/reddit`, consume the documented server response, and fix zero-award username linking.
- **Watch out for:** Preserve the unrelated `src/scorecard/Scorecard.jsx` worktree edit. The current Reddit redirect points to a hash route but `src/app/routes.jsx` registers the component at `/_`. The existing `DEBUG_DOWNLOAD` state prefix needs replacement. Do not use live credentials, print message contents, or run approval-gated deployment/data operations while implementing locally.

## Cross-phase reference

- **Repositories affected:** `lpu-belt-explorer` (frontend, tests, and documents) and `../explore-lpubelts-com-node` (API routes, service, tests, and API documentation).
- **Approval-gated actions:** Production deployment, secret rotation, production smoke tests, and live-data scripts require explicit authorization. No such action has been performed for this plan.
- **Environment notes:** Frontend uses npm and Node 24; the sibling server uses Yarn and Node 24.21.0. Keep development and production API configuration separate. Use synthetic fixtures and mocked Firebase/Reddit calls for automated tests.
- **Baseline metrics:** No full-suite baseline was measured. Phase 1 used only directly affected server unit/route tests, targeted ESLint, and documentation parsing.

## Phase 1: Server OAuth and Reddit reads

### Changes

- Added `/api/v1/reddit/oauth/start` and `/oauth/exchange` in the sibling API server. Both require a verified Firebase bearer token and return private no-store responses. Start accepts only `import` or explicit `debugImport` and the exact configured root callback.
- Added a one-use, ten-minute Firestore state bound to the verified UID and hashed browser nonce. Exchange consumes it transactionally before contacting Reddit, exchanges the code with server-only credentials, reads verified identity, flair, and relevant r/lockpicking moderator inbox messages, then attempts token revocation.
- The existing profile bookmark is read from the selected Firestore database only when the linked username matches the verified Reddit username, ignoring case. The response returns `bookmark` and `nextBookmark`; the server never writes awards or profile data. Other inbox items may supply pagination cursors but are omitted from the response.
- Added exact request/response contracts, errors, synthetic samples, and protected environment variable names to the server API documentation. The source project definition and phase tracker now record the final callback syntax and limits.

### Decisions and limits

| Decision | Reason and consequence |
| --- | --- |
| One `REDDIT_REDIRECT_URI` per API environment | Matches the reported single-URI Reddit app setting. Development registers `https://dev.lpubelts.com/`; production registers `https://lpubelts.com/`. Both include the trailing slash and no fragment or query. Localhost requires a separate app if it needs a live callback. |
| `import` and `debugImport` only | The debug purpose is explicit; future `beltRequest` authorization and sending remain outside this project. |
| Five 100-item inbox pages and 256 KiB of relevant message JSON | A capped or incomplete scan returns HTTP 413 `reddit_import_too_large` with no partial data or bookmark advance. An oversized first import cannot currently resume; add continuation before release if development testing encounters this. |
| Eight seconds per Reddit call and 30 seconds for the import attempt before revocation | Limits external waits. Safe error codes distinguish rate limits, timeouts, and failed Reddit reads without exposing tokens or message text. |
| Attempt revocation after token-bearing work | Reddit's OAuth guide specifies `token_type_hint=access_token`. A failed revoke does not hide a complete import result; the temporary access token otherwise expires on Reddit's schedule. |

### Verification

| Command / check | Result |
| --- | --- |
| `yarn vitest run src/api/services/redditImportService.test.js` | Passed: 11 service tests for URI/purpose, UID/nonce/expiry/replay, zero messages, username/bookmark isolation, both pagination directions, page/response size caps, partial-page failure, rate limit, failed exchange, timeout, and revocation attempt. |
| `yarn vitest run src/api/testing/redditImportRoutes.test.js` | Passed: 3 route tests for authentication/no-store, schema rejection, and verified UID propagation. Supertest required loopback binding outside the default sandbox; Firebase and Reddit remained mocked. |
| `yarn eslint src/api/services/redditImportService.js src/api/services/redditImportService.test.js src/api/routes/redditImport.js src/api/testing/redditImportRoutes.test.js src/api/index.js` | Passed. |
| `ruby -e "require 'yaml'; YAML.load_file('src/api/documentation/openapi.yaml'); puts 'OpenAPI YAML parsed'"` | Passed. |
| `git diff --check` in the sibling API repository | Passed. |
| HTTP logger and error path source review | Request logging serializes ID, method, URL, and IP but no request body or authorization header; Reddit service errors contain generic messages. The API exchange is a POST with no token-bearing query parameters. |
| Full server/frontend suites, builds, live OAuth, deployment, and live data | Not run in Phase 1. The user reserved the full suite for a final gate; live operations need separate authorization and registered apps. |

### Open questions and later work

- **Phase 2:** Route the root callback before hash-router mount, fix the current `/_` Reddit route mismatch, translate server `flairText`/`messages`/`nextBookmark` to the existing matcher, and preserve debug download without profile or award writes. Save the verified username even when no award matches.
- **Phase 3:** Confirm Reddit Data API approval covers this external website and its new OAuth clients. Register traditional web apps at `reddit.com/prefs/apps` with the exact URI values above; supply separate server-only credentials and a descriptive user agent; configure TTL cleanup for `redditOAuthStates.expiresAt`; validate real inbox pagination and the 500-item/256 KiB/30-second limits with a consenting development account. Add a continuation flow if the cap is encountered. Coordinate frontend secret removal, rotation, and release with approvals.

### App registration research (2026-10-23)

- [Reddit's Devvit FAQ](https://developers.reddit.com/docs/guides/faq) says Devvit handles authentication for Reddit-hosted apps and that an external website uses a different flow. [Reddit's OAuth guide](https://github.com/reddit-archive/reddit/wiki/OAuth2) and [Help Center OAuth instructions](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=19623931614484) still direct traditional web-app clients to `reddit.com/prefs/apps`. Thus the registered clients for this project should be traditional web apps, not Devvit projects.
- [Reddit's current Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) requires a request and explicit approval before any Data API access and directs use cases unsupported by Devvit to a [Data API request form](https://support.reddithelp.com/hc/en-us/requests/new?tf_42139884615700=api_request_type_developer_clone&ticket_form_id=14868593862164). Existing approval coverage is unknown; client creation must not be treated as approval. The policy cautions against multiple requests for the same use case, so one project request should describe both deployment environments if needed.

## Phase 0: Planning and source review

### Changes

#### Planning documents

- Added the phase tracker in `internal-docs/reddit-api-auth-implementation-plan.md` and opened this report from the repository templates. The existing `reddit-api-auth-plan.md` remains the project definition.

### Decisions

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| Keep Reddit OAuth exchange and token-bearing reads on the API server; return only import inputs to the browser. | Removes the public client secret and browser token while reusing the existing award matcher and Firestore writer. | Returning the token to the browser preserves the existing exposure; moving award catalog/matching and all writes to the API broadens this migration. |
| Use temporary, per-import authorization and one-use browser-bound state. | Fits the current reauthorization workflow and avoids persistent credentials. | Storing refresh tokens now adds lifecycle, revocation, and operational work that this project does not need. |
| Reserve future `beltRequest` behavior without implementing it. | User-originated ModMail sending needs its own endpoint, scope, and queue contract. | Reusing the linked `redditUsername` would treat editable profile data as verified posting identity. |

### Verification

| Command / check | Result |
| --- | --- |
| Source and template review with `rg`, `sed`, and `cat` in both repositories | Completed; inspected current Reddit entry points/callback, Discord OAuth server pattern, relevant repository guidance, and both templates. |
| `git diff --cached --check` | Initial run found template-style Markdown trailing spaces in the new documents. Converted those lines to lists; rerun passed. |
| Frontend/server lint, tests, builds, and live OAuth | Not run; this task created planning documents only. |

### Manual review needed

- Confirm the Reddit app's exact registered redirect URI and whether the intended user-originated ModMail path needs `privatemessages` or `modmail` scope before implementing that later project.
- Before live validation and release, confirm the server-only Reddit OAuth configuration, the account used for the test, and the approved secret-rotation sequence without recording secret values here.
