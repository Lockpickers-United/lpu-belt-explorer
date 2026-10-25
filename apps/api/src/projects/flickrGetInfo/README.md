# Flickr-info runtime

The public `GET /flickr-info?id=<photoset-id>` endpoint retrieves a Flickr photoset and returns the media metadata used by the frontend tool. Server startup creates the component runtime and injects its handler into the route.

## Configuration

The endpoint is disabled unless explicitly enabled:

```dotenv
FLICKR_INFO_ENABLED=true
FLICKR_API_KEY=your-flickr-api-key
FLICKR_INFO_TIMEOUT_MS=30000
FLICKR_INFO_MAX_PHOTOS=500
FLICKR_INFO_CONCURRENCY=5
```

An enabled endpoint also requires the shared runtime settings:

```dotenv
LPU_JOB_ENV=local|development|production
ALLOW_PRODUCTION_JOB=true
```

`ALLOW_PRODUCTION_JOB=true` is required only when `LPU_JOB_ENV=production`. Timeout, maximum photos, and concurrency are optional. Their accepted ranges are 1–120 seconds, 1–1,000 photos, and 1–20 concurrent photo lookups.

If `FLICKR_INFO_ENABLED` is absent or `false`, the server still starts and `GET /flickr-info` returns `503` with the code `flickr_info_disabled`. Invalid or incomplete enabled configuration fails server startup.

## Safety properties

- Importing the handler, configuration, or runtime does not load credentials, create a Flickr client, or contact Flickr.
- The Flickr API key comes only from explicit configuration; `USER` and `LOGNAME` have no effect.
- Configuration summaries report only whether a key is configured, never the key itself.
- Photoset IDs are validated before a Flickr client is created.
- Every request gets a fresh abort deadline.
- Photoset and photo metadata are validated before a response is returned.
- Individual photo requests use bounded concurrency, and oversized photosets are rejected.
- Upstream failures use stable status codes and do not expose Flickr error details or stack traces to clients in production.

The endpoint remains public to preserve the existing API contract. The frontend tool that calls it is currently displayed only within the authenticated tools area; that UI restriction is not treated as server-side authorization.
