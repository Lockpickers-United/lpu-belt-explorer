# JavaScript API Creation Outline

## Recommendation

Extend this repo, but keep the new API as a small, isolated module inside the existing Express server.

`../../lpubeltsApiServer.js` is already an Express API process with CORS, Helmet, JSON limits, logging, request IDs, centralized errors, and route registration. `src/routes.js` already uses lazy route loading, which is good for production memory.

Starting a second Node service would usually cost more memory because it would require another Node runtime, another Express app, another Firebase client, another logging stack, and related infrastructure. If production memory is tight, one process with lazy routes is usually better than two processes.

The exception would be if this new API could replace the current server or run without most of this project’s large dependencies. That is not the expected case because most current routes will continue running. This repo has a large dependency set, including Firebase, Sharp, Google APIs, Flickr, Reddit, email, geoip, and other libraries. Disk size is not the same as runtime memory, but accidental top-level imports of those packages can increase RAM.

## Known Decisions

- Most current routes will continue running.
- Generated JSON summaries are small: almost all are under `1 MB`, and most are under `200 KB`.
- The first version of the API will be public read-only.
- Future versions may include public read-only, authenticated user-specific, and admin-only endpoint types.
- Production deployment is DreamHost using PM2.
- Pre-generated summaries are acceptable for many endpoints.
- Pre-generated summaries are required for endpoints that involve heavy Firebase queries or long processing time.
- Live Firebase data is preferred for some endpoints where freshness matters.

These answers strengthen the recommendation to extend the existing server instead of starting a separate service. Since the summaries are small, lazy-loading and modest in-memory caching are reasonable. The main memory risk is less about summary file size and more about accidentally importing heavy modules or initializing Firebase clients more than once.

## General Steps

### 1. Define the API contract first

Decide:

- What endpoints exist.
- What each endpoint returns.
- Whether data is public or authenticated.
- Whether clients need filtering, sorting, pagination, or search.
- Whether responses come directly from Firebase, generated JSON summaries, or both.

Example endpoint shape:

```txt
GET /api/v1/locks
GET /api/v1/locks/:id
GET /api/v1/stats/collections
GET /api/v1/users/:id/summary
GET /api/v1/search?q=...
```

### 2. Create a dedicated API route module

Add a small API area, for example:

```txt
src/api/index.js
src/api/firebase.js
src/api/summaryStore.js
src/api/routes/locks.js
src/api/routes/stats.js
```

Then mount it from `src/routes.js`:

```js
app.use([`${prefix}/api`, `/${prefix}/api`], api)
```

The API module itself is intentionally lightweight. Firebase-backed user profile code still imports Firebase lazily only when a user endpoint needs it.

### 3. Centralize Firebase initialization

Do not initialize Firebase separately in multiple route files. Create one shared Firebase Admin module that initializes once and exports `getDb()`.

This matters because the current project already has Firebase initialization in multiple places. For the new API, use one singleton-style module to avoid duplicate clients and unnecessary memory.

### 4. Treat generated JSON summaries as cached read models

If the summaries are generated periodically, avoid recomputing them inside request handlers.

Recommended pattern:

- Cron/script generates summary JSON.
- API reads the summary file.
- API caches parsed JSON with a short TTL or reloads based on file modified time.
- Small summaries under `1 MB` may be cached in memory.
- Split summaries by endpoint/topic when it keeps the API simpler or avoids loading unrelated data.

Avoid this for large files:

```js
import hugeSummary from './summary.json' with { type: 'json' }
```

That loads the file at module initialization and keeps it resident.

Prefer lazy file reads with caching:

```js
let cached
let cachedAt = 0

export async function getSummary() {
  if (cached && Date.now() - cachedAt < 60_000) return cached

  const raw = await fs.readFile(summaryPath, 'utf8')
  cached = JSON.parse(raw)
  cachedAt = Date.now()
  return cached
}
```

### 5. Keep request handlers thin

Each endpoint should mostly do:

```txt
validate request -> fetch data -> shape response -> return JSON
```

Move Firebase reads and JSON-summary reads into separate modules. That keeps the route layer simple and makes testing easier.

### 6. Design for low memory

For this project, prioritize:

- Lazy-load new API routes.
- Avoid top-level imports of heavy packages unless needed.
- Avoid loading JSON files at server startup.
- Cache small generated summaries only after first request.
- Paginate Firebase reads.
- Select only needed Firestore fields where possible.
- Do not cache unbounded datasets in memory.
- Split larger or unrelated generated summaries into smaller endpoint-specific files.
- Avoid importing existing scripts directly if they pull in unrelated dependencies.
- Extract shared data logic instead of reusing whole export/process scripts.
- Reuse the existing PM2 process unless memory measurements show the API needs isolation.

### 7. Add validation and error handling

The server already has centralized error handling. Add request validation at the route level using either `zod` or `joi`; both are already in `package.json`.

Example:

```js
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25)
})
```

### 8. Add auth only where needed

If the API is public, keep it read-only and rate-limit/cache aggressively.

For the first version, design the route structure so public endpoints do not require auth middleware.

If later versions expose user-specific or admin data, reuse or adapt the existing Firebase auth flow from `src/util/authenticateRequest.js`, but keep it optional per-route rather than global.

Recommended future grouping:

```txt
/api/v1/public/...   public read-only
/api/v1/user/...     authenticated user-specific
/api/v1/admin/...    authenticated admin-only
```

All versioned API success responses should use this general envelope:

```json
{
  "metadata": {
    "source": "firebase | generated-summary",
    "updatedDateTime": "present when source has a known update timestamp",
    "fetchedDateTime": "present when data is fetched live"
  },
  "data": {}
}
```

### 9. Add tests before production

At minimum:

- Health endpoint still works.
- Each new endpoint returns expected shape.
- Bad inputs return `400`.
- Missing records return `404`.
- Firebase failures return clean `500` responses.
- Large summary responses do not blow memory.

The project already has `vitest` and `supertest`, so this fits the current stack.

### 10. Measure production memory before and after

Do not rely only on intuition. Add simple logging around startup and after first API hit:

```js
logger.info({ memory: process.memoryUsage() }, 'memory snapshot')
```

Measure:

- Fresh server startup.
- After first hit to existing routes.
- After first hit to new API.
- After loading summary JSON.
- Under repeated requests.

## Open Questions

Answered:

1. Most current routes will continue running.
2. Almost all generated JSON summaries are under `1 MB`, and most are under `200 KB`.
3. The API starts as public read-only, with possible authenticated user-specific and admin-only endpoints later.
4. Deployment is DreamHost using PM2.
5. Pre-generated summaries are fine in many cases and required for heavy processing; live Firebase data is preferred for some freshness-sensitive endpoints.

Remaining questions:

1. Which endpoints should be included in version 1?
2. Which endpoints require live Firebase data versus generated summary files?
3. Where will generated summary JSON files live in production?
4. How often will summary files be regenerated?
5. Should public endpoints include HTTP cache headers for browser/proxy caching?

## Default Architecture

Keep this repo and the existing PM2 process. Add a small `/api` module, centralize Firebase access, serve generated summaries as lightweight cached read models, and avoid importing existing export scripts directly into request handlers.

For version 1, make the API public read-only and favor pre-generated JSON summaries where freshness is not critical. Use live Firebase reads only for endpoints that need current data. Measure process memory before and after first API use to confirm that the new module does not materially increase the production footprint.
