var through = require('through3')
  , Node = require('./node');

/**
 *  Parses newline delimited JSON to objects.
 *
 *  @module {constructor} AstParser
 *
 *  @option {Boolean} [wrap] wrap deserialized objects in shallow nodes.
 */
function AstParser(opts) {
  opts = opts || {};
  this.wrap = opts.wrap;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstParser
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {
  // empty lines
  if(!ast) {
    return cb(); 
  }

  var res;

  try {
    res = JSON.parse(ast);
  }catch(e) {
    return cb(e); 
  }

  if(this.wrap) {
    this.push(Node.createNode(res._type, res)); 
  }else{
    this.push(res);
  }
  cb();
}

module.exports = through.transform(transform, {ctor: AstParser})
