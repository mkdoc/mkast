var through = require('through3')
  , LineStream = require('stream-lines')
  , Walk = require('./lib/walk')
  , Serialize = require('./lib/serialize')
  , Deserialize = require('./lib/deserialize')
  , Parser = require('./lib/parser');

/**
 *  Iterate the lines.
 *
 *  @private
 */
function each(chunk, encoding, cb) {
  var scope = this;
  chunk.forEach(function(item) {
    scope.push(item); 
  })
  cb();
}

var EachStream = through.transform(each);

/**
 *  Parse line-delimited JSON to vanilla objects.
 *
 *  When a callback function is given it is added as a listener for 
 *  the `error` and `finish` events on the parser stream.
 *
 *  @function parser
 *  @param {Object} stream input stream.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the deserializer stream.
 */
function parser(stream, cb) {
  var parser = new Parser();
  stream
    .pipe(new LineStream())
    .pipe(new EachStream())
    .pipe(parser);

  if(cb) {
    parser
      .once('error', cb)
      .once('finish', function(doc) {
        cb(null, doc); 
      });
  }
  return parser;
}

/**
 *  Deserialize line-delimited JSON to commonmark AST documents.
 *
 *  When a callback function is given it is added as a listener for 
 *  the `error` and `eof` events on the deserializer stream.
 *
 *  The `eof` event can fire multiple times so the callback may be called 
 *  multiple times.
 *
 *  @function deserialize
 *  @param {Object} stream input stream.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the deserializer stream.
 */
function deserialize(stream, cb) {
  var deserializer = new Deserialize();
  stream
    .pipe(new LineStream())
    .pipe(new EachStream())
    .pipe(new Parser())
    .pipe(deserializer);

  if(cb) {
    deserializer
      .once('error', cb)
      .on('eof', function(doc) {
        cb(null, doc); 
      });
  }
  return deserializer;
}

/**
 *  Serialize a commonmark AST to line-delimited JSON.
 *
 *  When a callback function is given it is added as a listener for 
 *  the `error` and `finish` events on the serializer stream.
 *
 *  @function serialize
 *  @param {Object} node input AST node.
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the serializer stream.
 */
function serialize(node, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};

  var ast = new Walk(opts)
    , serializer = new Serialize(opts);

  ast.pipe(serializer);

  if(cb) {
    serializer
      .once('error', cb)
      .once('finish', cb);
  }

  // give callers a chance to listen for events
  process.nextTick(function() {
    ast.end(node);
  })

  return serializer;
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
  parser: parser,
  Node: require('./lib/node'),
  Parser: require('commonmark').Parser
}
