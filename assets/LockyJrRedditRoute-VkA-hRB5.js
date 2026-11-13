import{a as e}from"./rolldown-runtime-B0Z9INg1.js";import{J as t,st as n}from"./utils-B19WLMKm.js";import{t as r}from"./Nav-D_MaXNuf.js";import{l as i}from"./chunk-OB3PAWPO-8ALKzXFc.js";import{t as a}from"./Card-D4wtRY-r.js";import{t as o}from"./CardContent-CKQXaiTc.js";import{t as s}from"./Footer-IJRCxFaA.js";import{t as c}from"./usePageTitle-CwC4t4yx.js";import{t as l}from"./lib-HwqKOE2t.js";import{t as u}from"./lib-CX0BJfxx.js";var d=e(n(),1),f=`# Locky Jr. Privacy Policy

Last updated: November 5, 2026

Locky Jr. helps community moderators review belt requests by forwarding matching Reddit modmail messages to a Discord channel chosen for that community's installation.

## Information the app accesses and uses

When Reddit sends a modmail event, the app receives event information and retrieves the conversation to locate the triggering message. This can include messages that are not ultimately forwarded. The app reads conversations without marking them as read.

For messages containing \`@LockyJr\` and a recognized belt request, the app sends Discord the message author's Reddit username and profile link, the conversation participant's username, the requested belt, available event-author flair, a conversation identifier and link, and up to 1,024 characters of message text. Any evidence links, notes, or other information within that text may be included. If the message includes \`sync @username\`, the app also sends that Discord username; it does not verify ownership or link accounts.

Matching moderator replies and private moderator notes can also be forwarded. A private-note label does not limit who can read the message in Discord.

## Why information is used and who receives it

Information is used to deliver belt requests for moderator review and to diagnose delivery problems. Discord receives forwarded information through the installation's configured webhook. People and integrations with access to the destination channel may access those messages. Community moderators control the destination and should restrict channel access appropriately.

The app stores the installation's webhook URL through Reddit's settings service. It is an installation setting accessible to authorized moderators, not a Devvit global secret. The app does not use advertising or analytics trackers, sell personal information, or use request information to train AI models.

## Storage and retention

The app does not maintain its own request-history database. However, Reddit hosts the original modmail and app logs, and Discord stores forwarded messages. Logs include incoming modmail event data, parsed request text, delivery identifiers, and errors, including for some messages that are not forwarded. Authorized people with app-log access may see that information.

This version has no automatic deletion schedule for logs, installation settings, or Discord messages. Their retention depends on the relevant platform and the actions of authorized moderators or app maintainers. Deleting a Reddit message or uninstalling the app does not automatically delete Discord copies or existing logs. Reddit and Discord also process information under their own privacy policies: [Reddit](https://www.reddit.com/policies/privacy-policy) and [Discord](https://discord.com/privacy).

## Your choices and privacy requests

Avoid including passwords, financial information, or unrelated sensitive information in modmail. Omitting the request command prevents that message from being forwarded by this app, but does not prevent Reddit from delivering a modmail event or the app from reading the conversation and logging event information.

For questions or requests to access, correct, or delete forwarded information, contact the moderators of the community where you used Locky Jr. through Reddit modmail. Identify the relevant conversation without repeating unnecessary personal information. Moderators can address channel copies and coordinate with the app maintainer about app records, subject to applicable law and platform capabilities. Do not include a \`@LockyJr request\` command in a privacy inquiry. The inquiry itself may still appear in app event logs.

Moderators can uninstall the app to stop future processing for their community. This does not erase information already held by Reddit or Discord.

## Changes

Updates to this policy will appear here with a revised date. Material changes to data practices should be communicated before they take effect.
`,p=`# Locky Jr. Terms of Service

Last updated: November 5, 2026

By installing or using Locky Jr., you agree to these terms. If you do not agree, do not use the app. These terms do not replace your rights under applicable law or your obligations under Reddit's and Discord's terms and policies.

## What the app does

Locky Jr. forwards recognized belt requests containing \`@LockyJr\` from Reddit modmail to the Discord channel configured by the community's moderators. It supports moderation review; it does not approve requests, award belts, verify evidence, or link accounts.

## Information sent and access

Forwarded information includes Reddit usernames and profile links, requested belt, available author flair, conversation identifiers and links, message text, and any Discord username included for synchronization. Matching moderator replies and private moderator notes can also be forwarded. People with access to the destination Discord channel may read this information. Server logs may contain event data and request text.

Do not include passwords, financial information, or unrelated sensitive information in requests. Sending information to Discord creates a separate copy; removing a Reddit message or uninstalling the app does not automatically remove that copy.

## Your responsibilities

Use the app only for legitimate belt-request moderation and only share information you are authorized to share. Do not use it for spam, harassment, impersonation, or unlawful activity.

Installing moderators must inform their community about forwarding, provide any legally required notices and obtain any required permissions, restrict access to the destination channel, and protect the webhook URL. Moderators are responsible for their installation settings and review decisions.

## Availability and limitations

The app is provided as available, without a guarantee of uninterrupted service, successful delivery, accuracy, or fitness for a particular purpose. Messages may fail, be shortened, or appear more than once. Reviewers should check the original modmail and confirm delivery before acting. To the extent permitted by law, the app's maintainers are not liable for losses resulting from its use. Nothing in these terms excludes rights or liability that cannot legally be excluded.

## Stopping use and getting help

You may stop submitting requests through the app at any time. Moderators may uninstall it from their community. For questions, concerns, or requests about forwarded information, contact the moderators of the community where you used the app through Reddit modmail; they control the installation and destination channel and can coordinate with the app maintainer. Do not include \`@LockyJr\` request commands in a private support inquiry.

These terms may be updated as the app changes. The current version and revision date will be available here; material changes should be communicated before they take effect.
`,m=t();function h(){c(`Locky Jr Information`);let e=i().some(e=>e.handle?.route===`reddit.privacy`)?f:p;return(0,m.jsxs)(d.Fragment,{children:[(0,m.jsx)(r,{title:`Locky Jr.`}),(0,m.jsx)(a,{style:{maxWidth:800,marginLeft:`auto`,marginRight:`auto`,marginTop:16,marginBottom:16},children:(0,m.jsx)(o,{children:(0,m.jsx)(l,{rehypePlugins:[[u,{target:`_blank`}]],children:String(e)})})}),(0,m.jsx)(s,{})]})}export{h as default};