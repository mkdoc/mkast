var Node = require('commonmark/lib/node');

/**
 *  Converts a deserialized object to an AST node.
 *
 *  @function attach
 *  @param {Object} res deserialized object.
 *
 *  @return {Node} an AST node.
 */
function attach(res) {
  var n = new Node(res._type, res._sourcepos)
    , next = res._firstChild;

  for(var k in res) {
    n[k] = res[k];
  }

  while(next) {
    n.appendChild(attach(next));
    next = next._next; 
  }

  return n;
}

module.exports = attach;
