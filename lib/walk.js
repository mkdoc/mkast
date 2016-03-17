var through = require('through3')
  , detach = require('./detach');

function Walk(opts) {
  opts = opts || {};
  this.EOF = opts.eof;
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
  if(ast && ast.type === 'document' && ast._firstChild) {
  //if(ast && ast._firstChild) {

    // push direct descendants
    var next = ast._firstChild;
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
    if(this.EOF !== false) {
      this.push({_type: 'eof', _file: ast._file});
    }
  }else{
    this.push(ast);
  }
  cb();
}

module.exports = through.transform(transform, {ctor: Walk});
