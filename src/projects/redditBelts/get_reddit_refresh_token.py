import os
import webbrowser
import socket
import urllib.parse
import requests
import json

with open('../../../keys/reddit-keys.json') as f:
    keys = json.load(f)

CLIENT_ID = keys['client_id']
CLIENT_SECRET = keys['client_secret']
REDIRECT_URI = 'http://localhost:8080'
SCOPE = 'identity modflair read modmail'
USER_AGENT = 'flair-fetch-token-generator'

def get_auth_url():
    return (
        f"https://www.reddit.com/api/v1/authorize?"
        f"client_id={CLIENT_ID}&response_type=code&state=random&"
        f"redirect_uri={urllib.parse.quote(REDIRECT_URI)}&duration=permanent&"
        f"scope={urllib.parse.quote(SCOPE)}"
    )

def wait_for_code():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('localhost', 8080))
        s.listen(1)
        conn, addr = s.accept()
        with conn:
            request = conn.recv(1024).decode('utf-8')
            path = request.split(' ')[1]
            query = urllib.parse.urlparse(path).query
            params = urllib.parse.parse_qs(query)
            code = params.get('code', [None])[0]
            # Send simple browser response
            response = (
                "HTTP/1.1 200 OK\r\n"
                "Content-Type: text/html\r\n\r\n"
                "<html><body><h1>You can close this window.</h1></body></html>"
            )
            conn.sendall(response.encode('utf-8'))
            return code

def get_refresh_token(code):
    auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    headers = {'User-Agent': USER_AGENT}
    response = requests.post('https://www.reddit.com/api/v1/access_token', auth=auth, data=data, headers=headers)
    return response.json().get('refresh_token')

if __name__ == '__main__':
    print("Opening browser to authorize with Reddit...")
    webbrowser.open(get_auth_url())
    code = wait_for_code()
    if not code:
        print("Failed to get code.")
        exit(1)

    refresh_token = get_refresh_token(code)
    if refresh_token:
        print("\n✅ Refresh Token:")
        print(refresh_token)
        print("\n🔐 Save this and use it in your script like so:")
        print("praw.Reddit(..., refresh_token='YOUR_REFRESH_TOKEN')")
    else:
        print("❌ Failed to get refresh token.")
