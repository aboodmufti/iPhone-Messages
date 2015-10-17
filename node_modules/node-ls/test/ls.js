var test = require('tape');
var type = require('component-type');
var ls = require('../');

test('ls --all', function(t) {
  t.plan(2);
  ls('./', '--all', function(er, list) {
    t.equal(type(list) === 'array', true);
    t.equal(list.length > 0, true);
  });
})