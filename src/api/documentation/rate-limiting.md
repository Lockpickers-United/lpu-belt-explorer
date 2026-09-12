# API Rate Limiting

## Purpose

The server uses layered in-memory rate limiting to reduce abuse risk across public endpoints.

Every request first passes through a generous baseline IP limit. Work-producing routes then use independent, stricter IP limits before database access, token verification, file processing, email delivery, logging, or external API calls. Independent counters prevent activity on one route from exhausting another route's allowance.

`GET` and `HEAD` requests to `/health` and `/ready`, including supported proxy-prefixed forms, are exempt so operational monitoring remains reliable. CORS preflight requests are also exempt. Diagnostic routes remain covered by the baseline limiter when they are enabled.

## Current Limits

| Layer or route | Limit per client IP |
| --- | --- |
| Server baseline | 300 requests per minute |
| `/api/v1/users/*` | 60 requests per minute |
| `/api/v1/stats/collections/*` | 120 requests per minute |
| `POST /request-lock` | 10 requests per 10 minutes |
| `POST /update-request` | 30 requests per minute |
| `POST /request-vote` | 60 requests per minute |
| `POST /upload` | 5 requests per 10 minutes |
| `POST /email-form` | 5 requests per 10 minutes |
| `GET /refresh-preview` | 3 requests per 10 minutes |
| `/fetch-reddit-flairs` | 3 requests per 10 minutes |
| `GET /flickr-info` | 20 requests per minute |
| `POST /log-activity` | 120 requests per minute |

Routes not listed separately, including the two read-only local-log routes, receive the baseline limit.

After the limit is exceeded, rejected requests use a sliding backoff:

```txt
Base penalty: 30 seconds
Maximum single penalty: 120 seconds
Maximum Retry-After: 20 minutes
```

Each rejected request during the cooldown extends the reset time. The extension grows exponentially until it reaches the maximum single penalty, and the total `Retry-After` value is capped at `20 minutes`.

This applies to:

```txt
GET /api/v1/users/{id}
GET /api/v1/users/{id}/summary
GET /api/v1/users/{id}/wishlist
GET /api/v1/users/{id}/profile
```

Route-specific limiters run before their protected work. The administrative import and Reddit refresh limiters run before Firebase token verification, protecting both authentication and the downstream jobs.

## Firebase User Profile Cache

The user profile service also caches raw Firestore profile documents in memory:

```txt
Found profiles: 60 seconds
Missing profiles: 10 seconds
Maximum cache entries: 1,000
```

This cache is implemented in:

```txt
src/api/services/userProfileService.js
```

The cache stores the raw profile document by Firebase user ID. That means multiple endpoint shapes can reuse the same Firestore read:

```txt
GET /api/v1/users/{id}
GET /api/v1/users/{id}/summary
GET /api/v1/users/{id}/wishlist
GET /api/v1/users/{id}/profile
```

Missing profile responses are cached briefly to reduce repeated reads from user-ID enumeration attempts. The short `10 second` missing-profile TTL avoids hiding newly created profiles for long.

## Rate-Limited Response

When the limit is exceeded, the API returns `429`:

```json
{
  "error": {
    "message": "Too many requests",
    "code": "rate_limited",
    "requestId": "request id",
    "path": "/api/v1/users/example/summary",
    "method": "GET"
  }
}
```

Development responses may include extra `details`.

## Headers

All rate-limited route responses include:

```txt
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

Rejected requests also include:

```txt
Retry-After
```

`Retry-After` is the number of seconds until the client should try again. During a cooldown, another rejected request can increase this value instead of simply counting down.

Example with the current `/api/v1/users/*` settings:

```txt
00s: request 1 starts the 60-second window
00s: requests 1-60 are allowed
01s: request 61 is rejected; Retry-After is about 89 seconds
10s: another request is rejected; Retry-After increases instead of counting down normally
```

## Implementation Notes

The limiter and its source-controlled policies are implemented in:

```txt
src/api/middleware/rateLimit.js
src/api/middleware/rateLimitConfig.js
```

Rate-limit values are intentionally not loaded from `.env` files. Updating a policy therefore requires a reviewed code change and normal deployment.

It is intentionally dependency-free and stores counters in process memory.

The client key uses Express `req.ip` first. Because production is behind the DreamHost/Apache proxy, the server's `trust proxy` setting must stay aligned with the actual proxy setup or client IP detection may be inaccurate.

`TRUST_PROXY` defaults to `loopback`, which is appropriate when Apache connects to Node over the same host's loopback interface. If Apache connects from another address, set `TRUST_PROXY` to a comma-separated allowlist of its exact IP addresses or CIDRs before restarting the server. The named ranges `loopback`, `linklocal`, and `uniquelocal` are also accepted. Set it to `false` when Node is not behind a proxy.

Blanket trust (`true`, `*`, `all`, `0.0.0.0/0`, or `::/0`) and numeric hop counts are rejected at startup. This prevents a directly connected client from selecting its rate-limit identity with a forged `X-Forwarded-For` header.

This is acceptable for the current DreamHost/PM2 deployment if there is only one active Node process. If the app later runs multiple PM2 cluster workers, multiple servers, or serverless instances, each process will have its own independent counters. At that point, use a shared backing store such as Redis or move rate limiting to the edge/proxy layer.

## Tuning Guidance

The checked-in policy table is the operational source of truth. All route-specific policies currently use a 30-second base backoff, a 120-second maximum single penalty, and a 20-minute maximum `Retry-After`. The baseline uses a shorter 10-second base backoff.

If abuse occurs, lower public user endpoints to:

```txt
30 requests / minute / IP
```

If legitimate clients need more throughput, prefer increasing or tuning the user profile cache before raising the rate limit. Caching repeated reads reduces Firebase cost more directly than rate limiting alone.
