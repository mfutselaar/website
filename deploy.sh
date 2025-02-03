#!/bin/sh

git checkout main src package.json package-lock.json eleventy.config.js
git add .

commit=$(git rev-parse main)

git commit -m "${commit}"

#git push -u github cloudflare:main