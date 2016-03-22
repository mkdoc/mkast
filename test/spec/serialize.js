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

  it('should create document fragment', function(done) {
    var doc = ast.parse('Paragraph')
      , obj = Node.createDocumentFragment(Node.serialize(doc).firstChild);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(obj.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(Node.is(obj.firstChild.firstChild, Node.TEXT)).to.eql(true);
    expect(obj.firstChild.firstChild.literal).to.eql('Paragraph');
    done();
  });

  it('should serialize _file property', function(done) {
    var doc = ast.parse('Text')
      , expected = 'README.md'
      , obj;

    doc._file = expected;
    obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(obj.file).to.eql(expected);
    done();
  });

  it('should serialize _cmd property', function(done) {
    var doc = ast.parse('Text')
      , expected = 'pwd'
      , obj;

    doc._cmd = expected;
    obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(obj.cmd).to.eql(expected);
    done();
  });

  it('should serialize _linkRefs property', function(done) {
    var doc = ast.parse('Text')
      , expected = true
      , obj;

    doc._linkRefs = expected;
    obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(obj.linkRefs).to.eql(expected);
    done();
  });

  it('should serialize link references', function(done) {
    var doc = ast.parse('[example]: http://example.com "Example Website"')
      , obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(obj.refmap).to.be.an('object');
    expect(obj.refmap.example).to.be.an('object');
    expect(obj.refmap.example.destination).to.eql('http://example.com');
    expect(obj.refmap.example.title).to.eql('Example Website');
    done();
  });

  it('should serialize heading', function(done) {
    var doc = ast.parse('# Heading')
      , obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(obj.firstChild, Node.HEADING)).to.eql(true);
    expect(Node.is(obj.firstChild.firstChild, Node.TEXT)).to.eql(true);
    expect(obj.firstChild.firstChild.literal).to.eql('Heading');
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

  it('should serialize code block', function(done) {
    var doc = ast.parse('```javascript\nvar foo="bar";\n```')
      , obj = Node.serialize(doc);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(obj.firstChild, Node.CODE_BLOCK)).to.eql(true);
    expect(obj.firstChild.literal).to.eql('var foo="bar";\n');
    done();
  });

});
