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

For more detail see the [api docs](/API.md).
