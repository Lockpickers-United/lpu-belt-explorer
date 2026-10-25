# Contributing to the API

From the monorepo root, enter `apps/api`, select Node 24.21.0 from its `.nvmrc`, then run `corepack yarn install --immutable`. Yarn 4.18.0 and `yarn.lock` remain authoritative until Phase 3. The root npm lockfile does not install API dependencies.

Run `corepack yarn validate` from `apps/api` for lint and the complete API unit suite. During implementation, run only directly affected unit tests; reserve full validation for the phase gate. The monorepo root Husky hook validates the web and additionally validates the API when staged API files change. Do not run the former `yarn hooks:install`: it is disabled so it cannot replace the root hook.

Root `.github/workflows/api-ci.yml` validates API changes and constructs the standalone Linux release artifact. Root `.github/workflows/api-deploy-production.yml` is the manual candidate release path; its deploy job is unconditionally disabled until approved Phase 5 transfer. The original API repository remains the sole production release authority. See `.agents/references/production-releases.md` for packaging and release boundaries.

For the initial Phase 1 check, API CI also accepts pushes to the exact `monorepo/phase1-api` branch with the same API path scope. This allows CI on a reviewed branch without a default-branch merge, PR creation or manual dispatch of an unavailable workflow. Pushing that branch still requires explicit authorization. Production deployment remains unconditionally disabled.
