
var fs = require('fs');
var type = require('component-type');
var path = require('path');
var async = require('async');
var isHarmony = require('harmony-required')(true);

function ls(files, option, callback) {
  if (!files)
    return dir(__dirname, option, callback);
  
  if (type(files) == 'string')
    return dir(path.resolve(files), option, callback);
  else {
    async.each(files, function(base, done) {
      dir(path.resolve(base), option, function(er, list) {
        done(er, { dir:base,list:list })
      });
    },
    callback);
  };
}

function dir(path, option, callback) {
  fs.readdir(path, function(er, list) {
    var res = parseOption(list, option);
    callback(er, res);
  })
}

function parseOption(list, option) {
  if (option['A'] || option['almost-all'])
    return list;
  else if (option['a'] || option['all'])
    return ['.','..'].concat(list);
  else if (option['B'] || option['ignore-backups'])
    return list.filter(function(item) {
      return item.slice(-1) !== '~';
    })
  else
    return list.filter(function(item) {
      return item[0] !== '.';
    });
}

module.exports = isHarmony ? function(files, option) {
  return function(callback) {
    ls(files, option, callback);
  };
} : ls;