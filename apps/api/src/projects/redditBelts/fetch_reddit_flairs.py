import json
import praw
import sys

if len(sys.argv) != 2:
    raise ValueError("Expected the Reddit credentials file path")

credentials_path = sys.argv[1]

with open(credentials_path, encoding="utf-8") as f:
    keys = json.load(f)

reddit = praw.Reddit(
    client_id=keys['client_id'],
    client_secret=keys['client_secret'],
    refresh_token=keys['refresh_token'],
    user_agent='flair-fetch'
)

subreddit = reddit.subreddit("lockpicking")
flair_data = []
for flair in subreddit.flair(limit=None):
    flair_data.append({
        'user': flair['user'].name,
        'flair_text': flair['flair_text'],
        'flair_css_class': flair['flair_css_class']
    })

print(json.dumps(flair_data))
