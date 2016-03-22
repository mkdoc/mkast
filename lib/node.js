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

// static type check
AstNode.is = function(node, type) {
  if(node.type) {
    return node.type === type; 
  }
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
 *  @param {Object} [attrs] map of data to assign to the node.
 *  @param {Array} [sourcepos] source position.
 *
 *  @returns a document node.
 */
function createDocument(attrs, sourcepos) {
  var args = Array.prototype.slice.call(arguments);
  if(Array.isArray(attrs)) {
    sourcepos = attrs; 
    attrs = args[1];
  }

  attrs = attrs || {};
  sourcepos = sourcepos || [[1, 1], [0, 0]];

  return AstNode.createNode(
    AstNode.DOCUMENT, attrs, sourcepos);
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
 *  @function deserialize
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

/**
 *  Converts an AST node to an object that may be serialized without any 
 *  circular references.
 *
 *  @function serialize
 *  @param {Object} node the AST node.
 *
 *  @return {Object} an object.
 */
function serialize(node) {
  if(!(node instanceof Node)) {
    throw new TypeError('serialize() expects a Node instance'); 
  }

  var obj = {};

  obj.type = node._type;
  obj.sourcepos = node._sourcepos;
  if(node._literal) {
    obj.literal = node._literal;
  }

  // document properties
  if(AstNode.is(node, AstNode.DOCUMENT)) {
    if(node.refmap) {
      obj.refmap = node.refmap; 
    }

    if(node._file) {
      obj.file = node._file; 
    }

    if(node._cmd) {
      obj.cmd = node._cmd; 
    }

    if(node._linkRefs) {
      obj.linkRefs = node._linkRefs; 
    }
  }

  obj.lastLinkBlank = node._lastLineBlank;
  obj.open = node._open;

  if(node._string_content) {
    obj.stringContent = node._string_content;
  }

  for(var k in node._listData) {
    if(!obj.listData) {
      obj.listData = {}; 
    } 
    obj.listData[k] = node._listData[k];
  }

  // fenced code block info
  if(node._info) {
    obj.info = node._info;
  }
  obj.isFenced = node._isFenced;
  obj.fenceLength = node._fenceLength;
  if(node._fenceChar) {
    obj.fenceChar = node._fenceChar; 
  }
  if(node._fenceOffset !== null) {
    obj.fenceOffset = node._fenceOffset; 
  }

  // heading
  if(node._level) {
    obj._level = node._level;
  }

  // links
  if(node._linkType) {
    obj.linkType = node._linkType;
  }
  if(node._destination) {
    obj.destination = node._destination;
  }
  if(node._title) {
    obj.title = node._title;
  }

  // custom
  if(node._onEnter) {
    obj.onEnter = node._onEnter; 
  }
  if(node._onExit) {
    obj.onExit = node._onExit; 
  }

  if(node._firstChild) {
    obj.firstChild = serialize(node._firstChild);
  }

  if(node._next) {
    obj.next = serialize(node._next);
  }

  return obj;
}

function createDocumentFragment(node) {
  var doc = AstNode.createDocument();
  doc.appendChild(AstNode.deserialize(node));
  return doc;
}

AstNode.serialize = serialize;
AstNode.deserialize = deserialize;
AstNode.createDocumentFragment = createDocumentFragment;

module.exports = AstNode;
