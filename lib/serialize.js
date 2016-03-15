var through = require('through3')
  , stringify = require('./stringify')
  , EOL = require('os').EOL;

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
  this.push(stringify(ast) + EOL);
  cb();
}

module.exports = through.transform(transform);
