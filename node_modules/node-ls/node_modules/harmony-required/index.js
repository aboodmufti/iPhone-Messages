var useHarmony = process.execArgv.filter(function(item) {
  return /^--harmony/.test(item);
}).length;

module.exports = function(disableThrowErr) {
  if (!disableThrowErr && useHarmony == 0)
    throw 'harmony required';
  else
    return useHarmony > 0;
}
