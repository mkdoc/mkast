var expect = require('chai').expect
  , cmark = require('commonmark')
  , Parser = cmark.Parser
  , ast = require('../../index')
  , Deserialize = require('../../lib/deserialize');

describe('mkast:', function() {

  it('should parse string input w/ callback', function(done) {
    var parser = new Parser()
      , buffer = parser.parse('# Title')
      , stream = ast.serialize(buffer)
      , deserializer = new Deserialize();

    function complete(doc) {
      expect(doc).to.be.an('object');
      expect(doc).to.eql(buffer);
      done(); 
    }

    stream.pipe(deserializer);

    deserializer.once('eof', complete);
  });

});
