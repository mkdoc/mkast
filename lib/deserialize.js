var through = require('through3')
  , Node = require('./node')
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
  this.open = 0;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstDeserialize
 *
 *  @param {Array} node input AST node.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {

  // bad input
  if(!chunk) {
    return cb(); 
  }

  var node = Node.createNode(chunk._type, chunk)
    , isDocument = node.is(Node.DOCUMENT)
    , isEof = node.is(Node.EOF)
    , isMeta = isEof;

  if(isDocument) {
    this.open++; 
  }

  if(isEof) {
    this.open--; 
  }

  // handle documet nodes
  if(isDocument) {

    // create root document
    if(!this.doc) {
      this.doc = Node.createDocument(); 

    // append children of nested document
    }else{
      var next = chunk._firstChild;
      while(next) {
        this.doc.appendChild(attach(next));
        next = next._next; 
      }
    }

    // maintain link references for nested documents
    if(chunk.refs && this.doc) {
      this.doc.refs = this.doc.refs || [];
      this.doc.refs = this.doc.refs.concat(chunk.refs);
    }

  // attach to current doc
  }else if(this.doc && !isEof) {
    this.doc.appendChild(attach(chunk));

  // got EOF with a valid root doc, flush it
  }else if(this.doc && isEof && this.open === 0) {
    this.push(this.doc);
    this.emit(Node.EOF, this.doc);
    this.doc = null;

  // concrete node (non-meta node) that does not 
  // have a parent
  }else if(!isMeta) {
    console.error('dropped node %s', chunk._type);
    console.error(chunk);
    throw new Error('node without parent document');
  }

  cb();
}

module.exports = through.transform(transform, {ctor: AstDeserialize})
