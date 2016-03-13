var fs = require('fs')
  , cmark = require('commonmark')
  , Parser = cmark.Parser
  , Ast = require('./lib/ast');

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
  opts.buffer = true;
  var source = fs.createReadStream(path)
    , ast = new Ast(opts);
  return source.pipe(ast);
}

/**
 *  Parse a commonmark string.
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

  var ast = new Ast(opts)
    , parser = new Parser(opts);

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

  return ast;
}

module.exports = {
  load: load,
  parse: parse
}
