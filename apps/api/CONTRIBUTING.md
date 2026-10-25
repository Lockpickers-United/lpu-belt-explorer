# API development in the monorepo

From the monorepo root, select Node 24.21.0 with `nvm use`, verify npm 11.19.0, then run `npm ci`. Web and API share the root lockfile. Root `.npmrc` keeps dependencies nested within each workspace; Firebase Functions retains its separate install.

Run `npm run validate:api` for lint and the complete API unit suite. During implementation use `npm run test:api -- --run path/to/test.js`; reserve full validation for the phase gate. The root Husky hook also validates the API when API files or shared dependency inputs are staged. Do not install the imported API hook over the root hook.

Root `.github/workflows/api-ci.yml` validates API changes and constructs the standalone Linux release artifact. Root `.github/workflows/api-deploy-production.yml` is the manual candidate release path; its deploy job is unconditionally disabled until approved Phase 5 transfer. The original API repository remains the sole production release authority. See `.agents/references/production-releases.md` for packaging and release boundaries.

For the Phase 3 workspace/artifact gate, API CI also accepts pushes to the exact `monorepo/phase3-npm` branch with the same API path scope. This allows CI on a reviewed branch without a default-branch merge, PR creation or manual dispatch of an unavailable workflow. Pushing that branch still requires explicit authorization. Production deployment remains unconditionally disabled.
