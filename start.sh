#!/bin/sh

/wait
yarn install
node ace migration:run --force
adonis serve --dev & npm run watch