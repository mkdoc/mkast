var expect = require('chai').expect
  , cmark = require('commonmark')
  , Parser = cmark.Parser
  , Renderer = cmark.XmlRenderer
  , ast = require('../../index')
  , Walk = require('../../lib/walk')
  , Deserialize = require('../../lib/deserialize');

describe('mkast:', function() {

  it('should serialize ast w/ callback', function(done) {
    var parser = new Parser()
      , buffer = parser.parse('# Title\n<? @include file.md ?>');
    ast.serialize(buffer, done);
  });


  it('should serialize and deserialize ast', function(done) {

    var parser = new Parser()
      , buffer = parser.parse('# Title\n<? @include file.md ?>')
      , expected = (new Renderer()).render(buffer)
      , stream = ast.serialize(buffer)
      , deserializer = new Deserialize();

    function complete(doc) {
      expect(doc).to.be.an('object');
      expect((new Renderer()).render(doc)).to.eql(expected);
      done(); 
    }

    stream.pipe(deserializer);
    deserializer.once('eof', complete);
  });

  it('should skip non-document on walk', function(done) {
    var walker = new Walk();
    walker.once('finish', done);
    walker.end({_type: 'foo'});
  });

  it('should error on bad json', function(done) {
    var deserializer = new Deserialize();
    deserializer.once('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done(); 
    });
    deserializer.end(new Buffer('{'));
  });

});
