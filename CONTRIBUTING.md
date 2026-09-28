# Contributing

## Local setup

Use Node 24.21.0 from `.nvmrc` and Yarn 4.18.0 from the `packageManager`
declaration in `package.json`:

```sh
nvm use
corepack enable
yarn install --immutable
yarn hooks:install
```

`yarn hooks:install` configures this checkout to use the tracked hooks in
`.githooks`. Git configuration is local to the checkout, so run it once after
cloning. Confirm the setting with:

```sh
git config --get core.hooksPath
```

It should print `.githooks`.

## Validation

Run the complete local validation directly with:

```sh
yarn validate
```

This runs ESLint followed by the complete Vitest suite. The pre-commit hook runs
the same command and also rejects whitespace errors in staged changes with
`git diff --cached --check`. A failed check blocks the commit; correct the failure
and commit again.

The hook validates the current working tree, including unstaged changes. Stage a
coherent change before committing and avoid keeping unrelated failing edits in the
working tree.

## Pull requests

`.github/workflows/pull-request-ci.yml` runs automatically for every pull request.
It checks out the proposed revision without persisted credentials, selects the
Node version from `.nvmrc`, installs the lockfile with `yarn install --immutable`,
and runs `yarn validate`. No repository or production secrets are provided to the
job.

The production deployment workflow runs the same validation command before its
approval-gated deployment job, so pull request, local, and deployment checks stay
aligned.
