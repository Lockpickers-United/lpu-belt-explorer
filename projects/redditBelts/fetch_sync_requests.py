import json
import praw
import re
import time
import os

from praw.exceptions import RedditAPIException
from prawcore.exceptions import TooManyRequests   #  catch raw 429s

print('Current working directory:', os.getcwd())

with open('../../keys/reddit-keys.json') as f:
    keys = json.load(f)

reddit = praw.Reddit(
    client_id=keys['client_id'],
    client_secret=keys['client_secret'],
    refresh_token=keys['refresh_token'],
    user_agent='modmail-fetch',
    ratelimit_seconds=1800,   # let PRAW sleep up to 30 min on its own :contentReference[oaicite:0]{index=0}
)

sub = reddit.subreddit('lockpicking')
print(f"Subreddit: {sub.modmail.unread_count()}")

mod_names = {mod.name for mod in sub.moderator()}
discord_requests = []

# list all conversations (state='all') with no limit
for convo in sub.modmail.conversations(state='archived', limit=None):
    try:
        for msg in convo.messages:  # ModmailConversation.messages attribute :contentReference[oaicite:3]{index=3}
            msg_body = re.sub(r'\n', '|',
                      re.sub(r'<.*?>', '',
                             msg.body.lower()))

            if 'discord' in msg_body and msg.author.name not in mod_names:
                print(f'{msg.author}||{convo.id}||{convo.last_updated}||{msg_body}')
                discord_requests.append({
                    'author': msg.author.name,
                    'convo_id': convo.id,
                    'last_updated': convo.last_updated,
                    'msg_body': msg_body,
        })

    except RedditAPIException as e:
        if e.error_type == 'RATELIMIT':
            # extract “X minutes” from PRAW’s message
            m = re.search(r'(\d+)\s+minute', e.message)
            wait = int(m.group(1)) * 60 if m else 5
            print(f'PRAW rate-limit hit, sleeping {wait+1}s…')
            time.sleep(wait + 1)
            continue
        raise

    except TooManyRequests as e:
        # raw 429 from prawcore; look for a Retry-After header
        retry_after = int(e.response.headers.get('retry-after', 5))
        print(f'HTTP 429 received, sleeping {retry_after}s…')
        time.sleep(retry_after + 1)
        continue

    # throttle yourself between conversations
    time.sleep(2)   # ~30 requests/minute :contentReference[oaicite:1]{index=1}


print(json.dumps(discord_requests, indent=2))

with open('RedditSyncRequests.json', 'w', encoding='utf-8') as fp:
    json.dump(discord_requests, fp, ensure_ascii=False, indent=2)

print('Wrote', len(discord_requests), 'entries to RedditSyncRequests.json')
