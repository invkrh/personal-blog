#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

if ! [ -e ./public ]; then
  git submodule add -b master git@github.com:invkrh/invkrh.github.io.git public
fi

rm -rf ./public/*

# Build the project.
hugo

cp CNAME ./public

hash_tag=$(git log --pretty=format:'%h' -n 1)

# Go To Public folder
cd public
# Add changes to git.
git add -A

# Commit changes.
msg="Rebuild site on $hash_tag"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master -f

# Come Back
cd ..
