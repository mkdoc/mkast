var through = require('through3')
  , EOL = require('os').EOL;

function circular() {
  var seen = [];
  return function (key, val) {
    if(!val || typeof (val) !== 'object') {
      return val;
    }
    if(~seen.indexOf(val)) {
      return;
    }
    seen.push(val);
    return val;
  };
}

/**
 *  Converts AST nodes to newline delimited JSON.
 *
 *  @module {constructor} AstSerialize
 *  @param {Object} [opts] stream options.
 */
function AstSerialize(opts) {
  opts = opts || {};
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstSerialize
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {
  this.push(JSON.stringify(ast, circular()) + EOL);
  cb();
}

module.exports = through.transform(transform, {ctor: AstSerialize})
