var expect = require('chai').expect
  , cmark = require('commonmark')
  , Parser = cmark.Parser
  , Renderer = cmark.XmlRenderer
  , ast = require('../../index')
  , Deserialize = require('../../lib/deserialize');

describe('mkast:', function() {

  it('should parse string input w/ callback', function(done) {

    var parser = new Parser()
      , buffer = parser.parse('# Title\n<? @include file.md ?>')
      , expected = (new Renderer()).render(buffer)
      , stream = ast.serialize(buffer)
      , deserializer = new Deserialize();

    function complete(doc) {
      expect(doc).to.be.an('object');
      //console.dir(doc)
      expect((new Renderer()).render(doc)).to.eql(expected);
      done(); 
    }

    stream.pipe(deserializer);
    deserializer.once('eof', complete);
  });

});
