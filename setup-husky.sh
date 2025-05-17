#!/bin/bash

# Exit immediately on error
set -e

echo "Installing Husky..."
yarn add husky --dev

echo "Setting up Husky Git hooks..."
npx husky init

echo "Adding pre-push lint hook..."
echo "yarn eslint \"./src/**\" \"./scripts/**\" --max-warnings=0" > .husky/_/pre-push

echo "Ensuring .husky/_/husky.sh is included..."
# Modify ignore rule so husky.sh is not excluded
if [ -f .husky/_/.gitignore ]; then
  echo -e "*\n!husky.sh\n!pre-push" > .husky/_/.gitignore
fi

echo "Staging Husky files for Git..."
git add .husky/_/pre-push .husky/_/husky.sh .husky/_/.gitignore

echo "✅ Husky setup complete. Hooks will now run on push."
