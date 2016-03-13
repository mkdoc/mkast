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

Transforms commonmark AST documents to and from JSON for piping between processes.

## Install

```
npm i mkast
```

## Usage

Serialize commonmark AST to line-delimited JSON:

```javascript
var cmark = require('commonmark')
  , parser = new cmark.Parser()
  , mkast = require('mkast')
  , ast = parser.parse('# Title\n<? @include file.md ?>');
mkast.serialize(ast).pipe(process.stdout);
```

For more detail see the [api docs](https://github.com/mkdoc/mkast/blob/master/API.md).

## License

MIT.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp
