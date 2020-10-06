Git Bash

Basic Bash Script for updating the packages of a Node.JS Project

Run: npm start

Description:
    1. App.js
        1. Get's all the Public repos.
        2. Using the execSync function it performs the git operations.
        3. Check whether any package updates are available.
        4. In case any update is available the package file is updated.
        5. And the updated package and package-lock files are updated in Git

    2. index.js - Updating the package via js packages

    3. newIndex.js - for updating everything except the specified package(express)

