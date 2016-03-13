var expect = require('chai').expect
  , ast = require('../../index')
  , Deserialize = require('../../lib/deserialize');

describe('mkast:', function() {

  it('should parse string input w/ callback', function(done) {
    function complete(doc) {
      expect(doc).to.be.an('object');
      //console.dir(doc);
      done(); 
    }
    var stream = ast.serialize('# Title')
      , deserializer = new Deserialize();
    stream.pipe(deserializer);

    deserializer.once('eof', complete);
  });

});
