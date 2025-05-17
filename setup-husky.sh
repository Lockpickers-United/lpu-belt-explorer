#!/bin/bash

# Exit immediately on error
set -e

echo "🔧 Installing Husky..."
yarn add husky --dev

echo "🧰 Setting up Husky Git hooks..."
npx husky install

echo "📦 Adding 'prepare' script to package.json..."
# Uses jq to avoid manual edits
if ! grep -q '"prepare"' package.json; then
  jq '.scripts.prepare = "husky install"' package.json > tmp.$$.json && mv tmp.$$.json package.json
fi

echo "🧪 Adding pre-commit lint hook..."
npx husky add .husky/pre-commit "yarn eslint \"./src/**\" \"./scripts/**\" --max-warnings=0"

echo "📁 Ensuring .husky/_/husky.sh is included..."
# Modify ignore rule so husky.sh is not excluded
if [ -f .husky/_/.gitignore ]; then
  echo -e "*\n!husky.sh" > .husky/_/.gitignore
fi

echo "📥 Staging Husky files for Git..."
git add .husky/pre-commit .husky/_/husky.sh .husky/_/.gitignore

echo "✅ Husky setup complete. Hooks will now run on commit."
