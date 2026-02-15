#!/usr/bin/env sh

# abort on errors
# set -e

# build
npm run build

# commit
git checkout gh-pages
rm -rf *
cp -r ../dist/* .
git add .
git commit -m "deploy"

# push
git push origin gh-pages

# return to master branch
git checkout master