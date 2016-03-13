var through = require('through3');

/**
 *  Iterates an AST document and emits on every node exit.
 *
 *  @module {constructor} CommonmarkAst
 *  @param {Object} [opts] stream options.
 *  @option {Array|Function} rules defines the comment rules.
 *  @option {Object} options to pass to the `rules` function.
 */
function CommonmarkAst(opts) {
  opts = opts || {};

}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member CommonmarkAst
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {
  console.dir(ast)
  cb();
}

function flush(cb) {
  cb();
}

module.exports = through.transform(transform, flush, {ctor: CommonmarkAst})
