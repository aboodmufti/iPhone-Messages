#!/usr/bin/env node

var ls = require('./');
var argv = require('minimist')(process.argv.slice(2));

ls(argv._[0], argv, function(er, list) {
  if (er)
    console.error(er);
  else
    console.log(JSON.stringify(list, null, 4));
})
