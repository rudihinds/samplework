const path = require('path');
// const fs = require('fs');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
// const { print } = require('graphql');

const typesArray = loadFilesSync(path.join(__dirname, './**/*.graphql'));

const typeDefs = mergeTypeDefs(typesArray);

// const printedTypeDefs = print(typeDefs);
// fs.writeFileSync('joined.graphql', printedTypeDefs);

module.exports = typeDefs;
