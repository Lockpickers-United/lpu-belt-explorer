# Locky Jr.

## Reddit Verification Notes

**r/lockpicking** is maintained by the organization LockPickers United (LPU) which uses a "karate belt" like system for ranking members based on proven skills. Each belt is represented by a flair, which grow increasingly difficult to earn. Users apply for belt recognition on Reddit via ModMail. The belt system ties together the community through shared skill milestones across Reddit, Discord, and our many sites (most notably https://lpubelts.com/).

We are working on integrating those platforms, and this Devvit app is part of a phased development plan, starting with:

**Have modmail messages that match a specific structure trigger a webhook call to Discord.**

> When users send modmail with the structure `@lockyjr request <Belt Color> <Name of Lock> <link to photo or video evidence>`, the app forwards the modmail details to an admin only channel on discord. That message is then picked up and added to our request queue along with requests submitted on Discord (with the same required structure) and website. The admin team can then review and approve/deny the request, flagging it for follow up on Reddit.

The app has been tested and is running smoothly at https://www.reddit.com/r/locky_jr_dev/?playtest=locky-jr

## App overview

Locky Jr. helps locksport moderators move belt requests from Reddit modmail (the shared inbox for a community's moderators) into a Discord channel. It is for moderation teams that review belt requests in Discord and want a link back to the original Reddit conversation.

The app runs on Reddit. When a new modmail message arrives, it checks for `@LockyJr` and a recognized belt request. Matching messages become a “New Belt Request” card in Discord, with the requested belt, Reddit username, message text, and links for reviewers. A message can also include a Discord username for a downstream review process to use.

Moderators and requesters interact through modmail; there is no app screen, game, button, or special Reddit post to open. This version forwards information only. It does not approve requests, award belts, change Reddit flair, assign Discord roles, verify evidence, or link accounts automatically. Any follow-up automation in Discord must be provided separately.

**Critical operational notes:**

- Matching outgoing moderator messages and private moderator notes can also be forwarded. A private-note label on the Discord card does not restrict who can read it there. Use a restricted Discord channel and avoid including unrelated confidential information.
- Each installation has its own Discord destination. Moderators configure it on that community’s Install Settings page. Use a separate test webhook to keep test messages out of the live channel. This is an installation setting, not a Devvit secret; treat access to installation settings as access to the webhook URL.
- The app reads conversations without marking them as read. It forwards only the triggering message, not the entire conversation history.
- Forwarding is not guaranteed delivery. There is no app-managed retry queue, duplicate prevention, or success reply in modmail. Check Discord before sending a request again.
- The server logs incoming event data and parsed request text. Treat access to logs as access to potentially sensitive moderation information.

## What you need

For routine use, you need access to the community's modmail and, for reviewers, the destination Discord channel.

For setup, ask the app's maintainer or a technical helper to have:

- A Reddit account authorized to manage the `locky-jr` app and install it in the intended subreddit.
- A private test subreddit they moderate.
- Permission to create a webhook in the destination Discord channel. A webhook is a private address that lets the app send messages to that channel.
- This repository and Node.js 24.21.0 with npm 11.19.0, as specified by the repository.

The app requests Reddit moderator access and permission to contact `discord.com`. It does not require Firebase setup or a separate server you manage.

## Configure and try the app

Commands below run in a terminal from `apps/locky-jr-devvit`. Replace `YourTestSubreddit` and `YourCommunity` with actual subreddit names. Commands that upload, playtest, install, publish, or change settings affect Reddit or Discord routing; the operator should authorize the target and destination first.

### 1. Prepare the local tools

Install the app's packages, then sign in to Reddit:

```sh
npm ci
npm run login
```

Complete the browser sign-in with the account authorized to manage the app. Keep the configured app name `locky-jr` when maintaining this app; a separately owned copy needs its own registered app identity.

### 2. Create the Discord destination

In Discord, open the intended channel's settings, find **Integrations → Webhooks**, and create a webhook. Copy its URL privately. Restrict channel membership to people allowed to see the forwarded modmail.

Do not put that URL in this README, source code, screenshots, or shared terminal output. Anyone with it may be able to post to the channel.

### 3. Upload, install, and configure the destination

Upload a built version so Reddit knows about the app and its settings:

```sh
npm run deploy
```

This builds the app and uploads it; it does not itself publish the app for general use or update every installation.

Install it in your test subreddit:

```sh
npx devvit install r/YourTestSubreddit
```

Open that installation’s **Install Settings** page on Reddit. Paste the test channel’s webhook URL into **Discord Webhook URL** and save. No `.env` file or global CLI setting is needed. Repeat this setup separately for each community, using its intended channel’s webhook.

**Existing installations:** after installing the updated version, enter the destination again in Install Settings. The previous global secret is not copied or used as a fallback. Forwarding fails until the installation has a destination configured.

Reddit’s [Settings & Secrets documentation](https://developers.reddit.com/docs/capabilities/server/settings-and-secrets) describes installation settings and their moderator controls. Webhook URLs are sensitive: this installation field is not a globally encrypted Devvit secret. Only share settings access with trusted moderators.

### 4. Test on Reddit

Start a playtest in the test community:

```sh
npm run dev -- r/YourTestSubreddit
```

Playtesting installs a development version on Reddit and updates it as local files change. It is not an offline preview. Follow the terminal prompts, then send synthetic modmail to the test community using the examples below. Confirm a Discord card appears and its conversation link works for an authorized moderator. Stop the terminal session with Ctrl+C when finished; that does not uninstall the app.

## Use all forwarding features

Send modmail to the installed community, or add a message to an existing conversation. Include the literal text `@LockyJr`, followed by `request` and a belt name. It does not need to become a clickable Reddit mention.

Basic request:

```text
@LockyJr request Orange Belt
```

Request with evidence and notes:

```text
@LockyJr request Blue Belt https://example.com/my-evidence
Please review my submission.
```

Request with optional Discord username information:

```text
@LockyJr request Green Belt https://example.com/my-evidence
sync @example_user
```

Replace example links and usernames with the requester's information. Evidence and notes remain in the forwarded message text; the app does not check them. The `sync @example_user` text adds `syncUsername` and `syncTo: Discord` fields to the card. It does not verify ownership or perform synchronization.

| Feature | Accepted input or behavior |
| --- | --- |
| Colored belts | White, Yellow, Orange, Green, Blue, Purple, Brown, Red, Black |
| Belt wording | Both `Orange Belt` and `Orange` work |
| Dan ranks | `1st Dan` through `20th Dan`; also `Dan 1` through `Dan 20` |
| Capitalization | `@lockyjr request orange` works |
| Moderator replies | Matching outgoing messages are forwarded |
| Private notes | Matching notes are forwarded with “Private Moderator Note” in the footer |
| Ordinary modmail | Messages without the mention or a recognized request are skipped |

Use the full `@LockyJr request …` pattern shown above. Other bot names or commands are not supported forwarding entry points.

### What reviewers receive

The Discord card includes:

- The message author's name and a Reddit profile link.
- A “New Belt Request” title linking to the modmail conversation.
- The requested belt, the conversation participant's username, and the conversation ID as `requestId`.
- `source` and `platform`, both set to `Reddit`.
- `currentBelt`, taken from the event's author flair when available, otherwise `unknown`. Reviewers should confirm the requester's actual rank.
- Optional Discord username fields and the message text, shortened to 1,024 characters if necessary.

Colored-belt cards use the corresponding belt color. Dan requests currently use a gray fallback. Open the original modmail to read longer submissions. Reddit permissions still control who can open that conversation.

## Deploy to a community and maintain it

Once testing is complete, the authorized maintainer can submit a fresh version for Reddit's publication process:

```sh
npm run launch
```

This builds, uploads, and runs `devvit publish`. Follow Reddit's prompts and any review requirements; submitting does not guarantee immediate approval or availability.

Once the intended version is available, install it in the target community:

```sh
npx devvit install r/YourCommunity
```

For an existing installation, use the app's installation management page on Reddit to select the approved update. Configure **Discord Webhook URL** in that community’s Install Settings, then confirm the installed version and send one synthetic request to verify delivery. Uploading a newer version alone is not confirmation that the community uses it.

To change the destination, open that community’s Install Settings and replace **Discord Webhook URL**. This affects only that installation. If a URL is exposed, replace or delete that webhook in Discord and update each installation that used it.

To stop the app in one community:

```sh
npx devvit uninstall r/YourCommunity
```

Uninstalling does not remove previously forwarded Discord messages. Deleting the Discord webhook stops delivery to that destination for every installation using it.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| No Discord card | Check the installed app/version, webhook setting, literal `@LockyJr` mention, and recognized `request` wording. Ordinary messages are silently skipped. |
| “Discord webhook URL not configured” | A moderator must save **Discord Webhook URL** in that community’s Install Settings. |
| Discord rejects a request | Check whether the webhook was deleted, the channel still exists, or Discord is limiting requests. Review logs for the HTTP status. |
| Error note in modmail | On a rejected Discord response, the app attempts to add a private note saying the request was not entered. That note can also fail; its absence does not prove delivery. |
| Duplicate cards | The app does not prevent duplicates. Compare `requestId` and message text before processing again. |
| Missing message text | Discord cards shorten long text. Follow the conversation link for the complete message. |
| Incorrect or unknown current belt | Confirm the participant's rank manually; event author flair may be unavailable or belong to a moderator. |

The maintainer can stream installation logs with:

```sh
npx devvit logs r/YourCommunity
```

Look for `Belt request forwarded to Discord`, `ModMail processing failed`, or `Discord webhook failed`. Keep logs private. Investigate the cause and check Discord before manually resending; this app offers no manual replay command or delivery history screen.

## Local checks and further help

`npm run build` checks whether the app can be packaged locally. `npm run lint` checks source-code rules. Neither command verifies real Reddit-to-Discord delivery. This package currently has no `test` or `type-check` npm script.

`src/util/testEmbed.js` is a separate utility that sends a real Discord message using a separate private configuration. It is not an offline test or part of normal setup; do not run it as a routine check.

For platform help, see Reddit's [Devvit documentation index](https://developers.reddit.com/docs/llms.txt), including its links to Settings & Secrets, Devvit CLI, Playtest, and Logs and Debugging. These explain the platform tools; the behavior described above follows this app's current source and configuration.
