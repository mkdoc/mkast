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
 *  @returns the parser stream.
 */
function parser(stream, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  var parser = new Parser(opts);
  stream
    .pipe(new LineStream())
    .pipe(new EachStream())
    .pipe(parser);

  if(cb) {
    parser
      .once('error', cb)
      .once('finish', cb);
  }
  return parser;
}

/**
 *  Deserialize line-delimited JSON to commonmark AST nodes.
 *
 *  When a callback function is given it is added as a listener for 
 *  the `error` and `eof` events on the deserializer stream.
 *
 *  The `eof` event can fire multiple times so the callback may be called 
 *  multiple times.
 *
 *  @function deserialize
 *  @param {Object} [stream] input stream.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the deserializer stream.
 */
function deserialize(stream, cb) {
  var deserializer = new Deserialize()
    , lines = new LineStream()
    , each = new EachStream()
    , parser = new Parser();

  lines
    .pipe(each)
    .pipe(parser)
    .pipe(deserializer);

  if(stream) {
    stream.pipe(lines); 
  }

  //stream
    //.pipe(new LineStream())
    //.pipe(new EachStream())
    //.pipe(new Parser())
    //.pipe(deserializer);

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
 *  Serialize a commonmark AST node to line-delimited JSON.
 *
 *  When the node is of the `document` type it's direct descendants are 
 *  detached from the document and streamed as independent lines. So that 
 *  consumers of the stream will know when the document ends a node 
 *  with an `eof` type is sent to indicate the end of file (EOF).
 *
 *  When injecting documents into a stream it may be desirable to disable 
 *  this behaviour, to do so use:
 *
 *  ```javascript
 *  {eof: false}
 *  ```
 *
 *  When a callback function is given it is added as a listener for 
 *  the `error` and `finish` events on the serializer stream.
 *
 *  @function serialize
 *  @param {Object} node input AST node.
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @options {Boolean=true} eof disable sending an EOF node.
 *  @options {Number=0} indent number of spaces to indent JSON.
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

function parse(markdown) {
  var commonmark = require('commonmark')
  , parser = new commonmark.Parser()
  return parser.parse(markdown);
}

function walk(opts) {
  return new Walk(opts);
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
  parser: parser,
  parse: parse,
  walk: walk,
  Node: require('./lib/node'),
  Parser: require('commonmark').Parser
}
