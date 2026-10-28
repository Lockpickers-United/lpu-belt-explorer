# lpu-belt-explorer
An interactive web app for exploring the Lockpickers United belt ranking system.

[LIVE - LPU Belts Website](https://lpubelts.com)

# Table of Contents

* [How to Contribute](#how-to-contribute)
* [Getting Started (Local Setup)](#getting-started-local-setup)
    * [Run Locally](#run-locally)
    * [Github Hooks](#github-hooks)
    * [Build/Deploy](#builddeploy)
    * [Import/Exort Data](#importexport-data)
* [Links](#links)

# How To Contribute
* Data contributions
    - [Photos of Locks](https://lpubelts.com/#/content) 
    - [Submit Locks](https://lpubelts.com/#/rankingrequests/submit) not on the site
    - For other data contributions, ask in [LPU Discord](https://discord.gg/lockpicking)
* Code/Feature contributions   
    One of the following
    - Submit an issue and discuss first
    - Discuss in [LPU Discord #belt-explorer Channel](https://discord.gg/lockpicking)


# Getting Started (Local Setup)

* Install [Node.js](https://nodejs.org/en) 24 LTS. The tested release is recorded in `.nvmrc`; with nvm, run `nvm install` and `nvm use`.
* Clone [repo](https://github.com/Lockpickers-United/lpu-belt-explorer)


## Run locally
* On initial setup and package.json changes
    - Run `npm ci` from the repository root; this installs the `apps/web` and `apps/api` workspaces plus root tooling. Functions retains its separate installation.
* To stand up locally
    - Run `npm run dev`

## Package layout

- `apps/web`: React/Vite source, public assets, tests, scripts and app config. Common root npm commands delegate here; build output is `apps/web/dist`.
- `apps/api`: API npm workspace. Web/API share the root lockfile, Node 24.21.0 and npm 11.19.0; run `npm ci` at root. Nested installs preserve standalone API packaging. Follow its `AGENTS.md`.
- `firebase`: unchanged CLI configs, rules and separately installed `firebase/functions` package.
- Web `.env.dev`, `.env.local`, `.env.production` and synthetic `.env.test` live in `apps/web`. Vite and Vitest load that directory whether npm is invoked from root or the workspace. For local development, the owner privately supplies ignored `apps/web/.env.keys`; it is excluded in test mode. Shell variables retain precedence, followed by the existing Vite mode/local-file precedence. API local configuration stays in `apps/api/.env.local`; production API settings remain in the host's protected `shared` directory.

The monorepo is the sole web/API release source. The owner marked the last old API publication final and archived `explore-lpubelts-com-node` on GitHub (authenticated `archived=true` verified). Preserve that repository as history; direct API fixes and dependency changes here. Neal Bayless coordinates release/settings changes. API CI and root Dependabot cover the API workspace through the shared lockfile; retain existing GitHub protection policy. See the [Phase 5 ledger](internal-docs/monorepo/monorepo-phase5-runbook.md) for release identities, retained recovery artifacts and remaining manual-workflow gates.

Existing ignored files under the former root `public/`, `src/data/` or `scripts/` are left untouched and remain ignored. Clean checkout tests use tracked synthetic fixtures; review local generated data before relocating it into app-owned paths. Do not copy live exports into test fixtures.

The root keeps common development and verification shortcuts plus API/combined checks. Specialized web commands live only in `apps/web/package.json`: run `npm run <script> --workspace=apps/web -- <args>` from root, or enter `apps/web` and use `npm run <script> -- <args>`.

`npm test` starts both web and API Vitest suites concurrently in watch mode; `npm test -- --run` runs both once and fails if either suite fails. Arguments are forwarded to both suites, with file filters relative to each app. Use `npm run test --workspace=apps/web` or `npm run test:api` to watch only one app. The `test:run`, `test:ci`, and `test:coverage` root shortcuts remain web-only.

Focused commands from root: `npm run test:run -- tests/vitest/SomeRoute.test.jsx`, `npm run test:api -- --run src/api/services/discordBeltRequestService.test.js`, and `npm run e2e -- tests/e2e/viteBundle.spec.js`. For direct tool commands, enter the relevant workspace first. Browser tests build and serve the relocated app with existing loopback-only restrictions.

## Github Hooks
* [Web - Build & Deploy](/.github/workflows/web-build.js.yml)
    * Enabled by Phase 5: scoped main push, successful same-repository main Import completion or manual main dispatch. A merge matching its path filters publishes Pages and uploads seven catalogs to both API environments; obtain approval for those effects.
    * Action(s): Builds application from `apps/web` with `npm run ci-build` then kicks off gh page action to deploy
* [Web - Import](/.github/workflows/web-import.js.yml)
    * Manual dispatch on main only, restored under question 23. Obtain separate approval before a live import; its successful completion triggers the existing Pages/catalog release.
    * Action(s): Runs `npm run import` from `apps/web`, which updates the data then auto commits back to repository
* [Web - PR Check](/.github/workflows/web-pr.js.yml)
    * Trigger: On Pull Request
    * Action(s): Gets PR ready with `npm run ci-pr` which lints and builds application

## Build/Deploy
Production publication is approval-gated. Web publication is enabled; API production deployment is manual, confirmed and main-only through `.github/workflows/api-deploy-production.yml` and the `api-production` environment. Web - Import is manual-only/main-only; each actual dispatch still requires separate approval. The development-only catalog uploader workflow has been removed. The release-only command below generates/exports artifacts and is not a validation shortcut:
* `npm run ci-build --workspace=apps/web`

## Import/Export data

Live imports/exports and administrative jobs require separate explicit approval. Web workspace npm jobs execute from `apps/web`; standalone legacy routines retain their existing subdirectory/CWD assumptions and require inspection before use. App-owned files use `apps/web/scripts` and `apps/web/src/data`. Preparing this move does not authorize running them. Once approved:
```
npm run import --workspace=apps/web
```

For export, run one of the following:
* `npm run exportCsv --workspace=apps/web`
* `npm run exportMd --workspace=apps/web`
* `npm run exportHtml --workspace=apps/web`

There's also a Dan import
```
npm run import-dan --workspace=apps/web
```

# Links

* [LPU Belts Website](https://lpubelts.com)
* [Github Repo](https://github.com/Lockpickers-United/lpu-belt-explorer)
* [Discord](https://discord.gg/lockpicking)
* [Reddit](https://www.reddit.com/r/lockpicking/)
* [Wiki](https://www.reddit.com/r/lockpicking/wiki/generalwiki)
* [Belt Ranking Information](https://www.reddit.com/r/lockpicking/wiki/beltranking)
