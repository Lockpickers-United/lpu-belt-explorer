# Posting Belt Requests to Discord — Implementation Plan

Status: draft, 2026-10-20. LockyJr webhook handling already exists;
lpubelts.com posting and the OAuth changes below are not implemented.

## Goal

Today `BeltRequestForm.jsx` formats a request (`formatDiscordRequest` in
`handleRequestSubmit.js`) and copies it to the clipboard. The user then pastes
`@LockyJr request …` into #belt-requests. The goal is to let a signed-in user
authenticate with Discord and have lpubelts.com post the request for them.

## Feasibility

**Posting *as* the user is not possible.** Discord OAuth2 has no scope that
lets a third-party app send guild channel messages with a user's token.
Automating a user account ("self-botting") breaks Discord's Terms of Service.

**Posting *for* the user is possible.** The server posts through a dedicated
webhook in #belt-requests. The user's Discord identity, verified with OAuth
`identify`, goes into the message:

| Option | How it looks | Notes |
|---|---|---|
| **A. Channel webhook** (recommended) | User's Discord name + avatar, "APP" tag | LockyJr already handles webhook requests. Mods provide a dedicated webhook in #belt-requests. Forum channels require a `thread_id` or `thread_name`. |
| B. Bot account | Bot name, message mentions `<@userId>` | Needs a bot user in the LPU guild with Send Messages permission; more setup, no real benefit over A. |
| C. Deep link only | User still pastes | Copy, then open `https://discord.com/channels/{guild}/{channel}`. Ship this regardless as the fallback. |

### LockyJr integration contract

LockyJr already handles webhook requests. Before implementing the site side,
record and test the existing contract with its owner: which webhook ID(s) it
trusts, where it reads the real requester's Discord ID, the exact command and
mention format, whether it processes forum threads, and which membership,
role, duplicate-request, or rate rules it applies. The server must populate
the requester from its verified OAuth link, never from submitted form data.
Confirm whether #belt-requests is a text or forum channel and who creates and
owns the dedicated webhook. A test webhook in a channel LockyJr does not
watch proves delivery only; it does not prove that the bot accepts the request.

## Reuse of `src/auth/AuthDiscordRoute.jsx`

The current flow can be reused in part, but it is not usable as-is:

- **Reusable:** the authorize redirect (`ImportButton.jsx`,
  `EditProfilePage.jsx`), the `identify` scope, the `/#/auth/discord` callback
  route, and the `/users/@me` lookup. Together these give us the verified
  Discord user ID, username, and avatar. `identify` alone does not establish
  LPU guild membership or channel eligibility. If LockyJr's existing rules
  require either, define how the server or bot verifies them before posting;
  add an OAuth scope only if that check requires it.
- **Must change first:**
  - The code-for-token exchange runs in the browser with
    `VITE_DISCORD_CLIENT_SECRET`, which ships in the public bundle. Move the
    exchange to the server, then rotate the secret. Until this is done, the
    site can't vouch for anyone's identity.
  - There is no OAuth `state` parameter, so there is no CSRF protection, and
    the callback always runs the award-import flow. Use server-issued state
    carrying `purpose` (`import` | `beltRequest`), the Firebase UID, an expiry,
    and a nonce bound to the initiating browser. Check that binding on return
    and consume the state once; a signature alone is insufficient.
  - The current `lockcollections.discordId` and `discordUsername` are writable
    by their owner under the existing Firestore rules. Do not treat them as a
    verified link. Store the posting identity in a server-only record, and
    require OAuth linking before posting even for existing profile values.
    Expose linked status through an authenticated endpoint and update the
    existing "Remove Discord account" action to clear the trusted link too.

## Implementation steps

### 1. Server: Discord identity (`explore-lpubelts-com-node`)
- Add an authenticated OAuth start operation that issues state bound to the
  Firebase UID, purpose, a browser nonce stored in session storage, and a short
  expiry. Include a hash of the nonce in signed state or bind it to a
  server-side session. Allowlist `returnTo` destinations; do not accept an
  arbitrary redirect URL.
- `POST /discord/oauth/exchange` `{code, state, nonce}`: requires a Firebase ID
  token, validates the UID and browser-bound nonce, rejects expiry or replay,
  exchanges the code with the client secret from server env, and calls
  `/users/@me`. Save
  `{discordId, username, avatar, verifiedAt}` in a server-only record. Return
  the identity, never a Discord token. Keep award import behavior independent
  of whether the Discord account has any matching awards.
- Add authenticated linked-status and unlink operations. A client write to
  `lockcollections` must never create, replace, or remove the trusted link.
- Rotate the Discord client secret and remove `VITE_DISCORD_CLIENT_SECRET`
  from the frontend env and CI. Coordinate the rotation with the new exchange
  flow so existing import callbacks do not break during rollout.

### 2. Frontend: callback refactor
- `AuthDiscordRoute.jsx` waits for Firebase authentication, calls the exchange
  endpoint instead of Discord, then branches on the validated purpose: the
  existing award import (`peekAtDiscordAwards` with the returned ID), or a
  redirect back to the belt request form. Remove the OAuth code and state from
  browser history after use.
- Share one `startDiscordAuth({purpose, returnTo})` helper between
  `ImportButton.jsx`, `EditProfilePage.jsx` and the form. It stores the browser
  nonce for the callback and requests the server-issued state.

### 3. Server: post endpoint
- `POST /belt-requests/discord`: requires a Firebase ID token and a verified
  Discord identity from the server-only record. Apply any membership or role
  checks required by LockyJr's integration contract.
- The server builds the message from structured form fields using one formatter
  shared with its preview operation. Do not trust the client's formatted text,
  Discord ID, lock names, or belt metadata. Resolve entry IDs against trusted
  catalog data and normalize the fields before preview and posting. Return a
  digest of the previewed payload and require it on post; reject a post if the
  recomputed payload has changed.
- Validate belt, entry IDs, URLs, and free-text fields such as notes and quest
  details. Permit only HTTP(S) evidence URLs, cap field lengths and the final
  message to Discord's 2,000-character `content` limit, and prevent free text
  from injecting bot commands or unexpected mentions. Set `allowed_mentions`
  explicitly: suppress all mentions unless the bot contract requires specific
  user IDs. Match its exact requester and command format.
- Post via a new `BELT_REQUEST_WEBHOOK_URL` env variable, using `username` and
  `avatar_url` from the trusted identity. Use a dedicated sender or refactor
  `sendToDiscord.js`: its current HTML escaping changes Discord message text,
  and it swallows failures without returning a message ID. Specify the target
  channel or forum thread, set `?wait=true`, inspect the response, and return
  the message ID and channel ID for the success link. Surface Discord errors,
  including rate limits, without exposing the webhook URL.
- Accept a stable submission ID from the client. Persistently reserve it before
  sending and reuse the result on retries. Hold uncertain send outcomes for
  reconciliation rather than blindly resending; double-clicks or network
  retries must not silently create duplicate requests.
  Rate-limit by Firebase UID and verified Discord ID (for example, 1 per 10
  minutes and 5 per day). Log `{uid, discordId, messageId, belt}` for moderator
  audit without logging tokens, webhook URLs, or full request bodies.
- Route dev/test sends explicitly to `TEST_WEBHOOK_URL` and fail closed if the
  intended target is not configured. Do not infer the destination from a
  client-supplied field or webhook username.

### 4. Frontend: form UX (`BeltRequestForm.jsx`)
- When `requestPlatform === 'Discord Post'`, add a second action next to
  **Copy Request**: **Post to Discord**. It is only enabled once the user is
  signed in. If they are not linked, the button reads "Connect Discord to
  post"; it saves the draft (sessionStorage), starts the OAuth flow, and
  restores the draft on return.
- Get the preview from the server formatter, then confirm the exact normalized
  message that will be posted. If the form changes, refresh the preview before
  confirmation. Disable repeat submission while pending and retry with the same
  submission ID. On success, link to the posted message using the returned
  channel and message IDs. Show errors with `enqueueSnackbar`, and keep copy
  as the fallback.
- Add the "open #belt-requests" deep link (option C) to the existing
  copied-to-clipboard dialog.

### 5. Tests and checks
- Vitest:
  - callback branching by validated `state`, and rejection of mismatched or
    expired browser state;
  - form button states (signed out, unlinked, linked);
  - draft restore, preview refresh, and repeat-submit prevention;
  - error paths, including uncertain send results.
- Server: unit tests for the exchange (UID binding, expiry, replay, no token
  leak), trusted-link storage and unlinking, and the post endpoint (auth,
  legacy client-writable profile values, catalog/URL/free-text validation,
  message length, mentions, idempotency, rate limits, and Discord failures),
  with Discord `fetch` mocked.
- Run a manual end-to-end send against `TEST_WEBHOOK_URL`. Where LockyJr
  watches a test channel, verify that it recognizes the trusted webhook and
  attributes the request to the verified Discord ID. If it cannot watch the
  test channel, record bot acceptance as unverified until a separately approved
  production smoke test. A production webhook, live send, and deploy need the
  required mod and owner approvals.

## Open questions
- Document the existing LockyJr webhook contract and its membership, role,
  duplicate-request, and rate rules before wiring the post endpoint to it.
- Text vs forum channel in #belt-requests, and who creates and owns the
  dedicated webhook.
- Should Reddit modmail get the same treatment? Probably not, since the Reddit
  API needs a user-scoped `privatemessages` token, so it would be a separate plan.
