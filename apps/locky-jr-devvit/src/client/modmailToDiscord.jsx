//import { MessageData, ModMail } from "@devvit/protos";
import { Devvit } from "@devvit/public-api";

const discordWebhookURLs = [
    "canary.discord.com",
    "ptb.discord.com",
    "discord.com",
    "canary.discordapp.com",
    "ptb.discordapp.com",
    "discordapp.com",
];

const discordWebhookURL = 'https://discord.com/api/webhooks/1562162476009660489/0ttoudTNGegeRmouUzsz6Pq816xCNC1JmK_dOCQYmgemYwZWF-kZMiPx4mu5jIzsBYDW'

Devvit.configure({
    http: true,
    redditAPI: true,
});

Devvit.addSettings([
    {
        type: "string",
        name: "webhook",
        label: "Webhook URL (Discord or Slack)",
    },
    {
        type: "boolean",
        name: "outgoing",
        label:
            "Whether to send outgoing messages by mods to the webhook payload (Enabled by default, if disabled outgoing messages by mods will not be sent to the webhook payload.)",
        defaultValue: true,
    },
    {
        type: "string",
        name: "ignoreUsers",
        label: "Ignore list (comma-separated usernames, don't include u/)",
        helpText:
            "Add Reddit usernames (case-insensitive) separated by commas to skip them from webhook payloads (example: username1, username2, username3). This is totally optional.",
    },
    {
        type: "string",
        name: "rolePing",
        label: "Discord Role ID to Ping",
        helpText:
            "Enter a Discord Role ID to ping when a message is sent. Leave blank to disable. This is totally optional.",
    },
    {
        type: "boolean",
        name: "onlyModDiscussions",
        label: "Only Sync Mod Discussions",
        helpText:
            "If enabled, only mod discussion messages will be sent to the webhook. Messages from users will be ignored.",
        defaultValue: false,
    },
]);

Devvit.addTrigger({
    event: "ModMail",
    onEvent: async (event, context) => {
        try {
            if (!context) throw new Error("Context is probably undefined");
            await sendModMailToWebhook(event, context);
        } catch (error) {
            console.error("There was an error:", error.message);
        }
    },
});

function escapeSlackMrkdwn(text)  {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncateDescription(description, maxLength = 4096) {
    if (description.length <= maxLength) {
        return description;
    }
    const truncationIndicator = "... (truncated)";
    return description.substring(0, maxLength - truncationIndicator.length) + truncationIndicator;
}

async function sendModMailToWebhook(event, context) {
    try {
        const webhook = discordWebhookURL
        const outgoing = (await context.settings.get("outgoing"))
        const ignoreListRaw = (await context.settings.get("ignoreUsers"))
        const rolePing = (await context.settings.get("rolePing")) || undefined;
        const onlyModDiscussions = (await context.settings.get("onlyModDiscussions"))

        const ignoreList = (ignoreListRaw || "")
            .split(",")
            .map((u) => u.trim().toLowerCase())
            .filter(Boolean);

        if (!webhook) {
            console.error("No webhook URL provided");
            return;
        }

        const conversationId = event.conversationId ?? "";
        const actualConversationId = conversationId.replace(
            "ModmailConversation_",
            ""
        );
        const result = await context.reddit.modMail.getConversation({
            conversationId,
            markRead: false,
        });

        const isModDiscussion = result.conversation?.isInternal ?? false;
        if (onlyModDiscussions && !isModDiscussion) {
            console.log("Skipping regular modmail because only mod discussions are enabled.");
            return;
        }

        const modmailLink = `https://mod.reddit.com/mail/all/${actualConversationId}`;
        const messages = result.conversation?.messages ?? {};
        const messageIds = Object.keys(messages);
        const lastMessageId =
            messageIds.length > 0 ? messageIds[messageIds.length - 1] : undefined
        const lastMessage = lastMessageId || undefined
            ? messages[lastMessageId]
            : undefined;

        if (!lastMessage) {
            console.error("No messages found");
            return;
        }

        const authorName = lastMessage.author?.name ?? "Unknown";
        const body = lastMessage.bodyMarkdown ?? "";
        const participatingAs = lastMessage.participatingAs ?? "Unknown";
        const authorProfileLink = `https://www.reddit.com/u/${authorName}`;
        const isPrivateNote = lastMessage.isInternal ?? false;

        if (ignoreList.includes(authorName.toLowerCase())) {
            console.log(`User "${authorName}" is in the ignore list. Skipping webhook.`);
            return;
        }

        if (participatingAs === "moderator" && !outgoing) {
            console.log("Not sending outgoing messages to the webhook");
            return;
        }

        let payload;

        // slack payload
        if (webhook.startsWith("https://hooks.slack.com/")) {
            const slackSubject = escapeSlackMrkdwn(result.conversation?.subject ?? "");
            const slackAuthor = escapeSlackMrkdwn(authorName);
            const slackBody = escapeSlackMrkdwn(body);
            const slackParticipant = escapeSlackMrkdwn(result.conversation?.participant?.name ?? "");
            payload = {
                text: `*Modmail Subject:* <${modmailLink}|${slackSubject}>\n*Author:* <${authorProfileLink}|${slackAuthor}>\n*Body:* ${slackBody}\n\n*Participant:* ${slackParticipant}\n*Participating As:* ${participatingAs}${isPrivateNote ? "\n*Note:* This is a private note." : ""}`,
            };
        }
        // discord payload
        else if (
            discordWebhookURLs.some((url) =>
                webhook.startsWith(`https://${url}/api/webhooks/`)
            )
        ) {
            const description = `**Author:** [${authorName}](${authorProfileLink})\n**Body:** ${body}\n\n**Participant:** ${result.conversation?.participant?.name}\n**Participating As:** ${participatingAs}`;
            payload = {
                content: rolePing ? `<@&${rolePing}>` : undefined,
                embeds: [
                    {
                        title: `${result.conversation?.subject}`,
                        url: modmailLink,
                        author: {
                            name: authorName,
                            url: authorProfileLink,
                        },
                        description: truncateDescription(description),
                        color: isPrivateNote ? 0x00cc66 : 0x3498db, // different colors for private notes and regular messages
                        footer: isPrivateNote ? { text: "📌 Private Moderator Note" } : undefined,
                    },
                ],
            };
        } else {
            throw new Error("This webhook is neither from Slack nor Discord.");
        }

        const response = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Error sending data to webhook");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

export default Devvit;