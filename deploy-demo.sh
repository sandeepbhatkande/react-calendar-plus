#!/bin/bash

# Build the demo
npm run build:demo

# Create a temporary directory for deployment
mkdir -p temp-deploy
cp -r demo-dist/* temp-deploy/

# Create a .nojekyll file to prevent Jekyll processing
touch temp-deploy/.nojekyll

# Switch to gh-pages branch (create if doesn't exist)
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Remove all files except .git
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Copy demo files
cp -r temp-deploy/* .

# Add and commit
git add .
git commit -m "Deploy demo to GitHub Pages"

# Push to gh-pages branch
git push origin gh-pages

# Switch back to main branch
git checkout main

# Clean up
rm -rf temp-deploy

echo "Demo deployed to GitHub Pages!"
echo "Demo URL: https://sandeepbhatkande.github.io/react-calendar-plus/"
