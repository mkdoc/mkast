var Node = require('./node');

function walk(node, cb) {
  var child = node._firstChild;
  while(child) {
    cb(child, node);
    walk(child, cb);
    child = child._next; 
  }
}

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

module.exports = {
  walk: walk,
  collect: collect
}
