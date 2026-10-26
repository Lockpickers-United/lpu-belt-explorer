# Operational and diagnostic routes

`registerRoutes()` always mounts these operational probes:

- `GET /health` returns `{ok: true}` as a liveness response.
- `GET /ready` returns `{ready: true}` after server startup has completed runtime initialization.

The following diagnostic routes are mounted only when `enableDiagnosticRoutes` is true:

- `POST /echo` validates and echoes a test message.
- `GET /boom` intentionally throws an error to exercise centralized error handling.

The primary server passes `enableDiagnosticRoutes: NODE_ENV !== 'production'`. The route registrar uses the same expression as its default so production callers that omit the option also fail closed. There is intentionally no production override.

When diagnostics are disabled, `/echo` and `/boom` are not registered and therefore receive the normal `404` response. Both root and prefixed route registrations follow the same gate.
