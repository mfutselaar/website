#!/bin/sh

git stash
git checkout cloudflare
git checkout main src package.json package-lock.json eleventy.config.js deploy.sh
git add .

commit=$(git rev-parse main)

git commit -m "${commit}"

git push -u github cloudflare:main

git checkout main
git stash pop