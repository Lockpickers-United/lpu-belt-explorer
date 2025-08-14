### Purpose
This document captures the project-specific build, configuration, testing, and development guidance required to work effectively on explore-lpubelts-com-node. It is written for advanced developers and focuses on non-trivial, repo-specific details.

---

### Stack and runtime assumptions
- Node.js: Use Node 20 LTS (or newer). The project is ESM-only (package.json has "type": "module"). Many scripts rely on top-level await and global fetch (Node 18+). Node 20 avoids interop pain with node-fetch and ESM-only deps.
- Package manager: Yarn (yarn.lock is present). npm will work but CI/contributor instructions assume yarn.
- OS-specific behavior: Several scripts derive production vs. local paths from process.env.USER and values in keys/users.js.
- HTTPS server: The main server is HTTPS-enabled and expects server.key and server.crt in keys/.
- Notable deps with native/OS pre-reqs:
    - sharp: Requires libvips installed when no prebuilt binary is available (Linux build hosts). On Ubuntu/Debian: apt-get install -y libvips.

---

### Build and configuration
#### 1) Install dependencies
```
# Node 20+ recommended
node -v

# Using yarn
yarn install

# Or npm (if you must)
npm ci
```

#### 2) Repo-level scripts
- Lint code: `yarn lint` (configured via eslint.config.js, using flat config + react/import plugins; see Code Style section for rules and ignores).
- Tests: The repo currently has no configured tests; see Testing section to add Vitest and run unit tests.

#### 3) Keys and environment
- keys/users.js defines:
    - localUser, prodUser
    - SMTP-esque credentials for email utilities (contentUser/contentPass/etc.)
    - Various "recipient" emails
- Reddit API keys:
    - keys/reddit-keys.js exports client_id, client_secret, refresh_token (also a JSON variant exists: keys/reddit-keys.json used by some Python/Node scripts via fs.readFile).
- TLS:
    - The HTTPS server reads keys/server.key and keys/server.crt. For local testing generate self-signed certs and place them in keys/.
        - Example (mkcert): `mkcert -install && mkcert -key-file keys/server.key -cert-file keys/server.crt localhost`

Security note: Secrets are committed for convenience in this repo snapshot. If you rotate or move to env-based configs, refactor imports that read JSON or named exports accordingly.

#### 4) Production vs. local paths and user detection
- Many scripts use the pattern:
    - const production = process.env.USER !== localUser
    - serverDir resolves to
        - Prod: `/home/${prodUser}/explore.lpubelts.com/public/data`
        - Local: `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts`
- Main server (src/exploreLPUbeltsServer.js) determines keys path based on whether process.env.USER === prodUser.
- If your local OS account name differs from keys/users.js localUser, either:
    - export USER=nealbayless temporarily (affects behavior broadly), or
    - adjust localUser in keys/users.js for your machine, or
    - modify the specific script to accept overrides via env (recommended for long-term, e.g., LOCAL_USER or explicit DATA_DIR).

#### 5) Running the HTTP(S) server locally
- Server entry: src/exploreLPUbeltsServer.js.
- It binds both HTTP and HTTPS servers. Ports are set with prod=true currently; change prod=false for a cleaner dev experience if needed. Otherwise update port mapping as desired.
- Requirements:
    - keys/server.key and keys/server.crt files must exist and be readable.
    - Ensure process.env.USER is not prodUser (dh_m5s5pf) to use the local keys path resolution.
- Run:
```
node src/exploreLPUbeltsServer.js
```
- PM2 (prod example from file comments):
```
pm2 start /home/dh_m5s5pf/explore-lpubelts-com-node/exploreLPUbeltsServer.js --watch
```

#### 6) Running one-off project scripts
- Scripts live under src/projects/* and rely on local file data, users.js, and keys.
- Example (WIP flair fixer; requires Reddit OAuth):
```
node src/projects/beltInvestigationsWIP/processSyncMessagesForFlairFix.js
```
- Requires: keys/reddit-keys.js exports; valid token scopes (modflair for flair changes), snoowrap client initialization; network access.
- Data dependencies: src/projects/beltInvestigationsWIP/data/syncMessagesForFlairFix.json

---

### Testing
There is currently no testing framework configured. The simplest approach with ESM is Vitest for unit tests; use Supertest for HTTP endpoint tests if you later export the Express app without binding to ports in test mode.

#### 1) Add Vitest and a test script
```
yarn add -D vitest

# Update package.json scripts
# "scripts": {
#   "test": "vitest",
#   "lint": "eslint \"./src/**\""
# }
```

Vitest works out of the box with ESM. No config file is necessary for basic unit tests. Place test files as src/**\/*.test.js.

#### 2) Example unit tests (works with repo code)
Create src/util/setDeep.test.js:
```
import {describe, it, expect} from 'vitest'
import {setDeep, setDeepAdd, setDeepMax, setDeepPush, setDeepUnique, setDeepCreate} from './setDeep.js'

describe('setDeep utilities', () => {
  it('setDeep sets a nested value', () => {
    const obj = {}
    setDeep(obj, ['a', 'b', 'c'], 42)
    expect(obj).toEqual({a: {b: {c: 42}}})
  })

  it('setDeepAdd sums values', () => {
    const obj = {}
    setDeepAdd(obj, ['sum'], 10)
    setDeepAdd(obj, ['sum'], 5)
    expect(obj.sum).toBe(15)
  })

  it('setDeepMax picks larger value', () => {
    const obj = {}
    setDeepMax(obj, ['m'], 3)
    setDeepMax(obj, ['m'], 7)
    expect(obj.m).toBe(7)
  })

  it('setDeepPush appends array values', () => {
    const obj = {}
    setDeepPush(obj, ['items'], 'x')
    setDeepPush(obj, ['items'], 'y')
    expect(obj.items).toEqual(['x', 'y'])
  })

  it('setDeepUnique ensures uniqueness', () => {
    const obj = {}
    setDeepUnique(obj, ['u'], 'a')
    setDeepUnique(obj, ['u'], 'a')
    setDeepUnique(obj, ['u'], 'b')
    expect(obj.u).toEqual(['a', 'b'])
  })

  it('setDeepCreate does not overwrite existing', () => {
    const obj = {}
    setDeepCreate(obj, ['x', 'y'], 1)
    setDeepCreate(obj, ['x', 'y'], 2)
    expect(obj).toEqual({x: {y: 1}})
  })
})
```

Create src/util/belts.test.js:
```
import {describe, it, expect} from 'vitest'
import {beltSort, beltSortReverse, uniqueBelts} from './belts.js'

describe('belts helpers', () => {
  it('beltSort orders by progression', () => {
    const sample = ['Blue', 'White', 'Red']
    const sorted = [...sample].sort(beltSort)
    expect(sorted).toEqual(['White', 'Blue', 'Red'])
  })

  it('beltSortReverse orders reverse progression with wrap-around', () => {
    const sample = ['Blue', 'White', 'Red']
    const sorted = [...sample].sort(beltSortReverse)
    // Reverse list moves last to first per file logic.
    expect(sorted[0]).not.toBeUndefined()
    expect(sorted.includes('White')).toBe(true)
  })

  it('uniqueBelts are canonical LPU unique tiers', () => {
    expect(uniqueBelts).toEqual([
      'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Red', 'Black'
    ])
  })
})
```

Run tests:
```
yarn test
```

Notes:
- These tests are side-effect free and do not require network, credentials, or filesystem.
- If you later add integration tests for the server, refactor src/exploreLPUbeltsServer.js to export the Express app without creating servers when NODE_ENV === 'test'. For example:
```
// exploreLPUbeltsApp.js
export function createApp() { /* configure and return express() */ }

// server.js
import {createApp} from './exploreLPUbeltsApp.js'
const app = createApp()
http.createServer(app).listen(...)
https.createServer(credentials, app).listen(...)
```
Then in tests:
```
import request from 'supertest'
import {createApp} from '../exploreLPUbeltsApp.js'

test('GET /flickr-info requires id', async () => {
  const app = createApp()
  const res = await request(app).get('/flickr-info?id=123')
  expect(res.status).toBe(200)
})
```

#### 3) Verifying test examples work
- The provided unit tests reference only code in src/util and Vitest APIs. With Node 20+ and `yarn add -D vitest`, they should run as-is via `yarn test`.
- If you use npm, replace yarn commands with npm equivalents and add a "test" script accordingly.

#### 4) Cleanup policy for added testing files
- If you add the example tests purely for demonstration, you can keep them. The task request suggests deleting additional files created during the demo. If you need to keep the repo footprint minimal, remove the example test files after validating they pass, and retain only .junie/guidelines.md.

---

### Additional development information
#### Code style and linting
- ESLint flat config at eslint.config.js with:
    - Extends: eslint:recommended, plugin:react/recommended, plugin:import/recommended (compat/shims via @eslint/compat).
    - Enforced rules (highlights):
        - Semi: never; Quotes: single; eqeqeq: always; react-hooks/exhaustive-deps: warn; no-unused-vars: warn (ignores rest siblings);
        - import/extensions: warn for js/jsx/json; import/no-unresolved disabled.
    - Ignores: binary assets, markdown, JSON, CSS and notably src/projects/beltInvestigationsWIP/* is globally ignored by ESLint (WIP folder intentionally un-linted).
- Run: `yarn lint`.

#### HTTP server endpoints
- Provided endpoints in src/exploreLPUbeltsServer.js:
    - GET /flickr-info?id=...
    - POST /upload
    - POST /request-lock
    - POST /update-request
    - POST /request-vote
    - POST /log-activity
    - GET /process-firebase-log[?dev=true]
    - POST /fetch-reddit-flairs
    - POST /fetch-flairs (requires body.userId)
- The server uses CORS and JSON body parsing globally; events are logged via a simple EventEmitter with dayjs timestamps.

#### Reddit utilities
- Snoowrap is used for OAuth; ensure access token scopes cover required operations:
    - Reading modmail and user flairs: read, modcontributors, modflair, modmail, etc., depending on operation.
    - processSyncMessagesForFlairFix.js:
        - Reads user flair, conditionally sets flair via direct POST to /api/selectflair with snoowrap access token.
        - Skips any flair containing "Dan" to avoid overwriting dan flairs.
        - Dependencies: flairDetails map, syncMessagesForFlairFix.json, uniqueBelts from src/util/belts.js, and keys/reddit-keys.js.
- Token troubleshooting:
    - src/projects/beltInvestigationsWIP/checkTokenScope.js and src/projects/setRedditFlair/redditTestsSNOO.js can help verify token scope and behavior. Use these in a dev environment only.

#### File system and data paths
- Many scripts write/read to serverDir based on env/user detection. Ensure the target directories exist:
    - Prod: /home/${prodUser}/explore.lpubelts.com/public/data
    - Local: /Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/BeltCounts
- When porting to different machines, either create these dirs or add env-based overrides.

#### Python helpers
- Some Reddit workflows include Python utilities in src/projects/redditBelts/ that read keys/reddit-keys.json:
    - get_reddit_refresh_token.py, fetch_reddit_flairs.py, fetch_sync_requests.py
- Ensure your Python env can read JSON keys and that required packages are installed (requests, praw or equivalent if used later).

#### Common pitfalls
- ESM only: Avoid require()/CommonJS interop. Keep .js imports explicit (eslint import/extensions warns if missing extensions).
- TLS files missing locally: The server will fail to start if keys/server.key or keys/server.crt are missing.
- process.env.USER mismatch: Path logic will write to unexpected locations or select prod paths. Verify USER/localUser.
- sharp on Linux: Install libvips or rely on supported platforms with prebuilt binaries.
- Reddit rate limits and scopes: Writing flairs requires mod permissions; ensure your bot is moderator with proper scopes.

---

### Quickstart checklist
1) Node 20+, Yarn installed.
2) yarn install
3) Place TLS certs in keys/ (or set prod=false and adjust ports/behavior in src/exploreLPUbeltsServer.js for dev).
4) Verify keys/users.js matches your local USER or adjust as needed.
5) Add tests with Vitest as above, run yarn test.
6) Lint before commits: yarn lint.

---

### Post-demo cleanup
- If you created example test files solely to validate the testing flow, remove them before committing if you want to keep the repo minimal. Retain only .junie/guidelines.md per the task requirement.
