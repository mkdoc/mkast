var expect = require('chai').expect
  , ast = require('../../index')
  , Serialize = require('../../lib/serialize');

describe('mkast:', function() {

  it('should return stream from stringify()', function(done) {
    expect(ast.stringify()).to.be.instanceof(Serialize);
    done();
  });

});
