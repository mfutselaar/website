# README.md

## What am I looking at?

This is the repository for [my website](https://matttt.nl), and specifically a special branch of the repository in my self-hosted
Gitea instance that is accessible by Cloudflare .

The commit messages you see are usually the hash of my local branch main branch where these files have been pulled from.

If you are curious to what my very hacky deploy script looks like, enjoy yourself:

```sh
#!/bin/sh

git stash
git checkout cloudflare
remove=$(ls !(node_modules))
rm -rf $remove
git checkout main src package.json package-lock.json eleventy.config.js README.md
git add .

commit=$(git rev-parse main)

git commit -m "${commit}"

git push -u github cloudflare:main

git checkout main
git stash pop
```

### Why though?

Why not ;)