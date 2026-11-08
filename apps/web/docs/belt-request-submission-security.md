# Belt request submission: prototype and recommended hardening

## Prototype decision

The owner requested a flexible intake rule for prototyping and potential Reddit
requests: any Firebase-authenticated user may create a `belt-requests` document
only when its initial `status` is `incoming`. This applies to moderator creates
too. Existing read, update, and delete permissions remain unchanged.

The requested deployment targets only `lpubelts-dev` in project
`lpu-belt-explorer`, using `firebase/firebase.rules-dev.json`, which contains no
production database or indexes. The shared `firebase/firestore.rules` source is
also referenced by production configurations; a future production rules release
would include this change unless it is revised first.

This prototype does not verify submitted Discord/Reddit identities, bind a
request to its Firebase author, enforce a schema, prevent duplicate creates, or
limit submission frequency. Browser OAuth checks are not a security boundary.
Authenticated users can supply arbitrary fields with `status: 'incoming'`.
The stronger design below is a recommendation, not implemented behavior.

## Recommended direct Firestore submission design

Keep Discord OAuth through the API, then allow the browser to submit directly
to Firestore with a server-issued, single-use submission authorization. The
request itself bypasses the API posting endpoint and Discord webhook.

The existing OAuth backend already stores verified identity in
`discordPostingGrants`, bound to a Firebase UID with a 15-minute expiry. Adapt
that mechanism rather than introduce permanent claims:

1. After OAuth, trusted backend code issues an authorization containing the
   Firebase UID, verified Discord ID and username, expiry, and reserved request
   ID. Only trusted server code may create authorizations or change their
   identity fields. Store the authorization in the same Firestore database as
   the queue. Keep this separate from legacy webhook grants or explicitly
   version their semantics so both submission paths cannot consume it.
2. `createBeltRequest()` atomically creates the reserved request and marks the
   authorization consumed. Rules require both operations together. Reuse the
   reserved ID for retries and recognize a confirmed existing submission
   without creating duplicates. Retain a consumption record independently of
   the request's later lifecycle.
3. Firestore rules require the authenticated Firebase UID to own an unexpired,
   unconsumed authorization. The request's Discord ID and username must match
   that authorization, and its document ID must match the reserved ID. Initial
   values must be `source: 'Site'`, `platform: 'Discord'`, `status: 'incoming'`,
   and `revision: 1`. Validate allowed/required fields, types, belt values, and
   content lengths. Members cannot supply review, checkout, approval, or
   bot-populated fields. Member permission is create-only; review permissions
   remain role-based.
4. The OAuth callback retains the authorization reference. The form clears the
   authorization and draft only after a confirmed Firestore commit. Session
   storage supports the flow; Firestore rules enforce access. Removing a grant
   from browser storage does not consume it on the server.
5. Add emulator tests for forged identity, another user's authorization,
   expiration, reuse, invalid fields, and missing atomic consumption. Test
   successful submission, draft preservation, and duplicate-safe retries in
   the frontend.

Include `submittedByUid` for the Firebase author, distinct from `userId`, which
LockyJr expects to hold the Discord ID. A Reddit flow should establish its own
verified platform identity using the same authorization pattern.

Implementation spans the OAuth backend, Firestore rules, and frontend. Deploys
remain separately approval-gated.

## Deployment verification

Development rules were deployed at 2026-11-08T07:00:56.568526Z using:

```sh
firebase deploy --config firebase/firebase.rules-dev.json --only firestore:lpubelts-dev --project lpu-belt-explorer --non-interactive
```

- Development ruleset: `projects/lpu-belt-explorer/rulesets/a2a7b5e6-8ede-4785-aee8-13af8fc244a9`.
- Production ruleset: `projects/lpu-belt-explorer/rulesets/dcbb6b1c-0962-4baa-92f6-ebca07f709cd`; release metadata was unchanged before and after deployment.
- Rules compilation dry run and the focused Auth/Firestore emulator suite passed.
- No live application data was read or written for verification.

### Production publication

The owner subsequently authorized publication to the production `(default)`
database. Deployment completed at 2026-11-08T07:25:07.856225Z using:

```sh
firebase deploy --config firebase/firebase.rules-prod.json --only firestore:rules --project lpu-belt-explorer --non-interactive
```

Production now uses `projects/lpu-belt-explorer/rulesets/a2a7b5e6-8ede-4785-aee8-13af8fc244a9`, matching development.
The production compilation dry run passed, and development release metadata
was unchanged before and after this deployment. No application documents were
read or written for verification.
