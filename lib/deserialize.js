var through = require('through3')
  , Node = require('commonmark/lib/node');

/**
 *  @private
 */
function attach(res) {
  var n = new Node(res._type, res._sourcepos);
  for(var k in res) {
    n[k] = res[k];
  }
  return n;
}

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
  var res;

  try {
    res = JSON.parse(ast);
  }catch(e) {
    return cb(e); 
  }

  if(res && res._type === 'Document') {
    this.doc = new Node('Document', res._sourcepos); 
  }else if(this.doc && res._type !== 'EOF') {
    this.doc.appendChild(attach(res));
  // got EOF
  }else{
    this.push(this.doc);
    this.emit('eof', this.doc);
    this.doc = null;
  }
  cb();
}

module.exports = through.transform(transform, {ctor: AstDeserialize})
