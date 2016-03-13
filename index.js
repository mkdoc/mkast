var Walk = require('./lib/walk')
  , Serialize = require('./lib/serialize');

/**
 *  Serialize a commonmark AST to line-delimited JSON.
 *
 *  When a callback function is given it is added as a listener for 
 *  the error and finish events on the parser stream.
 *
 *  @function serialize
 *  @param {Object} buffer input AST.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the serializer stream.
 */
function serialize(buffer, cb) {
  var ast = new Walk()
    , serialize = new Serialize();

  ast.pipe(serialize);

  if(cb) {
    ast
      .once('error', cb)
      .once('finish', cb);
  }

  // give callers a chance to listen for events
  process.nextTick(function() {
    ast.end(buffer);
  })

  return serialize;
}

module.exports = {
  serialize: serialize
}
