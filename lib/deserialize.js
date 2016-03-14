var through = require('through3')
  , Node = require('commonmark/lib/node')
  , attach = require('./attach');

/**
 *  Converts newline delimited JSON to AST nodes.
 *
 *  @module {constructor} AstDeserialize
 *  @param {Object} [opts] stream options.
 */
function AstDeserialize(opts) {
  opts = opts || {};
  this.doc = null;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstDeserialize
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {

  if(ast && ast._type === 'document') {
    this.doc = new Node('document', ast._sourcepos); 
  }else if(this.doc && ast._type !== 'EOF') {
    this.doc.appendChild(attach(ast));
  // got EOF
  }else{
    this.push(this.doc);
    this.emit('eof', this.doc);
    this.doc = null;
  }
  cb();
}

module.exports = through.transform(transform, {ctor: AstDeserialize})
