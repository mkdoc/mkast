var expect = require('chai').expect
  , ast = require('../../index')
  , Walk = require('../../lib/walk');

describe('mkast:', function() {

  it('should return stream from src()', function(done) {
    expect(ast.src('Text.')).to.be.instanceof(Walk);
    done();
  });

});
