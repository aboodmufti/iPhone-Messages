var test = require('tape');

test('should throw erro', function(t) {
  t.plan(1);

  try {
    var isHarmony = require('./index')();
  }
  catch (e) {
    t.equal(e !== null, true);
  };
})

test('disable throw error', function(t) {
  t.plan(1);
  
  var isHarmony = require('./index')(true);
  t.equal(!isHarmony, true);
})