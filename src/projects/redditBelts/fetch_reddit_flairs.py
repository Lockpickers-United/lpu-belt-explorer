import json
import praw
import sys
#from pathlib import Path
#current_directory_pathlib = Path.cwd()
#print(f"Current working directory (using pathlib): {current_directory_pathlib}")
#import os
#print('Current working directory:', os.getcwd())

if len(sys.argv) > 1:
    baseDir = sys.argv[1]
else:
    baseDir = "/Users/error/path"

with open(f"{baseDir}/keys/reddit-keys.json") as f:
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
