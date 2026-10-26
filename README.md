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

- `apps/web`: React/Vite source, public assets, tests, scripts and app config. Root npm commands delegate here; build output is `apps/web/dist`.
- `apps/api`: API npm workspace. Web/API share the root lockfile, Node 24.21.0 and npm 11.19.0; run `npm ci` at root. Nested installs preserve standalone API packaging. Follow its `AGENTS.md`.
- `firebase`: unchanged CLI configs, rules and separately installed `firebase/functions` package.
- Root `.env.*`, ignored key files and credentials keep their existing locations. Vite and Vitest explicitly load env files from the root; do not copy secrets into app directories.

Existing ignored files under the former root `public/`, `src/data/` or `scripts/` are left untouched and remain ignored. Clean checkout tests use tracked synthetic fixtures; review local generated data before relocating it into app-owned paths. Do not copy live exports into test fixtures.

Focused commands from root: `npm run test:run -- tests/vitest/SomeRoute.test.jsx` and `npm run e2e -- tests/e2e/viteBundle.spec.js`. For direct tool commands, enter `apps/web` first. Browser tests build and serve the relocated app with existing loopback-only restrictions.

## Github Hooks
* [Build-N-Deploy](/.github/workflows/build.js.yml)
    * Candidate migration hold: disabled for every event until the approved release transfer. Intended trigger after release: scoped main push, Import completion or manual dispatch.
    * Action(s): Builds application with `npm run ci-build` then kicks off gh page action to deploy
* [Import](/.github/workflows/import.js.yml)
    * Candidate migration hold: disabled until the approved live-data/release step; intended trigger is workflow dispatch.
    * Action(s): Runs `npm run import` which updates the data then auto commits back to repository
* [PR](/.github/workflows/pr.js.yml)
    * Trigger: On Pull Request
    * Action(s): Gets PR ready with `npm run ci-pr` which lints and builds application

## Build/Deploy
Production publication is approval-gated and the candidate workflow is disabled during migration. The release-only command below generates/exports artifacts and is not a validation shortcut:
* `npm run ci-build`

## Import/Export data

Live imports/exports and administrative jobs require separate explicit approval. Root npm jobs execute from `apps/web`; standalone legacy routines retain their existing subdirectory/CWD assumptions and require inspection before use. App-owned files use `apps/web/scripts` and `apps/web/src/data`. Preparing this move does not authorize running them. Once approved:
```
npm run import
```

For export, run one of the following:
* `npm run exportCsv`
* `npm run exportMd`
* `npm run exportHtml`

There's also a Dan import
```
npm run import-dan
```

# Links

* [LPU Belts Website](https://lpubelts.com)
* [Github Repo](https://github.com/Lockpickers-United/lpu-belt-explorer)
* [Discord](https://discord.gg/lockpicking)
* [Reddit](https://www.reddit.com/r/lockpicking/)
* [Wiki](https://www.reddit.com/r/lockpicking/wiki/generalwiki)
* [Belt Ranking Information](https://www.reddit.com/r/lockpicking/wiki/beltranking)
