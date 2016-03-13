var through = require('through3');

function detach(node) {
  delete node._firstChild;
  delete node._lastChild;
  delete node._next;
  delete node._prev;
  delete node._parent;
}

/**
 *  Iterates an AST document and emits on every node.
 *
 *  @module {constructor} AstWalk
 *  @param {Object} [opts] stream options.
 */
function AstWalk(opts) {
  opts = opts || {};

}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstWalk
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {
  var nodes = [];
  if(ast && ast.type === 'Document' && ast.firstChild) {

    // push direct descendants
    var next = ast.firstChild;
    while(next) {
      nodes.push(next);
      next = next.next;
    }

    // trim document ast
    detach(ast);
    this.push(ast);

    for(var i = 0;i < nodes.length;i++) {
      this.push(nodes[i]); 
    }

    // extension to signal end of document
    this.push({_type: 'EOF'});
  }
  cb();
}

module.exports = through.transform(transform, {ctor: AstWalk})
