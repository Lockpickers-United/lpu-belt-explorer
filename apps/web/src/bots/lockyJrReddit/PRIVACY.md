# Locky Jr. Privacy Policy

Last updated: November 5, 2026

Locky Jr. helps community moderators review belt requests by forwarding matching Reddit modmail messages to a Discord channel chosen for that community's installation.

## Information the app accesses and uses

When Reddit sends a modmail event, the app receives event information and retrieves the conversation to locate the triggering message. This can include messages that are not ultimately forwarded. The app reads conversations without marking them as read.

For messages containing `@LockyJr` and a recognized belt request, the app sends Discord the message author's Reddit username and profile link, the conversation participant's username, the requested belt, available event-author flair, a conversation identifier and link, and up to 1,024 characters of message text. Any evidence links, notes, or other information within that text may be included. If the message includes `sync @username`, the app also sends that Discord username; it does not verify ownership or link accounts.

Matching moderator replies and private moderator notes can also be forwarded. A private-note label does not limit who can read the message in Discord.

## Why information is used and who receives it

Information is used to deliver belt requests for moderator review and to diagnose delivery problems. Discord receives forwarded information through the installation's configured webhook. People and integrations with access to the destination channel may access those messages. Community moderators control the destination and should restrict channel access appropriately.

The app stores the installation's webhook URL through Reddit's settings service. It is an installation setting accessible to authorized moderators, not a Devvit global secret. The app does not use advertising or analytics trackers, sell personal information, or use request information to train AI models.

## Storage and retention

The app does not maintain its own request-history database. However, Reddit hosts the original modmail and app logs, and Discord stores forwarded messages. Logs include incoming modmail event data, parsed request text, delivery identifiers, and errors, including for some messages that are not forwarded. Authorized people with app-log access may see that information.

This version has no automatic deletion schedule for logs, installation settings, or Discord messages. Their retention depends on the relevant platform and the actions of authorized moderators or app maintainers. Deleting a Reddit message or uninstalling the app does not automatically delete Discord copies or existing logs. Reddit and Discord also process information under their own privacy policies: [Reddit](https://www.reddit.com/policies/privacy-policy) and [Discord](https://discord.com/privacy).

## Your choices and privacy requests

Avoid including passwords, financial information, or unrelated sensitive information in modmail. Omitting the request command prevents that message from being forwarded by this app, but does not prevent Reddit from delivering a modmail event or the app from reading the conversation and logging event information.

For questions or requests to access, correct, or delete forwarded information, contact the moderators of the community where you used Locky Jr. through Reddit modmail. Identify the relevant conversation without repeating unnecessary personal information. Moderators can address channel copies and coordinate with the app maintainer about app records, subject to applicable law and platform capabilities. Do not include a `@LockyJr request` command in a privacy inquiry. The inquiry itself may still appear in app event logs.

Moderators can uninstall the app to stop future processing for their community. This does not erase information already held by Reddit or Discord.

## Changes

Updates to this policy will appear here with a revised date. Material changes to data practices should be communicated before they take effect.
