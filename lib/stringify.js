var Node = require('commonmark/lib/node')
  , defaultNode = new Node();

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

      || (val === null && (key !== 'start' && key !== 'delimiter'))
      || (val === undefined)
      || (defaultNode.hasOwnProperty(key) && val === defaultNode[key])

      // NOTE: must do instanceof test or some listData is dropped
      || Boolean(~seen.indexOf(val) && (val instanceof Node));

    if(invalid) {
      return;
    }

    if(Boolean(~seen.indexOf(val))) {
      if(Array.isArray(val)) {
        val = val.slice(); 
      }else if(val && typeof(val) === 'object') {
        var o = {};
        for(var k in val) {
          o[k] = val[k];
        }
        if(!k) {
          return;
        }
        return o;
      }
    }

    if(!val || typeof(val) !== 'object') {
      return val;
    }

    seen.push(val);
    return val;
  }
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
