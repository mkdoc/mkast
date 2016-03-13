var through = require('through3')
  , EOL = require('os').EOL;

function circular() {
  var seen = [];
  return function (key, val) {
    var invalid = Boolean(~seen.indexOf(val))
      || key === '_parent' || key === '_prev' || key === '_lastChild';
    if(invalid) {
      return;
    }
    if(!val || typeof (val) !== 'object') {
      return val;
    }
    seen.push(val);
    return val;
  };
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member AstSerialize
 *  @param {Array} ast input AST document.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(ast, encoding, cb) {
  this.push(JSON.stringify(ast, circular()) + EOL);
  cb();
}

module.exports = through.transform(transform);
