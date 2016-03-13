var fs = require('fs')
  , through = require('through3')
  , LineStream = require('stream-lines');

/**
 *  Load and parse file contents.
 *
 *  The options are passed to the `LineStream`, `Comment` and `Parser`.
 *
 *  @function load
 *  @param {String} file path.
 *  @param {Object} [opts] processing options.
 *
 *  @returns the parser stream.
 */
function load(path, opts) {
  var source = fs.createReadStream(path)
    , lines = new LineStream(opts)
    //, comment = new Comment(opts)
    //, parser = new Parser(opts);

  return source
    .pipe(lines)
    //.pipe(comment)
    //.pipe(parser);
}

/**
 *  Parse a string or buffer.
 *
 *  When a callback function is given it is added as a listener for 
 *  the error and finish events on the parser stream.
 *
 *  @function parse
 *  @param {String|Buffer} buffer input data.
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @returns the parser stream.
 */
function parse(buffer, opts, cb) {

  if(typeof opts === 'function') {
    cb = opts;
    opts =  null;
  }

  var Readable = through.passthrough()
    , source = new Readable()
    , lines = new LineStream(opts)
    //, comment = new Comment(opts)
    //, parser = new Parser(opts);

  source
    .pipe(lines)
    //.pipe(comment)
    //.pipe(parser);

  if(cb) {
    lines
      .once('error', cb)
      .once('finish', cb);
  }

  // give callers a chance to listen for events
  process.nextTick(function() {
    source.end(buffer);
  })

  //return parser;
  return lines;
}

module.exports = {
  load: load,
  parse: parse
}
