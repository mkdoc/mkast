var EOL = require('os').EOL
  , through = require('through3');

/**
 *  @private
 */
function stringify(chunk, encoding, cb) {
  this.push(JSON.stringify(chunk) + EOL);
  cb();
}

module.exports = through.transform(stringify);
