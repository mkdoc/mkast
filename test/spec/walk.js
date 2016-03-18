var expect = require('chai').expect
  , ast = require('../../index')
  , Walk = require('../../lib/walk');

describe('mkast:', function() {

  it('should return stream from walk()', function(done) {
    expect(ast.walk()).to.be.instanceof(Walk);
    done();
  });

});
