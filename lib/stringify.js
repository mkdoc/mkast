/**
 *  Resolves circular references in an AST so it may be serialized 
 *  to JSON.
 *
 *  @function resolve
 *
 *  @returns {Function} a closure to use with `JSON.stringify`.
 */
function resolve() {
  var seen = [];
  return function(key, val) {
    var invalid = key === '_parent' || key === '_prev' || key === '_lastChild'
      || (val === null)
      || Boolean(~seen.indexOf(val));
    if(invalid) {
      return;
    }
    if(!val || typeof (val) !== 'object') {
      return val;
    }
    seen.push(val);
    return val;
  };
}

/**
 *  Convert a commonmark AST to JSON removing circular references but 
 *  maintaining the ability to re-create the tree.
 *
 *  @function stringify
 *
 *  @param {Object} ast commonmark AST.
 *  @param {Number} indent number of spaces to indent JSON.
 *
 *  @returns {String} serialized JSON.
 */
function stringify(ast, indent) {
  return JSON.stringify(ast, resolve(), indent);
}

stringify.resolve = resolve;

module.exports = stringify;
