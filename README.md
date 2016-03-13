Table of Contents
=================

* [AST Transformer](#ast-transformer)
  * [Install](#install)
  * [Usage](#usage)
  * [License](#license)

AST Transformer
===============

[<img src="https://travis-ci.org/mkdoc/mkast.svg?v=3" alt="Build Status">](https://travis-ci.org/mkdoc/mkast)
[<img src="http://img.shields.io/npm/v/mkast.svg?v=3" alt="npm version">](https://npmjs.org/package/mkast)
[<img src="https://coveralls.io/repos/mkdoc/mkast/badge.svg?branch=master&service=github&v=3" alt="Coverage Status">](https://coveralls.io/github/mkdoc/mkast?branch=master).

Transforms commonmark AST documents to and from JSON for piping between streams.

See the [api docs](https://github.com/mkdoc/mkast/blob/master/API.md).

## Install

```
npm i mkast
```

## Usage

Parse a string or buffer:

```javascript
var mkast = require('mkast')
  , stream = mkast.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var mkast = require('mkast')
  , stream = mkast.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var mkast = require('mkast')
  , fs = require('fs')
  , stream = mkast.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var mkast = require('mkast')
  , stream = mkast.parse(
      '# @file spec.rb', {rules: require('mkast/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var mkast = require('mkast')
  , stream = mkast.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('mkast/lang/ini'), require('mkast/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

For more detail see the [api docs](https://github.com/mkdoc/mkast/blob/master/API.md).

## License

MIT.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp
