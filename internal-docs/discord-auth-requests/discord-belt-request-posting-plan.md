# Posting Belt Requests to Discord — Implementation Plan

Status: in progress, 2026-10-20. The OAuth identity and posting APIs are
implemented locally; LockyJr verification and the lpubelts.com form flow remain
in progress. The posting API's webhook target is disabled by default.
See the [implementation plan](discord-belt-request-posting-implementation-plan.md)
for current phase status.

## Goal

Today `BeltRequestForm.jsx` formats a request (`formatDiscordRequest` in
`handleRequestSubmit.js`) and copies it to the clipboard. The user then pastes
`@LockyJr request …` into #belt-requests. The goal is to let a signed-in user
authenticate with Discord and have lpubelts.com post the request for them.

This is a low-risk convenience feature carrying information the member already
intends to post publicly. Keep the implementation proportionate: protect the
Discord credentials and requester identity, validate the message, and handle
ordinary send errors. Moderators and LockyJr continue their existing review.

## Feasibility

**Posting *as* the user is not possible.** Discord OAuth2 has no scope that
lets a third-party app send guild channel messages with a user's token.
Automating a user account ("self-botting") breaks Discord's Terms of Service.

**Posting *for* the user is possible.** The server posts through a dedicated
webhook in #belt-requests. The user's Discord identity, verified with OAuth
`identify`, goes into the message:

| Option | How it looks | Notes |
|---|---|---|
| **A. Channel webhook** (recommended) | User's Discord name + avatar, "APP" tag | A server admin owns the dedicated webhook. The confirmed test webhook targets #announcement-reactions; LockyJr posts the resulting request to #belt-requests. Its local handler still needs exact guild/channel checks and member validation. |
| B. Bot account | Bot name, message mentions `<@userId>` | Needs a bot user in the LPU guild with Send Messages permission; more setup, no real benefit over A. |
| C. Deep link only | User still pastes | Copy, then open `https://discord.com/channels/{guild}/{channel}`. Ship this regardless as the fallback. |

### LockyJr integration contract

The production destination is the **text** channel #belt-requests. A server
admin creates, owns, and rotates its dedicated webhook. The owner confirmed
that test webhook ID `1562162476009660489` targets #announcement-reactions
(`1360395141822812311`) in guild `140129091796992000`; LockyJr's `announce()`
posts the resulting request in #belt-requests (`282173282546089985`). The test
Discord webhook URL has been supplied separately; treat the entire URL as a
secret and configure it only in server-side secret storage. Do not put it in
this plan, source, fixtures, logs, or a frontend environment variable.

The current bot contract calls for fields named `userId`, `userName`,
`requestedBelt`, `messageContent`, and optional `redditUsername`. `userId` is
the Discord user ID verified by the site's per-request OAuth exchange;
`userName` is display data. These names replace the earlier proposed
`requesterId`, `username`, `belt`, and `message` fields. Put them in an embed
titled `New Belt Request`. The local `processBotRequest.js` reads these fields
and passes them to the shared request handler.
These are **embed fields**, not top-level Discord webhook parameters. Discord's
[Execute Webhook API](https://docs.discord.com/developers/resources/webhook#execute-webhook)
accepts an `embeds` array, along with webhook display overrides such as
`username` and `avatar_url`; it does not define top-level `requestedBelt`,
`messageContent`, or `redditUsername` parameters. The site must send the exact embed shape after
the bot handler is finalized. The manual `@LockyJr request …` command remains
the separate copy-and-paste flow.

The local bot handler now dispatches the `New Belt Request` embed only when
the webhook ID, LPU guild ID, and configured test or belt-request channel ID
match. It calls `isValidEvent(message, true)` first. Focused rejection tests
and deployed-bot verification remain before the webhook target is enabled.

Do not infer trust from an embed title alone. A test webhook in an unwatched
channel proves delivery only, not bot acceptance.

For requester attribution, the site must derive the Discord ID from its
verified OAuth result for that request, never from form data. The current bot
code now stores the embed's `userId` without resolving that guild member or
rejecting an unknown ID. LockyJr must validate the explicit, OAuth-verified
Discord `userId` and apply its existing requester rules; this feature does not
need a new role policy. The webhook display name is presentation only.

Discord's [rate limits](https://docs.discord.com/developers/topics/rate-limits)
govern API throughput: parse the response headers and honor `429` and
`Retry-After`; do not hard-code Discord's bucket sizes. Discord does not
provide application-level duplicate belt-request detection or idempotency.
The current manual bot path replaces an existing pending request for the same
user and belt. The local embed path now calls the shared handler, whose
existing-request lookup compares the supplied `userId`. Focused duplicate
tests remain before enabling posts. These observations reflect uncommitted bot worktree
changes on 2026-10-20 and must be checked again against the version actually
deployed. The owner reports that one simulated payload posted successfully;
this does not establish duplicate behavior or live webhook delivery.

## Reuse of `../../src/auth/AuthDiscordRoute.jsx`

The current flow can be reused in part, but it is not usable as-is:

- **Reusable:** the authorize redirect (`ImportButton.jsx`,
  `EditProfilePage.jsx`), the `identify` scope, the `/#/auth/discord` callback
  screen, and the `/users/@me` lookup. The registered OAuth redirect uses a
  fragment-free URL and the frontend routes its return to that screen. Together these give us the verified
  Discord user ID, username, and avatar. `identify` alone does not establish
  LPU guild membership or channel eligibility. Let LockyJr resolve the
  verified Discord ID and apply its existing requester rules.
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
    by their owner under the existing Firestore rules. Do not treat them as
    posting authorization. Require a fresh Discord OAuth flow for each belt
    request and issue a short-lived, one-use server-side posting grant. The
    existing "Remove Discord account" action continues to remove only the
    legacy award-import profile association.

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
  `/users/@me`. Return the verified identity without a Discord token. For a
  belt request, issue a one-use posting grant bound to the Firebase UID and
  verified identity, expiring after 15 minutes. Keep award import independent
  of whether the Discord account has any matching awards.
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
- `POST /belt-requests/discord`: requires a Firebase ID token and atomically
  consumes the matching one-use posting grant. LockyJr resolves the verified
  Discord ID and applies its existing requester rules.
- The server builds the final embed from structured form fields. Ignore any
  client-supplied Discord ID. The existing form gives the member enough context
  to review the request; no server-generated preview endpoint is needed.
- Validate belt, entry IDs, URLs, and free-text fields such as notes and quest
  details. Permit only HTTP(S) evidence URLs and enforce Discord's
  [embed limits](https://docs.discord.com/developers/resources/message#embed-limits),
  especially the 1,024-character limit for the request `messageContent` field and
  the 6,000-character combined embed limit. Reject an oversized request until
  a longer-message contract is agreed with the bot. Prevent free text
  from injecting bot commands or unexpected mentions. Set `allowed_mentions`
  explicitly: suppress all mentions unless the finalized bot contract
  requires specific user IDs. Construct the `New Belt Request` embed with
  server-derived requester identity and the agreed field names.
- Post via a server-only `BELT_REQUEST_WEBHOOK_URL` env variable, using `username` and
  `avatar_url` from the trusted identity. Use a dedicated sender or refactor
  `sendToDiscord.js`: its current HTML escaping changes Discord message text,
  and it swallows failures without returning a message ID. Use the configured
  configured text-channel webhook, set `?wait=true`, inspect the response,
  and return the message ID and channel ID for the success link. Surface Discord errors,
  including rate limits, without exposing the webhook URL.
- Disable the action while sending and do not automatically retry a timed-out
  request. If the result is uncertain, ask the member to check the channel
  before trying again. Respect Discord's response-based rate limits and return
  a safe error to the client. Log a minimal send result without tokens,
  webhook URLs, or full request bodies.
- Route dev/test sends explicitly to `TEST_WEBHOOK_URL` via
  `BELT_REQUEST_WEBHOOK_TARGET=test` and fail closed if the
  intended target is not configured. Do not infer the destination from a
  client-supplied field or webhook username.

### 4. Frontend: form UX (`BeltRequestForm.jsx`)
- When `requestPlatform === 'Discord Post'`, add a second action next to
  **Copy Request**: **Post to Discord**. It is only enabled once the user is
  signed in. Each request saves the draft (sessionStorage), starts a fresh
  OAuth flow, and restores the draft on return with a one-use posting grant.
- Let the member review the existing form before posting. Disable repeat
  submission while pending. On success, link to the posted
  message using the returned channel and message IDs. Show errors with
  `enqueueSnackbar`, and keep copy as the fallback.
- Add the "open #belt-requests" deep link (option C) to the existing
  copied-to-clipboard dialog.

### 5. Tests and checks
- Vitest:
  - callback branching by validated `state`, and rejection of mismatched or
    expired browser state;
  - form button states (signed out, ready for OAuth, grant returned/expired);
  - draft restore and repeat-click prevention;
  - error paths, including uncertain send results.
- Server: focused tests for the exchange (UID binding, expiry, replay, no
  token leak), one-use posting grant, and the post endpoint
  (authentication, input/size limits, mentions, and Discord errors), with
  Discord `fetch` mocked.
- After the bot accepts the dedicated webhook, run a manual end-to-end send
  against `TEST_WEBHOOK_URL`. Where LockyJr
  watches a test channel, verify that it recognizes the trusted webhook and
  attributes the request to the verified Discord ID. If it cannot watch the
  test channel, record bot acceptance as unverified until a production smoke
  test is approved. Production webhook setup, live send, and deployment still
  need the required mod and owner approvals.

## Scope and remaining bot-side decisions

- #belt-requests is a text channel; a server admin owns its dedicated webhook.
- Discord posting is the scope of this plan. Reddit modmail is deferred to a
  separate phase because its API needs a user-scoped `privatemessages` token.
- Confirm the dedicated production webhook ID and channel, then configure
  LockyJr to accept that target only in its intended guild/channel.
- Use `userId` for the verified Discord ID and update LockyJr to resolve
  that ID while keeping its existing requester and same-belt replacement rules.
  Recheck the bot behavior after its in-progress changes are committed and
  deployed. The site post endpoint must wait for this contract.
