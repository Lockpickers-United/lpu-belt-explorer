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

* Install [node](https://nodejs.org/en) - v22 is needed
* Clone [repo](https://github.com/Lockpickers-United/lpu-belt-explorer)


## Run locally
* On initial setup and package.json changes
    - Run `npm install` inside the parent folder 'lpu-belt-explorer'
* To stand up locally
    - Run `npm run dev`

## Github Hooks
* [Build-N-Deploy](/.github/workflows/build.js.yml)
    * Trigger: On Push to Main
    * Action(s): Builds application with `npm run ci-build` then kicks off gh page action to deploy
* [Import](/.github/workflows/import.js.yml)
    * Trigger: Workflow Dispatch
    * Action(s): Runs `npm run import` which updates the data then auto commits back to repository
* [PR](/.github/workflows/pr.js.yml)
    * Trigger: On Pull Request
    * Action(s): Gets PR ready with `npm run ci-pr` which lints and builds application

## Build/Deploy
Several commmands are linked together for this, here is the shortened version 
* `npm run ci-build`

## Import/Export data

For import, place a data.csv in the scripts folder and run:
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
