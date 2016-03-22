var through = require('through3')
  , Node = require('./node')
  , EOL = require('os').EOL;

function Serializer(opts) {
  opts = opts || {};
  this.indent = opts.indent || 0;
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
  var res = Node.serialize(ast);
  this.push(JSON.stringify(res, undefined, this.indent) + EOL);
  cb();
}

module.exports = through.transform(transform, {ctor: Serializer});
