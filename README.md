# Quick start react application with Webpack v2.0

### Configured Features

 - ES6 With Spread operator
 - Transpiling JSX
 - CSS Loader and extract plugin
 - url-loader for images and fonts

### NPM Installation
 ```sh
 $ npm i -D react-qstart
 $ npm i -S react react-dom
 ```

### USE
In webpack.config.js

```javascript
const config = require('react-qstart/lib/webpack.config');
module.exports = config(options);
```
`options` are as follows...

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| outputPath | string | production |
| port | number | 3000 |

In package.json

```javascript
{
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --hot",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

`app/main.js` is the startup file of the application. Webpack alias: { "`appRoot`": "./app" }

```
demo
├── app
│   └── main.js
├── package.json
└── webpack.config.js
```

In main.js

```javascript
import React from 'react';
import { render } from 'react-dom';

const rootElement = document.getElementById('root');
render(
  <div>Hey, It works!!!</div>,
  rootElement
);
```
