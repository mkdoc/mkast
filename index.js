var fs = require('fs')
  , Walk = require('./lib/walk')
  , Serialize = require('./lib/serialize');

/**
 *  Parse a commonmark string.
 *
 *  When a callback function is given it is added as a listener for 
 *  the error and finish events on the parser stream.
 *
 *  @function serialize
 *  @param {String|Buffer} buffer input data.
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the serializer stream.
 */
function serialize(buffer, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts =  null;
  }

  var ast = new Walk(opts)
    , serialize = new Serialize(opts);

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
