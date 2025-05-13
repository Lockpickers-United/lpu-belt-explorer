import json
import praw

reddit = praw.Reddit(
    user_agent="flair-counter-script by u/mgsecure",
    client_id="get from keys",
    client_secret="get from keys",
    username="get from keys",
    password="get from keys",
)

subreddit = reddit.subreddit("lockpicking")
# print(subreddit.description)

flair_data = []
for flair in subreddit.flair(limit=None):
    flair_data.append({
        'user': flair['user'].name,
        'flair_text': flair['flair_text'],
        'flair_css_class': flair['flair_css_class']
    })

with open('data/redditBelts.json', 'w', encoding='utf-8') as f:
    json.dump(flair_data, f, indent=2)

with open('data/belts.txt', 'w', encoding='utf-8') as f:
    for flair in subreddit.flair(limit=None):
        f.write(str(flair))
