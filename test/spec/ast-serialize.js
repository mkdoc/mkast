var expect = require('chai').expect
  , ast = require('../../index');

describe('mkast:', function() {

  it('should parse string input w/ callback', function(done) {
    function complete() {
      done(); 
    }
    ast.parse('# Title', complete);
  });

});
