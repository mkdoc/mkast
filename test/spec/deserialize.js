var expect = require('chai').expect
  , ast = require('../../index')
  , Node = require('../../lib/node');

describe('mkast:', function() {

  it('should deserialize _file property', function(done) {
    var doc = ast.parse('Text')
      , expected = 'README.md'
      , obj
      , res;

    doc._file = expected;
    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(res._file).to.eql(expected);

    expect(doc).to.eql(res);
    done();
  });

  it('should deserialize _cmd property', function(done) {
    var doc = ast.parse('Text')
      , expected = 'pwd'
      , obj
      , res;

    doc._cmd = expected;
    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(res._cmd).to.eql(expected);

    expect(doc).to.eql(res);
    done();
  });

  it('should deserialize _linkRefs property', function(done) {
    var doc = ast.parse('Text')
      , expected = true
      , obj
      , res;

    doc._linkRefs = expected;
    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(res._linkRefs).to.eql(expected);

    expect(doc).to.eql(res);

    done();
  });


  it('should deserialize onEnter and onExit', function(done) {
    var doc = ast.parse('Text')
      , enter = 'enter'
      , exit = 'exit'
      , obj
      , res;

    doc._onEnter = enter;
    doc._onExit = exit;
    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(res.onEnter).to.eql(enter);
    expect(res.onExit).to.eql(exit);

    expect(doc).to.eql(res);

    done();
  });


  it('should deserialize link references', function(done) {
    var doc = ast.parse('[example]: http://example.com "Example Website"')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(res.refmap).to.be.an('object');
    expect(res.refmap.example).to.be.an('object');
    expect(res.refmap.example.destination).to.eql('http://example.com');
    expect(res.refmap.example.title).to.eql('Example Website');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize heading', function(done) {
    var doc = ast.parse('# Heading')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.HEADING)).to.eql(true);
    expect(Node.is(res.firstChild.firstChild, Node.TEXT)).to.eql(true);
    expect(res.firstChild.firstChild.literal).to.eql('Heading');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize paragraph', function(done) {
    var doc = ast.parse('Paragraph\n\n')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(Node.is(res.firstChild.firstChild, Node.TEXT)).to.eql(true);
    expect(res.firstChild.firstChild.literal).to.eql('Paragraph');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize blockquote', function(done) {
    var doc = ast.parse('> Quotation\n\n')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.BLOCK_QUOTE)).to.eql(true);
    expect(Node.is(res.firstChild.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(res.firstChild.firstChild.firstChild.literal).to.eql('Quotation');

    expect(doc).to.eql(res);

    done();
  });


  it('should deserialize code block', function(done) {
    var doc = ast.parse('```javascript\nvar foo="bar";\n```')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.CODE_BLOCK)).to.eql(true);
    expect(res.firstChild.literal).to.eql('var foo="bar";\n');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize link', function(done) {
    var doc = ast.parse('[example](http://example.com "Example Website")')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(obj).to.be.an('object');
    expect(Node.is(obj, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(obj.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(Node.is(obj.firstChild.firstChild, Node.LINK)).to.eql(true);
    expect(obj.firstChild.firstChild.destination).to.eql('http://example.com');
    expect(obj.firstChild.firstChild.title).to.eql('Example Website');
    expect(Node.is(obj.firstChild.firstChild.firstChild, Node.TEXT))
      .to.eql(true);
    expect(obj.firstChild.firstChild.firstChild.literal).to.eql('example');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize link with _linkType', function(done) {
    var doc = ast.parse('[example](http://example.com)')
      , obj
      , res;

    expect(doc).to.be.an('object');
    doc.firstChild.firstChild._linkType = 'ref';

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.PARAGRAPH)).to.eql(true);
    expect(Node.is(res.firstChild.firstChild, Node.LINK)).to.eql(true);
    expect(res.firstChild.firstChild._linkType).to.eql('ref');

    expect(doc).to.eql(res);

    done();
  });

  it('should deserialize list', function(done) {
    var doc = ast.parse('* foo\n* bar\n')
      , obj
      , res;

    obj = Node.serialize(doc);
    res = Node.deserialize(obj);

    expect(doc).to.be.an('object');
    expect(res).to.be.an('object');
    expect(Node.is(res, Node.DOCUMENT)).to.eql(true);
    expect(Node.is(res.firstChild, Node.LIST)).to.eql(true);
    expect(Node.is(res.firstChild.firstChild, Node.ITEM)).to.eql(true);

    // NOTE: list item has paragraph
    expect(
      res.firstChild.firstChild.firstChild.firstChild.literal).to.eql('foo');
    // NOTE: list item has paragraph
    expect(
        res.firstChild.firstChild.next.firstChild.firstChild.literal
      ).to.eql('bar');

    expect(doc).to.eql(res);

    done();
  });

});
