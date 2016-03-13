## Usage

Serialize commonmark AST to line-delimited JSON:

```javascript
var cmark = require('commonmark')
  , parser = new cmark.Parser()
  , mkast = require('mkast')
  , ast = parser.parse('# Title\n<? @include file.md ?>');
mkast.serialize(ast).pipe(process.stdout);
```

For more information see the [api docs](#api).
