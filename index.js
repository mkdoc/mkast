var fs = require('fs')
  , cmark = require('commonmark')
  , Parser = cmark.Parser
  , Walk = require('./lib/walk')
  , Serialize = require('./lib/serialize');

/**
 *  Load and parse file contents.
 *
 *  The options are passed to the Walk and Serialize streams..
 *
 *  @function load
 *  @param {String} file path.
 *  @param {Object} [opts] processing options.
 *
 *  @returns the parser stream.
 */
function load(path, opts) {
  opts.buffer = true;
  var source = fs.createReadStream(path)
    , ast = new Walk(opts)
    , serialize = new Serialize(opts);
  return source.pipe(ast).pipe(serialize);
}

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
    , serialize = new Serialize(opts)
    , parser = new Parser(opts);

  ast.pipe(serialize);

  if(cb) {
    ast
      .once('error', cb)
      .once('finish', cb);
  }

  // convert to AST
  buffer = parser.parse(buffer);

  // give callers a chance to listen for events
  process.nextTick(function() {
    ast.end(buffer);
  })

  return serialize;
}

module.exports = {
  load: load,
  serialize: serialize
}
