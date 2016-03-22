var Node = require('commonmark/lib/node');

/**
 *  Extend the commonmark Node with useful functionality.
 *
 *  @contructor AstNode
 */
function AstNode() {
  Node.apply(this, arguments);
}

AstNode.prototype = Object.create(Node.prototype);

/**
 *  Determine if a node is of a particular type.
 *
 *  @function is
 *  @param {String} type a type identifier.
 */
function is(type) {
  return this._type === type;
}

AstNode.prototype.is = is;

// static type check
AstNode.is = function(node, type) {
  return node._type === type;
}

// commonmark types
AstNode.DOCUMENT = 'document';
AstNode.SOFTBREAK = 'softbreak';
AstNode.LINEBREAK = 'linebreak';
AstNode.LIST = 'list';
AstNode.ITEM = 'item';
AstNode.PARAGRAPH = 'paragraph';
AstNode.TEXT = 'text';
AstNode.HEADING = 'heading';
AstNode.EMPH = 'emph';
AstNode.STRONG = 'strong';
AstNode.LINK = 'link';
AstNode.IMAGE = 'image';
AstNode.CODE = 'code';
AstNode.CODE_BLOCK = 'code_block';
AstNode.BLOCK_QUOTE = 'block_quote';
AstNode.THEMATIC_BREAK = 'thematic_break';
AstNode.HTML_INLINE = 'html_inline';
AstNode.HTML_BLOCK = 'html_block';
AstNode.CUSTOM_INLINE = 'custom_inline';
AstNode.CUSTOM_BLOCK = 'custom_block';

// mkdoc extensions
AstNode.EOF = 'eof';

/**
 *  Create a document node.
 *
 *  @static createDocument
 *  @param {Array} [sourcepos] source position.
 *
 *  @returns a document node.
 */
function createDocument(sourcepos, attrs) {
  return AstNode.createNode(
    AstNode.DOCUMENT, attrs, sourcepos || [[1, 1], [0, 0]]);
}

/**
 *  Create a node by type.
 *
 *  @static createNode
 *  @param {String} type node type identifier.
 *  @param {Object} [attrs] map of data to assign to the node.
 *  @param {Array} [sourcepos] source position.
 *
 *  @returns a node of the specified type.
 */
function createNode(type, attrs, sourcepos) {
  if(Array.isArray(attrs) && sourcepos === undefined) {
    sourcepos = attrs; 
    attrs = null;
  }
  var node = new AstNode(type, sourcepos);
  if(attrs) {
    for(var k in attrs) {
      node[k] = attrs[k];
    } 
  }
  return node;
}

AstNode.createDocument = createDocument;
AstNode.createNode = createNode;

AstNode.types = [
  AstNode.DOCUMENT,
  AstNode.SOFTBREAK,
  AstNode.LINEBREAK,
  AstNode.LIST,
  AstNode.ITEM,
  AstNode.PARAGRAPH,
  AstNode.TEXT,
  AstNode.HEADING,
  AstNode.EMPH,
  AstNode.STRONG,
  AstNode.LINK,
  AstNode.IMAGE,
  AstNode.CODE,
  AstNode.CODE_BLOCK,
  AstNode.BLOCK_QUOTE,
  AstNode.THEMATIC_BREAK,
  AstNode.HTML_INLINE,
  AstNode.HTML_BLOCK,
  AstNode.CUSTOM_INLINE,
  AstNode.CUSTOM_BLOCK
];

AstNode.extensions = [
  AstNode.EOF
];

/**
 *  Converts a deserialized object to an AST node.
 *
 *  @function attach
 *  @param {Object} res deserialized object.
 *
 *  @return {Node} an AST node.
 */
function deserialize(res) {
  var n = new AstNode(res._type, res._sourcepos)
    , next = res._firstChild;

  for(var k in res) {
    n[k] = res[k];
  }

  while(next) {
    n.appendChild(deserialize(next));
    next = next._next; 
  }

  return n;
}

function createDocumentFragment(node) {
  var doc = AstNode.createDocument();
  doc.appendChild(AstNode.deserialize(node));
  return doc;
}

AstNode.deserialize = deserialize;
AstNode.createDocumentFragment = createDocumentFragment;

module.exports = AstNode;
