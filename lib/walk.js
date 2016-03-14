var through = require('through3')
  , detach = require('./detach');


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
  if(ast && ast.type === 'document' && ast.firstChild) {

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

    // @todo allow not sending EOF for mkcat(1)
    // @todo which injects it's own eof

    // extension to signal end of document
    this.push({_type: 'eof'});
  }
  cb();
}

module.exports = through.transform(transform);
