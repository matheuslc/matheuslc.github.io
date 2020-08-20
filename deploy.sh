#!/bin/bash

# If a command fails then the deploy stops
set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
../hugo/./hugo -t 'monopriv'

git branch -D gh-pages
git checkout -b gh-pages

shopt -s extglob
rm -r !(public|CNAME)

cd public
mv !(index.xml) ../
cd ..
git add .
git commit -m "Remove everything except public package"
git push -f origin gh-pages
git checkout master

printf "\033[0;32mDONE DONE DONE DONE...\033[0m\n"
