#!/usr/bin/env sh

# abort on errors
# set -e

# build
npm run build

# push
git add -f dist
git commit -m "build"
git subtree push --prefix dist origin gh-pages