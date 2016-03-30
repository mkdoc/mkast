var Node = require('./node');

/**
 *  Recursively walk the children of a node invoking `cb` for every node.
 *  
 *  @function walk
 *  @param {Object|Node} node target node to walk.
 *  @param {Function} cb callback function invoked for every child node.
 */
function walk(node, cb) {
  var child = node.firstChild;
  while(child) {
    cb(child, node);
    walk(child, cb);
    child = child.next; 
  }
}

/**
 *  Collect all nodes of the specified `type` into an array, including the 
 *  given node(s) if they are of the specified type.
 *  
 *  @function collect
 *  @param {Array|Object|Node} node target node to walk.
 *  @param {String} type the node type identifier.
 *
 *  @returns a list of nodes or the empty array.
 */
function collect(node, type) {
  var o = [];
  if(!Array.isArray(node)) {
    node = [node];
  }

  node.forEach(function(c) {
    if(Node.is(c, type)) {
      o.push(c); 
    }
    walk(c, function(n) {
      if(Node.is(n, type)) {
        o.push(n); 
      }
    })
  });
  return o;
}

/**
 *  Get a literal string for all child text nodes.
 *
 *  @function literal
 *  @param {Object} node target node to walk.
 *
 *  @returns the literal text for the node.
 */
function literal(node) {
  var text = collect(node, Node.TEXT)
    , i
    , lit = '';
  for(i = 0;i < text.length;i++) {
    lit += text[i].literal; 
  }
  return lit;
}

module.exports = {
  walk: walk,
  collect: collect,
  literal: literal
}
