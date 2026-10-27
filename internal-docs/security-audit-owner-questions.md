# Security audit: owner questions and actions

Report: https://free.pentesttesting.com/report/ceb76037-00b4-41b4-9e8c-9561f47a31e4

Updated: 2026-10-26. Review needed. Record answers below; no hosting change,
production test, deployment, DNS change, or preload submission is authorized by this document.

## 1. Choose a response-header strategy

**Owner decision needed:** Should we prepare a move from GitHub Pages to Firebase
Hosting, retain Pages behind a header-configurable edge proxy, or retain Pages
and document its remaining limitations?

Recommendation: evaluate Firebase Hosting first because the app already uses
Firebase. Its custom response headers can be managed in version control. Confirm
bandwidth/storage costs against actual traffic before selecting it. This is a
recommendation to prepare a migration, not authorization to deploy or change DNS.

Owner answer:

Owner action: select an option and identify who manages DNS and hosting access.
Do not put credentials in this file. A migration must preserve the custom domain,
static exports, OAuth callbacks, cache behavior, rollback, and the existing web
workflow's separate API snapshot uploads. Moving hosting alone does not fix an
application vulnerability.

Remaining header work: framing protection (`frame-ancestors`, with
`X-Frame-Options` where appropriate), `X-Content-Type-Options: nosniff`, a tailored
Permissions-Policy, and HSTS management. Review COOP/COEP/CORP for compatibility
and actual need rather than enabling all three just to satisfy a scanner.

Reference: https://firebase.google.com/docs/hosting/full-config#headers

## 2. Obtain evidence for the open-redirect claim

**Owner information needed:** Provide the scanner's exact request URL, redirect
chain/Location headers or browser reproduction, and expected versus observed
destination. The public report says only "Open redirect: found" and supplies no
payload. Request this evidence from the scanner vendor if unavailable.

Owner answer / evidence:

Local review found fixed internal React route redirects and allowlisted Discord
callback destinations; it did not establish a reproduction of the reported
issue. External links are not by themselves an open redirect. The claim remains
unverified, not closed. No production probing was performed.

## 3. Inventory subdomains before strengthening HSTS

**Inventory received; all listed subdomains support HTTPS per the owner.** The report's existing
`max-age=31556952` already exceeds one year; its duration does not need increasing
to meet the stated one-year minimum.

Owner answer (2026-10-26): the following known subdomains all support HTTPS,
as reported by the owner:

- `api-dev.lpubelts.com`
- `api.lpubelts.com`
- `assets.lpubelts.com`
- `beta.lpubelts.com`
- `content.lpubelts.com`
- `data.lpubelts.com`
- `dev.lpubelts.com`
- `explore.lpubelts.com`
- `img.lpubelts.com`
- `share.lpubelts.com`
- `video.lpubelts.com`

The owner identified `video.lpubelts.com` as a DNS-only entry and subsequently
confirmed that `https://video.lpubelts.com/` is served over HTTPS. This resolves
the outstanding HTTPS-support clarification for that entry.

This records owner-provided inventory, not independent DNS/TLS verification.
No live checks or configuration changes were performed.

Owner action: confirm inventory completeness and HTTPS coverage for any other
active or nested subdomains before enabling `includeSubDomains` on a
header-capable host. Treat browser preload submission as a separate explicit
decision after checking eligibility and rollback implications. HTML meta tags
cannot configure HSTS.

Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security

## 4. Arrange authentication and deployment verification

**Owner action needed before release:** Arrange a controlled preview smoke test
for Google sign-in, Discord/Reddit callbacks, photo/HEIC uploads, native forms,
and embedded content. Actual account/service interactions require separately
authorized testing; automated browser tests here remain offline.

Owner answer / tester:

The current meta policy deliberately does not add `script-src`, `default-src`,
`connect-src`, or style/image/frame allowlists. It blocks inline event-handler
attributes but does not prevent injected script elements or `eval`. A full
script-source policy needs Firebase/Google authentication compatibility testing;
the SDK dynamically loads Google's API script, and Vite development injects an
inline refresh script. Prefer report-only testing on the chosen header-capable
host before enforcement. Meta CSP cannot run in report-only mode or enforce
`frame-ancestors`. Keep the policy ahead of resource loads.

Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP

## Current local remediation and audit status

- Preserved the owner's existing early meta referrer policy and baseline CSP in
  `apps/web/index.html`.
- Extended that CSP with `form-action 'self'` and `script-src-attr 'none'`.
  Native cross-origin form submissions and inline event attributes are blocked;
  React handlers and fetch-based uploads use separate mechanisms.
- Added offline browser checks for real CSP enforcement and cross-origin
  referrer behavior.
- Scope is the React entry document. Generated static HTML pages do not inherit
  its meta tags and need a separate review or a site-wide response-header policy.
- API source uses the shared Helmet policy described below and disables
  Express's X-Powered-By header. This is source evidence, not verification of
  deployed API/proxy headers.
- "CMS version exposed: skipped: budget" is inconclusive scanner output. The
  React entry HTML has no generator tag; obtain a concrete affected URL/version
  before treating this as a confirmed exposure.
- Server/version header suppression is hosting/proxy-controlled. Retest after a
  separately approved release, retain response/browser evidence, validate TLS
  (the scanner could not fully validate it), and document provider limitations.
- No dependency vulnerability evidence was supplied by this report, so no
  package versions or lockfiles were changed for this task.

## API scan and local remediation (2026-10-26)

Report: https://free.pentesttesting.com/report/d5b0a86a-1c8a-4a49-8411-4246ec8667d3

The owner authorized the following local source changes; deployment and live
verification remain separate:

- Extracted the API landing page's inline styles into `apps/api/public/styles.css`
  and removed the `BBEdit 14.0` generator meta tag. The tag identifies an editor,
  not evidence of a running CMS; the scanner's "skipped: budget" result does not
  establish a CMS vulnerability.
- Replaced bare Helmet setup with shared security middleware. Its CSP overrides
  `style-src` and `font-src` to `'self'`, removing broad HTTPS allowances and
  inline-style permission while preserving Helmet's other defaults. The original
  inline allowance was for styles, not scripts.
- Added `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- Preserved existing framing, referrer, HSTS, COOP/CORP and script protections.
  Kept `X-XSS-Protection: 0` to disable obsolete browser XSS filtering. Did not
  enable COEP or HSTS preload merely to satisfy scanner suggestions.
- Added offline Supertest coverage for landing-page, JSON and 404 security
  headers, stylesheet delivery and removal of inline styles/generator metadata.
  The existing development stack tests now use the same security middleware.

Remaining evidence/actions:

- Obtain the exact disclosed server/version header. Express already disables
  `X-Powered-By`; suppression of headers added by DreamHost's reverse proxy must
  happen at that layer or a separately configured edge proxy. The report does
  not identify the header/value, so no hosting configuration was changed.
- Obtain the API scanner's exact open-redirect URL and redirect chain. Its
  "found" result supplies no reproduction and remains unverified.
- CORS was not evaluated by the scanner. Production source requires explicit
  configured origins; this does not verify deployed configuration.
- Verify final headers, landing-page rendering and API behavior after a
  separately authorized deployment. No production probing or deployment was
  performed for this patch.

## Local verification

API patch:

- Targeted ESLint for the middleware, server entry point and affected tests: passed.
- `npm run validate:api`: passed API lint and 93 test files / 485 tests.
- The initial focused test run was blocked by sandbox socket restrictions;
  permitted offline validation ran successfully. The first full run exposed a
  new test fixture using Express's default HTML 404, which overrides CSP;
  the fixture now matches production's JSON 404 and asserts its status.
- Production headers, browser rendering and scanner results remain unverified
  until a separately authorized deployment and live checks.

Earlier web patch:

- `npm run ci-pr`: passed lint, 53 Vitest files / 284 tests, and the test-mode
  build. The build reported its existing oversized-chunk advisory; no bundle
  configuration was changed.
- `npm run e2e -- tests/e2e/securityPolicy.spec.js tests/e2e/locks.spec.js tests/e2e/contentRoutes.spec.js`:
  11 passed. Includes policy enforcement, referrer behavior, desktop/mobile
  browsing, filters, hash navigation and the anonymous sign-in prompt.
- `node --check apps/web/tests/e2e/securityPolicy.spec.js`: passed.
- The first browser invocation could not bind the loopback preview server in
  the sandbox; the permitted rerun used the same offline fixtures. The initial
  security test then exposed Playwright waiting for a navigation commit after a
  CSP-blocked form submission. The test now verifies the live document URL
  directly after observing the violation. The complete selected suite passed.
- Live sign-in, live service submissions, TLS checks and production rescanning
  were not run. No publication or hosting/DNS changes were made.
