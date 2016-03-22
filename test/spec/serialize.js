var expect = require('chai').expect
  , ast = require('../../index')
  , Node = require('../../lib/node');

describe('mkast:', function() {

  it('should throw error on non-node', function(done) {
    function fn() {
      Node.serialize({});
    }
    expect(fn).throws(/expects a node instance/i);
    done();
  });

  it('should serialize paragraph', function(done) {
    var doc = ast.parse('Paragraph\n\n')
      , obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(obj.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(Node.is(obj.firstChild.firstChild, Node.TEXT)).to.eql(true);
    expect(obj.firstChild.firstChild.literal).to.eql('Paragraph');
    done();
  });

});
